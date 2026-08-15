import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="bg-footer text-cream">
      <div className="container-r" style={{ paddingBlock: 64 }}>
        <div className="grid gap-10 md:grid-cols-[auto_1fr_1fr_1fr]">
          <div>
            <Logo size={72} inverted />
            <p className="t-meta mt-4 max-w-56 text-white/60">{t("tagline")}</p>
          </div>

          <div>
            <p className="label-caps text-white/50">{t("footer.pages")}</p>
            <ul className="mt-4 space-y-2">
              {[
                { to: "/listings", label: t("nav.listings") },
                { to: "/calculator", label: t("nav.calculator") },
                { to: "/favourites", label: t("nav.favourites") },
                { to: "/compare", label: t("nav.compare") },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="t-body text-white/80 transition-colors duration-200 hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-caps text-white/50">Rahana</p>
            <ul className="mt-4 space-y-2">
              {[
                { to: "/about", label: t("nav.about") },
                { to: "/news", label: t("nav.news") },
                { to: "/contact", label: t("nav.contact") },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="t-body text-white/80 transition-colors duration-200 hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label-caps text-white/50">{t("nav.contact")}</p>
            <ul className="mt-4 space-y-2 text-white/80">
              <li className="t-body">
                <a
                  href="tel:+37410555777"
                  className="transition-colors duration-200 hover:text-gold"
                >
                  +374 10 555 777
                </a>
              </li>
              <li className="t-body">
                <a
                  href="mailto:hello@rahana.am"
                  className="transition-colors duration-200 hover:text-gold"
                >
                  hello@rahana.am
                </a>
              </li>
              <li className="t-meta text-white/60">Yerevan, 12 Northern Ave</li>
              <li className="t-meta text-white/60">{t("contact.hoursValue")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="t-meta text-white/50">
            © {new Date().getFullYear()} RAHANA. {t("footer.rights")}.
          </p>
          <p className="label-caps text-white/40">{t("tagline.short")}</p>
        </div>
      </div>
    </footer>
  );
}
