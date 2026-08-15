# Contributing

Thanks for taking the time. Bug reports, ideas and pull requests are all welcome.

## Getting set up

```bash
npm install
npm run dev      # http://localhost:8080
```

Node 20.19 or newer.

## Before you open a pull request

Run all three. CI runs the same commands and will fail on anything that does not pass.

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint, Prettier rules included
npm run build       # must produce .output/ cleanly
```

`npm run format` fixes formatting automatically.

## House style

The design discipline in this project is deliberate, and PRs are reviewed against it:

- **Gold (`--gold`) is the only accent colour.** No second accent, no decorative gradients.
- **Body text is weight 400; headings are 500–600.** No bold body copy.
- **One shadow** (`0 2px 6px rgba(0,0,0,0.15)`), used rarely. Separate elements with whitespace instead.
- **No animation library, no scroll-jacking, no reveal-on-scroll.** Transitions are 0.15s–0.3s, or 1s for
  the slow image zoom.
- **New colours, radii and spacing go in `src/styles.css`** as tokens or `@utility` classes — not as
  one-off inline values scattered through components.

Technical conventions:

- TypeScript is strict, including `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`. Please do
  not loosen `tsconfig.json` to make an error go away.
- Interactive elements are real `<button>` / `<a>` elements with the appropriate `aria-*` state.
- Every user-facing string goes in `src/lib/i18n.tsx` with all three locales (`hy`, `en`, `ru`). A missing
  locale is a compile error.
- Filter state belongs in the URL search params (`src/lib/filters.ts`), not in component state.
- `src/routeTree.gen.ts` is generated. Do not edit it by hand.

## Commit messages

Short, imperative, one concern per commit — `Add floor range to the mobile filter sheet`. Conventional
Commit prefixes (`feat:`, `fix:`, `docs:`) are welcome but not required.

## Reporting a bug

Open an issue with the URL (including search params — they carry the filter state), what you expected,
what happened, and your browser. A screenshot helps a lot.
