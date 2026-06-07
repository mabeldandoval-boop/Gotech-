export const SCHEDULE_STORAGE_KEY = "gotech_schedule_bookings";

export interface Booking {
  id: string;
  slotKey: string; // "YYYY-MM-DD-HH"
  date: string;    // display "Lunes 5 May"
  time: string;    // display "4:00 PM"
  name: string;
  product: string;
  deliveryPoint: string;
  phone?: string;
  createdAt: string;
}

// Available delivery hours — weekdays
export const AVAILABLE_HOURS = [
  { hour: 8,  label: "8:00 AM" },
  { hour: 9,  label: "9:00 AM" },
  { hour: 10, label: "10:00 AM" },
  { hour: 11, label: "11:00 AM" },
  { hour: 12, label: "12:00 PM" },
  { hour: 13, label: "1:00 PM" },
  { hour: 14, label: "2:00 PM" },
  { hour: 15, label: "3:00 PM" },
  { hour: 16, label: "4:00 PM" },
];

// Available delivery hours — weekends (Sábado & Domingo)
export const WEEKEND_HOURS = [
  { hour: 13, label: "1:00 PM" },
  { hour: 14, label: "2:00 PM" },
  { hour: 15, label: "3:00 PM" },
];

export function getHoursForDay(date: Date) {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday
  return day === 0 || day === 6 ? WEEKEND_HOURS : AVAILABLE_HOURS;
}

export const DELIVERY_POINTS = [
  "Torre Futura",
  "75 Av. Norte (Gasolinera)",
];

export function getSlotKey(date: Date, hour: number): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}-${hour}`;
}

export function getNextDays(count = 7): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

export function formatDayShort(date: Date): string {
  return date.toLocaleDateString("es-SV", { weekday: "short", day: "numeric" });
}

export function formatDayFull(date: Date): string {
  return date.toLocaleDateString("es-SV", { weekday: "long", day: "numeric", month: "long" });
}

export function formatHour(hour: number): string {
  const h = AVAILABLE_HOURS.find((a) => a.hour === hour);
  return h ? h.label : `${hour}:00`;
}

export function loadBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBookings(bookings: Booking[]): void {
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(bookings));
}

export function addBooking(booking: Booking): void {
  const bookings = loadBookings();
  bookings.push(booking);
  saveBookings(bookings);
}

export function isSlotTaken(slotKey: string): boolean {
  return loadBookings().some((b) => b.slotKey === slotKey);
}

export function buildScheduleWhatsApp(booking: Omit<Booking, "id" | "createdAt">, whatsappNumber: string): string {
  let msg = `Hola GoTech! 👋\n\n`;
  msg += `📅 *Reserva de Entrega*\n\n`;
  msg += `👤 Nombre: ${booking.name}\n`;
  msg += `📦 Producto: ${booking.product}\n`;
  msg += `📍 Punto de entrega: ${booking.deliveryPoint}\n`;
  msg += `🗓️ Fecha: ${booking.date}\n`;
  msg += `⏰ Hora: ${booking.time}\n`;
  if (booking.phone) msg += `📱 Teléfono: ${booking.phone}\n`;
  msg += `\n¿Pueden confirmar la entrega?`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
}
