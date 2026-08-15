import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { PropertyCard } from "@/components/PropertyCard";
import { PROPERTIES, districtLabel, formatAmd } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useSaved } from "@/lib/saved";
import { defaultSearch } from "@/lib/filters";

export function SavedScreen({ tab }: { tab: "wishlist" | "compare" }) {
  const { t, tl, lang } = useI18n();
  const { favourites, compare, toggleCompare } = useSaved();

  const favItems = PROPERTIES.filter((p) => favourites.includes(p.id));
  const cmpItems = PROPERTIES.filter((p) => compare.includes(p.id));

  return (
    <div className="container-r pb-16 pt-32 sm:pt-36">
      <h1 className="t-section">{t("fav.title")}</h1>

      <div className="mt-6 inline-flex rounded-pill bg-surface-alt p-1">
        <Link to="/favourites" className={`btn ${tab === "wishlist" ? "btn-ink" : ""} px-6 py-2.5`}>
          {t("fav.wishlist")} ({favourites.length})
        </Link>
        <Link to="/compare" className={`btn ${tab === "compare" ? "btn-ink" : ""} px-6 py-2.5`}>
          {t("fav.compare")} ({compare.length})
        </Link>
      </div>

      {tab === "wishlist" &&
        (favItems.length === 0 ? (
          <Empty text={t("fav.empty")} cta={t("fav.browse")} />
        ) : (
          <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {favItems.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        ))}

      {tab === "compare" &&
        (cmpItems.length === 0 ? (
          <Empty text={t("compare.empty")} cta={t("fav.browse")} />
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr>
                  <th className="label-caps w-40 p-4" />
                  {cmpItems.map((p) => (
                    <th key={p.id} className="p-4 align-top">
                      <div className="card-r overflow-hidden bg-surface-alt">
                        <img
                          src={p.images[0]}
                          alt={tl(p.title)}
                          className="aspect-[4/3] w-full object-cover"
                        />
                      </div>
                      <div className="mt-3 flex items-start gap-2">
                        <Link
                          to="/listings/$id"
                          params={{ id: p.id }}
                          className="t-body transition-colors duration-300 hover:text-gold"
                        >
                          {tl(p.title)}
                        </Link>
                        <button
                          onClick={() => toggleCompare(p.id)}
                          aria-label="Remove"
                          className="ml-auto grid size-7 shrink-0 place-items-center rounded-full bg-surface-alt"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: t("search.price"), value: (id: string) => rowPrice(id) },
                  {
                    label: t("search.district"),
                    value: (id: string) => districtLabel(find(id).district, lang),
                  },
                  { label: t("search.rooms"), value: (id: string) => String(find(id).rooms) },
                  {
                    label: t("listings.area"),
                    value: (id: string) => `${find(id).area} ${t("unit.sqm")}`,
                  },
                  {
                    label: t("listings.floor"),
                    value: (id: string) => `${find(id).floor}/${find(id).floors}`,
                  },
                  { label: t("prop.building"), value: (id: string) => tl(find(id).buildingType) },
                  { label: t("prop.condition"), value: (id: string) => tl(find(id).condition) },
                ].map((row) => (
                  <tr key={row.label} className="border-t border-line">
                    <td className="t-meta p-4 text-muted">{row.label}</td>
                    {cmpItems.map((p) => (
                      <td key={p.id} className="t-body p-4">
                        {row.value(p.id)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
    </div>
  );

  function find(id: string) {
    return PROPERTIES.find((p) => p.id === id)!;
  }
  function rowPrice(id: string) {
    const p = find(id);
    return `${formatAmd(p.price)}${p.deal === "rent" ? ` ${t("unit.month")}` : ""}`;
  }
}

function Empty({ text, cta }: { text: string; cta: string }) {
  return (
    <div className="card-r mt-10 p-10 text-center sm:p-16">
      <p className="t-lead mx-auto max-w-lg text-muted">{text}</p>
      <Link to="/listings" search={defaultSearch} className="btn btn-gold mt-6">
        {cta}
      </Link>
    </div>
  );
}
