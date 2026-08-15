import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface SavedCtx {
  favourites: string[];
  compare: string[];
  toggleFavourite: (id: string) => void;
  toggleCompare: (id: string) => void;
  isFavourite: (id: string) => boolean;
  isCompared: (id: string) => boolean;
  clearCompare: () => void;
}

const SavedContext = createContext<SavedCtx | null>(null);

const read = (key: string): string[] => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

export function SavedProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);

  useEffect(() => {
    setFavourites(read("rahana-favourites"));
    setCompare(read("rahana-compare"));
  }, []);

  const toggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("rahana-favourites", JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompare((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-4);
      localStorage.setItem("rahana-compare", JSON.stringify(next));
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompare([]);
    localStorage.setItem("rahana-compare", "[]");
  }, []);

  const value = useMemo<SavedCtx>(
    () => ({
      favourites,
      compare,
      toggleFavourite,
      toggleCompare,
      clearCompare,
      isFavourite: (id) => favourites.includes(id),
      isCompared: (id) => compare.includes(id),
    }),
    [favourites, compare, toggleFavourite, toggleCompare, clearCompare],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error("useSaved must be used inside SavedProvider");
  return ctx;
}
