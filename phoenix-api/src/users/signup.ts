import { bufferToBase64, hashPassword, newApiResponse, parseAndValidateApiInput } from "../utils";
import { uuidv7 } from "@phoenix/uuidv7";
import { PermissionDeniedError } from "@phoenix/core/errors";
import { User } from "@phoenix/core/entities";
import { SignupInputValidator, convertUser } from "@phoenix/core/api";
import { Context } from "../hono_bindings";
import jwt from "@phoenix/jwt";
import { setCookie } from "hono/cookie";

export async function signup(ctx: Context): Promise<Response> {
  const apiInput = await parseAndValidateApiInput(ctx, SignupInputValidator);

  // for the demo we only allow 2 accounts to be created
  // 1. the admin account to manage resources
  // 2. the readers account with read-only access
  let isAdmin = false;
  const usersCount: number = await ctx.env.DB.prepare('SELECT COUNT(*) as users_count FROM users')
    .first('users_count') as number;

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

  // while it should be handled automatically by the database driver, we now need to manually convert
  // booleans into integers due to this issue:
  // https://github.com/cloudflare/workers-sdk/issues/3070
  await ctx.env.DB.prepare(`INSERT INTO users
    (id, created_at, updated_at, email, password_hash, is_admin)
    VALUES (?1, ?2, ?3, ?4, ?5, ?6)`)
    .bind(user.id, user.created_at.toISOString(), user.updated_at.toISOString(),
      user.email, user.password_hash, user.is_admin ? 1 : 0)
    .run();

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

  return newApiResponse(convertUser(user));
}
