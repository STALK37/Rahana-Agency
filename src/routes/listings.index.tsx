import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid, Rows3 } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CloseThin } from "@/components/ui/Icons";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { districtLabel, formatAmd, type DistrictKey, type PropertyType } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useLocalizedMeta } from "@/lib/use-localized-meta";
import {
  baseSubset,
  boundsOf,
  csv,
  defaultSearch,
  filterProperties,
  validateListingSearch,
  type ListingSearch,
  type SortKey,
} from "@/lib/filters";
import { SITE_URL } from "./__root";

const TITLE = {
  hy: "Բնակարաններ Երևանում | Rahana",
  en: "Apartments in Yerevan | Rahana",
  ru: "Квартиры в Ереване | Rahana",
};
const DESC = {
  hy: "Որոնեք բնակարաններ վաճառքի և վարձակալության համար Երևանում՝ ըստ թաղամասի, սենյակների, հարկի, մակերեսի և գնի։",
  en: "Search apartments for sale or rent in Yerevan by district, rooms, floor, area and price.",
  ru: "Поиск квартир на продажу и в аренду в Ереване по району, комнатам, этажу, площади и цене.",
};

export const Route = createFileRoute("/listings/")({
  validateSearch: (raw: Record<string, unknown>): ListingSearch => validateListingSearch(raw),
  head: () => ({
    meta: [
      { title: TITLE.hy },
      { name: "description", content: DESC.hy },
      { property: "og:title", content: TITLE.hy },
      { property: "og:description", content: DESC.hy },
      { property: "og:url", content: `${SITE_URL}/listings` },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { name: "twitter:title", content: TITLE.hy },
      { name: "twitter:description", content: DESC.hy },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/listings` }],
  }),
  component: Listings,
});

function Listings() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/listings/" });
  const { t, tl, lang } = useI18n();
  useLocalizedMeta(TITLE, DESC);
  const [sheet, setSheet] = useState(false);

  const set = (patch: Partial<ListingSearch>) =>
    navigate({ search: (prev: ListingSearch) => ({ ...prev, ...patch }) });
  const reset = () =>
    navigate({
      search: { ...defaultSearch, deal: search.deal, sort: search.sort, view: search.view },
    });

  const bounds = boundsOf(baseSubset(search));
  const results = filterProperties(search);

  const price: [number, number] = [
    search.priceMin ?? bounds.price[0],
    search.priceMax ?? bounds.price[1],
  ];
  const area: [number, number] = [
    search.areaMin ?? bounds.area[0],
    search.areaMax ?? bounds.area[1],
  ];
  const floor: [number, number] = [
    search.floorMin ?? bounds.floor[0],
    search.floorMax ?? bounds.floor[1],
  ];

  const districts = csv(search.districts);
  const types = csv(search.types);
  const rooms = csv(search.rooms);

  const toggle = (list: string[], v: string) =>
    (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]).join(",");

  const chips: { key: string; label: string; clear: () => void }[] = [
    ...districts.map((d) => ({
      key: `d-${d}`,
      label: districtLabel(d as DistrictKey, lang),
      clear: () => set({ districts: toggle(districts, d) }),
    })),
    ...types.map((x) => ({
      key: `t-${x}`,
      label: t(`type.${x as PropertyType}` as never),
      clear: () => set({ types: toggle(types, x) }),
    })),
    ...rooms.map((r) => ({
      key: `r-${r}`,
      label: `${r === "5" ? "5+" : r} ${t("unit.room")}`,
      clear: () => set({ rooms: toggle(rooms, r) }),
    })),
  ];
  if (search.priceMin !== undefined || search.priceMax !== undefined)
    chips.push({
      key: "price",
      label: `${formatAmd(price[0])} — ${formatAmd(price[1])}`,
      clear: () => set({ priceMin: undefined, priceMax: undefined }),
    });
  if (search.areaMin !== undefined || search.areaMax !== undefined)
    chips.push({
      key: "area",
      label: `${area[0]}–${area[1]} ${t("unit.sqm")}`,
      clear: () => set({ areaMin: undefined, areaMax: undefined }),
    });
  if (search.floorMin !== undefined || search.floorMax !== undefined)
    chips.push({
      key: "floor",
      label: `${t("listings.floor")} ${floor[0]}–${floor[1]}`,
      clear: () => set({ floorMin: undefined, floorMax: undefined }),
    });
  if (search.status !== "all")
    chips.push({
      key: "status",
      label: t(`status.${search.status}` as never),
      clear: () => set({ status: "all" }),
    });

  const sidebar = (onApply?: () => void) => (
    <FilterSidebar search={search} set={set} reset={reset} {...(onApply ? { onApply } : {})} />
  );

  return (
    <div className="container-r pb-16 pt-32 sm:pt-36">
      <h1 className="t-section">{t("listings.title")}</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="hidden lg:block lg:sticky lg:top-24">{sidebar()}</aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setSheet(true)} className="filters-fab lg:hidden">
              {t("listings.filters")}
              {chips.length > 0 && <span className="fab-badge">{chips.length}</span>}
            </button>

            <p className="t-meta text-muted">
              {results.length} {t("search.results")}
            </p>

            <div className="ml-auto flex items-center gap-3">
              <div
                className="card-r"
                style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.05)", borderRadius: 30 }}
              >
                <CustomSelect
                  label={t("listings.sort")}
                  placeholder={t("search.any")}
                  value={[search.sort]}
                  onChange={(v) => set({ sort: (v[0] ?? "newest") as SortKey })}
                  align="right"
                  options={(["newest", "priceAsc", "priceDesc", "areaDesc"] as const).map((s) => ({
                    value: s,
                    label: t(`sort.${s}` as never),
                  }))}
                />
              </div>

              <div className="view-track">
                <span
                  className="view-thumb"
                  style={{
                    transform: search.view === "grid" ? "translateX(0)" : "translateX(40px)",
                  }}
                  aria-hidden
                />
                <button
                  aria-label="grid"
                  onClick={() => set({ view: "grid" })}
                  className={`view-btn ${search.view === "grid" ? "is-active" : ""}`}
                >
                  <LayoutGrid size={16} strokeWidth={1.5} />
                </button>
                <button
                  aria-label="list"
                  onClick={() => set({ view: "list" })}
                  className={`view-btn ${search.view === "list" ? "is-active" : ""}`}
                >
                  <Rows3 size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {chips.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button key={c.key} onClick={c.clear} className="chip-r">
                  {c.label}
                  <CloseThin />
                </button>
              ))}
              <button onClick={reset} className="text-link ml-2">
                {t("listings.reset")}
              </button>
            </div>
          )}

          {results.length === 0 ? (
            <div className="card-r mt-8 p-10 text-center">
              <p className="t-card">{t("listings.empty")}</p>
              <p className="t-body mt-2 text-muted">{t("listings.emptyHint")}</p>
              <button onClick={reset} className="btn btn-gold mt-6">
                {t("listings.reset")}
              </button>
            </div>
          ) : (
            <div
              className={`mt-6 grid gap-x-6 gap-y-10 ${
                search.view === "grid" ? "sm:grid-cols-2 2xl:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {results.map((p) => (
                <PropertyCard key={p.id} property={p} view={search.view} />
              ))}
            </div>
          )}
        </div>
      </div>

      {sheet && (
        <>
          <div className="sheet-scrim lg:hidden" onClick={() => setSheet(false)} />
          <div className="sheet-body lg:hidden" role="dialog" aria-modal="true">
            <span className="sheet-handle" aria-hidden />
            <div className="min-h-0 flex-1 overflow-hidden">{sidebar(() => setSheet(false))}</div>
          </div>
        </>
      )}
    </div>
  );
}
