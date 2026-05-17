import { NextRequest, NextResponse } from "next/server";
import { interpretQuery } from "@/lib/claude";
import { filterAndRankPlaces } from "@/lib/places";
import { getCached, setCached, buildCacheKey } from "@/lib/cache";
import { RankedPlace } from "@/lib/places";

interface SearchResponse {
  results: RankedPlace[];
  interpretation: {
    summary: string;
    neighborhood: string | null;
    type: string | null;
  };
  cached: boolean;
}

export async function POST(request: NextRequest) {
  let query: string;
  let userLat: number | undefined;
  let userLng: number | undefined;

  try {
    const body = await request.json();
    query = body.query?.trim();
    if (typeof body.lat === "number" && typeof body.lng === "number") {
      userLat = body.lat;
      userLng = body.lng;
    }
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 });
  }

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "A busca deve ter pelo menos 2 caracteres" },
      { status: 400 }
    );
  }

  if (query.length > 500) {
    return NextResponse.json({ error: "Busca muito longa" }, { status: 400 });
  }

  // Arredonda para ~1 km para aproveitar cache sem ser muito impreciso
  const locationSuffix =
    userLat != null && userLng != null
      ? `:${userLat.toFixed(2)},${userLng.toFixed(2)}`
      : "";
  const cacheKey = buildCacheKey(query) + locationSuffix;
  const cached = await getCached<SearchResponse>(cacheKey);
  if (cached) {
    return NextResponse.json({ ...cached, cached: true });
  }

  try {
    const interpretation = await interpretQuery(query);
    const results = await filterAndRankPlaces(interpretation, userLat, userLng);

    const response: SearchResponse = {
      results,
      interpretation: {
        summary: interpretation.summary,
        neighborhood: interpretation.neighborhood,
        type: interpretation.type,
      },
      cached: false,
    };

    await setCached(cacheKey, response);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erro na busca:", error);
    return NextResponse.json(
      { error: "Erro ao processar a busca. Tente novamente." },
      { status: 500 }
    );
  }
}
