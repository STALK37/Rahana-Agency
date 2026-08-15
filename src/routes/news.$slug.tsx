import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getNews, type NewsItem } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/news/$slug")({
  loader: ({ params }) => {
    const item = getNews(params.slug);
    if (!item) throw notFound();
    return { item };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article unavailable | Rahana" }, { name: "robots", content: "noindex" }],
      };
    }
    const { item } = loaderData;
    return {
      meta: [
        { title: `${item.title.hy} | Rahana` },
        { name: "description", content: item.excerpt.en },
        { property: "og:title", content: item.title.en },
        { property: "og:description", content: item.excerpt.en },
        { property: "og:image", content: item.cover },
        { name: "twitter:image", content: item.cover },
      ],
    };
  },
  component: NewsArticle,
});

function NewsArticle() {
  const { item } = Route.useLoaderData() as { item: NewsItem };
  const { t, tl } = useI18n();

  return (
    <article className="pb-16 pt-32 sm:pt-36">
      <div className="container-r max-w-3xl">
        <Link
          to="/news"
          className="t-meta text-muted transition-colors duration-200 hover:text-gold"
        >
          ← {t("home.news")}
        </Link>
        <p className="label-caps mt-6">{item.date}</p>
        <h1 className="t-section mt-3">{tl(item.title)}</h1>
      </div>
      <div className="container-r mt-8">
        <img
          src={item.cover}
          alt={tl(item.title)}
          className="w-full rounded-card object-cover"
          style={{ maxHeight: 520 }}
        />
      </div>
      <div className="container-r mt-8 max-w-3xl">
        <p className="t-lead">{tl(item.excerpt)}</p>
        <p className="t-body mt-5 text-muted">{tl(item.body)}</p>
      </div>
    </article>
  );
}
