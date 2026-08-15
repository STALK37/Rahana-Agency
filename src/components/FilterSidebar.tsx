import type { ReactNode } from "react";
import { HistogramRange } from "./ui/HistogramRange";
import { DISTRICTS, formatAmd } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useCountUp } from "./ui/CountButton";
import {
  DISTRICT_KEYS,
  ROOM_KEYS,
  TYPE_KEYS,
  baseSubset,
  boundsOf,
  csv,
  filterProperties,
  type ListingSearch,
} from "@/lib/filters";

function Section({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <section className="filter-section">
      <div className="section-head">
        {active && <span className="section-dot" aria-hidden />}
        <span className="section-label">{label}</span>
        <span className="section-rule" aria-hidden />
      </div>
      {children}
    </section>
  );
}

export function FilterSidebar({
  search,
  set,
  reset,
  onApply,
}: {
  search: ListingSearch;
  set: (patch: Partial<ListingSearch>) => void;
  reset: () => void;
  onApply?: () => void;
}) {
  const { t, tl } = useI18n();
  const subset = baseSubset(search);
  const bounds = boundsOf(subset);
  const results = filterProperties(search);
  const count = useCountUp(results.length);

  const districts = csv(search.districts);
  const rooms = csv(search.rooms);
  const types = csv(search.types);

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

  const toggle = (list: string[], v: string) =>
    (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]).join(",");

  const dirty =
    districts.length > 0 ||
    rooms.length > 0 ||
    types.length > 0 ||
    search.status !== "all" ||
    search.priceMin !== undefined ||
    search.priceMax !== undefined ||
    search.areaMin !== undefined ||
    search.areaMax !== undefined ||
    search.floorMin !== undefined ||
    search.floorMax !== undefined;

  // Live per-district counts, respecting every other active filter.
  const districtCount = (d: string) => filterProperties({ ...search, districts: d }).length;

  return (
    <div className="filter-panel">
      <div className="filter-scroll">
        <div className="flex items-center justify-between gap-4">
          <h2 style={{ fontSize: 20, fontWeight: 500 }}>{t("listings.filters")}</h2>
          <button
            type="button"
            onClick={reset}
            className={`clear-btn ${dirty ? "is-on" : ""}`}
            tabIndex={dirty ? 0 : -1}
            aria-hidden={!dirty}
          >
            {t("filters.clear")}
          </button>
        </div>

        <Section label={t("search.deal")} active={false}>
          <div className="segmented grid w-full grid-cols-2">
            {(["sale", "rent"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() =>
                  set({
                    deal: d,
                    priceMin: undefined,
                    priceMax: undefined,
                    areaMin: undefined,
                    areaMax: undefined,
                    floorMin: undefined,
                    floorMax: undefined,
                  })
                }
                aria-pressed={search.deal === d}
                className={`segmented-btn min-w-0 truncate px-3 ${search.deal === d ? "is-active" : ""}`}
              >
                {t(d === "sale" ? "nav.buy" : "nav.rent")}
              </button>
            ))}
          </div>
        </Section>

        <Section label={t("search.district")} active={districts.length > 0}>
          <ul className="district-list">
            {DISTRICT_KEYS.map((d) => {
              const n = districtCount(d);
              const on = districts.includes(d);
              const dead = n === 0 && !on;
              return (
                <li key={d}>
                  <button
                    type="button"
                    disabled={dead}
                    aria-pressed={on}
                    onClick={() => set({ districts: toggle(districts, d) })}
                    className={`district-row ${on ? "is-on" : ""} ${dead ? "is-dead" : ""}`}
                  >
                    <span className="district-bar" aria-hidden />
                    <span className="district-name">
                      {tl(DISTRICTS.find((x) => x.key === d)!.label)}
                    </span>
                    <span className="district-count">{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>

        <Section label={t("search.rooms")} active={rooms.length > 0}>
          <div className="flex flex-wrap gap-[10px]">
            {ROOM_KEYS.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={rooms.includes(r)}
                onClick={() => set({ rooms: toggle(rooms, r) })}
                className={`room-dot ${rooms.includes(r) ? "is-active" : ""}`}
              >
                {r === "5" ? "5+" : r}
              </button>
            ))}
          </div>
        </Section>

        <Section label={t("listings.type")} active={types.length > 0}>
          <div className="flex flex-wrap gap-2">
            {TYPE_KEYS.map((x) => (
              <button
                key={x}
                type="button"
                aria-pressed={types.includes(x)}
                onClick={() => set({ types: toggle(types, x) })}
                className={`soft-pill ${types.includes(x) ? "is-active" : ""}`}
              >
                {t(`type.${x}` as never)}
              </button>
            ))}
          </div>
        </Section>

        <Section
          label={t("search.price")}
          active={search.priceMin !== undefined || search.priceMax !== undefined}
        >
          <HistogramRange
            min={bounds.price[0]}
            max={bounds.price[1]}
            step={search.deal === "sale" ? 500000 : 5000}
            value={price}
            unit="֏"
            values={subset.map((p) => p.price)}
            onChange={([a, b]) => set({ priceMin: a, priceMax: b })}
          />
          <p className="t-meta mt-2 text-muted">
            {formatAmd(price[0])} — {formatAmd(price[1])}
          </p>
        </Section>

        <Section
          label={t("listings.area")}
          active={search.areaMin !== undefined || search.areaMax !== undefined}
        >
          <HistogramRange
            min={bounds.area[0]}
            max={bounds.area[1]}
            value={area}
            unit={t("unit.sqm")}
            values={subset.map((p) => p.area)}
            onChange={([a, b]) => set({ areaMin: a, areaMax: b })}
          />
        </Section>

        <Section
          label={t("listings.floor")}
          active={search.floorMin !== undefined || search.floorMax !== undefined}
        >
          <HistogramRange
            min={bounds.floor[0]}
            max={bounds.floor[1]}
            value={floor}
            unit={t("unit.floorOf")}
            onChange={([a, b]) => set({ floorMin: a, floorMax: b })}
          />
        </Section>

        <Section label={t("listings.status")} active={search.status !== "all"}>
          <div className="flex flex-wrap gap-2">
            {(["all", "available", "reserved"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={search.status === s}
                onClick={() => set({ status: s })}
                className={`soft-pill ${search.status === s ? "is-active" : ""}`}
              >
                {t(`status.${s}` as never)}
              </button>
            ))}
          </div>
        </Section>
      </div>

      <div className="filter-foot">
        {results.length === 0 ? (
          <div>
            <button type="button" className="count-hero is-empty" onClick={reset}>
              {t("listings.empty")}
            </button>
            <button type="button" onClick={reset} className="text-link mx-auto mt-3 block">
              {t("listings.reset")}
            </button>
          </div>
        ) : (
          <button type="button" className="count-hero" onClick={onApply}>
            <span style={{ fontSize: 19, fontWeight: 500 }}>{count}</span>
            <span style={{ fontSize: 15, fontWeight: 400 }}>{t("search.results")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
