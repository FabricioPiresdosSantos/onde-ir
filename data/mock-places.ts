// /data/mock-places.ts
// Base de lugares mockados de Curitiba para o MVP do Onde Ir
// Substituir progressivamente por dados reais da Google Places API

export interface Place {
  id: string;
  googlePlaceId: string | null; // preencher quando integrar Google Places
  name: string;
  type: string;
  neighborhood: string;
  address: string;
  description: string;
  tags: string[];
  attributes: {
    musicaAoVivo?: boolean;
    wifi?: boolean;
    petFriendly?: boolean;
    estacionamento?: boolean;
    acessivel?: boolean;
    reserva?: boolean;
    abertoDomingo?: boolean;
    ambiente?: "agitado" | "tranquilo" | "moderado";
    ideal?: string[];
  };
  rating: number;
  reviewCount: number;
  priceRange: 1 | 2 | 3 | 4; // 1 = barato, 4 = caro
  priceLabel: string;
  hours: {
    weekdays: string;
    weekend: string;
  };
  lat: number;
  lng: number;
  phone?: string;
  instagram?: string;
  matchKeywords: string[]; // palavras-chave para matching semântico
}

export const mockPlaces: Place[] = [
  {
    id: "cwb-001",
    googlePlaceId: null,
    name: "Bar do Victor",
    type: "Bar / Boteco",
    neighborhood: "Centro",
    address: "Rua XV de Novembro, 1234 — Centro, Curitiba",
    description:
      "Bar tradicional do Centro com mais de 20 anos de história. Conhecido pela música ao vivo de quinta a domingo — de MPB a pagode — e pelos petiscos generosos. Chopp sempre gelado e ambiente descontraído que mistura trabalhadores, estudantes e moradores do bairro.",
    tags: ["música ao vivo", "petisco", "chopp", "MPB", "pagode", "tradicional"],
    attributes: {
      musicaAoVivo: true,
      wifi: false,
      petFriendly: false,
      estacionamento: false,
      acessivel: true,
      reserva: false,
      abertoDomingo: true,
      ambiente: "agitado",
      ideal: ["happy hour", "noite com amigos", "aniversário informal"],
    },
    rating: 4.6,
    reviewCount: 312,
    priceRange: 1,
    priceLabel: "R$ 30–60 / pessoa",
    hours: { weekdays: "17h–01h", weekend: "12h–02h" },
    lat: -25.4297,
    lng: -49.2716,
    instagram: "@bardovictor_cwb",
    matchKeywords: [
      "música", "música ao vivo", "live", "bar", "boteco", "centro",
      "animado", "petisco", "chopp", "mpb", "pagode", "happy hour",
    ],
  },
  {
    id: "cwb-002",
    googlePlaceId: null,
    name: "Armazém do Mané",
    type: "Restaurante / Bar",
    neighborhood: "Centro",
    address: "Rua Marechal Floriano, 567 — Centro, Curitiba",
    description:
      "Restaurante com palco fixo e shows de jazz e MPB toda sexta e sábado a partir das 20h. Cardápio elaborado com frutos do mar, massas autorais e carta de vinhos cuidadosa. O ambiente é aconchegante, com tijolos expostos e iluminação baixa — ótimo para jantares especiais.",
    tags: ["jazz", "música ao vivo", "jantar", "vinhos", "frutos do mar", "romântico"],
    attributes: {
      musicaAoVivo: true,
      wifi: true,
      petFriendly: false,
      estacionamento: false,
      acessivel: true,
      reserva: true,
      abertoDomingo: false,
      ambiente: "tranquilo",
      ideal: ["jantar romântico", "aniversário", "reunião de negócios"],
    },
    rating: 4.8,
    reviewCount: 198,
    priceRange: 3,
    priceLabel: "R$ 80–140 / pessoa",
    hours: { weekdays: "18h–00h (ter–qui)", weekend: "12h–01h (sex–sáb)" },
    lat: -25.4321,
    lng: -49.2698,
    matchKeywords: [
      "jazz", "música", "música ao vivo", "restaurante", "centro", "jantar",
      "romântico", "vinho", "frutos do mar", "especial", "aniversário",
    ],
  },
  {
    id: "cwb-003",
    googlePlaceId: null,
    name: "Boteco do Batel",
    type: "Bar / Petisco",
    neighborhood: "Batel",
    address: "Rua do Batel, 890 — Batel, Curitiba",
    description:
      "O boteco mais querido do Batel. Ambiente descontraído com mesas na calçada, porcão crocante, frango a passarinho e uma carta de cervejas artesanais com 12 rótulos rotativos. Frequentado por jovens profissionais e moradores do bairro nos fins de semana.",
    tags: ["boteco", "petisco", "cerveja artesanal", "calçada", "informal"],
    attributes: {
      musicaAoVivo: false,
      wifi: true,
      petFriendly: true,
      estacionamento: false,
      acessivel: true,
      reserva: false,
      abertoDomingo: true,
      ambiente: "moderado",
      ideal: ["happy hour", "fim de semana", "com amigos", "pet friendly"],
    },
    rating: 4.4,
    reviewCount: 427,
    priceRange: 2,
    priceLabel: "R$ 25–55 / pessoa",
    hours: { weekdays: "17h–00h", weekend: "12h–01h" },
    lat: -25.4412,
    lng: -49.2856,
    instagram: "@botecodobatel",
    matchKeywords: [
      "boteco", "batel", "petisco", "comida", "bar", "cerveja",
      "artesanal", "craft", "calçada", "informal", "animado",
    ],
  },
  {
    id: "cwb-004",
    googlePlaceId: null,
    name: "Pub Hops",
    type: "Pub / Cervejas Artesanais",
    neighborhood: "Batel",
    address: "Alameda Dom Pedro II, 234 — Batel, Curitiba",
    description:
      "Pub especializado em cervejas artesanais com 30 torneiras rotativas — IPAs, Sours, Stouts e Lagers de produtores locais e nacionais. Happy hour das 17h às 19h de segunda a sexta com 20% de desconto. Petiscos simples e ambiente com mesas altas estilo pub inglês.",
    tags: ["cerveja artesanal", "pub", "happy hour", "IPA", "craft beer", "torneiras"],
    attributes: {
      musicaAoVivo: false,
      wifi: true,
      petFriendly: true,
      estacionamento: false,
      acessivel: false,
      reserva: false,
      abertoDomingo: false,
      ambiente: "moderado",
      ideal: ["happy hour", "degustação", "com amigos", "cervejeiro"],
    },
    rating: 4.5,
    reviewCount: 284,
    priceRange: 2,
    priceLabel: "R$ 30–70 / pessoa",
    hours: { weekdays: "17h–00h (seg–qui)", weekend: "12h–01h (sex–sáb)" },
    lat: -25.4398,
    lng: -49.2841,
    instagram: "@pubhopscwb",
    matchKeywords: [
      "cerveja", "artesanal", "craft", "pub", "batel", "happy hour",
      "ipa", "sour", "torneiras", "degustação", "beer",
    ],
  },
  {
    id: "cwb-005",
    googlePlaceId: null,
    name: "Terraço 360",
    type: "Bar / Rooftop",
    neighborhood: "Centro",
    address: "Rua Cândido Lopes, 100 — Centro, Curitiba",
    description:
      "Único rooftop bar com vista panorâmica do skyline de Curitiba. Drinques autorais inspirados na cultura paranaense, carta de vinhos e petiscos modernos. O espaço fica no 18º andar e oferece uma das vistas mais bonitas da cidade ao entardecer. Reserva altamente recomendada para fins de semana.",
    tags: ["rooftop", "vista", "drinques", "panorâmica", "romântico", "especial"],
    attributes: {
      musicaAoVivo: false,
      wifi: true,
      petFriendly: false,
      estacionamento: true,
      acessivel: true,
      reserva: true,
      abertoDomingo: true,
      ambiente: "tranquilo",
      ideal: ["romântico", "aniversário", "reunião especial", "pôr do sol"],
    },
    rating: 4.9,
    reviewCount: 156,
    priceRange: 3,
    priceLabel: "R$ 60–120 / pessoa",
    hours: { weekdays: "18h–00h (qua–qui)", weekend: "17h–01h (sex–dom)" },
    lat: -25.4279,
    lng: -49.2703,
    instagram: "@terraco360cwb",
    matchKeywords: [
      "rooftop", "vista", "alto", "panorâmica", "drinques", "drinks",
      "romântico", "especial", "pôr do sol", "skyline", "centro",
    ],
  },
  {
    id: "cwb-006",
    googlePlaceId: null,
    name: "Café Passeio",
    type: "Café de Especialidade",
    neighborhood: "Centro",
    address: "Rua das Flores, 456 — Centro, Curitiba",
    description:
      "Café de especialidade dentro de um sobrado histórico do Centro. Grãos selecionados de pequenos produtores do Sul do Brasil, métodos filtrados e espresso. Wi-fi rápido, mesas espaçadas e tomadas em todos os lugares — o preferido de quem trabalha remoto em Curitiba. Abre às 7h.",
    tags: ["café especial", "trabalho remoto", "wi-fi", "tranquilo", "histórico"],
    attributes: {
      musicaAoVivo: false,
      wifi: true,
      petFriendly: false,
      estacionamento: false,
      acessivel: true,
      reserva: false,
      abertoDomingo: false,
      ambiente: "tranquilo",
      ideal: ["trabalho remoto", "estudo", "reunião informal", "café da manhã"],
    },
    rating: 4.7,
    reviewCount: 341,
    priceRange: 2,
    priceLabel: "R$ 15–35 / pessoa",
    hours: { weekdays: "7h–19h (seg–sex)", weekend: "8h–17h (sáb)" },
    lat: -25.4285,
    lng: -49.2712,
    instagram: "@cafepasseiocwb",
    matchKeywords: [
      "café", "trabalhar", "trabalho", "remoto", "wifi", "wi-fi",
      "tranquilo", "estudo", "especialidade", "filtrado", "centro",
    ],
  },
  {
    id: "cwb-007",
    googlePlaceId: null,
    name: "Quintal do Vítor",
    type: "Café / Brunch",
    neighborhood: "Água Verde",
    address: "Rua Padre Agostinho, 789 — Água Verde, Curitiba",
    description:
      "Café com jardim interno e cardápio de brunch servido até as 15h. Ambiente acolhedor com mesas ao ar livre entre plantas, ótimo para fins de semana tranquilos. Especialidade em torradas artesanais, ovos beneditinos e granola caseira. Muito frequentado por famílias e casais.",
    tags: ["brunch", "jardim", "café", "família", "tranquilo", "fim de semana"],
    attributes: {
      musicaAoVivo: false,
      wifi: true,
      petFriendly: true,
      estacionamento: false,
      acessivel: true,
      reserva: false,
      abertoDomingo: true,
      ambiente: "tranquilo",
      ideal: ["brunch", "família", "casal", "fim de semana tranquilo"],
    },
    rating: 4.6,
    reviewCount: 219,
    priceRange: 2,
    priceLabel: "R$ 35–65 / pessoa",
    hours: { weekdays: "8h–17h (seg–sex)", weekend: "8h–16h" },
    lat: -25.4512,
    lng: -49.2934,
    instagram: "@quintaldovitor",
    matchKeywords: [
      "café", "brunch", "jardim", "tranquilo", "família", "agua verde",
      "água verde", "fim de semana", "ovos", "outdoor", "pet friendly",
    ],
  },
  {
    id: "cwb-008",
    googlePlaceId: null,
    name: "Pizzaria San Marco",
    type: "Pizzaria",
    neighborhood: "Bacacheri",
    address: "Rua Ângelo Trevisan, 321 — Bacacheri, Curitiba",
    description:
      "Pizzaria napolitana com forno a lenha e ambiente familiar amplo. Cardápio com mais de 40 sabores, incluindo opções sem glúten. Rodízio às quintas-feiras com preço especial para crianças. Estacionamento próprio e espaço kids. A favorita das famílias do Bacacheri há 15 anos.",
    tags: ["pizza", "família", "forno a lenha", "criança", "estacionamento", "amplo"],
    attributes: {
      musicaAoVivo: false,
      wifi: true,
      petFriendly: false,
      estacionamento: true,
      acessivel: true,
      reserva: true,
      abertoDomingo: true,
      ambiente: "moderado",
      ideal: ["família", "crianças", "grupo grande", "aniversário infantil"],
    },
    rating: 4.5,
    reviewCount: 512,
    priceRange: 2,
    priceLabel: "R$ 45–75 / pessoa",
    hours: { weekdays: "18h–23h (ter–sex)", weekend: "12h–23h30" },
    lat: -25.3921,
    lng: -49.2387,
    phone: "(41) 3333-0001",
    matchKeywords: [
      "pizza", "família", "bacacheri", "criança", "grupo", "forno a lenha",
      "rodízio", "estacionamento", "napolitana", "sem glúten",
    ],
  },
  {
    id: "cwb-009",
    googlePlaceId: null,
    name: "Cantina della Nonna",
    type: "Restaurante Italiano",
    neighborhood: "Santa Felicidade",
    address: "Av. Manoel Ribas, 4567 — Santa Felicidade, Curitiba",
    description:
      "Restaurante familiar de terceira geração em Santa Felicidade, o bairro italiano de Curitiba. Massas frescas feitas na hora, molhos de longa cocção e um galinhada caipira que é lenda da região. Ambiente rústico com fotos antigas da família e garrafas de vinho nas paredes.",
    tags: ["italiano", "família", "massa fresca", "tradicional", "Santa Felicidade"],
    attributes: {
      musicaAoVivo: false,
      wifi: false,
      petFriendly: false,
      estacionamento: true,
      acessivel: true,
      reserva: true,
      abertoDomingo: true,
      ambiente: "moderado",
      ideal: ["família", "almoço de domingo", "grupo grande", "tradicional"],
    },
    rating: 4.7,
    reviewCount: 634,
    priceRange: 2,
    priceLabel: "R$ 50–90 / pessoa",
    hours: { weekdays: "11h30–15h / 18h–22h", weekend: "11h30–22h" },
    lat: -25.3712,
    lng: -49.3287,
    instagram: "@cantinadanonna_cwb",
    matchKeywords: [
      "italiano", "família", "massa", "santa felicidade", "tradicional",
      "almoço", "domingo", "galinhada", "vinho", "rústico",
    ],
  },
  {
    id: "cwb-010",
    googlePlaceId: null,
    name: "Empório São Lourenço",
    type: "Bar / Empório",
    neighborhood: "São Francisco",
    address: "Rua São Francisco, 88 — São Francisco, Curitiba",
    description:
      "Bar e empório no coração do bairro São Francisco, polo cultural e boêmio de Curitiba. Mesas na calçada, tábuas de frios artesanais, vinhos naturais e um ambiente frequentado por artistas, músicos e universitários. Shows acústicos às quartas-feiras sem cobrança de couvert.",
    tags: ["boêmio", "cultural", "vinho natural", "acústico", "São Francisco", "calçada"],
    attributes: {
      musicaAoVivo: true,
      wifi: true,
      petFriendly: true,
      estacionamento: false,
      acessivel: false,
      reserva: false,
      abertoDomingo: false,
      ambiente: "moderado",
      ideal: ["cultura", "arte", "vinho", "música acústica", "descolado"],
    },
    rating: 4.6,
    reviewCount: 178,
    priceRange: 2,
    priceLabel: "R$ 40–80 / pessoa",
    hours: { weekdays: "17h–00h (ter–qui)", weekend: "17h–01h (sex–sáb)" },
    lat: -25.4198,
    lng: -49.2801,
    instagram: "@emporiosaolourenco",
    matchKeywords: [
      "boêmio", "cultural", "vinho", "natural", "acústico", "música",
      "são francisco", "arte", "descolado", "calçada", "artistas",
    ],
  },
  {
    id: "cwb-011",
    googlePlaceId: null,
    name: "Mercado Municipal de Curitiba",
    type: "Mercado / Gastronomia",
    neighborhood: "Centro",
    address: "Av. Sete de Setembro, 1865 — Centro, Curitiba",
    description:
      "Mercado histórico com bancas de frios, embutidos, temperos e restaurantes populares. Ótimo para almoços rápidos e baratos no Centro. Os pastéis e a linguiça artesanal são os queridinhos dos frequentadores. Funciona de segunda a sábado.",
    tags: ["mercado", "pastel", "almoço rápido", "barato", "histórico", "popular"],
    attributes: {
      musicaAoVivo: false,
      wifi: false,
      petFriendly: false,
      estacionamento: true,
      acessivel: true,
      reserva: false,
      abertoDomingo: false,
      ambiente: "agitado",
      ideal: ["almoço rápido", "turista", "culinária local", "econômico"],
    },
    rating: 4.3,
    reviewCount: 891,
    priceRange: 1,
    priceLabel: "R$ 15–30 / pessoa",
    hours: { weekdays: "7h–18h (seg–sex)", weekend: "7h–14h (sáb)" },
    lat: -25.4311,
    lng: -49.2658,
    matchKeywords: [
      "mercado", "pastel", "almoço", "rápido", "barato", "econômico",
      "centro", "histórico", "popular", "linguiça", "turista",
    ],
  },
  {
    id: "cwb-012",
    googlePlaceId: null,
    name: "Restaurante Durski",
    type: "Restaurante Ucraniano",
    neighborhood: "Ahú",
    address: "Rua Jaime Reis, 254 — Ahú, Curitiba",
    description:
      "Único restaurante ucraniano de Curitiba, cidade com forte herança da imigração eslava. Varêniques, borscht e pierogi feitos com receitas tradicionais. Ambiente intimista com decoração típica e atendimento caloroso da família proprietária. Uma experiência gastronômica única no Paraná.",
    tags: ["ucraniano", "étnico", "varêniki", "pierogi", "imigração", "diferente"],
    attributes: {
      musicaAoVivo: false,
      wifi: false,
      petFriendly: false,
      estacionamento: false,
      acessivel: true,
      reserva: true,
      abertoDomingo: false,
      ambiente: "tranquilo",
      ideal: ["experiência única", "turista", "jantar diferente", "culinária étnica"],
    },
    rating: 4.8,
    reviewCount: 143,
    priceRange: 2,
    priceLabel: "R$ 55–90 / pessoa",
    hours: { weekdays: "12h–15h / 19h–22h (ter–sex)", weekend: "12h–22h (sáb)" },
    lat: -25.4087,
    lng: -49.2612,
    matchKeywords: [
      "ucraniano", "étnico", "diferente", "único", "varêniki", "pierogi",
      "imigração", "europeu", "jantar especial", "culinária", "ahú",
    ],
  },
  {
    id: "cwb-013",
    googlePlaceId: null,
    name: "Bar Ocidente",
    type: "Bar / Música",
    neighborhood: "São Francisco",
    address: "Rua Oc cidental, 12 — São Francisco, Curitiba",
    description:
      "Ponto de referência da noite curitibana há mais de 30 anos. Shows de rock, blues e jazz quase todas as noites. Sem frescura: mesas de plástico, chope gelado e uma programação musical que traz bandas locais e nacionais. Couvert artístico apenas nos shows especiais.",
    tags: ["rock", "blues", "jazz", "noite", "shows", "tradicional", "boêmio"],
    attributes: {
      musicaAoVivo: true,
      wifi: false,
      petFriendly: false,
      estacionamento: false,
      acessivel: false,
      reserva: false,
      abertoDomingo: false,
      ambiente: "agitado",
      ideal: ["noite", "show", "música ao vivo", "rock", "blues"],
    },
    rating: 4.5,
    reviewCount: 467,
    priceRange: 1,
    priceLabel: "R$ 30–60 / pessoa",
    hours: { weekdays: "19h–02h (qua–qui)", weekend: "19h–03h (sex–sáb)" },
    lat: -25.4201,
    lng: -49.2789,
    instagram: "@barocidentecwb",
    matchKeywords: [
      "rock", "blues", "jazz", "música", "música ao vivo", "show",
      "noite", "são francisco", "boêmio", "tradicional", "bar",
    ],
  },
  {
    id: "cwb-014",
    googlePlaceId: null,
    name: "Spot Coffee",
    type: "Café de Especialidade",
    neighborhood: "Batel",
    address: "Rua Comendador Araújo, 531 — Batel, Curitiba",
    description:
      "Café moderno no Batel com foco em métodos de extração de precisão: Chemex, V60, AeroPress e espresso. Ambiente minimalista, mesas individuais e playlist curada. Frequentado por profissionais do bairro durante a semana e casais nos fins de semana. Não tem Wi-Fi — por design.",
    tags: ["café especial", "chemex", "v60", "minimalista", "batel", "silencioso"],
    attributes: {
      musicaAoVivo: false,
      wifi: false,
      petFriendly: false,
      estacionamento: false,
      acessivel: true,
      reserva: false,
      abertoDomingo: true,
      ambiente: "tranquilo",
      ideal: ["café da manhã", "pausa no trabalho", "encontro a dois", "silêncio"],
    },
    rating: 4.7,
    reviewCount: 189,
    priceRange: 2,
    priceLabel: "R$ 20–45 / pessoa",
    hours: { weekdays: "8h–18h", weekend: "9h–17h" },
    lat: -25.4421,
    lng: -49.2867,
    instagram: "@spotcoffeecwb",
    matchKeywords: [
      "café", "especialidade", "batel", "minimalista", "tranquilo",
      "chemex", "v60", "filtrado", "silencioso", "encontro",
    ],
  },
  {
    id: "cwb-015",
    googlePlaceId: null,
    name: "Feirinha do Largo da Ordem",
    type: "Feira / Gastronomia",
    neighborhood: "Centro Histórico",
    address: "Largo da Ordem — Centro Histórico, Curitiba",
    description:
      "A feira mais famosa de Curitiba, realizada aos domingos no coração do Centro Histórico. Artesanato, antiguidades, comida de rua e muita cultura. Barracas de tapioca, pastel, espetinho e chope ao ar livre. O melhor programa de domingo da cidade, com vista para as igrejas históricas.",
    tags: ["feira", "domingo", "artesanato", "comida de rua", "histórico", "passeio"],
    attributes: {
      musicaAoVivo: true,
      wifi: false,
      petFriendly: true,
      estacionamento: false,
      acessivel: true,
      reserva: false,
      abertoDomingo: true,
      ambiente: "agitado",
      ideal: ["domingo", "família", "turista", "passeio", "ao ar livre"],
    },
    rating: 4.8,
    reviewCount: 1243,
    priceRange: 1,
    priceLabel: "R$ 20–50 / pessoa",
    hours: { weekdays: "Fechado (seg–sáb)", weekend: "9h–14h (somente domingos)" },
    lat: -25.4151,
    lng: -49.2698,
    matchKeywords: [
      "feira", "domingo", "artesanato", "comida", "rua", "histórico",
      "largo da ordem", "turista", "família", "passeio", "ao ar livre", "gratuito",
    ],
  },
];

// Função utilitária para busca local por score de relevância
export function scorePlace(place: Place, keywords: string[]): number {
  const queryLower = keywords.map((k) => k.toLowerCase());
  let score = 0;
  place.matchKeywords.forEach((kw) => {
    if (queryLower.some((q) => q.includes(kw) || kw.includes(q))) score += 10;
  });
  return score;
}

// Lookup por bairro
export function filterByNeighborhood(places: Place[], neighborhood: string): Place[] {
  const n = neighborhood.toLowerCase();
  return places.filter(
    (p) =>
      p.neighborhood.toLowerCase().includes(n) ||
      p.address.toLowerCase().includes(n)
  );
}

// Lookup por atributo
export function filterByAttribute(
  places: Place[],
  attribute: keyof Place["attributes"]
): Place[] {
  return places.filter((p) => p.attributes[attribute] === true);
}
