import { createFileRoute } from "@tanstack/react-router";
import { SavedScreen } from "@/components/SavedScreen";

export const Route = createFileRoute("/favourites")({
  head: () => ({
    meta: [
      { title: "Ընտրանի | Rahana" },
      { name: "description", content: "Your shortlist of Yerevan apartments saved with Rahana." },
      { property: "og:title", content: "Ընտրանի | Rahana" },
      {
        property: "og:description",
        content: "Your shortlist of Yerevan apartments saved with Rahana.",
      },
    ],
  }),
  component: () => <SavedScreen tab="wishlist" />,
});
