# Architecture

How the pieces fit together, and why they're arranged this way. Read this before making a structural
change — most of the decisions below exist to stop a specific class of bug.

## The shape of the app

```
Request ──▶ src/server.ts ──▶ TanStack Start SSR ──▶ routeTree ──▶ route component
                │                                                        │
                │                                          ┌─────────────┴─────────────┐
                └── error recovery                         │  I18nProvider             │
                                                           │   SavedProvider           │
                                                           │    BookingProvider        │
                                                           └───────────────────────────┘
```

There is no API layer and no database. Property data is a typed module compiled into the bundle, which is
what makes the whole thing deployable as a single server bundle with no infrastructure behind it.

## The filter engine is the interesting part

Most catalogue UIs keep filter state in React state and treat the URL as an afterthought. This one inverts
that: **the URL is the state**, and React renders from it.

`src/lib/filters.ts` owns the contract:

- `ListingSearch` — the shape of every filter as a flat, URL-serialisable object
- `validateListingSearch()` — parses untrusted query strings into that shape, coercing bad input to
  defaults rather than throwing. It runs on the server for the SSR pass and in the browser on navigation.
- `filterProperties()` — pure function, `ListingSearch → Property[]`
- `baseSubset()` / `boundsOf()` — the subset used to compute slider bounds and histogram distributions

The route wires it up in one line:

```ts
validateSearch: (raw: Record<string, unknown>): ListingSearch => validateListingSearch(raw);
```

Three properties fall out of this for free:

1. **Every result set is a shareable link.** No "copy link" button needed.
2. **The back button works,** because navigation is the only way state changes.
3. **The server renders the filtered page,** so a crawler or a link preview sees real results.

The rule to preserve: **filter state never lives in `useState`.** A filter that isn't in the URL breaks all
three properties above.

### Live counts and dead options

`FilterSidebar` computes each district's count by re-running the full filter with only that district
swapped in:

```ts
const districtCount = (d: string) => filterProperties({ ...search, districts: d }).length;
```

Cheap because the dataset is in memory, and it means a count always reflects every _other_ active filter.
When a count is zero the row is disabled rather than hidden — a moving list of options is much harder to
use than a static one with some entries greyed out.

## Internationalisation

`src/lib/i18n.tsx` holds one dictionary object closed with `satisfies Record<string, L10n>`. That single
keyword does the work:

- a missing locale on any key is a **compile error**, not a runtime blank
- `TKey` is derived from the dictionary, so `t()` only accepts keys that exist

Content objects in `data.ts` carry all three locales inline (`{ hy, en, ru }`) and are read through
`tl()`. There is no translation-loading step and no async boundary.

**SSR caveat worth knowing.** The server renders in Armenian, the default locale, because it can't know the
visitor's stored preference. `useLocalizedMeta()` mirrors the localised title and description into the
document after hydration. If you add a page, call it — otherwise the tab title stays Armenian after a
language switch.

## Server rendering and error recovery

Two files exist purely to stop failures becoming blank pages:

- **`src/start.ts`** — request middleware. Catches anything thrown during a request, logs it, and returns a
  styled error page instead of a stack trace. Also re-installs the CSRF middleware, which TanStack Start
  would have added automatically had this file not existed.
- **`src/server.ts`** — wraps the SSR handler. h3 swallows in-handler throws into a generic
  `{"unhandled":true,"message":"HTTPError"}` 500 with no stack, so `normalizeCatastrophicSsrResponse()`
  detects that exact body and recovers the real error from `src/lib/error-capture.ts`, which shadows
  `console.error` to keep the last error out of band.

Without this, a crash in a loader shows up in production logs as the literal string `HTTPError` and nothing
else. That's why the indirection is there — it isn't ceremony.

## Styling

One stylesheet, `src/styles.css`, in three layers:

1. **`@theme` tokens** — seven colours, one shadow, four radii. Everything visual resolves to these.
2. **`@utility` classes** — `btn`, `card-r`, `field-r`, `nav-pill`, `hist-bar`… component-level classes
   that keep Tailwind soup out of the JSX.
3. **Raw CSS** for the handful of things utilities can't express, mostly range-input thumbs.

No CSS-in-JS, no component library. When you need a new visual primitive, add an `@utility` rather than a
long inline class list — that's what keeps the design consistent as the app grows.

## State that isn't in the URL

Three React contexts, deliberately small:

| Context           | Holds                              | Persistence    |
| ----------------- | ---------------------------------- | -------------- |
| `I18nProvider`    | active language                    | `localStorage` |
| `SavedProvider`   | favourites, compare list (max 4)   | `localStorage` |
| `BookingProvider` | booking modal open state + subject | none           |

All three read `localStorage` inside `useEffect`, never during render — reading storage during render would
produce a server/client mismatch and a hydration error.

## Adding things

**A property** — append to `seeds[]` in `src/lib/data.ts`. Everything else follows: catalogue, filters,
histograms, comparison, detail page, metadata.

**A page** — create the file in `src/routes/`; `routeTree.gen.ts` regenerates on dev/build. Add a `head()`
with title, description, canonical and OG tags, and call `useLocalizedMeta()` in the component.

**A filter** — add the field to `ListingSearch`, parse it in `validateListingSearch()`, apply it in
`filterProperties()`, then render a control. Do not add it to component state.

**A real backend** — replace `src/lib/data.ts` with an API client and make the route loaders async. The
filter functions are pure and take data as input, so they don't change; only their input source does.
