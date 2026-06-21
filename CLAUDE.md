# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Node.js version

This project requires Node.js >= 18. Use **nvm** to switch before running any npm command:

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20.19.6
```

Apply this prefix to all npm/node commands in this project. The default system Node (v10) is incompatible with Vite.

## Commands

```bash
# Development server
npm run dev

# Type-check (TypeScript strict) — authoritative verification step
npm run type-check

# Production build (also generates the PWA service worker + manifest)
npm run build

# Serve the built dist/ (test the PWA / offline)
npm run preview
```

`npm run build` has pre-existing failures in `PriceChart.vue` (SVG TypeScript types). Use `npm run type-check` (vue-tsc --noEmit) as the canonical pass/fail check.

**Vite config**: only `vite.config.ts` is authoritative. A stale transpiled `vite.config.js` used to shadow it (Vite loads `.js` before `.ts`) — it has been removed; do not re-create it. `base: './'` keeps `dist/` openable as a static bundle (pairs with the hash-router).

## Architecture

The project follows **Clean Architecture** with strict layer separation. Dependencies always point inward (presentation → application → domain ← infrastructure).

```
src/
├── domain/               # Pure business logic — no Vue, no Dexie, no external deps
│   ├── entities/         # Bottle (base), Wine, Spirit; PricePoint & TastingNote on Bottle
│   ├── value-objects/    # WineColor, SpiritCategory, DrinkingMoment enums;
│   │                     #   appellations.ts (~270 profiles + enrichment merge);
│   │                     #   grapeProfiles.ts (aromas/pairings per grape);
│   │                     #   wineGuidance.ts (deriveWineGuidance — pure derivation)
│   └── repositories/     # IBottleRepository, IWinePriceService (abstractions)
│
├── application/
│   ├── use-cases/        # AddBottle, UpdateBottle, DeleteBottle, GetBottles,
│   │                     #   GetCellarStats, SyncBottlePrice
│   ├── services/         # WineRecommendation, DrinkabilityAdvisor, ResaleAnalyzer,
│   │                     #   BackupService (all pure functions, no side effects)
│   └── dtos/             # CreateBottleDto, UpdateBottleDto
│
├── infrastructure/
│   ├── persistence/      # db.ts (Dexie schema v1), IndexedDBBottleRepository
│   └── pricing/          # LocalPriceEstimateService (active, no network);
│                         #   WineApioPriceService & WineSearcherPriceService (unused, kept for reference)
│
└── presentation/
    ├── router/           # Hash-based router (createWebHashHistory)
    ├── stores/           # cellar.store.ts — single Pinia store, instantiates all use cases
    ├── views/            # HomeView, CellarView, BottleDetailView, AddEditBottleView,
    │                     #   AnalyticsView, SuggestionsView, JournalView, SettingsView
    └── components/
        ├── layout/       # AppNavbar (theme toggle), AppSidebar (nav)
        ├── bottle/       # BottleCard, BottleForm, DrinkabilityChip, PriceAnalysis, PriceChart,
        │                 #   WineGuidanceCard, BottleAdviceCard
        ├── analytics/    # BottleRow, DrinkabilityTimeline, MaturityChart, WindowBar
        ├── tasting/      # TastingJournal, TastingForm, TastingNoteCard
        └── dashboard/    # StatCard
```

## Routes

| Path | View | Notes |
|---|---|---|
| `/` | HomeView | Dashboard, stats, recent additions |
| `/cave` | CellarView | Bottle list with filters |
| `/bouteille/ajouter` | AddEditBottleView | |
| `/bouteille/:id` | BottleDetailView | 3 tabs: Informations / Dégustations / Finances |
| `/bouteille/:id/modifier` | AddEditBottleView | `props: true` |
| `/suggestions` | SuggestionsView | Recommendation engine |
| `/journal` | JournalView | All tasting notes across all bottles |
| `/analytique` | AnalyticsView | |
| `/parametres` | SettingsView | WineAPI.io key management |

## Key design decisions

- **Repository instantiation**: `IndexedDBBottleRepository` and all use cases are module-level singletons in `cellar.store.ts`. No DI container.
- **Data model**: `Wine` and `Spirit` both extend `Bottle` via TypeScript interface extension (no class inheritance). Discriminant is `type: 'wine' | 'spirit'`. `TastingNote[]` and `PricePoint[]` live as optional arrays on the base `Bottle` interface.
- **Drinkability logic**: ISO string comparison (`drinkFrom ≤ today ≤ drinkUntil`). Implemented independently in `DrinkabilityChip`, `GetCellarStatsUseCase`, and `WineRecommendation`.
- **Router**: Hash history (`createWebHashHistory`) so the app works as a static file without a server.
- **Dexie schema**: Version 1 indexes `id, type, name, country, purchaseDate, drinkFrom, drinkUntil, createdAt`. Adding indexed fields requires a version bump in `db.ts`.
- **Theming**: Vuetify light/dark toggled via `AppNavbar`. Primary `#7B1FA2` (purple), secondary `#C2185B` (pink).

## Store (cellar.store.ts)

Beyond basic CRUD (`add`, `update`, `remove`, `loadAll`, `getById`), the store exposes:

- **Computed**: `stats` (totals, readyToDrink, pastPeak, recentAdditions, totalValue), `maturityCurve` (per-year units drinkable up to currentYear+30), `recentTastings` (all TastingNotes across all bottles, sorted by date desc)
- **Price actions**: `addPricePoint(bottleId, point)`, `removePricePoint(bottleId, index)`, `syncPrice(bottleId)` — all write to `priceHistory` only, never to `purchasePrice`
- **Tasting actions**: `addTastingNote(bottleId, note)`, `deleteTastingNote(bottleId, noteId)`
- **Consumption**: `consumeOne(bottleId)` — decrements `quantity` by 1 (floored at 0) via `UpdateBottle`. Triggered by the "J'en ai bu une" button on `BottleDetailView`. No separate consumption log is persisted; the bottle record stays even at quantity 0.
- **Backup**: `importBottles(bottles, 'replace' | 'merge')` — `replace` calls `repository.clear()` first, then `bulkUpsert`, then `loadAll`. Used by `SettingsView` restore flow.

## Backup / restore

`src/application/services/BackupService.ts` (pure) — `buildBackup(bottles)` returns a `CaveBackup` (`{ app:'ma-cave', version, appVersion, exportedAt, bottleCount, bottles }`); `parseBackup(raw)` validates a JSON file and throws French errors on bad app id / corrupt entries; `backupFileName()` gives a timestamped name. `SettingsView` exports via a Blob download and imports via a hidden file input + confirm dialog (Fusionner/Remplacer). Persistence support: `IBottleRepository.bulkUpsert()` (Dexie `bulkPut`) and `clear()`. Since storage is local-only (no server), export is the only safeguard against losing the cave with the browser profile.

**Versioning & migrations**: `version` is the **backup format version** (`BACKUP_FORMAT_VERSION`, currently `2`), distinct from `appVersion` (informational). `parseBackup` runs `migrateBackup` before validating bottles: `MIGRATIONS[n]` upgrades a backup from version `n` to `n+1`, applied in a chain up to the current version. A backup from a *newer* format version is rejected with a clear French error. **When the `Bottle` schema changes**, bump `BACKUP_FORMAT_VERSION` and add a `MIGRATIONS[n]` entry that transforms old files (the existing v1→v2 migration backfills `priceHistory`/`tastingNotes`/`updatedAt`). This keeps every previously exported file importable.

## Price estimation (local, no API)

`LocalPriceEstimateService` (`src/infrastructure/pricing/`) implements `IWinePriceService` with **no network call** — it is the active price service wired in `cellar.store.ts`. The "Estimer la cote" button (PriceAnalysis, Finances tab) and `store.syncPrice()` run it and append a `PricePoint` (source `Estimation locale · <basis>`) to `priceHistory` — never to `purchasePrice`.

The pure helper `estimateMarketPrice(bottle, today?)` resolves a per-bottle cote by: (1) the appellation's `marketPriceEur` range if present; (2) else a fallback range by `investmentPotential` + color; (3) else the purchase price as anchor (spirits / wines without appellation) — returns `null` when nothing is estimable. It then applies a maturity curve (vintage age vs `maxYears`, scaled by investment rank) and a deterministic ±4% daily "market" jitter seeded by `bottle.id` + date (so estimates shift day to day but are reproducible within a day). `today` is injected for testability.

`WineApioPriceService`/`WineSearcherPriceService` remain in the tree but are unused — no API key is read or stored anymore. `SettingsView` no longer manages an API key; it shows an info card and the count of priced appellations.

## Recommendation engine

`src/application/services/WineRecommendation.ts` is a pure function with no side effects. Scoring per bottle: +30 in drinkability window, +20 if window closes ≤1 year (urgent flag), +(bestScore−70)/2 from tasting notes; food match +25 (tasting accord) / +20 (derived guidance pairing) / +10 (aroma); occasion match +15 (note or derived moment via `OCCASION_TO_MOMENT`); +18 sparkling for `fête`; +18/+8 by investment rank for `cadeau`; +≤4 random variance. It now uses `deriveWineGuidance` so food/occasion matching works **without** any manual tasting note. Called from `SuggestionsView`.

## Wine guidance derivation (the knowledge layer)

`src/domain/value-objects/wineGuidance.ts` — `deriveWineGuidance({ color, grapes?, appellation? })` returns a pure `WineGuidance` (grapes, style, aromas, foodPairings, servingTemp, drinkingMoments, investmentPotential, investmentNotes, `fromCuratedAppellation`). Resolution order, by field: **curated appellation > grape profile > color fallback**. Nothing is persisted — guidance is recomputed on demand, so improving the data instantly improves every bottle. Consumed by `WineGuidanceCard`, `BottleCard` (moment chip), `CellarView` (moment filter), `WineRecommendation`, `ResaleAnalyzer`, `HomeView` (moment breakdown).

- `grapeProfiles.ts` — `GRAPE_PROFILES` maps ~35 grapes (normalized keys) to `{ aromas, foodPairings }`. Sources: Jancis Robinson *Wine Grapes*, WSET, Guide Hachette. Lookups via `getGrapeProfile()` (NFD-normalized, accent-insensitive).
- `DrinkingMoment.ts` — enum Aperitif/Entree/Plat/Fromage/Dessert + labels, MDI icons, canonical order.
- Serving temp + drinking moments are derived by color (WSET service norms); investment is curated per appellation or coarsely derived from `maxYears` (always confirm cote on Wine-Searcher / iDealwine).

## Appellation database & auto-drinkability

`src/domain/value-objects/appellations.ts` contains ~270 `AppellationProfile` entries (name, country, region, color, minYears, maxYears + optional grapes/style/aromas/foodPairings/servingTemp/investmentPotential/investmentNotes/`marketPriceEur`). The base array holds garde windows (with sourced comments); a separate `APPELLATION_ENRICHMENT` map (keyed by `id`) is `Object.assign`-merged into the profiles at module init — add curated data there, not inline in the 270 base lines. A second map, `APPELLATION_MARKET_PRICE` (keyed by `id`), holds indicative market price ranges (€/btl, Wine-Searcher/iDealwine medians) merged into `marketPriceEur` in the same loop; it feeds the local price estimation. Only iconic aroma/pairing overrides are curated (e.g. Sauternes→foie gras, Chablis→huîtres); generic aromas/pairings come from grape profiles. Investment ratings follow the recognized secondary market (Liv-ex, iDealwine, Wine-Searcher).

When the user selects a known appellation and enters a vintage in `BottleForm.vue`, the form computes `drinkFrom = vintage + minYears` and `drinkUntil = vintage + maxYears` and shows a suggestion banner with an "Appliquer" button. Auto-fill only triggers when both date fields are empty (new bottle flow); for existing bottles the banner shows but does not overwrite.

## Resale analysis

`src/application/services/ResaleAnalyzer.ts` — `analyzeResale(bottles)` (pure) flags sell opportunities from `priceHistory` (never `purchasePrice`): ≥15% gain on the latest quote, past-peak bottles that still hold value, and high-investment wines with a confirmed gain; sorted by a composite score. `totalMarketValue()` sums latest quote × quantity (fallback `purchasePrice`). Surfaced in `AnalyticsView` ("Vins à revendre" + the purchase-vs-market value cards at the top) and as a count card on `HomeView`.

## Known pitfalls

- **Pinia destructuring**: Always use `storeToRefs(store)` when destructuring reactive state or computed values. `const { x } = store` breaks reactivity — `x` becomes a static snapshot.
- **Vue Proxy + IndexedDB**: `structuredClone()` fails on Vue reactive Proxy objects (e.g. reactive arrays from `v-combobox`). The repository uses `JSON.parse(JSON.stringify(bottle))` before writing to Dexie.
- **v-model.number on Vuetify components**: Vue's `.number` modifier is unreliable on Vuetify `v-text-field`. Browser floating-point drift with `step="0.01"` can silently corrupt stored values. Pattern: use `step="any"` on price fields and round explicitly in `onSubmit` with `Math.round(Number(v) * 100) / 100`.
- **Async form submission errors**: Form submit handlers wrap store calls in `try/catch` and display a `v-snackbar` on failure.

## Adding a new bottle field

1. Add the field to the relevant entity in `src/domain/entities/`
2. Add it to `CreateBottleDto` / `UpdateBottleDto` in `src/application/dtos/`
3. Update `BottleForm.vue` with the new input
4. If the field needs to be indexed for filtering, bump the Dexie schema version in `db.ts`
5. Update this file

## Data persistence

All data is stored locally in **IndexedDB** (database name: `MaCaveDB`, table: `bottles`). No server, no sync. Data survives browser restarts but is scoped to the browser profile. On mobile, an uninstalled site's storage can be evicted by the OS — installing the PWA (below) reduces that risk, and a JSON export is the real safeguard.

## PWA (installable / offline)

The app is a **Progressive Web App** via `vite-plugin-pwa` (configured in `vite.config.ts`, `registerType: 'autoUpdate'`). `buildBackup`/`registerSW` aside, the build emits a service worker that precaches the app shell (`globPatterns` covers js/css/html/svg/png/fonts) with `navigateFallback: 'index.html'` so the hash-router works offline. `src/main.ts` calls `registerSW({ immediate: true })`; types come from the `vite-plugin-pwa/client` reference in `src/vite-env.d.ts`. Manifest: name "Ma Cave", `theme_color #7B1FA2`, `display standalone`, icons in `public/` (`pwa-192x192.png`, `pwa-512x512.png`, `maskable-512x512.png`, `apple-touch-icon.png`, `wine-glass.svg` favicon). `index.html` carries the iOS metas (`apple-touch-icon`, `apple-mobile-web-app-*`, `theme-color`). `SettingsView` shows install instructions. **The SW only runs on a built `dist/` served over http(s)** (or `npm run preview`) — not in `npm run dev`.

## Mobile / responsive layout

`AppSidebar.vue` uses Vuetify `useDisplay()`: `permanent` rail on desktop, `temporary` overlay drawer on mobile (`mobile` breakpoint = smAndDown). The drawer state is shared via `src/presentation/composables/useLayout.ts` (a module-level `ref`), toggled by the hamburger in `AppNavbar.vue` (mobile only) and auto-closed on route change. `App.vue` uses `pa-4 pa-md-6`.
