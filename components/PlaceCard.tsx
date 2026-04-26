import type { RankedPlace } from "@/lib/places";

interface PlaceCardProps {
  place: RankedPlace;
  maxScore: number;
  index: number;
}

function PriceRange({ range }: { range: 1 | 2 | 3 | 4 }) {
  return (
    <span className="text-sm">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className={i < range ? "text-[#E6EDF3]" : "text-[#30363D]"}>
          $
        </span>
      ))}
    </span>
  );
}

function AmbienteLabel({ ambiente }: { ambiente?: "agitado" | "tranquilo" | "moderado" }) {
  if (!ambiente) return null;
  const map = {
    agitado: { label: "Animado", color: "bg-orange-500/15 text-orange-400" },
    moderado: { label: "Moderado", color: "bg-blue-500/15 text-blue-400" },
    tranquilo: { label: "Tranquilo", color: "bg-green-500/15 text-green-400" },
  };
  const { label, color } = map[ambiente];
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>
      {label}
    </span>
  );
}

export default function PlaceCard({ place, maxScore, index }: PlaceCardProps) {
  const matchPct = maxScore > 0 ? Math.round((place.score / maxScore) * 100) : 0;

  const matchColor =
    matchPct >= 80
      ? "bg-green-500/15 text-green-400 border-green-500/20"
      : matchPct >= 55
      ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/20"
      : "bg-[#30363D]/40 text-[#8B949E] border-[#30363D]";

  const attributeIcons: { key: keyof typeof place.attributes; icon: string; label: string }[] = [
    { key: "musicaAoVivo", icon: "🎵", label: "Música ao vivo" },
    { key: "wifi", icon: "📶", label: "Wi-Fi" },
    { key: "petFriendly", icon: "🐾", label: "Pet friendly" },
    { key: "estacionamento", icon: "🅿️", label: "Estacionamento" },
    { key: "reserva", icon: "📋", label: "Aceita reserva" },
  ];

  const activeAttributes = attributeIcons.filter((a) => place.attributes[a.key]);

  return (
    <article
      className="
        group relative
        bg-[#161B22] border border-[#30363D]
        rounded-2xl overflow-hidden
        hover:border-[#F78166]/50 hover:bg-[#1C2128]
        transition-all duration-200
        animate-slide-up
      "
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Barra de match no topo */}
      <div
        className="h-0.5 bg-gradient-to-r from-[#F78166] to-transparent"
        style={{ width: `${matchPct}%` }}
      />

      <div className="p-5">
        {/* Header: nome + match */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-[#E6EDF3] font-semibold text-lg leading-tight truncate">
              {place.name}
            </h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs text-[#8B949E] bg-[#21262D] px-2 py-0.5 rounded-full">
                {place.type}
              </span>
              <span className="text-xs text-[#8B949E]">
                📍 {place.neighborhood}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${matchColor}`}
            >
              {matchPct}% match
            </span>
            <AmbienteLabel ambiente={place.attributes.ambiente} />
          </div>
        </div>

        {/* Descrição */}
        <p className="text-[#8B949E] text-sm leading-relaxed line-clamp-2 mb-3">
          {place.description}
        </p>

        {/* Tags */}
        {place.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {place.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[#0D1117] border border-[#30363D] text-[#8B949E] px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
            {place.tags.length > 5 && (
              <span className="text-xs text-[#8B949E] px-1">
                +{place.tags.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Atributos (ícones) */}
        {activeAttributes.length > 0 && (
          <div className="flex gap-3 mb-4">
            {activeAttributes.map(({ icon, label }) => (
              <span key={label} title={label} className="text-base" aria-label={label}>
                {icon}
              </span>
            ))}
          </div>
        )}

        {/* Footer: avaliação + preço + horário */}
        <div className="flex items-center justify-between pt-3 border-t border-[#21262D]">
          <div className="flex items-center gap-3">
            {/* Avaliação */}
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-medium text-[#E6EDF3]">{place.rating.toFixed(1)}</span>
              <span className="text-xs text-[#8B949E]">({place.reviewCount})</span>
            </div>

            {/* Preço */}
            <div className="flex items-center gap-1">
              <PriceRange range={place.priceRange} />
              <span className="text-xs text-[#8B949E]">{place.priceLabel}</span>
            </div>
          </div>

          {/* Horário hoje */}
          <span className="text-xs text-[#8B949E] hidden sm:block">
            {place.hours.weekdays}
          </span>
        </div>
      </div>
    </article>
  );
}
