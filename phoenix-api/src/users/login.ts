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

  const nowUnixMs = Date.now();
  const expiresAt = new Date(nowUnixMs + (50 * 1000 * 60 * 60)); // Expires: Now + 50 hours
  const authToken = await jwt.sign({
    user_id: user.id,
    // nbf: Math.floor(now / 1000), // Not before: Now
    exp: Math.floor(expiresAt.getTime() / 1000),
  }, ctx.env.JWT_SECRET);

  setCookie(ctx, 'phoenix_session', authToken,
    { httpOnly: true, expires: expiresAt, sameSite: 'Lax', secure: true, path: '/' },
  );

  return ctx.json(convertUser(user));
}
