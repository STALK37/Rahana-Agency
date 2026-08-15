import { Link } from "@tanstack/react-router";
import { ChevronDown, Heart, Menu, Phone, Scale, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { useI18n, LANGS } from "@/lib/i18n";
import { useSaved } from "@/lib/saved";
import { useBooking } from "@/lib/booking";
import { DISTRICTS } from "@/lib/data";
import { defaultSearch } from "@/lib/filters";

export function FloatingNav() {
  const { t, tl, lang, setLang } = useI18n();
  const { favourites, compare } = useSaved();
  const booking = useBooking();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const dealLinks = [
    { label: t("nav.buy"), search: { deal: "sale" as const } },
    { label: t("nav.rent"), search: { deal: "rent" as const } },
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6 sm:pt-6">
      <div
        ref={ref}
        className="nav-pill pointer-events-auto mx-auto flex max-w-[1520px] items-center gap-2 px-3 py-2 sm:gap-4 sm:px-5 sm:py-3"
      >
        <Logo size={52} />

        {/* desktop nav */}
        <nav className="ml-2 hidden items-center gap-1 lg:flex">
          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === "deal" ? null : "deal")}
              className="t-meta flex items-center gap-1 rounded-pill px-4 py-2 transition-colors duration-200 hover:text-gold"
            >
              {t("nav.listings")}
              <ChevronDown size={14} className="text-muted" />
            </button>
            {openMenu === "deal" && (
              <div className="fade-in-drop absolute left-0 top-full mt-2 w-56 rounded-card bg-surface p-2 shadow-soft">
                {dealLinks.map((d) => (
                  <Link
                    key={d.label}
                    to="/listings"
                    search={{ ...defaultSearch, ...d.search }}
                    onClick={() => setOpenMenu(null)}
                    className="t-body block rounded-input px-3 py-2 transition-colors duration-200 hover:bg-surface-alt"
                  >
                    {d.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === "district" ? null : "district")}
              className="t-meta flex items-center gap-1 rounded-pill px-4 py-2 transition-colors duration-200 hover:text-gold"
            >
              {t("search.district")}
              <ChevronDown size={14} className="text-muted" />
            </button>
            {openMenu === "district" && (
              <div className="fade-in-drop absolute left-0 top-full mt-2 w-56 rounded-card bg-surface p-2 shadow-soft">
                {DISTRICTS.map((d) => (
                  <Link
                    key={d.key}
                    to="/listings"
                    search={{ ...defaultSearch, districts: d.key }}
                    onClick={() => setOpenMenu(null)}
                    className="t-body block rounded-input px-3 py-2 transition-colors duration-200 hover:bg-surface-alt"
                  >
                    {tl(d.label)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/calculator"
            className="t-meta rounded-pill px-4 py-2 transition-colors duration-200 hover:text-gold"
          >
            {t("nav.calculator")}
          </Link>
          <Link
            to="/about"
            className="t-meta rounded-pill px-4 py-2 transition-colors duration-200 hover:text-gold"
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/news"
            className="t-meta rounded-pill px-4 py-2 transition-colors duration-200 hover:text-gold"
          >
            {t("nav.news")}
          </Link>
          <Link
            to="/contact"
            className="t-meta rounded-pill px-4 py-2 transition-colors duration-200 hover:text-gold"
          >
            {t("nav.contact")}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* language */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setOpenMenu(openMenu === "lang" ? null : "lang")}
              className="t-meta flex items-center gap-1 rounded-pill px-3 py-2 transition-colors duration-200 hover:text-gold"
            >
              {LANGS.find((l) => l.code === lang)?.label}
              <ChevronDown size={14} className="text-muted" />
            </button>
            {openMenu === "lang" && (
              <div className="fade-in-drop absolute right-0 top-full mt-2 w-32 rounded-card bg-surface p-2 shadow-soft">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setOpenMenu(null);
                    }}
                    className={`t-meta block w-full rounded-input px-3 py-2 text-left transition-colors duration-200 hover:bg-surface-alt ${
                      l.code === lang ? "text-gold" : ""
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <a
            href="tel:+37410555777"
            aria-label={t("contact.phone")}
            className="hidden size-10 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-alt sm:grid"
          >
            <Phone size={18} />
          </a>
          <Link
            to="/favourites"
            aria-label={t("nav.favourites")}
            className="relative grid size-10 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-alt"
          >
            <Heart size={18} />
            {favourites.length > 0 && <Badge n={favourites.length} />}
          </Link>
          <Link
            to="/compare"
            aria-label={t("nav.compare")}
            className="relative grid size-10 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-alt"
          >
            <Scale size={18} />
            {compare.length > 0 && <Badge n={compare.length} />}
          </Link>

          <button onClick={() => booking.open()} className="btn btn-gold hidden md:inline-flex">
            {t("nav.book")}
          </button>

          <button
            onClick={() => setMobile(true)}
            aria-label={t("nav.menu")}
            className="grid size-10 place-items-center rounded-full transition-colors duration-200 hover:bg-surface-alt lg:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {mobile && (
        <div
          className="pointer-events-auto fixed inset-0 z-50 bg-ink/40"
          onClick={() => setMobile(false)}
        >
          <div
            className="absolute inset-x-4 top-4 rounded-card bg-cream p-6 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <Logo size={52} />
              <button
                onClick={() => setMobile(false)}
                aria-label="Close"
                className="grid size-10 place-items-center rounded-full bg-surface-alt"
              >
                <X size={18} />
              </button>
            </div>
            <nav className="mt-6 flex flex-col">
              {[
                { to: "/listings", label: t("nav.listings") },
                { to: "/calculator", label: t("nav.calculator") },
                { to: "/about", label: t("nav.about") },
                { to: "/news", label: t("nav.news") },
                { to: "/contact", label: t("nav.contact") },
              ].map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobile(false)}
                  className="t-lead border-b border-line py-3"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-5 flex items-center gap-2">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`btn ${l.code === lang ? "btn-ink" : "btn-outline"} px-4 py-2 text-sm`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setMobile(false);
                booking.open();
              }}
              className="btn btn-gold mt-4 w-full"
            >
              {t("nav.book")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-gold text-[10px] font-medium text-white">
      {n}
    </span>
  );
}
