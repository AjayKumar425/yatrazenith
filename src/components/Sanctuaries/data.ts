import type { SanctuaryIconName } from "./icons";

export interface SanctuarySpec {
  icon: SanctuaryIconName;
  label: string;
}

export type SanctuaryCard =
  | {
      id: string;
      kind: "info";
      heading: string;
      specs: SanctuarySpec[];
    }
  | {
      id: string;
      kind: "photo";
      imageSrc: string;
      imageAlt: string;
      badgeIcon: SanctuaryIconName;
      badgeLabel: string;
    };

export interface SanctuaryProperty {
  id: string;
  index: string;
  tabLabel: string;
  eyebrow: string;
  titleLines: [string, string];
  description: [string, string];
  region: string;
  location: string;
  maxGuests: number;
  nightlyRate: number;
  areaSqm: number;
  availability: string;
  cards: SanctuaryCard[];
}

export const SANCTUARIES: SanctuaryProperty[] = [
  {
    id: "auli-cedar-lodge",
    index: "01",
    tabLabel: "Auli Cedar Lodge",
    eyebrow: "Property",
    titleLines: [
      "Spacious Family Sanctuary",
      "In the Heart of Garhwal",
    ],
    description: [
      "A sunlit deodar-and-stone estate crafted for large families or private creative retreats, offering quiet village charm and effortless access to high-ridge trails.",
      "It could accommodate up to 14 individuals!",
    ],
    region: "Garhwal & Uttarakhand",
    location: "Auli Ridge, Garhwal · 2,840M",
    maxGuests: 14,
    nightlyRate: 740,
    areaSqm: 386,
    availability: "Available · Autumn – Spring",
    cards: [
      {
        id: "auli-amenities",
        kind: "info",
        heading: "What amenities are here?",
        specs: [
          { icon: "pin", label: "50M from the Garhwal ridge trail" },
          { icon: "area", label: "386 SQM private sanctuary" },
          { icon: "hearth", label: "Cozy stone hearth with smart lounge" },
          { icon: "transfer", label: "Private helipad & chauffeur parking" },
        ],
      },
      {
        id: "auli-living-photo",
        kind: "photo",
        imageSrc: "/images/sanctuary-living.jpg",
        imageAlt:
          "Double-height Himalayan deodar timber living space with steel staircase, fireplace, and snow-peak views",
        badgeIcon: "pet",
        badgeLabel: "Dog-Friendly",
      },
      {
        id: "auli-bedrooms",
        kind: "info",
        heading: "Bedrooms with authentic charm",
        specs: [
          { icon: "bed", label: "5 king suite bedrooms" },
          { icon: "bath", label: "3 renovated stone bathrooms" },
          { icon: "craft", label: "Traditional cedar & slate aesthetic" },
          { icon: "peaks", label: "Unobstructed Nanda Devi views" },
        ],
      },
      {
        id: "auli-bedroom-photo",
        kind: "photo",
        imageSrc: "/images/sanctuary-bedroom.jpg",
        imageAlt:
          "Handcrafted cedar wood master suite framing misty snow-capped Himalayan mountain ridges",
        badgeIcon: "peaks",
        badgeLabel: "2,840M Elevation",
      },
      {
        id: "auli-wellness",
        kind: "info",
        heading: "Restoration & private dining",
        specs: [
          { icon: "sauna", label: "Steaming basalt thermal plunge" },
          { icon: "dining", label: "Dedicated Garhwal estate chef" },
          { icon: "stars", label: "Dark-sky cedar stargazing deck" },
          { icon: "compass", label: "On-call mountain naturalist guide" },
        ],
      },
      {
        id: "auli-terrace-photo",
        kind: "photo",
        imageSrc: "/images/sanctuary-terrace.jpg",
        imageAlt:
          "Cantilevered cedar deck with heated basalt stone plunge overlooking pine valley and snow peaks",
        badgeIcon: "sun",
        badgeLabel: "All-Season Plunge",
      },
    ],
  },
  {
    id: "leh-stone-manor",
    index: "02",
    tabLabel: "Leh Stone Manor",
    eyebrow: "Property",
    titleLines: [
      "Monastic Stone Residence",
      "Overlooking Indus Valley",
    ],
    description: [
      "Built from hand-dressed Ladakhi granite and apricot wood, this tranquil courtyard manor opens straight onto quiet monastery trails and high-altitude salt lakes.",
      "Privately hosts up to 10 guests with resident expedition team!",
    ],
    region: "Ladakh & Indus Valley",
    location: "Stok Valley, Ladakh · 3,520M",
    maxGuests: 10,
    nightlyRate: 890,
    areaSqm: 320,
    availability: "Available · May – October",
    cards: [
      {
        id: "leh-amenities",
        kind: "info",
        heading: "What amenities are here?",
        specs: [
          { icon: "pin", label: "120M from Stok Palace ridge path" },
          { icon: "area", label: "320 SQM walled stone courtyard" },
          { icon: "hearth", label: "Oxygen-assisted lounge & hearth" },
          { icon: "transfer", label: "4x4 expedition fleet & tarmac drop" },
        ],
      },
      {
        id: "leh-bedroom-photo",
        kind: "photo",
        imageSrc: "/images/sanctuary-bedroom.jpg",
        imageAlt:
          "Sunlit Ladakhi timber and stone bedroom suite looking over misty high-altitude peaks",
        badgeIcon: "shield",
        badgeLabel: "Acclimatized Suites",
      },
      {
        id: "leh-bedrooms",
        kind: "info",
        heading: "Suites shaped by Ladakhi silence",
        specs: [
          { icon: "bed", label: "4 heated king courtyard suites" },
          { icon: "bath", label: "4 copper & slate rain baths" },
          { icon: "craft", label: "Rammed-earth & willow joinery" },
          { icon: "peaks", label: "Panoramic Stok Kangri sightlines" },
        ],
      },
      {
        id: "leh-terrace-photo",
        kind: "photo",
        imageSrc: "/images/sanctuary-terrace.jpg",
        imageAlt:
          "High-altitude timber terrace with steaming plunge pool overlooking snow-capped range",
        badgeIcon: "sun",
        badgeLabel: "Solar Heated",
      },
      {
        id: "leh-wellness",
        kind: "info",
        heading: "Private passage & table",
        specs: [
          { icon: "dining", label: "Apricot orchard & Tibetan kitchen" },
          { icon: "stars", label: "Bortle-1 night sky observatory" },
          { icon: "compass", label: "Private monastery dawn access" },
          { icon: "sauna", label: "Herbal steam & recovery sanctuary" },
        ],
      },
      {
        id: "leh-living-photo",
        kind: "photo",
        imageSrc: "/images/sanctuary-living.jpg",
        imageAlt:
          "Warm timber and stone great room with glowing hearth facing mountain ridges",
        badgeIcon: "pet",
        badgeLabel: "Dog-Friendly",
      },
    ],
  },
  {
    id: "kaza-sky-chalet",
    index: "03",
    tabLabel: "Kaza Sky Chalet",
    eyebrow: "Property",
    titleLines: [
      "Timber & Slate Chalet",
      "Above the Spiti Horizon",
    ],
    description: [
      "Suspended along a dramatic limestone shelf above the Spiti River, designed for photographers, writers, and small groups seeking raw high-desert stillness.",
      "Accommodates up to 8 individuals in complete seclusion!",
    ],
    region: "Spiti High Desert",
    location: "Langza Shelf, Spiti · 4,180M",
    maxGuests: 8,
    nightlyRate: 650,
    areaSqm: 275,
    availability: "Available · June – November",
    cards: [
      {
        id: "spiti-amenities",
        kind: "info",
        heading: "What amenities are here?",
        specs: [
          { icon: "pin", label: "Direct access to Langza fossil trail" },
          { icon: "area", label: "275 SQM cliffside glass chalet" },
          { icon: "hearth", label: "Wood-burning stove & vinyl library" },
          { icon: "transfer", label: "Private overland Land Cruiser transfer" },
        ],
      },
      {
        id: "spiti-terrace-photo",
        kind: "photo",
        imageSrc: "/images/sanctuary-terrace.jpg",
        imageAlt:
          "Cantilevered alpine cedar terrace with steaming stone bath facing rugged snow peaks",
        badgeIcon: "peaks",
        badgeLabel: "4,180M Cliffside",
      },
      {
        id: "spiti-bedrooms",
        kind: "info",
        heading: "High-desert rooms with warmth",
        specs: [
          { icon: "bed", label: "3 panoramic timber bedrooms" },
          { icon: "bath", label: "2 heated slate soak bathrooms" },
          { icon: "craft", label: "Hand-loomed Kinnauri wool interiors" },
          { icon: "peaks", label: "270-degree Chau Chau Kang view" },
        ],
      },
      {
        id: "spiti-living-photo",
        kind: "photo",
        imageSrc: "/images/sanctuary-living.jpg",
        imageAlt:
          "Timber chalet great room with golden hour mountain views and hearth",
        badgeIcon: "sun",
        badgeLabel: "Passive Solar",
      },
      {
        id: "spiti-expedition",
        kind: "info",
        heading: "Expeditions & alpine table",
        specs: [
          { icon: "compass", label: "Snow-leopard tracker & local guide" },
          { icon: "dining", label: "Sea-buckthorn & hearth-fired menu" },
          { icon: "stars", label: "Rooftop telescope & astrophotography" },
          { icon: "sauna", label: "Heated basalt stone plunge" },
        ],
      },
      {
        id: "spiti-ridge-photo",
        kind: "photo",
        imageSrc: "/images/journey.jpg",
        imageAlt:
          "Expedition guide standing on high mountain crag overlooking misty valley ridges",
        badgeIcon: "compass",
        badgeLabel: "Private Guide",
      },
    ],
  },
];
