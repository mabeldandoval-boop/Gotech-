import jwt from "jsonwebtoken";

/**
 * Returns the real client IP address.
 * On Vercel, `x-real-ip` is set by the edge network to the actual client IP
 * and is more trustworthy than x-forwarded-for (which can be prepended by clients).
 * Falls back to the last (rightmost) entry in x-forwarded-for, then socket address.
 */
export function getClientIp(req) {
  // Vercel edge sets x-real-ip to actual client IP — prefer this
  const realIp = req.headers["x-real-ip"];
  if (realIp && isValidIp(realIp.trim())) return realIp.trim();

  // x-forwarded-for: rightmost value added by the last trusted proxy
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ips = forwarded.split(",").map((s) => s.trim()).filter(isValidIp);
    if (ips.length) return ips[ips.length - 1]; // rightmost = most recently added by trusted proxy
  }

  return req.socket?.remoteAddress || "unknown";
}

function isValidIp(ip) {
  if (!ip || typeof ip !== "string") return false;
  // Basic IPv4 / IPv6 / IPv4-mapped check — rejects obviously spoofed non-IP strings
  return /^[\d.:a-fA-F]+$/.test(ip) && ip.length <= 45;
}

function getSecret() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret) throw new Error("ADMIN_JWT_SECRET no está configurado");
  return secret;
}

export function signAdminToken() {
  return jwt.sign({ role: "admin" }, getSecret(), { expiresIn: "12h" });
}

export function verifyAdminToken(token) {
  if (!token) return false;
  try {
    const payload = jwt.verify(token, getSecret());
    return payload && payload.role === "admin";
  } catch {
    return false;
  }
}

export function requireAdmin(req) {
  const header = req.headers["authorization"] || req.headers["Authorization"] || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return verifyAdminToken(token);
}
