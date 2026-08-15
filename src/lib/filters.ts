import type { Deal, DistrictKey, Property, PropertyType, Status } from "./data";
import { PROPERTIES } from "./data";

export type SortKey = "newest" | "priceAsc" | "priceDesc" | "areaDesc";
export type StatusFilter = Status | "all";

export interface ListingSearch {
  deal: Deal;
  districts: string;
  types: string;
  rooms: string;
  status: StatusFilter;
  sort: SortKey;
  view: "grid" | "list";
  priceMin?: number | undefined;
  priceMax?: number | undefined;
  areaMin?: number | undefined;
  areaMax?: number | undefined;
  floorMin?: number | undefined;
  floorMax?: number | undefined;
}

export const defaultSearch: ListingSearch = {
  deal: "sale",
  districts: "",
  types: "",
  rooms: "",
  status: "all",
  sort: "newest",
  view: "grid",
};

const str = (v: unknown, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v: unknown): number | undefined => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : undefined;
};

export function validateListingSearch(raw: Record<string, unknown>): ListingSearch {
  const out: ListingSearch = {
    deal: raw["deal"] === "rent" ? "rent" : "sale",
    districts: str(raw["districts"]),
    types: str(raw["types"]),
    rooms: str(raw["rooms"]),
    status:
      raw["status"] === "available" || raw["status"] === "reserved"
        ? (raw["status"] as Status)
        : "all",
    sort: (["priceAsc", "priceDesc", "areaDesc"].includes(str(raw["sort"]))
      ? str(raw["sort"])
      : "newest") as SortKey,
    view: raw["view"] === "list" ? "list" : "grid",
  };
  const keys = ["priceMin", "priceMax", "areaMin", "areaMax", "floorMin", "floorMax"] as const;
  for (const k of keys) {
    const v = num(raw[k]);
    if (v !== undefined) out[k] = v;
  }
  return out;
}

export const csv = (v: string) => (v ? v.split(",").filter(Boolean) : []);

/** Properties matching only deal + district/type/rooms/status (used for range bounds). */
export function baseSubset(s: ListingSearch): Property[] {
  const districts = csv(s.districts);
  const types = csv(s.types);
  const rooms = csv(s.rooms);
  return PROPERTIES.filter((p) => {
    if (p.deal !== s.deal) return false;
    if (districts.length && !districts.includes(p.district)) return false;
    if (types.length && !types.includes(p.type)) return false;
    if (rooms.length) {
      const match = rooms.some((r) => (r === "5" ? p.rooms >= 5 : p.rooms === Number(r)));
      if (!match) return false;
    }
    if (s.status !== "all" && p.status !== s.status) return false;
    return true;
  });
}

export interface Bounds {
  price: [number, number];
  area: [number, number];
  floor: [number, number];
}

export function boundsOf(list: Property[]): Bounds {
  if (!list.length) return { price: [0, 1], area: [0, 1], floor: [1, 2] };
  const prices = list.map((p) => p.price);
  const areas = list.map((p) => p.area);
  const floors = list.map((p) => p.floor);
  return {
    price: [Math.min(...prices), Math.max(...prices)],
    area: [Math.min(...areas), Math.max(...areas)],
    floor: [Math.min(...floors), Math.max(...floors)],
  };
}

export function filterProperties(s: ListingSearch): Property[] {
  const list = baseSubset(s).filter((p) => {
    if (s.priceMin !== undefined && p.price < s.priceMin) return false;
    if (s.priceMax !== undefined && p.price > s.priceMax) return false;
    if (s.areaMin !== undefined && p.area < s.areaMin) return false;
    if (s.areaMax !== undefined && p.area > s.areaMax) return false;
    if (s.floorMin !== undefined && p.floor < s.floorMin) return false;
    if (s.floorMax !== undefined && p.floor > s.floorMax) return false;
    return true;
  });

  const sorted = [...list];
  if (s.sort === "priceAsc") sorted.sort((a, b) => a.price - b.price);
  if (s.sort === "priceDesc") sorted.sort((a, b) => b.price - a.price);
  if (s.sort === "areaDesc") sorted.sort((a, b) => b.area - a.area);
  return sorted;
}

export const DISTRICT_KEYS: DistrictKey[] = ["center", "arabkir", "kanaker", "avan", "davtashen"];
export const TYPE_KEYS: PropertyType[] = ["apartment", "house", "commercial"];
export const ROOM_KEYS = ["1", "2", "3", "4", "5"];
