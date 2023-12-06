import { setCookie } from "hono/cookie";
import { Context } from "../hono_bindings";
import jwt from "@phoenix/jwt";
import { NotFoundError, PermissionDeniedError } from "@phoenix/core/errors";
import { base64ToBuffer, hashPassword, parseAndValidateApiInput } from "../utils";
import { LoginInputValidator, convertToApiResponse, convertUser } from "@phoenix/core/api";
import { UserValidator } from "@phoenix/core/entities";

export async function login(ctx: Context): Promise<Response> {
  const apiInput = await parseAndValidateApiInput(ctx, LoginInputValidator);

  const userFromDb = await ctx.env.DB.prepare('SELECT * FROM users WHERE email = ?1')
    .bind(apiInput.email)
    .first();
  if (!userFromDb) {
    throw new NotFoundError('account not found');
  }
  const user = UserValidator.parse(userFromDb);

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

  // in a real-world application you want to set the httpOnly flag as true
  setCookie(ctx, 'phoenix_session', authToken,
    { httpOnly: false, expires: expiresAt, sameSite: 'Lax', secure: true, path: '/' },
  );

  return ctx.json(convertToApiResponse(convertUser(user)));
}
