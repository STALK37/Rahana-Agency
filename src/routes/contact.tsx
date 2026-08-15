import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { MapEmbed } from "@/components/MapEmbed";
import { useI18n } from "@/lib/i18n";
import { useLocalizedMeta } from "@/lib/use-localized-meta";
import { SITE_URL } from "./__root";

const TITLE = { hy: "Կապ մեզ հետ | Rahana", en: "Contact | Rahana", ru: "Контакты | Rahana" };
const DESC = {
  hy: "Զանգահարեք, գրեք կամ այցելեք Rahana-ի գրասենյակ Երևանում։ Երկ–Շաբ, 10:00–19:00։",
  en: "Call, write or visit the Rahana office in Yerevan. Mon–Sat, 10:00–19:00.",
  ru: "Позвоните, напишите или посетите офис Rahana в Ереване. Пн–Сб, 10:00–19:00.",
};

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE.hy },
      { name: "description", content: DESC.hy },
      { property: "og:title", content: TITLE.hy },
      { property: "og:description", content: DESC.hy },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { property: "og:image", content: `${SITE_URL}/og-image.png` },
      { name: "twitter:title", content: TITLE.hy },
      { name: "twitter:description", content: DESC.hy },
      { name: "twitter:image", content: `${SITE_URL}/og-image.png` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
  }),
  component: Contact,
});

function Contact() {
  const { t } = useI18n();
  useLocalizedMeta(TITLE, DESC);
  const [sent, setSent] = useState(false);

  const items = [
    { icon: MapPin, label: t("contact.address"), value: "Yerevan, 12 Northern Ave" },
    { icon: Phone, label: t("contact.phone"), value: "+374 10 555 777", href: "tel:+37410555777" },
    {
      icon: Mail,
      label: t("contact.email"),
      value: "hello@rahana.am",
      href: "mailto:hello@rahana.am",
    },
    { icon: Clock, label: t("contact.hours"), value: t("contact.hoursValue") },
  ];

  return (
    <div className="pb-16 pt-32 sm:pt-36">
      <div className="container-r">
        <h1 className="t-section">{t("contact.title")}</h1>

        <div className="mt-10 grid gap-x-6 gap-y-10 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((i) => (
              <div key={i.label} className="card-r p-6">
                <span className="grid size-10 place-items-center rounded-full bg-surface-alt text-gold">
                  <i.icon size={18} />
                </span>
                <p className="label-caps mt-4">{i.label}</p>
                {i.href ? (
                  <a
                    href={i.href}
                    className="t-body mt-1 block transition-colors duration-200 hover:text-gold"
                  >
                    {i.value}
                  </a>
                ) : (
                  <p className="t-body mt-1">{i.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="card-r p-6 sm:p-8">
            {sent ? (
              <p className="t-lead text-gold">{t("form.sent")}</p>
            ) : (
              <form
                className="flex flex-col gap-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <input className="input-pill" placeholder={t("form.first")} required />
                  <input className="input-pill" placeholder={t("form.last")} required />
                </div>
                <input type="email" className="input-pill" placeholder={t("form.email")} required />
                <input
                  className="input-pill"
                  placeholder={t("form.phone")}
                  defaultValue="+374 "
                  required
                />
                <textarea className="input-r min-h-32" placeholder={t("form.message")} />
                <button className="btn btn-ink w-full">{t("form.send")}</button>
                <p className="t-meta text-muted">{t("form.consent")}</p>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="mt-16">
        <MapEmbed query="Yerevan office" height={440} />
      </div>
    </div>
  );
}
