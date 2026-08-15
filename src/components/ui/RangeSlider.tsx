import { useEffect, useState } from "react";

export function RangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1,
  unit,
  format,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  step?: number;
  unit?: string;
  format?: (n: number) => string;
}) {
  const safeMax = max > min ? max : min + step;
  const pct = (n: number) => ((Math.min(Math.max(n, min), safeMax) - min) / (safeMax - min)) * 100;
  const fmt = format ?? ((n: number) => String(n));

  const [draft, setDraft] = useState<[string, string]>([String(value[0]), String(value[1])]);
  useEffect(() => {
    setDraft([String(value[0]), String(value[1])]);
  }, [value[0], value[1]]);

  const commit = (i: 0 | 1, raw: string) => {
    const n = Number(raw.replace(/[^\d]/g, ""));
    if (!Number.isFinite(n) || raw === "") {
      setDraft([String(value[0]), String(value[1])]);
      return;
    }
    const clamped = Math.min(Math.max(n, min), safeMax);
    if (i === 0) onChange([Math.min(clamped, value[1]), value[1]]);
    else onChange([value[0], Math.max(clamped, value[0])]);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        {([0, 1] as const).map((i) => (
          <label key={i} className="flex flex-1 items-baseline justify-end gap-2">
            <input
              inputMode="numeric"
              value={draft[i]}
              aria-label={i === 0 ? "min" : "max"}
              onChange={(e) =>
                setDraft((d) => (i === 0 ? [e.target.value, d[1]] : [d[0], e.target.value]))
              }
              onBlur={(e) => commit(i, e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && commit(i, (e.target as HTMLInputElement).value)
              }
              className="num-input"
            />
            {unit && <span className="t-meta text-muted">{unit}</span>}
          </label>
        ))}
      </div>

      <p className="t-meta mt-2 text-right text-muted">
        {fmt(value[0])} — {fmt(value[1])}
      </p>

      <div className="range-r relative mt-4 h-5">
        <div className="absolute inset-x-0 top-[9px] h-[2px] rounded-full bg-line" />
        <div
          className="absolute top-[9px] h-[2px] rounded-full bg-gold"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
        <input
          type="range"
          aria-label="min"
          min={min}
          max={safeMax}
          step={step}
          value={value[0]}
          onChange={(e) => onChange([Math.min(Number(e.target.value), value[1]), value[1]])}
          className="absolute inset-x-0 top-0 h-5 w-full"
        />
        <input
          type="range"
          aria-label="max"
          min={min}
          max={safeMax}
          step={step}
          value={value[1]}
          onChange={(e) => onChange([value[0], Math.max(Number(e.target.value), value[0])])}
          className="absolute inset-x-0 top-0 h-5 w-full"
        />
      </div>
    </div>
  );
}
