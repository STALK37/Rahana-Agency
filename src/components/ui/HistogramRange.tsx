import { useEffect, useMemo, useState } from "react";

const THIN = " ";

export const groupNum = (n: number) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, THIN);

const parseNum = (s: string) => Number(s.replace(/[^\d]/g, ""));

/**
 * Dual-handle range with an optional distribution histogram sitting flush on
 * top of the track, plus editable number inputs for both ends.
 */
export function HistogramRange({
  min,
  max,
  value,
  onChange,
  step = 1,
  unit,
  values,
  bins = 28,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  step?: number;
  unit?: string;
  /** raw data points used to build the histogram; omit for a plain slider */
  values?: number[];
  bins?: number;
}) {
  const safeMax = max > min ? max : min + step;
  const pct = (n: number) => ((Math.min(Math.max(n, min), safeMax) - min) / (safeMax - min)) * 100;

  const [draft, setDraft] = useState<[string, string]>([groupNum(value[0]), groupNum(value[1])]);
  useEffect(() => {
    setDraft([groupNum(value[0]), groupNum(value[1])]);
  }, [value[0], value[1]]);

  const hist = useMemo(() => {
    if (!values || values.length === 0) return null;
    const counts = new Array(bins).fill(0) as number[];
    const width = (safeMax - min) / bins || 1;
    for (const v of values) {
      const i = Math.min(bins - 1, Math.max(0, Math.floor((v - min) / width)));
      counts[i] = (counts[i] ?? 0) + 1;
    }
    const peak = Math.max(...counts, 1);
    return counts.map((c, i) => ({
      h: c === 0 ? 2 : Math.max(4, Math.round((c / peak) * 48)),
      from: min + i * width,
      to: min + (i + 1) * width,
    }));
  }, [values, bins, min, safeMax]);

  const commit = (i: 0 | 1, raw: string) => {
    const n = parseNum(raw);
    if (!Number.isFinite(n) || raw.trim() === "") {
      setDraft([groupNum(value[0]), groupNum(value[1])]);
      return;
    }
    const clamped = Math.min(Math.max(n, min), safeMax);
    if (i === 0) onChange([Math.min(clamped, value[1]), value[1]]);
    else onChange([value[0], Math.max(clamped, value[0])]);
  };

  const live = (i: 0 | 1, raw: string) => {
    const digits = raw.replace(/[^\d]/g, "");
    setDraft((d) =>
      i === 0 ? [groupNum(Number(digits || 0)), d[1]] : [d[0], groupNum(Number(digits || 0))],
    );
    if (!digits) return;
    const n = Math.min(Math.max(Number(digits), min), safeMax);
    if (i === 0) onChange([Math.min(n, value[1]), value[1]]);
    else onChange([value[0], Math.max(n, value[0])]);
  };

  return (
    <div>
      <div className="flex items-baseline gap-3">
        {([0, 1] as const).map((i) => (
          <label
            key={i}
            className={`num-field flex flex-1 items-baseline gap-1 ${i === 0 ? "" : "justify-end"}`}
          >
            <input
              inputMode="numeric"
              value={draft[i]}
              aria-label={i === 0 ? "min" : "max"}
              onChange={(e) => live(i, e.target.value)}
              onBlur={(e) => commit(i, e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && commit(i, (e.target as HTMLInputElement).value)
              }
              className="num-edit"
            />
            {unit && <span className="num-unit">{unit}</span>}
          </label>
        ))}
      </div>

      <div className="mt-4">
        {hist && (
          <div className="hist" aria-hidden>
            {hist.map((b, i) => {
              const inside = b.to >= value[0] && b.from <= value[1];
              return (
                <span
                  key={i}
                  className={`hist-bar ${inside ? "is-in" : ""}`}
                  style={{ height: b.h }}
                />
              );
            })}
          </div>
        )}

        <div className="range-r relative h-5">
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
    </div>
  );
}
