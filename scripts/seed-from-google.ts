import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import { searchNearby, googlePlaceToPlace } from "../lib/google-places";
import type { GooglePlaceType } from "../lib/google-places";
import type { Place } from "../data/mock-places";

// Pontos estratégicos cobrindo os principais bairros de Curitiba
const SEARCH_POINTS = [
  { lat: -25.4284, lng: -49.2733 }, // Centro
  { lat: -25.4143, lng: -49.2602 }, // Hugo Lange / Juvevê
  { lat: -25.3967, lng: -49.2611 }, // Cabral / Ahú
  { lat: -25.4400, lng: -49.2633 }, // Rebouças
  { lat: -25.4384, lng: -49.2889 }, // Batel
  { lat: -25.4567, lng: -49.2933 }, // Água Verde
  { lat: -25.4233, lng: -49.2980 }, // Bigorrilho / Champagnat
  { lat: -25.4300, lng: -49.3133 }, // Mercês
  { lat: -25.4500, lng: -49.2200 }, // Cajuru
  { lat: -25.4717, lng: -49.2533 }, // Hauer / Fanny
  { lat: -25.4367, lng: -49.2433 }, // Jardim Botânico
  { lat: -25.3750, lng: -49.2500 }, // Bacacheri / Boa Vista
  { lat: -25.3600, lng: -49.3200 }, // Barreirinha
  { lat: -25.3800, lng: -49.3650 }, // Santa Felicidade
  { lat: -25.4700, lng: -49.3033 }, // Portão / Lindóia
  { lat: -25.5000, lng: -49.3033 }, // Novo Mundo
  { lat: -25.5100, lng: -49.3267 }, // Capão Raso
  { lat: -25.4900, lng: -49.2900 }, // Xaxim
  { lat: -25.5200, lng: -49.3700 }, // CIC
  { lat: -25.3433, lng: -49.2367 }, // Bairro Alto / Tingui
];

const TYPES: GooglePlaceType[] = ["bar", "restaurant", "cafe", "night_club"];
const RADIUS = 1000; // metros
const RATE_LIMIT_MS = 150; // pausa entre requests

function placeToRow(place: Place) {
  return {
    id: place.id,
    google_place_id: place.googlePlaceId,
    name: place.name,
    type: place.type,
    neighborhood: place.neighborhood,
    address: place.address,
    description: place.description,
    tags: place.tags,
    attributes: place.attributes,
    rating: place.rating,
    review_count: place.reviewCount,
    price_range: place.priceRange,
    price_label: place.priceLabel,
    hours: place.hours,
    lat: place.lat,
    lng: place.lng,
    phone: place.phone ?? null,
    instagram: place.instagram ?? null,
    match_keywords: place.matchKeywords,
  };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!apiKey) {
    console.error("❌  GOOGLE_PLACES_API_KEY não configurada no .env.local");
    process.exit(1);
  }
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌  SUPABASE_URL e SUPABASE_ANON_KEY precisam estar no .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("🔍  Buscando lugares via Google Places API...");
  console.log(`   ${SEARCH_POINTS.length} pontos × ${TYPES.length} tipos = ${SEARCH_POINTS.length * TYPES.length} requests\n`);

  const seen = new Set<string>(); // deduplicação por google place_id
  const places: Place[] = [];
  let requests = 0;
  let errors = 0;

  for (const point of SEARCH_POINTS) {
    for (const type of TYPES) {
      try {
        const results = await searchNearby(apiKey, point.lat, point.lng, RADIUS, type);
        requests++;

        for (const gp of results) {
          if (!seen.has(gp.id)) {
            seen.add(gp.id);
            places.push(googlePlaceToPlace(gp));
          }
        }

        process.stdout.write(
          `   Req ${requests}/${SEARCH_POINTS.length * TYPES.length} — ${places.length} lugares únicos\r`
        );

        await sleep(RATE_LIMIT_MS);
      } catch (err) {
        errors++;
        console.error(`\n❌  Erro (${type} @ ${point.lat},${point.lng}):`, (err as Error).message);
      }
    }
  }

  console.log(`\n\n✅  ${places.length} lugares únicos encontrados (${errors} erros)\n`);

  if (places.length === 0) {
    console.log("Nenhum lugar para inserir.");
    return;
  }

  // Inserir no Supabase em batches de 100
  console.log("💾  Inserindo no Supabase...");
  let inserted = 0;

  for (let i = 0; i < places.length; i += 100) {
    const batch = places.slice(i, i + 100).map(placeToRow);
    const { error } = await supabase
      .from("places")
      .upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`❌  Erro no batch ${Math.floor(i / 100) + 1}:`, error.message);
    } else {
      inserted += batch.length;
      process.stdout.write(`   Inseridos: ${inserted}/${places.length}\r`);
    }
  }

  console.log(`\n🎉  Seed concluído — ${inserted} lugares do Google Places no Supabase`);
}

main();
