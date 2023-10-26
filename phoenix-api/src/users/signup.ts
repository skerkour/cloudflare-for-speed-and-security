import { bufferToBase64, hashPassword, parseAndValidateApiInput } from "../utils";
import { uuidv7 } from "@phoenix/uuiv7";
import { InternalServerError, PermissionDeniedError } from "../errors";
import { User } from "@phoenix/core/entities";
import { SignupInputValidator, convertUser } from "@phoenix/core/api";
import { Context } from "../hono_bindings";

export async function signup(ctx: Context): Promise<Response> {
  const apiInput = await parseAndValidateApiInput(ctx, SignupInputValidator);

  // for the demo we only allow 2 accounts to be created
  // 1. the admin account to manage resources
  // 2. the readers account with read-only access
  let isAdmin = false;
  const usersCountRes = await ctx.var.db.query('SELECT COUNT(*) as users_count FROM users');
  if (usersCountRes.rowCount !== 1) {
    throw new InternalServerError();
  }
  const usersCount = usersCountRes.rows[0].users_count as number | undefined;
  if (!usersCount) {
    throw new InternalServerError();
  }

  if (usersCount === 0) {
    isAdmin = true;
  } else if (usersCount >= 2) {
    throw new PermissionDeniedError();
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

  await ctx.var.db.query('INSERT INTO users VALUES ($1, $2, $3, $4, $5, $6)',
    [user.id, user.created_at, user.updated_at, user.email, user.password_hash, user.is_admin]);

  return ctx.json(convertUser(user));
}
