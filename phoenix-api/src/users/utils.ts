import { Bindings, Variables } from "../bindings";
import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { PermissionDeniedError } from "../errors";
import jwt from "@phoenix/jwt";

export async function hashPassword(password: string, userId: string): Promise<ArrayBuffer> {
  const textEncoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    'raw',
    textEncoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits', 'deriveKey'],
  );

  // we derive a 512 bit hash from the password and the userId
  // See OWASP recommendations for the number of PBKDF2 iterations https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
  // as of October 2023, Cloudflare Workers limits the number of PBKDF2 iterations to 100,000
  // See https://github.com/cloudflare/workerd/issues/1346
  return await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: textEncoder.encode(userId),
      iterations: 100_000,
      hash: 'SHA-512',
    },
    key,
    512,
  );
}

// encodes an ArrayBuffer to base64
export function encodePasswordHash(hash: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(hash)))
}

// decodes a base64 string to an ArrayBuffer
export function decodePasswordhash(hash: string): ArrayBuffer {
  return Uint8Array.from(atob(hash), c => c.charCodeAt(0));
}

export async function checkAuth(ctx: Context<{Bindings: Bindings, Variables: Variables}>): Promise<string> {
  const authCookie = getCookie(ctx, 'phoenix_session');
  if (!authCookie) {
    throw new PermissionDeniedError('authentication is required');
  }

  try {
    const isAuthCookieValid = await jwt.verify(authCookie, ctx.env.JWT_SECRET);
    if (!isAuthCookieValid) {
      throw new PermissionDeniedError('');
    }
  } catch (err) {
    throw new PermissionDeniedError('session is not valid. Please clear your cookies and reload the page.');
  }

    // Decode token
    const { payload } = jwt.decode(authCookie)
    return payload.user_id as string;
}
