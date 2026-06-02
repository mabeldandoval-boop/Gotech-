import { Star, CheckCircle } from "lucide-react";
import { REVIEWS } from "@/constants/reviews";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? "text-yellow-400 fill-yellow-400" : "text-white/20"}`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <section className="py-20 bg-dark-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-neon-cyan text-sm font-bold uppercase tracking-widest mb-2">Clientes</p>
          <h2 className="font-orbitron font-black text-3xl text-white mb-4">Opiniones Reales</h2>

          {/* Summary */}
          <div className="inline-flex items-center gap-4 bg-dark-700 border border-neon-cyan/20 rounded-2xl px-6 py-4">
            <div>
              <p className="font-orbitron font-black text-4xl text-neon-cyan glow-text">{avgRating}</p>
              <StarRating rating={5} />
              <p className="text-white/50 text-xs mt-1">{REVIEWS.length} reseñas</p>
            </div>
            <div className="w-px h-12 bg-neon-cyan/20" />
            <div className="text-left space-y-1">
              {[5, 4, 3].map((star) => {
                const count = REVIEWS.filter((r) => r.rating === star).length;
                const pct = Math.round((count / REVIEWS.length) * 100);
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-white/50 text-[10px] w-4">{star}★</span>
                    <div className="w-24 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-white/40 text-[10px]">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {REVIEWS.map((review) => (
            <div key={review.id} className="card-tech p-4 flex flex-col gap-3 hover:border-neon-cyan/40 transition-all">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-neon-cyan/30 to-neon-blue/30 border border-neon-cyan/20 flex items-center justify-center shrink-0">
                  <span className="font-black text-neon-cyan text-xs">{review.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <p className="text-white font-bold text-xs truncate">{review.name}</p>
                    {review.verified && (
                      <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-white/30 text-[10px]">{review.date}</p>
                </div>
              </div>

              {/* Stars + product */}
              <div>
                <StarRating rating={review.rating} />
                <p className="text-neon-cyan/60 text-[10px] font-semibold mt-1 truncate">
                  {review.productName}
                </p>
              </div>

              {/* Comment */}
              <p className="text-white/70 text-xs leading-relaxed flex-1">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
