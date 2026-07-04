import { getAllProducts, updateProduct } from "../api/_lib/productsCore.js";
import { signAdminToken, verifyAdminToken } from "../api/_lib/auth.js";

function readJsonBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch {
        resolve({});
      }
    });
  });
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

function getBearerToken(req) {
  const header = req.headers["authorization"] || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

export function devApiPlugin() {
  return {
    name: "gotech-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) return next();

        const url = new URL(req.url, "http://localhost");
        const pathname = url.pathname;

        try {
          if (pathname === "/api/products" && req.method === "GET") {
            const products = await getAllProducts();
            return send(res, 200, { products });
          }

          const productMatch = pathname.match(/^\/api\/products\/([^/]+)$/);
          if (productMatch && req.method === "PUT") {
            if (!verifyAdminToken(getBearerToken(req))) {
              return send(res, 401, { error: "No autorizado" });
            }
            const body = await readJsonBody(req);
            const product = await updateProduct(decodeURIComponent(productMatch[1]), body);
            if (!product) return send(res, 404, { error: "Producto no encontrado" });
            return send(res, 200, { product });
          }

          if (pathname === "/api/admin/login" && req.method === "POST") {
            const body = await readJsonBody(req);
            const { password } = body;
            if (!password || password !== process.env.ADMIN_PASSWORD) {
              return send(res, 401, { error: "Contraseña incorrecta" });
            }
            return send(res, 200, { ok: true, question: "¿Quién es el dueño?" });
          }

          if (pathname === "/api/admin/verify" && req.method === "POST") {
            const body = await readJsonBody(req);
            const { answer } = body;
            const expected = (process.env.ADMIN_SECURITY_ANSWER || "").trim().toLowerCase();
            const given = (answer || "").trim().toLowerCase();
            if (!given || !expected || given !== expected) {
              return send(res, 401, { error: "Respuesta incorrecta" });
            }
            const token = signAdminToken();
            return send(res, 200, { ok: true, token });
          }

          return send(res, 404, { error: "Not found" });
        } catch (err) {
          console.error("[dev-api] error:", err);
          return send(res, 500, { error: "Error interno del servidor" });
        }
      });
    },
  };
}
