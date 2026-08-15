import { useEffect, useRef, useState } from "react";
import { Chevron, Check } from "./Icons";

export interface Option {
  value: string;
  label: string;
}

export function CustomSelect({
  label,
  options,
  value,
  onChange,
  multi = false,
  placeholder,
  align = "left",
}: {
  label: string;
  options: Option[];
  value: string[];
  onChange: (v: string[]) => void;
  multi?: boolean;
  placeholder: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const typed = useRef({ str: "", at: 0 });

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const pick = (v: string) => {
    if (multi) {
      onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onChange(value[0] === v ? [] : [v]);
      setOpen(false);
    }
  };

  const summary =
    value.length === 0
      ? placeholder
      : options
          .filter((o) => value.includes(o.value))
          .map((o) => o.label)
          .join(", ");

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActive((a) => (a + (e.key === "ArrowDown" ? 1 : options.length - 1)) % options.length);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) setOpen(true);
      else if (options[active]) pick(options[active]!.value);
      return;
    }
    if (e.key.length === 1) {
      const now = Date.now();
      typed.current.str = now - typed.current.at < 900 ? typed.current.str + e.key : e.key;
      typed.current.at = now;
      const i = options.findIndex((o) =>
        o.label.toLocaleLowerCase().startsWith(typed.current.str.toLocaleLowerCase()),
      );
      if (i >= 0) {
        setActive(i);
        if (!open) setOpen(true);
      }
    }
  };

  return (
    <div ref={root} className="field-r relative">
      <button
        type="button"
        className="field-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        <span className="field-label">{label}</span>
        <span className="field-value">
          <span className={value.length ? "" : "text-muted"}>{summary}</span>
          <Chevron open={open} />
        </span>
      </button>

      {open && (
        <div
          role="listbox"
          className={`panel-r absolute top-[calc(100%-6px)] z-50 min-w-[240px] ${
            align === "right" ? "right-0" : "left-2"
          }`}
        >
          {options.map((o, i) => {
            const selected = value.includes(o.value);
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onClick={() => pick(o.value)}
                className={`option-row ${i === active ? "bg-[var(--surface-alt)]" : ""}`}
              >
                <span>{o.label}</span>
                {selected && <Check />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
