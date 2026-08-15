import { createFileRoute, Link } from "@tanstack/react-router";
import { HERO_IMAGES } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useLocalizedMeta } from "@/lib/use-localized-meta";
import { useBooking } from "@/lib/booking";
import { defaultSearch } from "@/lib/filters";
import { SITE_URL } from "./__root";

const TITLE = { hy: "Մեր մասին | Rahana", en: "About us | Rahana", ru: "О нас | Rahana" };
const DESC = {
  hy: "Rahana՝ Երևանի անշարժ գույքի գործակալություն՝ ժամանակակից բնակարանների վաճառք և վարձակալություն։",
  en: "Rahana is a Yerevan estate agency handling the sale and rental of modern apartments.",
  ru: "Rahana — агентство недвижимости в Ереване: продажа и аренда современных квартир.",
};

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE.hy },
      { name: "description", content: DESC.hy },
      { property: "og:title", content: TITLE.hy },
      { property: "og:description", content: DESC.hy },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { name: "twitter:title", content: TITLE.hy },
      { name: "twitter:description", content: DESC.hy },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();
  useLocalizedMeta(TITLE, DESC);
  const booking = useBooking();

  return (
    <div className="pb-16 pt-32 sm:pt-36">
      <div className="container-r">
        <p className="label-caps">{t("home.about")}</p>
        <h1 className="t-section mt-3 max-w-3xl">{t("tagline")}</h1>
        <p className="t-lead mt-5 max-w-2xl text-muted">{t("about.lead")}</p>
      </div>

      <div className="container-r mt-12 grid gap-x-6 gap-y-10 md:grid-cols-2">
        <img
          src={HERO_IMAGES[1]}
          alt="Yerevan architecture"
          className="w-full rounded-card object-cover"
          style={{ aspectRatio: "4/3" }}
        />
        <div className="flex flex-col justify-center gap-6">
          {[
            { n: "01", hy: "Անձնական մոտեցում", en: "A personal approach", ru: "Личный подход" },
            { n: "02", hy: "Ստուգված գույք", en: "Verified property", ru: "Проверенные объекты" },
            {
              n: "03",
              hy: "Ուղեկցում մինչև բանալին",
              en: "With you to the keys",
              ru: "Сопровождение до ключей",
            },
          ].map((x) => (
            <div key={x.n} className="border-b border-line pb-5">
              <span className="label-caps text-gold">{x.n}</span>
              <p className="t-card mt-2">{x.en}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="container-r section-y">
        <div className="card-r flex flex-wrap items-center justify-between gap-6 bg-ink p-8 text-cream sm:p-12">
          <h2 className="t-sub max-w-lg">{t("nav.book")}</h2>
          <div className="flex gap-3">
            <button onClick={() => booking.open()} className="btn btn-gold">
              {t("nav.book")}
            </button>
            <Link to="/listings" search={defaultSearch} className="btn btn-white">
              {t("fav.browse")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
