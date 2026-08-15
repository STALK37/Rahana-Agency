import { useEffect, useRef, useState, type ReactNode } from "react";
import { CustomSelect } from "./ui/CustomSelect";
import { RangeSlider } from "./ui/RangeSlider";
import { Chevron } from "./ui/Icons";
import { DISTRICTS, formatAmd } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import {
  DISTRICT_KEYS,
  ROOM_KEYS,
  TYPE_KEYS,
  boundsOf,
  baseSubset,
  csv,
  type ListingSearch,
} from "@/lib/filters";

export function FilterBar({
  search,
  set,
  submit,
  showAdvanced = true,
}: {
  search: ListingSearch;
  set: (patch: Partial<ListingSearch>) => void;
  submit: ReactNode;
  showAdvanced?: boolean;
}) {
  const { t, tl } = useI18n();
  const [more, setMore] = useState(false);
  const bounds = boundsOf(baseSubset(search));

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

  return (
    <div>
      <div className="filter-bar">
        {/* Sale / Rent */}
        <div className="field-r">
          <div className="field-label px-1">{t("search.deal")}</div>
          <div className="segmented mt-2">
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
                className={`segmented-btn ${search.deal === d ? "is-active" : ""}`}
              >
                {t(d === "sale" ? "nav.buy" : "nav.rent")}
              </button>
            ))}
          </div>
        </div>

        <Hair />

        <CustomSelect
          multi
          label={t("search.district")}
          placeholder={t("search.any")}
          value={districts}
          onChange={(v) => set({ districts: v.join(",") })}
          options={DISTRICT_KEYS.map((d) => ({
            value: d,
            label: tl(DISTRICTS.find((x) => x.key === d)!.label),
          }))}
        />

        <Hair />

        <div className="field-r">
          <div className="field-label px-1">{t("search.rooms")}</div>
          <div className="mt-2 flex gap-2">
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
        </div>

        <Hair />

        <Popover
          label={t("search.price")}
          value={
            search.priceMin === undefined && search.priceMax === undefined
              ? t("search.any")
              : `${formatAmd(price[0])} — ${formatAmd(price[1])}`
          }
          empty={search.priceMin === undefined && search.priceMax === undefined}
        >
          <RangeSlider
            min={bounds.price[0]}
            max={bounds.price[1]}
            step={search.deal === "sale" ? 500000 : 5000}
            value={price}
            unit="֏"
            format={formatAmd}
            onChange={([a, b]) => set({ priceMin: a, priceMax: b })}
          />
        </Popover>

        <div className="p-2">{submit}</div>
      </div>

      {showAdvanced && (
        <>
          <button type="button" onClick={() => setMore((m) => !m)} className="more-btn mt-4">
            {t("search.more")}
            <Chevron open={more} />
          </button>

          <div className={`more-panel ${more ? "is-open mt-3" : ""}`}>
            <div className="grid gap-x-10 gap-y-8 p-6 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <span className="field-label">{t("listings.floor")}</span>
                <div className="mt-4">
                  <RangeSlider
                    min={bounds.floor[0]}
                    max={bounds.floor[1]}
                    value={floor}
                    unit={t("unit.floorOf")}
                    onChange={([a, b]) => set({ floorMin: a, floorMax: b })}
                  />
                </div>
              </div>

              <div>
                <span className="field-label">{t("listings.area")}</span>
                <div className="mt-4">
                  <RangeSlider
                    min={bounds.area[0]}
                    max={bounds.area[1]}
                    value={area}
                    unit={t("unit.sqm")}
                    onChange={([a, b]) => set({ areaMin: a, areaMax: b })}
                  />
                </div>
              </div>

              <div>
                <span className="field-label">{t("listings.type")}</span>
                <div className="mt-4 flex flex-wrap gap-2">
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
              </div>

              <div>
                <span className="field-label">{t("listings.status")}</span>
                <div className="mt-4 flex flex-wrap gap-2">
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
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Hair() {
  return <span className="hairline" aria-hidden />;
}

function Popover({
  label,
  value,
  empty,
  children,
}: {
  label: string;
  value: string;
  empty: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="field-r relative">
      <button
        type="button"
        className="field-trigger"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="field-label">{label}</span>
        <span className="field-value">
          <span className={empty ? "text-muted" : ""}>{value}</span>
          <Chevron open={open} />
        </span>
      </button>
      {open && (
        <div className="panel-r absolute right-0 top-[calc(100%-6px)] z-50 w-[320px] p-5">
          {children}
        </div>
      )}
    </div>
  );
}
