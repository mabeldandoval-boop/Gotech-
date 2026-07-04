import { getPool } from "../_lib/db.js";

const SEED_PRODUCTS = [
  {
    "id": "bluetooth-5-0",
    "name": "Adaptador USB Bluetooth 5.0",
    "short_name": "Bluetooth 5.0",
    "price": "9.50",
    "original_price": null,
    "discount": null,
    "stock": 8,
    "image": "https://cdn-ai.onspace.ai/onspace/files/THvUj2c69krqnY28qJZzBE/1000512167.png",
    "badge": "🔥 MÁS VENDIDO",
    "description": "Convierte cualquier PC en Bluetooth. Certificación BQB CSR 5.0 oficial. Plug & Play sin drivers. Alcance hasta 20m.",
    "features": [
      "Bluetooth 5.0 — conexión estable hasta 20m",
      "Plug & Play, sin instalación ni drivers",
      "Compatible con audífonos, bocinas y controles",
      "Para PC, laptops y computadoras de escritorio",
      "Diseño compacto y portátil"
    ],
    "available": true,
    "category": "Bluetooth",
    "sort_order": 0,
    "updated_at": "2026-07-03T19:02:07.854Z"
  },
  {
    "id": "microsd-128gb",
    "name": "Memoria MicroSD 128GB MTMAX",
    "short_name": "MicroSD 128GB",
    "price": "13.00",
    "original_price": null,
    "discount": null,
    "stock": 6,
    "image": "https://cdn-ai.onspace.ai/onspace/files/8QiifjmnBoEDHv6PPLFNTZ/1000512165.png",
    "badge": "💾 NUEVO",
    "description": "Memoria MicroSD 128GB velocidad 200MB/s. Almacena fotos, videos y archivos. Compatible con celulares, cámaras y tablets.",
    "features": [
      "Alta velocidad: lectura hasta 200MB/s",
      "128GB para fotos, videos y archivos",
      "Compatible con celulares, cámaras y tablets",
      "Resistente a agua, golpes y rayones",
      "Incluye adaptador SD"
    ],
    "available": true,
    "category": "Memorias",
    "sort_order": 1,
    "updated_at": "2026-07-03T19:02:09.121Z"
  },
  {
    "id": "microsd-64gb",
    "name": "Memoria MicroSD 64GB MTMAX",
    "short_name": "MicroSD 64GB",
    "price": "9.99",
    "original_price": null,
    "discount": null,
    "stock": 7,
    "image": "https://cdn-ai.onspace.ai/onspace/files/LMesSYSZMRbtrf2mkJ8Jhv/1000512163.png",
    "badge": "💾 NUEVO",
    "description": "Memoria MicroSD 64GB velocidad 200MB/s. Perfecta para celulares, cámaras y tablets. Resistente al agua.",
    "features": [
      "Alta velocidad: lectura hasta 200MB/s",
      "64GB para tus fotos, videos y archivos",
      "Compatible con celulares, cámaras y tablets",
      "Resistente a agua, golpes y rayones",
      "Incluye adaptador SD"
    ],
    "available": true,
    "category": "Memorias",
    "sort_order": 2,
    "updated_at": "2026-07-03T19:02:10.441Z"
  },
  {
    "id": "candado-moto",
    "name": "Candado de Cable para Moto MasJie",
    "short_name": "Candado Moto",
    "price": "5.00",
    "original_price": null,
    "discount": null,
    "stock": 5,
    "image": "https://cdn-ai.onspace.ai/onspace/files/NcVov2uKUMPvsTPCYHJswd/1000512137.png",
    "badge": "🔒 SEGURIDAD",
    "description": "Candado de cable de acero reforzado para moto. Combinación de 4 dígitos, sin llaves. Material anticorte y anticorrosión.",
    "features": [
      "Cable de acero reforzado anticorte",
      "Combinación de 4 dígitos, sin llaves",
      "Material anticorte y anticorrosión",
      "Práctico, portátil y confiable",
      "Ideal para cualquier tipo de moto"
    ],
    "available": true,
    "category": "Accesorios Moto",
    "sort_order": 3,
    "updated_at": "2026-07-03T19:02:11.645Z"
  },
  {
    "id": "control-remoto-universal",
    "name": "Control Remoto Universal LCD/LED",
    "short_name": "Control Universal",
    "price": "7.00",
    "original_price": null,
    "discount": null,
    "stock": 5,
    "image": "https://cdn-ai.onspace.ai/onspace/files/6yw9h27cbTqF6zJJ3HSUVM/1000511704.png",
    "badge": "📺 COMPATIBLE",
    "description": "Compatible con la mayoría de TVs LCD/LED. Botones Netflix, YouTube, Prime Video. Diseño práctico e intuitivo.",
    "features": [
      "Compatible con TVs LCD/LED de todas las marcas",
      "Acceso rápido a Netflix, YouTube y Prime Video",
      "Diseño práctico con botones intuitivos",
      "Calidad garantizada para uso diario",
      "Fácil de usar sin configuración"
    ],
    "available": true,
    "category": "Controles",
    "sort_order": 4,
    "updated_at": "2026-07-03T19:02:12.948Z"
  },
  {
    "id": "soporte-retrovisor",
    "name": "Soporte para Auto 360° Retrovisor",
    "short_name": "Soporte Auto 360°",
    "price": "5.00",
    "original_price": null,
    "discount": null,
    "stock": 6,
    "image": "https://cdn-ai.onspace.ai/onspace/files/ScCLdQsvyEKjf9Tb7GX6i9/1000512075.png",
    "badge": "🚗 ROTACIÓN 360°",
    "description": "Soporte de celular para espejo retrovisor con rotación 360°. Ajuste seguro y sujeción firme. Compatible con todos los smartphones.",
    "features": [
      "Rotación 360° para el ángulo perfecto",
      "Ajuste seguro y sujeción firme",
      "Compatible con todos los smartphones",
      "Instalación rápida sin herramientas",
      "Material resistente y duradero"
    ],
    "available": true,
    "category": "Accesorios Auto",
    "sort_order": 5,
    "updated_at": "2026-07-03T19:02:14.221Z"
  },
  {
    "id": "soporte-moto",
    "name": "Soporte Premium para Moto 50–95mm",
    "short_name": "Soporte Moto",
    "price": "6.00",
    "original_price": null,
    "discount": null,
    "stock": 7,
    "image": "https://cdn-ai.onspace.ai/onspace/files/dY7DxKhGn7koBAfEkp3tJg/1000511238.png",
    "badge": "🏍️ PREMIUM",
    "description": "Soporte premium metálico para retrovisor de moto. Compatible 50–95mm. Diseño metálico premium resistente a cualquier terreno.",
    "features": [
      "Compatible 50–95mm con todos los smartphones",
      "Diseño metálico premium resistente",
      "Ideal para GPS, música y llamadas",
      "Fácil instalación en retrovisor de moto",
      "Máxima seguridad en cualquier terreno"
    ],
    "available": true,
    "category": "Accesorios Moto",
    "sort_order": 6,
    "updated_at": "2026-07-03T19:02:15.536Z"
  },
  {
    "id": "control-tcl",
    "name": "Control Remoto TCL Smart TV",
    "short_name": "Control TCL",
    "price": "10.00",
    "original_price": null,
    "discount": null,
    "stock": 3,
    "image": "https://cdn-ai.onspace.ai/onspace/files/MwBcLQraNJUPLrji2LwHnH/1000511696.png",
    "badge": "🟢 DISPONIBLE HOY",
    "description": "Control universal para todos los modelos TCL Smart TV. Con Asistente de Google, Netflix y YouTube integrados.",
    "features": [
      "Compatible con todos los modelos TCL Smart TV",
      "Asistente de Google integrado",
      "Botones directos Netflix y YouTube",
      "Diseño ergonómico e intuitivo",
      "Calidad garantizada para uso diario"
    ],
    "available": true,
    "category": "Controles",
    "sort_order": 7,
    "updated_at": "2026-07-03T19:02:16.866Z"
  },
  {
    "id": "bocina-portatil",
    "name": "Bocina Portátil Bluetooth GTS-1961",
    "short_name": "Bocina Portátil",
    "price": "5.99",
    "original_price": null,
    "discount": null,
    "stock": 10,
    "image": "/bocina-portatil.png",
    "badge": "🔊 NUEVO",
    "description": "Bocina portátil con sonido potente y claro. Bluetooth 5.0 con alcance de 10m. Reproduce por Bluetooth, USB, TF Card y FM. Batería recargable de larga duración.",
    "features": [
      "Sonido potente — audio claro y de alta fidelidad",
      "Bluetooth 5.0 — conexión estable hasta 10m",
      "Multifunción: Bluetooth, USB, TF Card y FM",
      "Batería recargable para más horas de música",
      "Portátil y ligera, llévala a donde quieras"
    ],
    "available": true,
    "category": "Bocinas",
    "sort_order": 8,
    "updated_at": "2026-07-03T19:02:17.939Z"
  },
  {
    "id": "arnes-reflector",
    "name": "Arnés Reflector de Seguridad",
    "short_name": "Arnés Reflector",
    "price": "3.00",
    "original_price": null,
    "discount": null,
    "stock": 10,
    "image": "/arnes-reflector.png",
    "badge": "",
    "description": "Arnés reflector con tiras 360° para máxima visibilidad de día y de noche. Correas elásticas ajustables, material transpirable y ligero.",
    "features": [
      "Tiras reflectantes 360° visibles de día y de noche",
      "Correas elásticas ajustables para mayor comodidad",
      "Material transpirable, cómodo y ligero",
      "Ideal para moto, ciclismo, running y caminatas nocturnas",
      "Resistente al desgaste y a la intemperie"
    ],
    "available": true,
    "category": "Accesorios Moto",
    "sort_order": 9,
    "updated_at": "2026-07-03T19:02:19.287Z"
  }
];

export default async function handler(req, res) {
  const key = req.headers["x-migrate-key"] || req.query.key;
  if (key !== process.env.ADMIN_JWT_SECRET) {
    return res.status(401).json({ error: "No autorizado" });
  }

  const pool = getPool();

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_lockouts (
        device_id VARCHAR NOT NULL PRIMARY KEY,
        locked_until TIMESTAMP,
        last_attempt TIMESTAMP DEFAULT NOW(),
        failed_count INTEGER NOT NULL DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR NOT NULL PRIMARY KEY,
        name VARCHAR NOT NULL,
        short_name VARCHAR NOT NULL DEFAULT '',
        price NUMERIC NOT NULL,
        original_price NUMERIC,
        discount NUMERIC,
        stock INTEGER NOT NULL DEFAULT 0,
        image TEXT NOT NULL,
        badge VARCHAR,
        description TEXT NOT NULL DEFAULT '',
        features JSONB NOT NULL DEFAULT '[]',
        available BOOLEAN NOT NULL DEFAULT true,
        category VARCHAR NOT NULL DEFAULT '',
        sort_order INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    let inserted = 0;
    for (const p of SEED_PRODUCTS) {
      await pool.query(
        `INSERT INTO products (
          id, name, short_name, price, original_price, discount, stock, image,
          badge, description, features, available, category, sort_order, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          short_name = EXCLUDED.short_name,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price,
          discount = EXCLUDED.discount,
          stock = EXCLUDED.stock,
          image = EXCLUDED.image,
          badge = EXCLUDED.badge,
          description = EXCLUDED.description,
          features = EXCLUDED.features,
          available = EXCLUDED.available,
          category = EXCLUDED.category,
          sort_order = EXCLUDED.sort_order,
          updated_at = EXCLUDED.updated_at`,
        [
          p.id, p.name, p.short_name, p.price, p.original_price, p.discount,
          p.stock, p.image, p.badge, p.description, JSON.stringify(p.features),
          p.available, p.category, p.sort_order, p.updated_at,
        ]
      );
      inserted++;
    }

    const check = await pool.query("SELECT count(*) FROM products");
    return res.status(200).json({ ok: true, inserted, totalInDb: check.rows[0].count });
  } catch (err) {
    return res.status(500).json({ error: err.message, stack: err.stack });
  }
}
