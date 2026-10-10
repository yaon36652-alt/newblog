import { SignJWT, jwtVerify } from "jose";

// 会话 cookie 名与有效期（7 天）
export const SESSION_COOKIE = "admin_session";
export const MAX_AGE = 60 * 60 * 24 * 7;

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("缺少 AUTH_SECRET 环境变量");
  return new TextEncoder().encode(secret);
}

/** 登录成功后签发会话 token */
export async function signToken(username: string): Promise<string> {
  return new SignJWT({ username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(getSecret());
}

/** 校验会话 token，无效或过期返回 null（jose 可用于 Edge 运行时，见 proxy.ts） */
export async function verifyToken(
  token: string
): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { username: String(payload.username ?? "") };
  } catch {
    return null;
  }
}
