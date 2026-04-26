import SearchBar from "@/components/SearchBar";
import Link from "next/link";

const SUGGESTIONS = [
  "bar com música ao vivo no Batel",
  "café tranquilo para trabalhar",
  "restaurante italiano no fim de semana",
  "rooftop com vista para a cidade",
  "cerveja artesanal e happy hour",
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center px-4 py-16">
      {/* Logo */}
      <div className="flex flex-col items-center mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[#F78166] rounded-2xl flex items-center justify-center shadow-lg shadow-[#F78166]/20">
            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-2.083 3.218-4.72 3.218-7.327C19.5 6.04 16.18 2.5 12 2.5S4.5 6.04 4.5 10c0 2.607 1.274 5.244 3.218 7.327a19.58 19.58 0 002.683 2.282 16.975 16.975 0 001.144.742zM12 13a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#E6EDF3] tracking-tight">
            Onde Ir
          </h1>
        </div>
        <p className="text-[#8B949E] text-base md:text-lg text-center max-w-xs">
          Encontre bares, restaurantes e cafés em Curitiba
        </p>
      </div>

      {/* Campo de busca */}
      <div className="w-full max-w-2xl mb-6">
        <SearchBar autoFocus />
      </div>

      {/* Sugestões */}
      <div className="w-full max-w-2xl">
        <p className="text-xs text-[#8B949E] mb-3 text-center uppercase tracking-wider">
          Experimente buscar
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/results?q=${encodeURIComponent(suggestion)}`}
              className="
                text-sm text-[#8B949E]
                bg-[#161B22] border border-[#30363D]
                px-4 py-2 rounded-full
                hover:border-[#F78166]/50 hover:text-[#E6EDF3] hover:bg-[#1C2128]
                transition-all duration-150
                whitespace-nowrap
              "
            >
              {suggestion}
            </Link>
          ))}
        </div>
      </div>

      {/* Rodapé discreto */}
      <footer className="mt-16 text-xs text-[#8B949E]/50">
        Curitiba · MVP com dados de exemplo
      </footer>
    </main>
  );
}
