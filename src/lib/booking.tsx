import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface BookingCtx {
  open: (subject?: string) => void;
  close: () => void;
  isOpen: boolean;
  subject: string | undefined;
}

const Ctx = createContext<BookingCtx | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState<string | undefined>(undefined);

  const open = useCallback((s?: string) => {
    setSubject(s);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen, subject }), [open, close, isOpen, subject]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBooking() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useBooking must be used inside BookingProvider");
  return ctx;
}
