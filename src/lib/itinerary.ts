export interface ItinerarySelectionItem {
  id: string;
  title: string;
  category: string;
  region: string;
  price: number;
  unitLabel: string;
}

export interface StoredItinerary {
  region?: string;
  guests?: number;
  sanctuaryTitle?: string;
  nightlyRate?: number;
  menuItems: ItinerarySelectionItem[];
}

const STORAGE_KEY = "yatrazenith:itinerary:v1";
export const ITINERARY_EVENT = "yatra-itinerary-updated";

const EMPTY_ITINERARY: StoredItinerary = { menuItems: [] };
let cachedRaw: string | null = null;
let cachedSnapshot: StoredItinerary = EMPTY_ITINERARY;

export function getServerItinerary(): StoredItinerary {
  return EMPTY_ITINERARY;
}

export function readItinerary(): StoredItinerary {
  if (typeof window === "undefined") {
    return EMPTY_ITINERARY;
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedSnapshot;
    }
    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = EMPTY_ITINERARY;
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw) as Partial<StoredItinerary>;
    cachedSnapshot = {
      region: parsed.region,
      guests: parsed.guests,
      sanctuaryTitle: parsed.sanctuaryTitle,
      nightlyRate: parsed.nightlyRate,
      menuItems: Array.isArray(parsed.menuItems) ? parsed.menuItems : [],
    };
    return cachedSnapshot;
  } catch {
    return EMPTY_ITINERARY;
  }
}

export function writeItinerary(next: StoredItinerary): void {
  if (typeof window === "undefined") return;
  try {
    const serialized = JSON.stringify(next);
    window.sessionStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedSnapshot = next;
  } catch {
    cachedSnapshot = next;
  }
  window.dispatchEvent(
    new CustomEvent<StoredItinerary>(ITINERARY_EVENT, { detail: next })
  );
}

export function subscribeItinerary(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener(ITINERARY_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(ITINERARY_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}
