import type { Place } from "../data/mock-places";

const BASE_URL = "https://places.googleapis.com/v1/places:searchNearby";

const FIELD_MASK = [
  "places.id",
  "places.displayName",
  "places.location",
  "places.types",
  "places.primaryType",
  "places.rating",
  "places.userRatingCount",
  "places.priceLevel",
  "places.formattedAddress",
  "places.nationalPhoneNumber",
  "places.regularOpeningHours",
].join(",");

const PRICE_MAP: Record<string, 1 | 2 | 3 | 4> = {
  PRICE_LEVEL_FREE: 1,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

const PRICE_LABEL: Record<1 | 2 | 3 | 4, string> = {
  1: "Econômico",
  2: "Moderado",
  3: "Sofisticado",
  4: "Premium",
};

export type GooglePlaceType = "bar" | "restaurant" | "cafe" | "night_club";

export interface GooglePlace {
  id: string;
  displayName: { text: string };
  location: { latitude: number; longitude: number };
  types: string[];
  primaryType?: string;
  rating?: number;
  userRatingCount?: number;
  priceLevel?: string;
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  regularOpeningHours?: {
    weekdayDescriptions: string[];
  };
}

export async function searchNearby(
  apiKey: string,
  lat: number,
  lng: number,
  radius: number,
  type: GooglePlaceType
): Promise<GooglePlace[]> {
  const body = {
    includedTypes: [type],
    maxResultCount: 20,
    languageCode: "pt-BR",
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius,
      },
    },
  };

  const resp = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Google Places API ${resp.status}: ${text}`);
  }

  const json = await resp.json() as { places?: GooglePlace[] };
  return json.places ?? [];
}

export function googlePlaceToPlace(gp: GooglePlace): Place {
  const priceRange = PRICE_MAP[gp.priceLevel ?? ""] ?? 2;
  const neighborhood = extractNeighborhood(gp.formattedAddress);
  const type = mapType(gp.primaryType, gp.types);
  const hours = parseHours(gp.regularOpeningHours?.weekdayDescriptions);

  return {
    id: `google-${gp.id}`,
    googlePlaceId: gp.id,
    name: gp.displayName.text,
    type,
    neighborhood,
    address: gp.formattedAddress ?? "",
    description: buildDescription(type, neighborhood),
    tags: [],
    attributes: {
      ambiente:
        type.includes("Bar") || type.includes("Balada")
          ? "agitado"
          : type.includes("Café")
          ? "tranquilo"
          : "moderado",
    },
    rating: gp.rating ?? 4.0,
    reviewCount: gp.userRatingCount ?? 0,
    priceRange,
    priceLabel: PRICE_LABEL[priceRange],
    hours,
    lat: gp.location.latitude,
    lng: gp.location.longitude,
    phone: gp.nationalPhoneNumber ?? undefined,
    instagram: undefined,
    matchKeywords: buildMatchKeywords(gp.displayName.text, type, neighborhood),
  };
}

// ── Helpers ────────────────────────────────────────────────

function mapType(primaryType?: string, allTypes?: string[]): string {
  const p = primaryType ?? allTypes?.[0] ?? "restaurant";
  const map: Record<string, string> = {
    bar: "Bar / Boteco",
    pub: "Pub / Bar",
    night_club: "Balada / Club",
    cafe: "Café",
    coffee_shop: "Café",
    restaurant: "Restaurante",
    brazilian_restaurant: "Restaurante Brasileiro",
    japanese_restaurant: "Restaurante Japonês",
    italian_restaurant: "Restaurante Italiano",
    pizza_restaurant: "Pizzaria",
    chinese_restaurant: "Restaurante Chinês",
    seafood_restaurant: "Frutos do Mar",
    steak_house: "Churrascaria",
    hamburger_restaurant: "Hamburgueria",
    vegetarian_restaurant: "Restaurante Vegetariano",
    lebanese_restaurant: "Restaurante Árabe",
    french_restaurant: "Restaurante Francês",
    mexican_restaurant: "Restaurante Mexicano",
    fast_food_restaurant: "Lanchonete",
    sandwich_shop: "Sanduicheria",
    ice_cream_shop: "Sorveteria",
    juice_shop: "Casa de Sucos",
    bakery: "Padaria / Confeitaria",
  };
  return map[p] ?? "Restaurante";
}

function extractNeighborhood(address?: string): string {
  if (!address) return "Curitiba";
  // "Rua ABC, 123 - Batel, Curitiba - PR, Brasil"
  // "Rua ABC, 123, Batel, Curitiba - PR, Brasil"
  const parts = address.split(/[-,]/).map((s) => s.trim());
  // Buscamos a parte que vem antes de "Curitiba"
  const cwbIdx = parts.findIndex((p) => p.startsWith("Curitiba"));
  if (cwbIdx > 0) return parts[cwbIdx - 1];
  return "Curitiba";
}

function parseHours(
  weekdayDescriptions?: string[]
): { weekdays: string; weekend: string } {
  if (!weekdayDescriptions || weekdayDescriptions.length < 7) {
    return { weekdays: "Consultar horário", weekend: "Consultar horário" };
  }
  // índice 0 = segunda, 5 = sábado, 6 = domingo
  const weekday = weekdayDescriptions[0].replace(/^[^:]+:\s*/, "");
  const weekend = weekdayDescriptions[5].replace(/^[^:]+:\s*/, "");
  return { weekdays: weekday, weekend };
}

function buildDescription(type: string, neighborhood: string): string {
  const hood = neighborhood !== "Curitiba" ? `no ${neighborhood}` : "em Curitiba";
  return `${type} localizado ${hood}, Curitiba.`;
}

function buildMatchKeywords(name: string, type: string, neighborhood: string): string[] {
  const words = new Set<string>();
  type.toLowerCase().split(/[\s/]+/).forEach((w) => w.length > 2 && words.add(w));
  name.toLowerCase().split(/\s+/).forEach((w) => w.length > 3 && words.add(w));
  if (neighborhood && neighborhood !== "Curitiba") words.add(neighborhood.toLowerCase());
  return Array.from(words);
}
