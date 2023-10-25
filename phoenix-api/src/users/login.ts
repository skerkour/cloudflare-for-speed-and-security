import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { Bindings, Variables } from "../bindings";
import * as api from "./api";
import jwt from "@phoenix/jwt/src/index";
import { User } from "./entities";
import { NotFoundError, PermissionDeniedError } from "../errors";
import { decodePasswordhash, hashPassword } from "./utils";

export async function login(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  const reqBody = await ctx.req.json()
  const apiInput = api.LoginInput.parse(reqBody);

  const usersRes = await ctx.var.db.query('SELECT * FROM users WHERE email = $1', [apiInput.email]);
  if (usersRes.rowCount !== 1) {
    throw new NotFoundError('account not found');
  }
  const user: User = usersRes.rows[0];

  const inputPasswordHash = await hashPassword(apiInput.password, user.id);
  const userPasswordHash = decodePasswordhash(user.password_hash);

  if (!crypto.subtle.timingSafeEqual(userPasswordHash, inputPasswordHash)) {
    throw new PermissionDeniedError('password is not valid')
  }

  const authToken = await jwt.sign({
    user_id: user.id,
    nbf: Math.floor(Date.now() / 1000), // Not before: Now
    exp: Math.floor(Date.now() / 1000) + (48 * (60 * 60)) // Expires: Now + 48h
  }, ctx.env.JWT_SECRET);

  setCookie(ctx, 'phoenix_session', authToken);

  return ctx.json(api.convertUser(user));
}
