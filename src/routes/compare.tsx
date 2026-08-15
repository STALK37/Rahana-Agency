import { createFileRoute } from "@tanstack/react-router";
import { SavedScreen } from "@/components/SavedScreen";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Համեմատել | Rahana" },
      { name: "description", content: "Compare up to four Yerevan properties side by side." },
      { property: "og:title", content: "Համեմատել | Rahana" },
      {
        property: "og:description",
        content: "Compare up to four Yerevan properties side by side.",
      },
    ],
  }),
  component: () => <SavedScreen tab="compare" />,
});
