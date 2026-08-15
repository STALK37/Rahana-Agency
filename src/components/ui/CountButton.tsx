import { useEffect, useRef, useState } from "react";

export function useCountUp(target: number, ms = 400) {
  const [n, setN] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(a + (target - a) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return n;
}

export function CountLabel({ count, word }: { count: number; word: string }) {
  const n = useCountUp(count);
  return (
    <>
      <span style={{ fontSize: 20, fontWeight: 500 }}>{n}</span>
      <span style={{ fontSize: 15, fontWeight: 400 }}>{word}</span>
    </>
  );
}
