import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, MapPin, Scale, School, ShoppingCart, TrainFront, Trees } from "lucide-react";
import { Lightbox } from "@/components/Lightbox";
import { PropertyCard } from "@/components/PropertyCard";
import { PaymentPlanner } from "@/components/PaymentPlanner";
import { MapEmbed } from "@/components/MapEmbed";
import {
  PROPERTIES,
  districtLabel,
  formatAmd,
  getProperty,
  type Poi,
  type Property,
  type RoomSpec,
} from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useSaved } from "@/lib/saved";
import { useBooking } from "@/lib/booking";
import { defaultSearch } from "@/lib/filters";
import { SITE_URL } from "./__root";

export const Route = createFileRoute("/listings/$id")({
  loader: ({ params }) => {
    const property = getProperty(params.id);
    if (!property) throw notFound();
    return { property };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Property unavailable | Rahana" }, { name: "robots", content: "noindex" }],
      };
    }
    const p = loaderData.property;
    const title = `${p.title.hy} | Rahana`;
    const description = p.description.hy;
    const url = `${SITE_URL}/listings/${params.id}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: p.images[0]! },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: p.images[0]! },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: PropertyPage,
});

const POI_ICON = {
  school: School,
  metro: TrainFront,
  park: Trees,
  supermarket: ShoppingCart,
};

function PropertyPage() {
  const { property } = Route.useLoaderData() as { property: Property };
  const { t, tl, lang } = useI18n();
  const { isFavourite, isCompared, toggleFavourite, toggleCompare } = useSaved();
  const booking = useBooking();
  const [lightbox, setLightbox] = useState<number | null>(null);
  useEffect(() => {
    document.title = `${property.title[lang]} | Rahana`;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", property.description[lang]);
  }, [lang, property]);

  const similar = PROPERTIES.filter(
    (p) =>
      p.id !== property.id &&
      p.district === property.district &&
      (Math.abs(p.rooms - property.rooms) <= 1 || Math.abs(p.area - property.area) <= 30),
  ).slice(0, 3);

  const specs: [string, string][] = [
    [t("search.district"), districtLabel(property.district, lang)],
    [t("search.rooms"), String(property.rooms)],
    [t("listings.area"), `${property.area} ${t("unit.sqm")}`],
    [t("listings.floor"), `${property.floor}/${property.floors}`],
    [t("prop.building"), tl(property.buildingType)],
    [t("prop.condition"), tl(property.condition)],
  ];

  return (
    <div className="pb-16 pt-28 sm:pt-32">
      <div className="container-r">
        <Link
          to="/listings"
          search={defaultSearch}
          className="t-meta text-muted transition-colors duration-200 hover:text-gold"
        >
          ← {t("prop.back")}
        </Link>

        <div className="mt-4 grid gap-2 sm:grid-cols-[2fr_1fr]">
          <button
            onClick={() => setLightbox(0)}
            className="zoom-frame overflow-hidden rounded-card"
          >
            <img
              src={property.images[0]}
              alt={tl(property.title)}
              className="h-full max-h-[540px] w-full object-cover"
            />
          </button>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            {property.images.slice(1, 3).map((src: string, i: number) => (
              <button
                key={src}
                onClick={() => setLightbox(i + 1)}
                className="zoom-frame overflow-hidden rounded-card"
              >
                <img src={src} alt="" className="h-full max-h-[266px] w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        {property.images.length > 3 && (
          <div className="mt-2 flex gap-2 overflow-x-auto">
            {property.images.slice(3).map((src: string, i: number) => (
              <button
                key={src}
                onClick={() => setLightbox(i + 3)}
                className="shrink-0 overflow-hidden rounded-card"
              >
                <img src={src} alt="" className="h-24 w-36 object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-x-6 gap-y-10 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-caps">
                {t(property.deal === "sale" ? "nav.buy" : "nav.rent")}
              </span>
              <span
                className={`t-meta rounded-pill px-3 py-1 ${
                  property.status === "available" ? "bg-surface-alt" : "bg-ink text-cream"
                }`}
              >
                {t(property.status === "available" ? "status.available" : "status.reserved")}
              </span>
            </div>
            <h1 className="t-section mt-3">{tl(property.title)}</h1>
            <p className="t-meta mt-2 flex items-center gap-2 text-muted">
              <MapPin size={15} /> {tl(property.address)}, {districtLabel(property.district, lang)}
            </p>
            <p className="t-lead mt-5 max-w-2xl text-muted">{tl(property.description)}</p>

            <h2 className="t-sub mt-12">{t("prop.specs")}</h2>
            <dl className="mt-5 grid gap-x-6 sm:grid-cols-2">
              {specs.map(([k, v]) => (
                <div
                  key={k}
                  className="flex items-baseline justify-between border-b border-line py-3"
                >
                  <dt className="t-meta text-muted">{k}</dt>
                  <dd className="t-body">{v}</dd>
                </div>
              ))}
            </dl>

            <h2 className="t-sub mt-12">{t("prop.layout")}</h2>
            <div className="card-r mt-5 overflow-hidden">
              <table className="w-full text-left">
                <tbody>
                  {property.layout.map((r: RoomSpec) => (
                    <tr key={tl(r.name)} className="border-b border-line last:border-0">
                      <td className="t-body px-5 py-3">{tl(r.name)}</td>
                      <td className="t-body px-5 py-3 text-right">
                        {r.area} {t("unit.sqm")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="t-sub mt-12">{t("prop.calc")}</h2>
            <div className="mt-5">
              <PaymentPlanner
                initialPrice={property.price}
                initialTab={property.deal === "rent" ? "rental" : "installment"}
                compact
              />
            </div>
          </div>

          {/* Sticky price panel */}
          <aside className="h-fit lg:sticky lg:top-32">
            <div className="card-r p-6 shadow-soft">
              <p className="label-caps">{t("search.price")}</p>
              <p className="t-hero text-gold" style={{ fontSize: 40 }}>
                {formatAmd(property.price)}
              </p>
              {property.deal === "rent" && <p className="t-meta text-muted">{t("unit.month")}</p>}

              <button
                onClick={() => booking.open(tl(property.title))}
                className="btn btn-gold mt-6 w-full"
              >
                {t("nav.book")}
              </button>
              <a href="tel:+37410555777" className="btn btn-outline mt-2 w-full">
                +374 10 555 777
              </a>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => toggleFavourite(property.id)}
                  className={`btn flex-1 ${isFavourite(property.id) ? "btn-ink" : "btn-outline"}`}
                >
                  <Heart size={16} fill={isFavourite(property.id) ? "currentColor" : "none"} />
                  {t("nav.favourites")}
                </button>
                <button
                  onClick={() => toggleCompare(property.id)}
                  className={`btn flex-1 ${isCompared(property.id) ? "btn-ink" : "btn-outline"}`}
                >
                  <Scale size={16} />
                  {t("nav.compare")}
                </button>
              </div>
            </div>

            <div className="card-r mt-6 p-6">
              <p className="label-caps">{t("prop.nearby")}</p>
              <ul className="mt-4 space-y-3">
                {property.pois.map((poi: Poi) => {
                  const Icon = POI_ICON[poi.kind];
                  return (
                    <li key={poi.kind} className="flex items-center gap-3">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-surface-alt text-gold">
                        <Icon size={16} />
                      </span>
                      <span className="t-body">{tl(poi.name)}</span>
                      <span className="t-meta ml-auto text-muted">{poi.distance}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <section className="mt-16">
        <div className="container-r">
          <h2 className="t-sub mb-6">{t("prop.location")}</h2>
        </div>
        <MapEmbed query={tl(property.address)} height={420} />
      </section>

      {similar.length > 0 && (
        <section className="container-r section-y">
          <h2 className="t-section">{t("prop.similar")}</h2>
          <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </section>
      )}

      {lightbox !== null && (
        <Lightbox
          images={property.images}
          index={lightbox}
          onIndex={setLightbox}
          onClose={() => setLightbox(null)}
          alt={tl(property.title)}
        />
      )}
    </div>
  );
}
