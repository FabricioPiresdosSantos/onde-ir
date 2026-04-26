import { mockPlaces, Place } from "@/data/mock-places";
import { QueryInterpretation } from "@/lib/claude";

export interface RankedPlace extends Place {
  score: number;
}

export function filterAndRankPlaces(
  interpretation: QueryInterpretation
): RankedPlace[] {
  const { keywords, neighborhood, type, attributes } = interpretation;

  const ranked = mockPlaces.map((place) => {
    let score = 0;
    const searchableText = [
      place.name,
      place.description,
      place.neighborhood,
      place.type,
      ...place.tags,
      ...(place.matchKeywords ?? []),
      ...(place.attributes.ideal ?? []),
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
      // bônus por atributos booleanos
      if (attrLower.includes("música") && place.attributes.musicaAoVivo) score += 15;
      if (attrLower.includes("wifi") && place.attributes.wifi) score += 8;
      if (attrLower.includes("pet") && place.attributes.petFriendly) score += 8;
    }

    score += place.rating * 2;

    return { ...place, score };
  });

  return ranked
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

export type { Place };
