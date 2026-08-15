import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/37410555777"
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-6 right-6 z-40 grid size-14 place-items-center rounded-full bg-ink text-cream shadow-soft transition-colors duration-300 hover:bg-gold"
    >
      <MessageCircle size={22} />
    </a>
  );
}
