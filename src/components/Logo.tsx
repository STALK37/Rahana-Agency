import { Link } from "@tanstack/react-router";

/**
 * The single Rahana mark. Swap the SVG inside `TowerMark` (or this whole
 * component) when the real asset arrives — nothing else draws the logo.
 */
export function TowerMark({
  size = 64,
  color = "var(--cream)",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <g fill={color}>
        <path d="M13 30h11v22H13z" />
        <path d="M26 14h12v38H26z" />
        <path d="M40 30h11v22H40z" />
      </g>
    </svg>
  );
}

export function Logo({ size = 56, inverted = false }: { size?: number; inverted?: boolean }) {
  const fg = inverted ? "var(--ink)" : "var(--cream)";
  return (
    <Link to="/" aria-label="RAHANA" className="shrink-0">
      <span
        className="grid place-items-center rounded-full text-center leading-none transition-colors duration-300"
        style={{
          width: size,
          height: size,
          background: inverted ? "var(--cream)" : "var(--ink)",
          color: fg,
        }}
      >
        <span className="flex flex-col items-center justify-center gap-[2px]">
          <TowerMark size={size * 0.3} color={fg} />
          <span style={{ fontSize: size * 0.155, letterSpacing: "0.14em", fontWeight: 600 }}>
            RAHANA
          </span>
          <span style={{ fontSize: size * 0.072, letterSpacing: "0.12em", opacity: 0.65 }}>
            WHERE YOUR
          </span>
          <span style={{ fontSize: size * 0.072, letterSpacing: "0.12em", opacity: 0.65 }}>
            STORY STARTS
          </span>
        </span>
      </span>
    </Link>
  );
}
