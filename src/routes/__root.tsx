import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { I18nProvider, useI18n } from "@/lib/i18n";
import { SavedProvider } from "@/lib/saved";
import { BookingProvider } from "@/lib/booking";
import { FloatingNav } from "@/components/FloatingNav";
import { Footer } from "@/components/Footer";
import { BookingModal } from "@/components/BookingModal";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PropertyCard } from "@/components/PropertyCard";
import { PROPERTIES } from "@/lib/data";
import { defaultSearch } from "@/lib/filters";

function NotFoundInner() {
  const { t } = useI18n();
  return (
    <div className="container-r pb-16 pt-40">
      <p className="text-gold" style={{ fontSize: 120, fontWeight: 600, lineHeight: 1 }}>
        404
      </p>
      <h1 className="t-section mt-4">{t("404.title")}</h1>
      <p className="t-lead mt-3 max-w-xl text-muted">{t("404.text")}</p>
      <Link to="/listings" search={defaultSearch} className="btn btn-gold mt-6">
        {t("fav.browse")}
      </Link>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PROPERTIES.slice(0, 3).map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}

function NotFoundComponent() {
  return <NotFoundInner />;
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="t-sub">This page didn't load</h1>
        <p className="t-body mt-2 text-muted">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn btn-ink"
          >
            Try again
          </button>
          <a href="/" className="btn btn-outline">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

/** Canonical origin used for structured data and share cards. Override with VITE_SITE_URL. */
export const SITE_URL = import.meta.env["VITE_SITE_URL"] ?? "https://rahana.am";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Rahana — Անշարժ գույքի գործակալություն Երևանում" },
      {
        name: "description",
        content:
          "Բնակարանների վաճառք և վարձակալություն Երևանում՝ Rahana անշարժ գույքի գործակալություն։",
      },
      { name: "author", content: "Rahana" },
      { name: "theme-color", content: "#0D0D0F" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Rahana" },
      { property: "og:locale", content: "hy_AM" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "og:locale:alternate", content: "ru_RU" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600&family=Noto+Sans+Armenian:wght@400;500;600&display=swap",
      },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "RealEstateAgent",
          name: "Rahana",
          alternateName: "Ռահանա",
          url: SITE_URL,
          logo: `${SITE_URL}/apple-touch-icon.png`,
          image: `${SITE_URL}/og-image.png`,
          slogan: "Where your story starts",
          telephone: "+374 10 555 777",
          email: "hello@rahana.am",
          address: {
            "@type": "PostalAddress",
            streetAddress: "12 Northern Ave",
            addressLocality: "Yerevan",
            addressCountry: "AM",
          },
          areaServed: "Yerevan, Armenia",
          sameAs: ["https://www.instagram.com/rahana_agency"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="hy">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <SavedProvider>
          <BookingProvider>
            <FloatingNav />
            <main className="min-h-screen">
              {/* Required: nested routes render here. */}
              <Outlet />
            </main>
            <Footer />
            <BookingModal />
            <WhatsAppButton />
          </BookingProvider>
        </SavedProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
