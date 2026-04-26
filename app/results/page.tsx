"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import dynamic from "next/dynamic";
import PlaceCard from "@/components/PlaceCard";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import type { RankedPlace } from "@/lib/places";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full bg-[#161B22] border border-[#30363D] rounded-2xl mb-6 animate-pulse-subtle" />
  ),
});

interface SearchResponse {
  results: RankedPlace[];
  interpretation: {
    summary: string;
    neighborhood: string | null;
    type: string | null;
  };
  cached: boolean;
  error?: string;
}

// ──────────────────────────────────────────────────────────
// Esqueleto de loading
// ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-5 animate-pulse-subtle">
      <div className="flex justify-between mb-3">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-[#21262D] rounded" />
          <div className="h-3 w-24 bg-[#21262D] rounded" />
        </div>
        <div className="h-7 w-20 bg-[#21262D] rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-[#21262D] rounded" />
        <div className="h-3 w-4/5 bg-[#21262D] rounded" />
      </div>
      <div className="flex gap-2 mb-3">
        {[60, 80, 50].map((w) => (
          <div key={w} className="h-5 bg-[#21262D] rounded-full" style={{ width: w }} />
        ))}
      </div>
      <div className="h-px bg-[#21262D] mb-3" />
      <div className="flex justify-between">
        <div className="h-4 w-24 bg-[#21262D] rounded" />
        <div className="h-4 w-20 bg-[#21262D] rounded" />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {/* Esqueleto do box de interpretação */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 animate-pulse-subtle">
        <div className="h-3 w-16 bg-[#21262D] rounded mb-2" />
        <div className="h-4 w-3/4 bg-[#21262D] rounded" />
      </div>
      {/* Esqueleto dos cards */}
      {Array.from({ length: 4 }, (_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Estado vazio
// ──────────────────────────────────────────────────────────
function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-[#161B22] border border-[#30363D] rounded-2xl flex items-center justify-center mb-4">
        <span className="text-3xl">🔍</span>
      </div>
      <h2 className="text-[#E6EDF3] font-semibold text-lg mb-2">
        Nenhum lugar encontrado
      </h2>
      <p className="text-[#8B949E] text-sm max-w-xs">
        Não encontramos resultados para{" "}
        <span className="text-[#F78166]">&ldquo;{query}&rdquo;</span>.
        Tente outras palavras ou bairros.
      </p>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Box de interpretação da IA
// ──────────────────────────────────────────────────────────
function InterpretationBox({
  summary,
  neighborhood,
  type,
  count,
  cached,
}: {
  summary: string;
  neighborhood: string | null;
  type: string | null;
  count: number;
  cached: boolean;
}) {
  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 mb-6 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 bg-[#F78166]/15 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg className="w-4 h-4 text-[#F78166]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-[#F78166] uppercase tracking-wider">
              IA interpretou
            </span>
            {cached && (
              <span className="text-xs bg-[#21262D] text-[#8B949E] px-2 py-0.5 rounded-full">
                cache
              </span>
            )}
          </div>
          <p className="text-[#E6EDF3] text-sm leading-relaxed">{summary}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {neighborhood && (
              <span className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                📍 {neighborhood}
              </span>
            )}
            {type && (
              <span className="text-xs bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
                🏷️ {type}
              </span>
            )}
            <span className="text-xs bg-[#21262D] text-[#8B949E] px-2 py-0.5 rounded-full">
              {count} {count === 1 ? "resultado" : "resultados"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Conteúdo principal (precisa de useSearchParams)
// ──────────────────────────────────────────────────────────
function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") ?? "";

  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query || query.length < 2) return;

    setLoading(true);
    setData(null);
    setError(null);

    fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    })
      .then((r) => {
        if (!r.ok) return r.json().then((e) => Promise.reject(e.error ?? "Erro desconhecido"));
        return r.json();
      })
      .then((json: SearchResponse) => setData(json))
      .catch((msg: string) => setError(typeof msg === "string" ? msg : "Erro ao buscar. Tente novamente."))
      .finally(() => setLoading(false));
  }, [query]);

  const handleReSearch = (newQuery: string) => {
    router.push(`/results?q=${encodeURIComponent(newQuery)}`);
  };

  const maxScore = data?.results[0]?.score ?? 1;

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Header fixo */}
      <header className="sticky top-0 z-10 bg-[#0D1117]/90 backdrop-blur-sm border-b border-[#21262D] px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-[#161B22] border border-[#30363D] hover:border-[#F78166]/50 transition-colors"
            aria-label="Voltar"
          >
            <svg className="w-4 h-4 text-[#8B949E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div className="flex-1">
            <SearchBar
              initialValue={query}
              isLoading={loading}
              onSearch={handleReSearch}
            />
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Query exibida */}
        {query && (
          <p className="text-[#8B949E] text-sm mb-5">
            Buscando por{" "}
            <span className="text-[#E6EDF3] font-medium">&ldquo;{query}&rdquo;</span>
          </p>
        )}

        {/* Erro */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <LoadingSkeleton />}

        {/* Resultados */}
        {!loading && data && (
          <>
            <InterpretationBox
              summary={data.interpretation.summary}
              neighborhood={data.interpretation.neighborhood}
              type={data.interpretation.type}
              count={data.results.length}
              cached={data.cached}
            />

            {data.results.length === 0 ? (
              <EmptyState query={query} />
            ) : (
              <>
                <MapView places={data.results} />
                <div className="space-y-4">
                  {data.results.map((place, i) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      maxScore={maxScore}
                      index={i}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Caso a query esteja vazia */}
        {!loading && !data && !error && !query && (
          <div className="text-center py-20 text-[#8B949E]">
            Digite algo para começar a busca.
          </div>
        )}
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────────────────
// Export com Suspense obrigatório para useSearchParams
// ──────────────────────────────────────────────────────────
export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#F78166] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
