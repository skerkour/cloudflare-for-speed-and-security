import { setCookie } from "hono/cookie";
import { Context } from "../hono_bindings";
import jwt from "@phoenix/jwt";
import { NotFoundError, PermissionDeniedError } from "../errors";
import { base64ToBuffer, hashPassword, parseAndValidateApiInput } from "../utils";
import { LoginInputValidator, convertUser } from "@phoenix/core/api";
import { User } from "@phoenix/core/entities";

export async function login(ctx: Context): Promise<Response> {
  const apiInput = await parseAndValidateApiInput(ctx, LoginInputValidator);

  const usersRes = await ctx.var.db.query('SELECT * FROM users WHERE email = $1', [apiInput.email]);
  if (usersRes.rowCount !== 1) {
    throw new NotFoundError('account not found');
  }
  const user: User = usersRes.rows[0];

  const inputPasswordHash = await hashPassword(apiInput.password, user.id);
  const userPasswordHash = base64ToBuffer(user.password_hash);

  if (!crypto.subtle.timingSafeEqual(userPasswordHash, inputPasswordHash)) {
    throw new PermissionDeniedError('password is not valid')
  }

  const authToken = await jwt.sign({
    user_id: user.id,
    nbf: Math.floor(Date.now() / 1000), // Not before: Now
    exp: Math.floor(Date.now() / 1000) + (48 * (60 * 60)) // Expires: Now + 48h
  }, ctx.env.JWT_SECRET);

  setCookie(ctx, 'phoenix_session', authToken);

  return ctx.json(convertUser(user));
}
