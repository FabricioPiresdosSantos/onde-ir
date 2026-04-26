"use client";

import { useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import type { RankedPlace } from "@/lib/places";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

const CURITIBA_VIEW = {
  longitude: -49.2733,
  latitude: -25.4284,
  zoom: 13,
};

// ─── Pin numerado ──────────────────────────────────────────
function Pin({ rank, isActive }: { rank: number; isActive: boolean }) {
  return (
    <div
      style={{ transform: "translate(-50%, -100%)" }}
      className={`
        relative flex items-center justify-center
        w-7 h-7 rounded-full
        text-white text-xs font-bold
        border-2 cursor-pointer
        transition-all duration-150 select-none
        ${
          isActive
            ? "bg-white text-[#F78166] border-[#F78166] scale-125 shadow-lg shadow-[#F78166]/40"
            : "bg-[#F78166] border-white/30 hover:scale-110 shadow-md shadow-black/40"
        }
      `}
    >
      {rank + 1}
      {/* triângulo inferior */}
      <span
        className={`
          absolute -bottom-[7px] left-1/2 -translate-x-1/2
          border-l-[5px] border-r-[5px] border-t-[7px]
          border-l-transparent border-r-transparent
          ${isActive ? "border-t-white" : "border-t-[#F78166]"}
        `}
      />
    </div>
  );
}

// ─── Fallback sem token ────────────────────────────────────
function NoTokenFallback() {
  return (
    <div className="h-[300px] w-full bg-[#161B22] border border-[#30363D] rounded-2xl flex flex-col items-center justify-center gap-2 mb-6">
      <svg
        className="w-10 h-10 text-[#30363D]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
        />
      </svg>
      <p className="text-[#8B949E] text-sm">Configure o Mapbox token para ver o mapa</p>
      <code className="text-[#30363D] text-xs font-mono">NEXT_PUBLIC_MAPBOX_TOKEN</code>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────
interface MapViewProps {
  places: RankedPlace[];
}

export default function MapView({ places }: MapViewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (!TOKEN) return <NoTokenFallback />;

  const activePlace = places.find((p) => p.id === activeId) ?? null;

  return (
    <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-[#30363D] mb-6">
      <Map
        mapboxAccessToken={TOKEN}
        initialViewState={CURITIBA_VIEW}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        style={{ width: "100%", height: "100%" }}
        onClick={() => setActiveId(null)}
      >
        <NavigationControl position="top-right" showCompass={false} />

        {places.map((place, i) => (
          <Marker
            key={place.id}
            longitude={place.lng}
            latitude={place.lat}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setActiveId((prev) => (prev === place.id ? null : place.id));
            }}
          >
            <Pin rank={i} isActive={activeId === place.id} />
          </Marker>
        ))}

        {activePlace && (
          <Popup
            longitude={activePlace.lng}
            latitude={activePlace.lat}
            anchor="bottom"
            offset={20}
            onClose={() => setActiveId(null)}
            closeOnClick={false}
            closeButton={false}
            className="onde-ir-popup"
          >
            <div className="min-w-[160px]">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-[#E6EDF3] font-semibold text-sm leading-tight">
                  {activePlace.name}
                </p>
                <button
                  onClick={() => setActiveId(null)}
                  className="text-[#8B949E] hover:text-[#E6EDF3] flex-shrink-0 mt-0.5 transition-colors"
                  aria-label="Fechar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <p className="text-[#8B949E] text-xs">{activePlace.type}</p>

              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex items-center gap-0.5">
                  <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-[#E6EDF3] text-xs font-medium">{activePlace.rating.toFixed(1)}</span>
                </div>
                <span className="text-[#30363D]">·</span>
                <span className="text-[#8B949E] text-xs">{activePlace.neighborhood}</span>
              </div>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
