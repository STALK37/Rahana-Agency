import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroCarousel } from "@/components/HeroCarousel";
import { SearchWidget } from "@/components/SearchWidget";
import { PropertyCard } from "@/components/PropertyCard";
import { MapEmbed } from "@/components/MapEmbed";
import { NEWS, PROPERTIES } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useLocalizedMeta } from "@/lib/use-localized-meta";
import { defaultSearch } from "@/lib/filters";
import { SITE_URL } from "./__root";

const TITLE = {
  hy: "Rahana — Անշարժ գույքի գործակալություն Երևանում",
  en: "Rahana — Real estate agency in Yerevan",
  ru: "Rahana — Агентство недвижимости в Ереване",
};
const DESC = {
  hy: "Բնակարանների վաճառք և վարձակալություն Երևանում՝ Կենտրոն, Արաբկիր, Քանաքեռ, Ավան, Դավթաշեն։",
  en: "Apartments for sale and rent in Yerevan: Center, Arabkir, Kanaker, Avan, Davtashen.",
  ru: "Продажа и аренда квартир в Ереване: Центр, Арабкир, Канакер, Аван, Давташен.",
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE.hy },
      { name: "description", content: DESC.hy },
      { property: "og:title", content: TITLE.hy },
      { property: "og:description", content: DESC.hy },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { name: "twitter:title", content: TITLE.hy },
      { name: "twitter:description", content: DESC.hy },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Index,
});

function Index() {
  const { t } = useI18n();
  useLocalizedMeta(TITLE, DESC);
  const featured = PROPERTIES.slice(0, 6);

  return (
    <>
      <HeroCarousel />

      <div className="container-r">
        <SearchWidget />
      </div>

      <section className="container-r section-y">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="t-section">{t("home.featured")}</h2>
            <p className="t-lead mt-2 max-w-xl text-muted">{t("home.featured.sub")}</p>
          </div>
          <Link to="/listings" search={defaultSearch} className="btn btn-outline">
            {t("home.viewAll")}
          </Link>
        </div>

        <div className="mt-10 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="container-r section-y grid gap-10 md:grid-cols-2 md:gap-x-6">
          <div>
            <p className="label-caps text-white/50">{t("home.about")}</p>
            <h2 className="t-section mt-4">{t("tagline")}</h2>
          </div>
          <div>
            <p className="t-lead text-white/70">{t("about.lead")}</p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { n: "12", l: t("listings.title") },
                { n: "5", l: t("search.district") },
                { n: "9", l: "years" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="t-sub text-gold">{s.n}</p>
                  <p className="t-meta text-white/60">{s.l}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn btn-gold mt-8">
              {t("nav.about")}
            </Link>
          </div>
        </div>
      </section>

      <section className="container-r section-y">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="t-section">{t("home.news")}</h2>
          <Link to="/news" className="btn btn-outline">
            {t("home.viewAll")}
          </Link>
        </div>
        <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-3">
          {NEWS.map((n) => (
            <NewsCard key={n.slug} slug={n.slug} />
          ))}
        </div>
      </section>

      <section>
        <div className="container-r">
          <h2 className="t-section mb-8">{t("home.map")}</h2>
        </div>
        <MapEmbed query="Yerevan" height={480} />
      </section>
    </>
  );
}

function NewsCard({ slug }: { slug: string }) {
  const { tl } = useI18n();
  const item = NEWS.find((n) => n.slug === slug)!;
  return (
    <Link to="/news/$slug" params={{ slug }} className="card-r zoom-frame block">
      <img
        src={item.cover}
        alt={tl(item.title)}
        loading="lazy"
        className="aspect-[16/10] w-full object-cover"
      />
      <div className="p-5">
        <p className="label-caps">{item.date}</p>
        <h3 className="t-card mt-2">{tl(item.title)}</h3>
        <p className="t-meta mt-2 text-muted">{tl(item.excerpt)}</p>
      </div>
    </Link>
  );
}
