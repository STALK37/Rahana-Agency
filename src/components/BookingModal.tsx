import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { useBooking } from "@/lib/booking";

const COUNTRIES = [
  { code: "+374", label: "🇦🇲 +374" },
  { code: "+7", label: "🇷🇺 +7" },
  { code: "+1", label: "🇺🇸 +1" },
  { code: "+44", label: "🇬🇧 +44" },
  { code: "+33", label: "🇫🇷 +33" },
];

export function BookingModal() {
  const { t } = useI18n();
  const { isOpen, close, subject } = useBooking();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSent(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={close}
    >
      <div
        className="relative w-full max-w-lg rounded-card bg-surface p-6 shadow-soft sm:p-8"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={close}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-surface-alt transition-colors duration-300 hover:bg-line"
        >
          <X size={18} />
        </button>

        <h2 className="t-sub pr-10">{t("nav.book")}</h2>
        {subject && <p className="t-meta mt-1 text-muted">{subject}</p>}

        {sent ? (
          <p className="t-lead mt-8 text-gold">{t("form.sent")}</p>
        ) : (
          <form
            className="mt-6 flex flex-col gap-3"
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
            <div className="flex gap-3">
              <select className="input-pill w-32 shrink-0" defaultValue="+374">
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <input className="input-pill" placeholder={t("form.phone")} required />
            </div>
            <textarea className="input-r min-h-28" placeholder={t("form.message")} />
            <button type="submit" className="btn btn-ink mt-1 w-full">
              {t("form.send")}
            </button>
            <p className="t-meta text-muted">{t("form.consent")}</p>
          </form>
        )}
      </div>
    </div>
  );
}
