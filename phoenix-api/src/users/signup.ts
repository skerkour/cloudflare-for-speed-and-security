import { Context } from "hono";
import { Bindings, Variables } from "../bindings";
import * as api from "./api";
import { encodePasswordHash, hashPassword } from "./utils";
import { uuidv7 } from "@phoenix/uuiv7";
import { User } from "./entities";
import { InternalServerError, PermissionDeniedError } from "../errors";

export async function signup(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<Response> {
  const reqBody = await ctx.req.json()
  const apiInput = api.SignupInput.parse(reqBody);

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
  const passwordHash = encodePasswordHash(passwordHashBuffer);

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

  return ctx.json(api.convertUser(user));
}
