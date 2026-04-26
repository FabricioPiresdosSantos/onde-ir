import type { Place } from "../data/mock-places";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

// bbox de Curitiba: (sul, oeste, norte, leste)
const QUERY = `
[out:json][timeout:90];
(
  node["amenity"~"^(bar|pub|restaurant|cafe)$"]["name"](-25.62,-49.41,-25.32,-49.17);
  way["amenity"~"^(bar|pub|restaurant|cafe)$"]["name"](-25.62,-49.41,-25.32,-49.17);
);
out center tags;
`;

interface OsmElement {
  type: "node" | "way";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags: Record<string, string>;
}

export async function fetchCuritibaPlaces(): Promise<Place[]> {
  const response = await fetch(OVERPASS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(QUERY)}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass API erro: ${response.status} ${response.statusText}`);
  }

  const json = await response.json() as { elements: OsmElement[] };
  const elements: OsmElement[] = json.elements ?? [];

  return elements
    .map(mapOsmToPlace)
    .filter((p): p is Place => p !== null);
}

function mapOsmToPlace(el: OsmElement): Place | null {
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (!lat || !lng || !el.tags?.name) return null;

  const tags = el.tags;
  const amenity = tags.amenity;
  const cuisine = tags.cuisine;
  const name = tags.name;

  const neighborhood =
    tags["addr:suburb"] ??
    tags["addr:neighbourhood"] ??
    tags["addr:district"] ??
    "";

  const streetParts = [tags["addr:street"], tags["addr:housenumber"]]
    .filter(Boolean)
    .join(", ");
  const address = streetParts
    ? `${streetParts} — ${neighborhood || "Curitiba"}, Curitiba`
    : `${name} — ${neighborhood || "Curitiba"}, Curitiba`;

  const type = mapType(amenity, cuisine);
  const cuisineTags = cuisineToTags(cuisine);

  return {
    id: `osm-${el.type}-${el.id}`,
    googlePlaceId: null,
    name,
    type,
    neighborhood: neighborhood || "Curitiba",
    address,
    description: buildDescription(type, neighborhood, cuisineTags),
    tags: cuisineTags,
    attributes: mapAttributes(tags),
    rating: seededFloat(el.id, 3.5, 4.8),
    reviewCount: seededInt(el.id, 10, 480),
    priceRange: 2,
    priceLabel: "Moderado",
    hours: defaultHours(amenity),
    lat,
    lng,
    phone: tags.phone ?? tags["contact:phone"] ?? undefined,
    instagram: tags["contact:instagram"] ?? undefined,
    matchKeywords: buildMatchKeywords(name, type, cuisine, neighborhood),
  };
}

// ── Helpers ────────────────────────────────────────────────

function mapType(amenity: string, cuisine?: string): string {
  if (amenity === "cafe") return "Café";
  if (amenity === "pub") return "Pub / Bar";
  if (amenity === "bar") return "Bar / Boteco";

  const c = (cuisine ?? "").toLowerCase();
  if (c.includes("pizza")) return "Pizzaria";
  if (c.includes("italian")) return "Restaurante Italiano";
  if (c.includes("japanese") || c.includes("sushi")) return "Restaurante Japonês";
  if (c.includes("chinese")) return "Restaurante Chinês";
  if (c.includes("arab") || c.includes("lebanese") || c.includes("middle_eastern"))
    return "Restaurante Árabe";
  if (c.includes("vegetarian") || c.includes("vegan")) return "Restaurante Vegetariano";
  if (c.includes("steak") || c.includes("churrasco") || c.includes("barbecue"))
    return "Churrascaria";
  if (c.includes("seafood") || c.includes("fish")) return "Frutos do Mar";
  if (c.includes("burger") || c.includes("hamburger")) return "Hamburgueria";
  if (c.includes("regional") || c.includes("brazilian")) return "Restaurante Brasileiro";
  return "Restaurante";
}

function cuisineToTags(cuisine?: string): string[] {
  if (!cuisine) return [];
  const MAP: Record<string, string> = {
    italian: "italiano", pizza: "pizza", japanese: "japonês", sushi: "sushi",
    chinese: "chinês", arab: "árabe", lebanese: "libanês", middle_eastern: "árabe",
    vegetarian: "vegetariano", vegan: "vegano", steak_house: "churrasco",
    barbecue: "churrasco", seafood: "frutos do mar", fish: "frutos do mar",
    burger: "hamburguer", hamburger: "hamburguer", regional: "regional",
    brazilian: "brasileiro", french: "francês", mexican: "mexicano",
    portuguese: "português", thai: "tailandês", indian: "indiano",
  };
  return cuisine
    .split(";")
    .map((c) => MAP[c.trim().toLowerCase()] ?? c.trim())
    .filter(Boolean);
}

function mapAttributes(tags: Record<string, string>): Place["attributes"] {
  const amenity = tags.amenity;
  return {
    wifi: tags["internet_access"] === "wlan" || tags["internet_access"] === "yes",
    petFriendly: tags["dog"] === "yes",
    acessivel: tags["wheelchair"] === "yes",
    estacionamento: tags["parking"] !== undefined,
    ambiente:
      amenity === "bar" || amenity === "pub"
        ? "agitado"
        : amenity === "cafe"
        ? "tranquilo"
        : "moderado",
  };
}

function defaultHours(amenity: string): { weekdays: string; weekend: string } {
  const map: Record<string, { weekdays: string; weekend: string }> = {
    bar: { weekdays: "17:00 – 00:00", weekend: "15:00 – 02:00" },
    pub: { weekdays: "17:00 – 00:00", weekend: "15:00 – 02:00" },
    cafe: { weekdays: "08:00 – 18:00", weekend: "09:00 – 17:00" },
    restaurant: { weekdays: "11:30 – 15:00, 18:00 – 23:00", weekend: "11:30 – 23:00" },
  };
  return map[amenity] ?? { weekdays: "11:00 – 23:00", weekend: "11:00 – 23:00" };
}

function buildDescription(type: string, neighborhood: string, cuisineTags: string[]): string {
  const hood = neighborhood ? `no ${neighborhood}` : "em Curitiba";
  const spec = cuisineTags.length > 0
    ? `. Especialidade em ${cuisineTags.slice(0, 2).join(" e ")}`
    : "";
  return `${type} localizado ${hood}, Curitiba${spec}.`;
}

function buildMatchKeywords(
  name: string,
  type: string,
  cuisine: string | undefined,
  neighborhood: string
): string[] {
  const words = new Set<string>();
  type.toLowerCase().split(/[\s/]+/).forEach((w) => w.length > 2 && words.add(w));
  name.toLowerCase().split(/\s+/).forEach((w) => w.length > 3 && words.add(w));
  cuisineToTags(cuisine).forEach((t) => words.add(t));
  if (neighborhood) words.add(neighborhood.toLowerCase());
  return Array.from(words);
}

function seededFloat(seed: number, min: number, max: number): number {
  const h = ((seed * 1664525 + 1013904223) & 0x7fffffff) / 0x7fffffff;
  return parseFloat((min + h * (max - min)).toFixed(1));
}

function seededInt(seed: number, min: number, max: number): number {
  const h = ((seed * 22695477 + 1) & 0x7fffffff) >>> 0;
  return min + (h % (max - min + 1));
}
