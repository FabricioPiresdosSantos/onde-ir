import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import { fetchCuritibaPlaces } from "../lib/osm";
import type { Place } from "../data/mock-places";

const BATCH_SIZE = 100;

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

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌  SUPABASE_URL e SUPABASE_ANON_KEY precisam estar no .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("🗺️  Buscando lugares no OpenStreetMap (Overpass API)...");
  console.log("   (pode levar 20-60s)");

  let places: Place[];
  try {
    places = await fetchCuritibaPlaces();
  } catch (err) {
    console.error("❌  Erro ao buscar dados do OSM:", err);
    process.exit(1);
  }

  console.log(`✅  ${places.length} lugares encontrados em Curitiba`);

  // inserir em batches
  let inserted = 0;
  let errors = 0;

  for (let i = 0; i < places.length; i += BATCH_SIZE) {
    const batch = places.slice(i, i + BATCH_SIZE).map(placeToRow);
    const { error } = await supabase
      .from("places")
      .upsert(batch, { onConflict: "id" });

    if (error) {
      console.error(`❌  Erro no batch ${i / BATCH_SIZE + 1}:`, error.message);
      errors += batch.length;
    } else {
      inserted += batch.length;
      process.stdout.write(`   Inseridos: ${inserted}/${places.length}\r`);
    }
  }

  console.log(`\n🎉  Seed concluído — ${inserted} inseridos, ${errors} erros`);
}

main();
