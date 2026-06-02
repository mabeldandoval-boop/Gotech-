import { useState, useEffect } from "react";
import { Calendar, Clock, CheckCircle2, MessageCircle, X, User, Package, MapPin, ChevronLeft, ChevronRight, Phone } from "lucide-react";
import {
  Booking,
  AVAILABLE_HOURS,
  DELIVERY_POINTS,
  getSlotKey,
  getNextDays,
  formatDayShort,
  formatDayFull,
  formatHour,
  loadBookings,
  addBooking,
  isSlotTaken,
  buildScheduleWhatsApp,
} from "@/constants/schedule";
import { WHATSAPP_NUMBER, PRODUCTS } from "@/constants/products";

type Step = "calendar" | "form" | "whatsapp" | "confirm";

export default function DeliveryScheduler() {
  const [days] = useState(() => getNextDays(7));
  const [selectedDay, setSelectedDay] = useState<Date>(days[0]);
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [step, setStep] = useState<Step>("calendar");
  const [dayIndex, setDayIndex] = useState(0);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    product: "",
    deliveryPoint: "",
    phone: "",
  });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    setBookings(loadBookings());
  }, []);

  const refreshBookings = () => setBookings(loadBookings());

  const handleSelectSlot = (hour: number) => {
    const key = getSlotKey(selectedDay, hour);
    if (isSlotTaken(key)) return;
    setSelectedHour(hour);
    setStep("form");
    setFormError("");
    setForm({ name: "", product: "", deliveryPoint: "", phone: "" });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.product.trim() || !form.deliveryPoint.trim()) {
      setFormError("Por favor completa todos los campos requeridos.");
      return;
    }
    if (!selectedHour) return;

    const slotKey = getSlotKey(selectedDay, selectedHour);
    if (isSlotTaken(slotKey)) {
      setFormError("Este espacio acaba de ser ocupado. Selecciona otro.");
      setStep("calendar");
      refreshBookings();
      return;
    }

    const booking: Booking = {
      id: `GT-${Date.now()}`,
      slotKey,
      date: formatDayFull(selectedDay),
      time: formatHour(selectedHour),
      name: form.name.trim(),
      product: form.product.trim(),
      deliveryPoint: form.deliveryPoint,
      phone: form.phone.trim(),
      createdAt: new Date().toISOString(),
    };

    setPendingBooking(booking);
    setStep("whatsapp");
  };

  const handleConfirmViaWhatsApp = () => {
    if (!pendingBooking) return;
    addBooking(pendingBooking);
    refreshBookings();
    setStep("confirm");
    const url = buildScheduleWhatsApp(pendingBooking, WHATSAPP_NUMBER);
    window.open(url, "_blank");
  };

  const handleReset = () => {
    setStep("calendar");
    setSelectedHour(null);
    setFormError("");
    setPendingBooking(null);
  };

  const slotKey = selectedHour ? getSlotKey(selectedDay, selectedHour) : "";

  const visibleDays = days.slice(dayIndex, dayIndex + 4);

  return (
    <section className="py-20 section-grid" id="agenda">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-neon-cyan" />
            <span className="badge-neon text-xs">AGENDA TU ENTREGA</span>
          </div>
          <h2 className="font-orbitron font-black text-3xl md:text-4xl text-white mb-3">
            Programar <span className="text-neon-cyan glow-text">Entrega</span>
          </h2>
          <p className="text-white/50 text-base max-w-md mx-auto">
            Elige el día y la hora de tu entrega. Los espacios ocupados se marcan automáticamente.
          </p>
        </div>

        <div className="card-tech overflow-hidden">
          {/* Step indicators */}
          <div className="flex items-center border-b border-neon-cyan/10 px-6 py-4 gap-4">
            {[
              { id: "calendar", label: "1. Horario", icon: <Calendar className="w-3.5 h-3.5" /> },
              { id: "form", label: "2. Tus Datos", icon: <User className="w-3.5 h-3.5" /> },
              { id: "whatsapp", label: "3. WhatsApp", icon: <MessageCircle className="w-3.5 h-3.5" /> },
              { id: "confirm", label: "4. Listo", icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
            ].map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                {i > 0 && <div className="w-6 h-px bg-neon-cyan/20" />}
                <div className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${step === s.id ? "text-neon-cyan" : ["calendar", "form", "whatsapp", "confirm"].indexOf(step) > i ? "text-green-400" : "text-white/25"}`}>
                  {s.icon}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── STEP 1: CALENDAR ── */}
          {step === "calendar" && (
            <div className="p-6">
              {/* Day selector */}
              <div className="mb-6">
                <p className="text-neon-cyan/70 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Selecciona el día
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDayIndex(Math.max(0, dayIndex - 1))}
                    disabled={dayIndex === 0}
                    className="w-8 h-8 rounded-lg border border-neon-cyan/20 flex items-center justify-center text-neon-cyan/50 hover:border-neon-cyan/60 hover:text-neon-cyan disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex-1 grid grid-cols-4 gap-2">
                    {visibleDays.map((day) => {
                      const isToday = day.toDateString() === new Date().toDateString();
                      const isSelected = day.toDateString() === selectedDay.toDateString();
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => setSelectedDay(day)}
                          className={`rounded-xl py-3 text-center transition-all border ${
                            isSelected
                              ? "border-neon-cyan bg-neon-cyan/15 shadow-[0_0_15px_rgba(0,207,255,0.2)]"
                              : "border-white/10 bg-dark-700/50 hover:border-neon-cyan/40"
                          }`}
                        >
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isSelected ? "text-neon-cyan" : "text-white/40"}`}>
                            {day.toLocaleDateString("es-SV", { weekday: "short" })}
                          </p>
                          <p className={`font-orbitron font-black text-xl ${isSelected ? "text-neon-cyan glow-text" : "text-white/70"}`}>
                            {day.getDate()}
                          </p>
                          {isToday && (
                            <p className="text-[9px] text-neon-cyan/60 font-bold uppercase">Hoy</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setDayIndex(Math.min(days.length - 4, dayIndex + 1))}
                    disabled={dayIndex >= days.length - 4}
                    className="w-8 h-8 rounded-lg border border-neon-cyan/20 flex items-center justify-center text-neon-cyan/50 hover:border-neon-cyan/60 hover:text-neon-cyan disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Time slots */}
              <div>
                <p className="text-neon-cyan/70 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Horarios disponibles — {selectedDay.toLocaleDateString("es-SV", { weekday: "long", day: "numeric", month: "long" })}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {AVAILABLE_HOURS.map(({ hour, label }) => {
                    const key = getSlotKey(selectedDay, hour);
                    const taken = bookings.some((b) => b.slotKey === key);
                    return (
                      <button
                        key={hour}
                        onClick={() => !taken && handleSelectSlot(hour)}
                        disabled={taken}
                        className={`relative rounded-xl py-3 px-2 text-center text-xs font-bold transition-all border ${
                          taken
                            ? "border-red-500/20 bg-red-500/5 text-red-400/50 cursor-not-allowed"
                            : "border-neon-cyan/20 bg-dark-700/60 text-white/70 hover:border-neon-cyan/60 hover:text-neon-cyan hover:bg-neon-cyan/10 cursor-pointer"
                        }`}
                      >
                        <Clock className={`w-3.5 h-3.5 mx-auto mb-1 ${taken ? "text-red-400/30" : "text-neon-cyan/50"}`} />
                        {label}
                        {taken && (
                          <div className="absolute inset-0 flex items-center justify-center rounded-xl">
                            <span className="text-[9px] font-black text-red-400/70 bg-dark-800/80 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Ocupado</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 text-[11px] text-white/30">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm border border-neon-cyan/40 bg-neon-cyan/10" />
                  Disponible
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm border border-red-500/30 bg-red-500/10" />
                  Ocupado
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: FORM ── */}
          {step === "form" && (
            <form onSubmit={handleFormSubmit} className="p-6">
              {/* Selected slot summary */}
              <div className="flex items-center gap-3 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl px-4 py-3 mb-6">
                <div className="w-9 h-9 rounded-lg bg-neon-cyan/20 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-neon-cyan font-bold text-sm">{formatDayFull(selectedDay)}</p>
                  <p className="text-white/60 text-xs">{selectedHour ? formatHour(selectedHour) : ""}</p>
                </div>
                <button type="button" onClick={() => setStep("calendar")} className="ml-auto text-white/30 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-neon-cyan/70 text-xs font-bold uppercase tracking-widest mb-4">Tus datos de entrega</p>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-1.5 text-white/60 text-xs font-semibold mb-1.5">
                    <User className="w-3.5 h-3.5 text-neon-cyan" /> Nombre completo *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Tu nombre"
                    className="w-full bg-dark-700 border border-neon-cyan/20 focus:border-neon-cyan/60 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors"
                    required
                  />
                </div>

                {/* Product */}
                <div>
                  <label className="flex items-center gap-1.5 text-white/60 text-xs font-semibold mb-1.5">
                    <Package className="w-3.5 h-3.5 text-neon-cyan" /> Producto pedido *
                  </label>
                  <select
                    value={form.product}
                    onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
                    className="w-full bg-dark-700 border border-neon-cyan/20 focus:border-neon-cyan/60 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors appearance-none"
                    required
                  >
                    <option value="" className="bg-dark-800">Selecciona un producto...</option>
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name} className="bg-dark-800">{p.name} — ${p.price.toFixed(2)}</option>
                    ))}
                    <option value="Moto Pack Pro (Combo)" className="bg-dark-800">Moto Pack Pro (Combo) — $15.00</option>
                    <option value="Control Pack (Combo)" className="bg-dark-800">Control Pack (Combo) — $14.00</option>
                    <option value="Otro producto" className="bg-dark-800">Otro producto</option>
                  </select>
                </div>

                {/* Delivery point */}
                <div>
                  <label className="flex items-center gap-1.5 text-white/60 text-xs font-semibold mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neon-cyan" /> Punto de entrega *
                  </label>
                  <select
                    value={form.deliveryPoint}
                    onChange={(e) => setForm((f) => ({ ...f, deliveryPoint: e.target.value }))}
                    className="w-full bg-dark-700 border border-neon-cyan/20 focus:border-neon-cyan/60 rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors appearance-none"
                    required
                  >
                    <option value="" className="bg-dark-800">Selecciona zona...</option>
                    {DELIVERY_POINTS.map((p) => (
                      <option key={p} value={p} className="bg-dark-800">{p}</option>
                    ))}
                  </select>
                </div>

                {/* Phone (optional) */}
                <div>
                  <label className="flex items-center gap-1.5 text-white/60 text-xs font-semibold mb-1.5">
                    <Phone className="w-3.5 h-3.5 text-neon-cyan" /> Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="7XXX XXXX"
                    maxLength={15}
                    className="w-full bg-dark-700 border border-neon-cyan/20 focus:border-neon-cyan/60 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {formError && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
                  ⚠️ {formError}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep("calendar")}
                  className="px-5 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 text-sm font-semibold transition-all"
                >
                  Atrás
                </button>
                <button type="submit" className="flex-1 btn-neon py-3 text-sm flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Reservar horario
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: WHATSAPP ── */}
          {step === "whatsapp" && pendingBooking && (
            <div className="p-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mx-auto mb-5">
                <MessageCircle className="w-10 h-10 text-neon-cyan" />
              </div>
              <h3 className="font-orbitron font-black text-xl text-white mb-2">¡Ya casi!</h3>
              <p className="text-white/50 text-sm mb-1 max-w-xs mx-auto">
                Confirma por WhatsApp para reservar tu horario.
              </p>
              <p className="text-neon-cyan/60 text-xs mb-6 max-w-xs mx-auto font-semibold">
                El horario solo queda apartado cuando mandas el mensaje.
              </p>

              {/* Summary card */}
              <div className="bg-dark-700/60 border border-neon-cyan/20 rounded-2xl p-5 text-left mb-6 max-w-sm mx-auto">
                <div className="space-y-2.5">
                  {[
                    { icon: <Calendar className="w-3.5 h-3.5" />, label: "Fecha", value: pendingBooking.date },
                    { icon: <Clock className="w-3.5 h-3.5" />, label: "Hora", value: pendingBooking.time },
                    { icon: <User className="w-3.5 h-3.5" />, label: "Nombre", value: pendingBooking.name },
                    { icon: <Package className="w-3.5 h-3.5" />, label: "Producto", value: pendingBooking.product },
                    { icon: <MapPin className="w-3.5 h-3.5" />, label: "Punto", value: pendingBooking.deliveryPoint },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      <div className="text-neon-cyan mt-0.5 shrink-0">{row.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/30 text-[10px] uppercase tracking-wider font-bold">{row.label}</p>
                        <p className="text-white text-xs font-semibold leading-snug">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <button
                  onClick={handleConfirmViaWhatsApp}
                  className="btn-neon flex items-center justify-center gap-2 py-3.5 text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Confirmar por WhatsApp
                </button>
                <button
                  onClick={() => setStep("form")}
                  className="text-white/30 hover:text-white/60 text-xs font-semibold transition-colors py-2"
                >
                  ← Editar mis datos
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: CONFIRM ── */}
          {step === "confirm" && pendingBooking && (
            <div className="p-6 text-center">
              <div className="w-20 h-20 rounded-2xl bg-green-500/15 border border-green-400/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              </div>
              <h3 className="font-orbitron font-black text-xl text-white mb-2">¡Reserva Confirmada!</h3>
              <p className="text-white/50 text-sm mb-6 max-w-xs mx-auto">
                Tu horario quedó apartado. Te estaremos contactando para coordinar la entrega.
              </p>

              {/* Summary card */}
              <div className="bg-dark-700/60 border border-green-400/20 rounded-2xl p-5 text-left mb-6 max-w-sm mx-auto">
                <div className="space-y-2.5">
                  {[
                    { icon: <Calendar className="w-3.5 h-3.5" />, label: "Fecha", value: pendingBooking.date },
                    { icon: <Clock className="w-3.5 h-3.5" />, label: "Hora", value: pendingBooking.time },
                    { icon: <User className="w-3.5 h-3.5" />, label: "Nombre", value: pendingBooking.name },
                    { icon: <Package className="w-3.5 h-3.5" />, label: "Producto", value: pendingBooking.product },
                    { icon: <MapPin className="w-3.5 h-3.5" />, label: "Punto", value: pendingBooking.deliveryPoint },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start gap-3">
                      <div className="text-green-400 mt-0.5 shrink-0">{row.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white/30 text-[10px] uppercase tracking-wider font-bold">{row.label}</p>
                        <p className="text-white text-xs font-semibold leading-snug">{row.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleReset}
                className="text-white/30 hover:text-white/60 text-xs font-semibold transition-colors py-2"
              >
                Programar otra entrega
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
