# Changelog

All notable changes to this project are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- `SECURITY.md` with a private vulnerability reporting route and a scope statement
- `.editorconfig` so editors match the Prettier configuration without extra setup
- `.nvmrc` pinning Node 22, matching the CI workflow

## [1.0.0] — 2026-08-15

### Added

- Trilingual property site (Armenian, English, Russian) on TanStack Start with server-side rendering
- URL-native search: deal, district, rooms, type, price, area, floor, status, sort and view are all
  validated search params, so any result set is a shareable link
- Filter sidebar with live per-district counts that respect every other active filter, and distribution
  histograms on the price and area ranges
- Payment planner with three modes — full payment with agency fee, installment schedule with an
  amortisation table, and a rental affordability ratio
- Favourites and a four-way property comparison table, persisted in `localStorage`
- Per-route SEO metadata, Open Graph and Twitter cards, and `RealEstateAgent` JSON-LD structured data
- Design system defined as Tailwind v4 `@theme` tokens — seven colours, one shadow, four radii
- GitHub Actions CI running typecheck, lint, format check and build

[unreleased]: https://github.com/STALK37/Rahana-Agency/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/STALK37/Rahana-Agency/releases/tag/v1.0.0
