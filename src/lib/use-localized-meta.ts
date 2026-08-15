import { useEffect } from "react";
import { useI18n } from "@/lib/i18n";

type L = { hy: string; en: string; ru: string };

/**
 * Route head() is rendered server-side in Armenian (the default locale).
 * Once the visitor switches language, we mirror the localized title and
 * description into the live document.
 */
export function useLocalizedMeta(title: L, description?: L) {
  const { lang } = useI18n();
  useEffect(() => {
    document.title = title[lang];
    if (description) {
      const el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute("content", description[lang]);
    }
  }, [lang, title, description]);
}
