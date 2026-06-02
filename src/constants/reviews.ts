export interface Review {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  productName: string;
  comment: string;
  verified: boolean;
}

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Carlos M.",
    avatar: "CM",
    rating: 5,
    date: "28 Abr 2026",
    productName: "Adaptador Bluetooth 5.0",
    comment: "Llegó super rápido, lo pedí en la mañana y al mediodía ya lo tenía. El adaptador funciona perfecto con mis audífonos. 100% recomendado!",
    verified: true,
  },
  {
    id: 2,
    name: "Andrea L.",
    avatar: "AL",
    rating: 5,
    date: "25 Abr 2026",
    productName: "Control Remoto TCL",
    comment: "Me quedé sin control y este fue la solución perfecta. Plug and play, lo conecté y funcionó al instante con mi Smart TV. Excelente servicio!",
    verified: true,
  },
  {
    id: 3,
    name: "Roberto V.",
    avatar: "RV",
    rating: 5,
    date: "22 Abr 2026",
    productName: "Control Remoto Universal",
    comment: "Muy buen producto, compatible con mi televisor Samsung y el decodificador también. El envío fue rápido a Torre Futura. Precio justo.",
    verified: true,
  },
  {
    id: 4,
    name: "María J.",
    avatar: "MJ",
    rating: 5,
    date: "19 Abr 2026",
    productName: "Adaptador Bluetooth 5.0",
    comment: "Fácil de usar, solo lo conecté y mi PC ya detectó mis bocinas Bluetooth. Sin instalación ni nada. Muy buena compra por WhatsApp.",
    verified: true,
  },
  {
    id: 5,
    name: "Diego F.",
    avatar: "DF",
    rating: 5,
    date: "16 Abr 2026",
    productName: "Soporte Retrovisor",
    comment: "Perfecto para el GPS en el carro. Se instala en segundos y aguanta bien el celular incluso en carretera. El envío llegó puntual.",
    verified: true,
  },
  {
    id: 6,
    name: "Sofía R.",
    avatar: "SR",
    rating: 5,
    date: "14 Abr 2026",
    productName: "Control Remoto Universal",
    comment: "Lo compré para reemplazar el control de mi mama que se dañó. Configura fácil y tiene todos los botones que necesitaba. Servicio muy rápido!",
    verified: true,
  },
  {
    id: 7,
    name: "Luis A.",
    avatar: "LA",
    rating: 5,
    date: "10 Abr 2026",
    productName: "Control Remoto TCL",
    comment: "Justo lo que buscaba. El envío gratis en Galerías Escalón fue muy conveniente. El control funciona al 100% en mi TCL de 55 pulgadas.",
    verified: true,
  },
  {
    id: 8,
    name: "Patricia C.",
    avatar: "PC",
    rating: 5,
    date: "7 Abr 2026",
    productName: "Adaptador Bluetooth 5.0",
    comment: "Excelente atención por WhatsApp, me respondieron rápido y coordinamos la entrega fácil. El adaptador funciona perfecto con mi teclado Bluetooth.",
    verified: true,
  },
];
