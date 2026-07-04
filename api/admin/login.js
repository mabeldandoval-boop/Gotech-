export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { password } = req.body || {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Contraseña incorrecta" });
  }

  return res.status(200).json({ ok: true, question: "¿Quién es el dueño?" });
}
