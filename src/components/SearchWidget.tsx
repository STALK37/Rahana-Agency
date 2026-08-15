import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { FilterBar } from "./FilterBar";
import { CountLabel } from "./ui/CountButton";
import { useI18n } from "@/lib/i18n";
import { filterProperties, defaultSearch, type ListingSearch } from "@/lib/filters";

export function SearchWidget() {
  const { t } = useI18n();
  const [search, setSearch] = useState<ListingSearch>(defaultSearch);
  const count = filterProperties(search).length;

  return (
    <div className="relative z-10 -mt-16">
      <FilterBar
        search={search}
        set={(patch) => setSearch((s) => ({ ...s, ...patch }))}
        showAdvanced={false}
        submit={
          <Link to="/listings" search={search} className="count-btn h-16 w-full">
            <CountLabel count={count} word={t("search.results")} />
          </Link>
        }
      />
    </div>
  );
}
