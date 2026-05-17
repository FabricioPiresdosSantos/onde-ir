import { mockPlaces, Place } from "@/data/mock-places";
import { QueryInterpretation } from "@/lib/claude";

export interface RankedPlace extends Place {
  score: number;
  distance?: number; // metros
}

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function proximityBonus(meters: number): number {
  if (meters < 500) return 20;
  if (meters < 1000) return 15;
  if (meters < 2000) return 10;
  if (meters < 5000) return 5;
  return 0;
}

interface DbRow {
  id: string;
  google_place_id: string | null;
  name: string;
  type: string;
  neighborhood: string;
  address: string;
  description: string;
  tags: string[];
  attributes: Place["attributes"];
  rating: number;
  review_count: number;
  price_range: number;
  price_label: string;
  hours: { weekdays: string; weekend: string };
  lat: number;
  lng: number;
  phone: string | null;
  instagram: string | null;
  match_keywords: string[];
}

function dbToPlace(row: DbRow): Place {
  return {
    id: row.id,
    googlePlaceId: row.google_place_id,
    name: row.name,
    type: row.type,
    neighborhood: row.neighborhood,
    address: row.address,
    description: row.description,
    tags: row.tags ?? [],
    attributes: row.attributes ?? {},
    rating: row.rating,
    reviewCount: row.review_count,
    priceRange: row.price_range as 1 | 2 | 3 | 4,
    priceLabel: row.price_label,
    hours: row.hours ?? { weekdays: "", weekend: "" },
    lat: row.lat,
    lng: row.lng,
    phone: row.phone ?? undefined,
    instagram: row.instagram ?? undefined,
    matchKeywords: row.match_keywords ?? [],
  };
}

async function getAllPlaces(): Promise<Place[]> {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return mockPlaces;
  }

  try {
    const { getSupabase } = await import("@/lib/supabase");
    const supabase = getSupabase();
    const { data, error } = await supabase.from("places").select("*");
    if (error || !data || data.length === 0) return mockPlaces;
    return (data as DbRow[]).map(dbToPlace);
  } catch {
    return mockPlaces;
  }
}

export async function filterAndRankPlaces(
  interpretation: QueryInterpretation,
  userLat?: number,
  userLng?: number
): Promise<RankedPlace[]> {
  const places = await getAllPlaces();
  const { keywords, neighborhood, type, attributes } = interpretation;

  const ranked = places.map((place) => {
    let score = 0;
    const distance =
      userLat != null && userLng != null
        ? haversineMeters(userLat, userLng, place.lat, place.lng)
        : undefined;
    const searchableText = [
      place.name,
      place.description,
      place.neighborhood,
      place.type,
      ...place.tags,
      ...(place.matchKeywords ?? []),
      ...((place.attributes.ideal as string[] | undefined) ?? []),
    ]
      .join(" ")
      .toLowerCase();

    if (type && place.type.toLowerCase().includes(type.toLowerCase())) score += 30;

    if (
      neighborhood &&
      place.neighborhood.toLowerCase().includes(neighborhood.toLowerCase())
    ) {
      score += 25;
    }

    for (const kw of keywords) {
      if (searchableText.includes(kw.toLowerCase())) score += 10;
    }

    for (const attr of attributes) {
      const attrLower = attr.toLowerCase();
      if (searchableText.includes(attrLower)) score += 8;
      if (attrLower.includes("música") && place.attributes.musicaAoVivo) score += 15;
      if (attrLower.includes("wifi") && place.attributes.wifi) score += 8;
      if (attrLower.includes("pet") && place.attributes.petFriendly) score += 8;
    }

    if (distance != null) score += proximityBonus(distance);

    // rating só entra como desempate quando há pelo menos um match real
    if (score > 0) score += place.rating * 2;

    return { ...place, score, distance };
  });

  return ranked
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export type { Place };
