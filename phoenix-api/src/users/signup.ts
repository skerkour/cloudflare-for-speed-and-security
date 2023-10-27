import { bufferToBase64, hashPassword, parseAndValidateApiInput } from "../utils";
import { uuidv7 } from "@phoenix/uuiv7";
import { InternalServerError, PermissionDeniedError } from "../errors";
import { User } from "@phoenix/core/entities";
import { SignupInputValidator, convertToApiResponse, convertUser } from "@phoenix/core/api";
import { Context } from "../hono_bindings";
import jwt from "@phoenix/jwt";
import { setCookie } from "hono/cookie";

export async function signup(ctx: Context): Promise<Response> {
  const apiInput = await parseAndValidateApiInput(ctx, SignupInputValidator);

  // for the demo we only allow 2 accounts to be created
  // 1. the admin account to manage resources
  // 2. the readers account with read-only access
  let isAdmin = false;
  const usersCountRes = await ctx.var.db.query('SELECT COUNT(*)::BIGINT as users_count FROM users');
  if (usersCountRes.rowCount !== 1) {
    throw new InternalServerError();
  }
  let usersCount = usersCountRes.rows[0].users_count as number | undefined;
  if (usersCount === undefined) {
    throw new InternalServerError();
  } else if (typeof usersCount === 'string') {
    // for some reasons, pg returns a string...
    usersCount = parseInt(usersCount, 10);
  }

  if (usersCount === 0) {
    isAdmin = true;
  } else if (usersCount >= 2) {
    throw new PermissionDeniedError('registrations are closed for the demo');
  }

  const newUserId = uuidv7();
  const passwordHashBuffer = await hashPassword(apiInput.password, newUserId);
  const passwordHash = bufferToBase64(passwordHashBuffer);

  const now = new Date();
  const user: User = {
    id: newUserId,
    created_at: now,
    updated_at: now,
    email: apiInput.email,
    password_hash: passwordHash,
    is_admin: isAdmin,
  };

  await ctx.var.db.query(`INSERT INTO users
    (id, created_at, updated_at, email, password_hash, is_admin)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [user.id, user.created_at, user.updated_at, user.email, user.password_hash, user.is_admin]);


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
