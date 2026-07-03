import jwt from "jsonwebtoken";

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
