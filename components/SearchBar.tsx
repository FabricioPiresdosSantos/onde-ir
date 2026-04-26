"use client";

import { useState, FormEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  initialValue?: string;
  autoFocus?: boolean;
  isLoading?: boolean;
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  initialValue = "",
  autoFocus = false,
  isLoading = false,
  onSearch,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2 || isLoading) return;
    if (onSearch) {
      onSearch(trimmed);
    } else {
      router.push(`/results?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit(e as unknown as FormEvent);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className="
          flex items-center gap-2
          bg-[#161B22] border border-[#30363D] rounded-2xl
          px-4 py-3
          focus-within:border-[#F78166] focus-within:ring-1 focus-within:ring-[#F78166]/30
          transition-all duration-200
        "
      >
        {/* Ícone de lupa */}
        <svg
          className="w-5 h-5 text-[#8B949E] flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607z"
          />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="O que você está procurando?"
          autoFocus={autoFocus}
          disabled={isLoading}
          className="
            flex-1 bg-transparent outline-none
            text-[#E6EDF3] placeholder-[#8B949E]
            text-base md:text-lg
            disabled:opacity-60
          "
        />

        {/* Botão de busca */}
        <button
          type="submit"
          disabled={query.trim().length < 2 || isLoading}
          className="
            flex-shrink-0 flex items-center justify-center
            w-9 h-9 rounded-xl
            bg-[#F78166] hover:bg-[#FF9580]
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-all duration-150
          "
          aria-label="Buscar"
        >
          {isLoading ? (
            <svg
              className="w-4 h-4 text-white animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
}
