import { createFileRoute } from "@tanstack/react-router";
import { PaymentPlanner } from "@/components/PaymentPlanner";
import { useI18n } from "@/lib/i18n";
import { useLocalizedMeta } from "@/lib/use-localized-meta";
import { SITE_URL } from "./__root";

const TITLE = { hy: "Հաշվիչ | Rahana", en: "Calculator | Rahana", ru: "Калькулятор | Rahana" };
const DESC = {
  hy: "Պլանավորեք գնումը Երևանում՝ ամբողջական վճարում, մասնաբաժանում կամ վարձակալության մատչելիություն։",
  en: "Plan a purchase in Yerevan: full payment with agency fee, installment schedule or rental affordability.",
  ru: "Спланируйте покупку в Ереване: полная оплата, рассрочка или доступность аренды.",
};

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: TITLE.hy },
      { name: "description", content: DESC.hy },
      { property: "og:title", content: TITLE.hy },
      { property: "og:description", content: DESC.hy },
      { property: "og:url", content: `${SITE_URL}/calculator` },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { name: "twitter:title", content: TITLE.hy },
      { name: "twitter:description", content: DESC.hy },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/calculator` }],
  }),
  component: Calculator,
});

function Calculator() {
  const { t } = useI18n();
  useLocalizedMeta(TITLE, DESC);
  return (
    <div className="container-r pb-16 pt-32 sm:pt-36">
      <h1 className="t-section">{t("calc.title")}</h1>
      <p className="t-lead mt-3 max-w-2xl text-muted">{t("calc.sub")}</p>
      <div className="mt-10">
        <PaymentPlanner />
      </div>
    </div>
  );
}
