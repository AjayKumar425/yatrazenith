export type MenuCategory =
  | "Sanctuaries"
  | "Expeditions"
  | "Wellness"
  | "Dining";

export interface MenuItem {
  id: string;
  code: string;
  category: MenuCategory;
  region: string;
  title: string;
  duration: string;
  elevation: string;
  description: string;
  highlights: [string, string];
  price: number;
  unitLabel: string;
  imageSrc: string;
  imageAlt: string;
}

export const MENU_CATEGORIES: Array<{
  id: "All" | MenuCategory;
  label: string;
  subtitle: string;
}> = [
  {
    id: "All",
    label: "All Offerings",
    subtitle: "Complete curated archive across stays, guided traverses, thermal restoration, and mountain table.",
  },
  {
    id: "Sanctuaries",
    label: "Private Sanctuaries",
    subtitle: "Architectural cedar-and-stone estates reserved exclusively for your party.",
  },
  {
    id: "Expeditions",
    label: "Guided Expeditions",
    subtitle: "Naturalist-led ridge walks, high-pass crossings, and dawn monastery immersions.",
  },
  {
    id: "Wellness",
    label: "Wellness & Thermal",
    subtitle: "Basalt stone thermal soaks, high-altitude recovery, and cedar sauna rituals.",
  },
  {
    id: "Dining",
    label: "Alpine Table",
    subtitle: "Private mountain chefs, hearth-fired tasting menus, and orchard cellar pairings.",
  },
];

export const MENU_REGIONS = [
  "All Regions",
  "Garhwal & Uttarakhand",
  "Ladakh & Indus Valley",
  "Spiti High Desert",
] as const;

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "auli-cedar-lodge",
    code: "01",
    category: "Sanctuaries",
    region: "Garhwal & Uttarakhand",
    title: "Auli Cedar Lodge",
    duration: "Private Buyout · Up to 14 Guests",
    elevation: "2,840M",
    description:
      "A 386 sqm deodar-and-stone family sanctuary featuring five king suites, glowing stone hearths, and unobstructed Nanda Devi sightlines.",
    highlights: ["386 SQM Estate", "Private Helipad Access"],
    price: 740,
    unitLabel: "/ night",
    imageSrc: "/images/sanctuary-living.jpg",
    imageAlt: "Warm deodar timber chalet living space with hearth and sunlit mountain windows",
  },
  {
    id: "leh-stone-manor",
    code: "02",
    category: "Sanctuaries",
    region: "Ladakh & Indus Valley",
    title: "Leh Stone Manor",
    duration: "Private Buyout · Up to 10 Guests",
    elevation: "3,520M",
    description:
      "Hand-dressed Ladakhi granite courtyard manor with four heated king suites, oxygen-assisted recovery lounge, and private 4x4 fleet.",
    highlights: ["Oxygen-Assisted Suites", "Stok Valley Views"],
    price: 890,
    unitLabel: "/ night",
    imageSrc: "/images/sanctuary-bedroom.jpg",
    imageAlt: "Sunlit cedar and stone bedroom suite looking onto snow-dusted peaks",
  },
  {
    id: "kaza-sky-chalet",
    code: "03",
    category: "Sanctuaries",
    region: "Spiti High Desert",
    title: "Kaza Sky Chalet",
    duration: "Private Buyout · Up to 8 Guests",
    elevation: "4,180M",
    description:
      "Suspended above a limestone shelf overlooking the Spiti River, built for quiet creative retreats, stargazing, and complete solitude.",
    highlights: ["270° Ridge Exposure", "Passive Solar Craft"],
    price: 650,
    unitLabel: "/ night",
    imageSrc: "/images/sanctuary-terrace.jpg",
    imageAlt: "Cantilevered cedar terrace overlooking misty pine valleys and snow peaks",
  },
  {
    id: "nanda-ridge-traverse",
    code: "04",
    category: "Expeditions",
    region: "Garhwal & Uttarakhand",
    title: "Nanda Ridge Naturalist Traverse",
    duration: "Full Day · Private Guide",
    elevation: "3,650M",
    description:
      "Dawn ridge ascent through old-growth oak and cedar forests led by a senior Himalayan botanist, concluding with a hot meadow picnic.",
    highlights: ["Senior Naturalist", "Meadow Tea Service"],
    price: 340,
    unitLabel: "/ guest",
    imageSrc: "/images/journey.jpg",
    imageAlt: "Mountaineer standing on a dramatic ridge overlooking misty mountain valleys",
  },
  {
    id: "indus-monastery-dawn",
    code: "05",
    category: "Expeditions",
    region: "Ladakh & Indus Valley",
    title: "Indus Monastery Dawn Passage",
    duration: "Half Day · Curated Access",
    elevation: "3,780M",
    description:
      "Private pre-sunrise entry to centuries-old hillside gompas for morning chanting, followed by high-valley overland exploration.",
    highlights: ["Private Monastic Access", "4x4 Land Cruiser"],
    price: 420,
    unitLabel: "/ guest",
    imageSrc: "/images/sanctuary-backdrop.jpg",
    imageAlt: "Twilight blue Himalayan pine valley shrouded in mist below snow peaks",
  },
  {
    id: "spiti-wildlife-track",
    code: "06",
    category: "Expeditions",
    region: "Spiti High Desert",
    title: "High-Desert Wildlife & Fossil Track",
    duration: "2 Days · Expedition Team",
    elevation: "4,350M",
    description:
      "Guided high-altitude tracking across Kibber and Langza shelves with local spotters, thermal optics, and heated mobile basecamp.",
    highlights: ["Local Spotter Team", "Thermal Field Kit"],
    price: 580,
    unitLabel: "/ guest",
    imageSrc: "/images/journey.jpg",
    imageAlt: "High mountain lookout overlooking mist-layered Himalayan ridges",
  },
  {
    id: "basalt-thermal-soak",
    code: "07",
    category: "Wellness",
    region: "Garhwal & Uttarakhand",
    title: "Steaming Basalt Plunge & Cedar Sauna",
    duration: "2.5 Hours · Private Deck",
    elevation: "2,840M",
    description:
      "Mineral-infused outdoor stone bath heated over mountain timber, paired with Himalayan cedar steam and pine-needle botanical compress.",
    highlights: ["Outdoor Heated Plunge", "Cedar Essential Steam"],
    price: 190,
    unitLabel: "/ session",
    imageSrc: "/images/sanctuary-terrace.jpg",
    imageAlt: "Steaming outdoor basalt stone plunge tub on cedar deck facing mountain range",
  },
  {
    id: "ladakhi-recovery-ritual",
    code: "08",
    category: "Wellness",
    region: "Ladakh & Indus Valley",
    title: "High-Altitude Herbal Recovery Suite",
    duration: "90 Mins · In-Suite",
    elevation: "3,520M",
    description:
      "Restorative sea-buckthorn oil bodywork, guided breathwork, and warm copper-basin foot soaking tailored for smooth acclimatization.",
    highlights: ["Breathwork Protocol", "Wild Sea-Buckthorn Oil"],
    price: 220,
    unitLabel: "/ guest",
    imageSrc: "/images/sanctuary-bedroom.jpg",
    imageAlt: "Serene cedar bedroom suite bathed in soft morning mountain light",
  },
  {
    id: "dark-sky-sound-bath",
    code: "09",
    category: "Wellness",
    region: "Spiti High Desert",
    title: "Bortle-1 Night Sky & Sound Stillness",
    duration: "Evening · Rooftop Deck",
    elevation: "4,180M",
    description:
      "Fireside acoustic bowl session beneath crystal-clear high-desert constellations with wool throws and warm spiced kahwa.",
    highlights: ["Telescope Observation", "Acoustic Sound Bath"],
    price: 175,
    unitLabel: "/ guest",
    imageSrc: "/images/sanctuary-backdrop.jpg",
    imageAlt: "Deep twilight alpine forest and snow-crowned Himalayan skyline",
  },
  {
    id: "garhwal-hearth-tasting",
    code: "10",
    category: "Dining",
    region: "Garhwal & Uttarakhand",
    title: "Seven-Course Garhwal Hearth Table",
    duration: "Evening · Private Chef",
    elevation: "2,840M",
    description:
      "Foraged morels, heirloom red rice, wood-roasted trout, and wild rhododendron infusions prepared live over the estate stone hearth.",
    highlights: ["Foraged Mountain Menu", "Cellar Wine Pairing"],
    price: 260,
    unitLabel: "/ guest",
    imageSrc: "/images/sanctuary-living.jpg",
    imageAlt: "Cozy cedar and stone hearth dining lounge with mountain backdrop",
  },
  {
    id: "apricot-orchard-supper",
    code: "11",
    category: "Dining",
    region: "Ladakh & Indus Valley",
    title: "Stok Apricot Orchard Long Table",
    duration: "Afternoon · Courtyard",
    elevation: "3,520M",
    description:
      "Sunlit courtyard lunch showcasing Ladakhi barley breads, fermented yak cheese, apricot glazes, and small-batch botanical teas.",
    highlights: ["Orchard Harvest", "Artisanal Tea Pairing"],
    price: 210,
    unitLabel: "/ guest",
    imageSrc: "/images/sanctuary-terrace.jpg",
    imageAlt: "Cantilevered timber deck overlooking sunlit valleys and peaks",
  },
  {
    id: "spiti-fire-pairing",
    code: "12",
    category: "Dining",
    region: "Spiti High Desert",
    title: "Cliffside Wood-Fired Tasting Menu",
    duration: "Evening · Glass Chalet",
    elevation: "4,180M",
    description:
      "Intimate slow-cooked high-altitude supper featuring buckwheat galettes, sea-buckthorn reductions, and fireside single malts.",
    highlights: ["Wood-Fired Kitchen", "Single Malt Flight"],
    price: 245,
    unitLabel: "/ guest",
    imageSrc: "/images/sanctuary-living.jpg",
    imageAlt: "Warm timber chalet lounge with glowing hearth and peak vistas",
  },
];
