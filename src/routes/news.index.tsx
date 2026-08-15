import { createFileRoute, Link } from "@tanstack/react-router";
import { NEWS } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/news/")({
  head: () => ({
    meta: [
      { title: "Նորություններ | Rahana" },
      {
        name: "description",
        content: "Yerevan property market notes, renting guides and Rahana agency news.",
      },
      { property: "og:title", content: "Նորություններ | Rahana" },
      { property: "og:description", content: "Yerevan property market notes and agency news." },
    ],
  }),
  component: NewsIndex,
});

function NewsIndex() {
  const { t, tl } = useI18n();
  return (
    <div className="container-r pb-16 pt-32 sm:pt-36">
      <h1 className="t-section">{t("home.news")}</h1>
      <div className="mt-10 grid gap-x-6 gap-y-10 md:grid-cols-3">
        {NEWS.map((n) => (
          <Link
            key={n.slug}
            to="/news/$slug"
            params={{ slug: n.slug }}
            className="card-r zoom-frame block"
          >
            <img
              src={n.cover}
              alt={tl(n.title)}
              loading="lazy"
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="p-5">
              <p className="label-caps">{n.date}</p>
              <h2 className="t-card mt-2">{tl(n.title)}</h2>
              <p className="t-meta mt-2 text-muted">{tl(n.excerpt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
