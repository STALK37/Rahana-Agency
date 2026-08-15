import { Link } from "@tanstack/react-router";
import { Heart, Scale } from "lucide-react";
import { PinThin } from "./ui/Icons";
import { districtLabel, formatAmd, type Property } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useSaved } from "@/lib/saved";

export function PropertyCard({
  property,
  view = "grid",
}: {
  property: Property;
  view?: "grid" | "list";
}) {
  const { t, tl, lang } = useI18n();
  const { isFavourite, isCompared, toggleFavourite, toggleCompare } = useSaved();

  return (
    <article
      className={`card-r group relative ${view === "list" ? "grid gap-0 sm:grid-cols-[320px_1fr]" : ""}`}
    >
      <div className="relative">
        <span className="glass-badge absolute left-4 top-4 z-10">
          {t(property.status === "available" ? "status.available" : "status.reserved")}
        </span>

        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <button
            aria-label={t("nav.favourites")}
            aria-pressed={isFavourite(property.id)}
            onClick={() => toggleFavourite(property.id)}
            className="glass-icon"
            style={isFavourite(property.id) ? { color: "var(--gold)" } : undefined}
          >
            <Heart size={15} fill={isFavourite(property.id) ? "currentColor" : "none"} />
          </button>
          <button
            aria-label={t("nav.compare")}
            aria-pressed={isCompared(property.id)}
            onClick={() => toggleCompare(property.id)}
            className="glass-icon"
            style={isCompared(property.id) ? { color: "var(--gold)" } : undefined}
          >
            <Scale size={15} />
          </button>
        </div>

        <Link
          to="/listings/$id"
          params={{ id: property.id }}
          className={`zoom-frame block ${view === "list" ? "h-full" : ""}`}
          style={{ borderRadius: view === "list" ? "20px 0 0 20px" : "20px 20px 0 0" }}
        >
          <img
            src={property.images[0]}
            alt={tl(property.title)}
            loading="lazy"
            className={`w-full object-cover ${view === "list" ? "h-56 sm:h-full" : "aspect-[4/3]"}`}
          />
        </Link>
      </div>

      <div className="flex flex-col gap-2 p-5">
        <p style={{ fontSize: 22, fontWeight: 500, color: "var(--gold)" }}>
          {formatAmd(property.price)}
          {property.deal === "rent" && (
            <span className="t-meta text-muted"> {t("unit.month")}</span>
          )}
        </p>

        <Link
          to="/listings/$id"
          params={{ id: property.id }}
          className="t-card transition-colors duration-300 hover:text-gold"
        >
          {tl(property.title)}
        </Link>

        <p className="t-meta text-muted">
          {property.rooms} {t("unit.room")} · {property.area} {t("unit.sqm")} · {property.floor}/
          {property.floors} {t("unit.floorOf")}
        </p>

        <p className="t-meta flex items-center gap-1.5 text-muted">
          <PinThin />
          {districtLabel(property.district, lang)} · {tl(property.address)}
        </p>
      </div>
    </article>
  );
}
