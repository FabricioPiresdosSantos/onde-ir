# Onde Ir — Contexto do Projeto

## O que é
Buscador semântico local para Curitiba. O usuário digita em linguagem
natural (ex: "bar com música ao vivo no Batel") e recebe lugares relevantes.

## Stack
- Frontend: Next.js 14 (App Router), Tailwind CSS, TypeScript
- Backend: API Routes do próprio Next.js (começar simples)
- Banco: Supabase (PostgreSQL)
- Cache: Upstash Redis
- IA: Claude API (claude-sonnet-4-6)
- Mapa: react-map-gl + Mapbox
- Deploy: Vercel

## Variáveis de ambiente necessárias
ANTHROPIC_API_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
SUPABASE_URL=
SUPABASE_ANON_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
GOOGLE_PLACES_API_KEY=       # deixar vazio por enquanto, usar mock

## Decisões importantes
- Google Places API ainda não contratada: usar dados mockados de Curitiba
- Começar sem autenticação (adicionar na Fase 2)
- Português brasileiro em toda a UI
- Mobile-first no CSS

## Estrutura de pastas desejada
/app
  /api/search/route.ts     ← endpoint de busca
  /page.tsx                ← homepage com campo de busca
  /results/page.tsx        ← página de resultados
/lib
  /claude.ts               ← wrapper da Claude API
  /places.ts               ← mock + futura integração Google Places
  /cache.ts                ← wrapper Redis
/components
  /SearchBar.tsx
  /PlaceCard.tsx
  /MapView.tsx
/data
  /mock-places.ts          ← base de lugares mockados de Curitiba