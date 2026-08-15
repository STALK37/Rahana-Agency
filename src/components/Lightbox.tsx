import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
  alt,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
  alt: string;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onIndex]);

  return (
    <div
      className="fixed inset-0 z-[110] flex flex-col"
      style={{ background: "rgba(8,8,10,0.96)" }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors duration-300 hover:bg-white/20"
      >
        <X size={20} />
      </button>

      <button
        onClick={() => onIndex((index - 1 + images.length) % images.length)}
        aria-label="Previous"
        className="absolute left-2 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full text-white transition-colors duration-300 hover:bg-white/10 sm:left-6"
      >
        <ChevronLeft size={30} />
      </button>
      <button
        onClick={() => onIndex((index + 1) % images.length)}
        aria-label="Next"
        className="absolute right-2 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full text-white transition-colors duration-300 hover:bg-white/10 sm:right-6"
      >
        <ChevronRight size={30} />
      </button>

      <div className="flex flex-1 items-center justify-center p-6 sm:p-16">
        <img
          src={images[index]}
          alt={alt}
          className="max-h-full max-w-full rounded-card object-contain"
        />
      </div>

      <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-6">
        {images.map((src, i) => (
          <button
            key={src + i}
            onClick={() => onIndex(i)}
            className="shrink-0 overflow-hidden rounded-input transition-opacity duration-300"
            style={{
              opacity: i === index ? 1 : 0.45,
              outline: i === index ? "2px solid var(--gold)" : "none",
              outlineOffset: 2,
            }}
          >
            <img src={src} alt="" className="h-16 w-24 object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
