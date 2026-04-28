import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";

const NOMINATIM = "https://nominatim.openstreetmap.org/reverse";
const USER_AGENT = "OndeIr/1.0 (fabpsantos@gmail.com)";

interface DbPlace {
  id: string;
  lat: number;
  lng: number;
  neighborhood: string;
}

// Agrupa coordenadas em células de ~1km (2 casas decimais)
function cellKey(lat: number, lng: number): string {
  return `${lat.toFixed(2)},${lng.toFixed(2)}`;
}

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const url = `${NOMINATIM}?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=14&accept-language=pt-BR`;
  const resp = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });
  if (!resp.ok) return "";
  const data = await resp.json() as { address?: Record<string, string> };
  return (
    data.address?.suburb ??
    data.address?.city_district ??
    data.address?.quarter ??
    data.address?.neighbourhood ??
    ""
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌  SUPABASE_URL e SUPABASE_ANON_KEY precisam estar no .env.local");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Busca lugares sem bairro real
  console.log("📡  Buscando lugares sem bairro no Supabase...");
  const { data, error } = await supabase
    .from("places")
    .select("id, lat, lng, neighborhood")
    .eq("neighborhood", "Curitiba");

  if (error) {
    console.error("❌  Erro ao buscar lugares:", error.message);
    process.exit(1);
  }

  const places = (data ?? []) as DbPlace[];
  console.log(`📍  ${places.length} lugares precisam de bairro`);

  if (places.length === 0) {
    console.log("✅  Nenhum lugar para atualizar.");
    return;
  }

  // Agrupa em células de ~1km e escolhe um representante por célula
  const cells = new Map<string, { lat: number; lng: number; ids: string[] }>();
  for (const p of places) {
    const key = cellKey(p.lat, p.lng);
    if (!cells.has(key)) {
      cells.set(key, { lat: p.lat, lng: p.lng, ids: [] });
    }
    cells.get(key)!.ids.push(p.id);
  }

  console.log(`🗺️  ${cells.size} células únicas a geocodificar (1 req/s)...`);

  const neighborhoodMap = new Map<string, string>(); // id → bairro
  let geocoded = 0;

  for (const [key, cell] of cells) {
    const neighborhood = await reverseGeocode(cell.lat, cell.lng);
    geocoded++;
    process.stdout.write(`   Geocodificando: ${geocoded}/${cells.size} — ${neighborhood || "(sem bairro)"}\r`);

    if (neighborhood) {
      for (const id of cell.ids) {
        neighborhoodMap.set(id, neighborhood);
      }
    }

    // Respeita o limite da Nominatim: 1 req/s
    await sleep(1100);
  }

  console.log(`\n✅  Geocodificação concluída — ${neighborhoodMap.size} lugares com bairro`);

  // Agrupa por bairro para atualizar em lote
  const byNeighborhood = new Map<string, string[]>();
  for (const [id, neighborhood] of neighborhoodMap) {
    if (!byNeighborhood.has(neighborhood)) byNeighborhood.set(neighborhood, []);
    byNeighborhood.get(neighborhood)!.push(id);
  }

  console.log("💾  Atualizando Supabase...");
  let updated = 0;

  for (const [neighborhood, ids] of byNeighborhood) {
    const { error: updateError } = await supabase
      .from("places")
      .update({ neighborhood })
      .in("id", ids);

    if (updateError) {
      console.error(`❌  Erro ao atualizar "${neighborhood}":`, updateError.message);
    } else {
      updated += ids.length;
    }
  }

  console.log(`🎉  ${updated} lugares atualizados com bairros reais.`);
}

main();
