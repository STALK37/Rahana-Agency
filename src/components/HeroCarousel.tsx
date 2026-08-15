import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { PROPERTIES } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

const SLIDES = [PROPERTIES[0]!, PROPERTIES[6]!, PROPERTIES[8]!, PROPERTIES[4]!];
const DURATION = 6000;
const TICK = 50;

export function HeroCarousel() {
  const { t, tl } = useI18n();
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p + TICK >= DURATION) {
          setIndex((i) => (i + 1) % SLIDES.length);
          return 0;
        }
        return p + TICK;
      });
    }, TICK);
    return () => clearInterval(id);
  }, []);

  const slide = SLIDES[index]!;

  return (
    <section className="relative h-[86vh] min-h-[560px] w-full overflow-hidden">
      {SLIDES.map((s, i) => (
        <img
          key={s.id}
          src={s.images[0]}
          alt={tl(s.title)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1000ms] ease-linear"
          style={{ opacity: i === index ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.4)" }} />

      <div className="container-r relative flex h-full flex-col justify-end pb-20 sm:pb-24">
        <p className="label-caps" style={{ color: "rgba(255,255,255,0.6)" }}>
          {t("tagline.short")}
        </p>
        <h1 className="t-hero mt-4 max-w-4xl text-white">{tl(slide.title)}</h1>
        <p className="t-lead mt-4 max-w-2xl" style={{ color: "rgba(255,255,255,0.6)" }}>
          {tl(slide.description)}
        </p>
        <div className="mt-8">
          <Link to="/listings/$id" params={{ id: slide.id }} className="btn btn-white">
            {t("hero.cta")}
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex gap-1">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            aria-label={tl(s.title)}
            onClick={() => {
              setIndex(i);
              setProgress(0);
            }}
            className="h-[3px] flex-1"
            style={{ background: "rgba(255,255,255,0.25)" }}
          >
            <span
              className="block h-full bg-gold"
              style={{
                width: i < index ? "100%" : i === index ? `${(progress / DURATION) * 100}%` : "0%",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
