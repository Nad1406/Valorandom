# VALORANDOM 🎯

A high-performance, client-side static Single Page Application (SPA) designed for Valorant players to randomize **Agents**, **Maps**, **Weapons**, and coordinated **5-player Squads** without duplicate agent assignments.

Operates **100% offline at runtime** with zero upstream network dependencies.

---

## ✨ Features

- **Single Random**:
  - Randomize Agents (with Role filter & customizable pool selection).
  - Randomize Maps (Competitive & Unrated standard 5v5 map pool).
  - Randomize Weapons (filtered by Category & Cost).
  - Custom pool checkboxes: include or exclude specific items on the fly.
- **Squad Random (5-player team)**:
  - Generate 1–5 player team comps without duplicate agents.
  - Role-constrained algorithm: narrow roles (Initiator, Sentinel, Controller, Duelist) resolved first before Flex slots.
  - Per-slot Agent Locking: lock favorite agents and re-roll remaining teammates.
  - Shareable Team Links: state serialized with base64url JSON via URL search params (`?s=...`), hydrated seamlessly.
- **Localization (i18n)**:
  - Full Vietnamese (`vi`) and English (`en`) support.
  - Bilingual agent, map, and weapon descriptions.
- **Accessibility & Design**:
  - Dark futuristic Valorant aesthetic with high-contrast UI tokens.
  - Full keyboard navigation and `aria-live` screen-reader announcements.
  - Responsive across Mobile (360px), Tablet (768px), and Desktop (1440px).

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript (Strict mode, no `any`)
- **Bundler & Tooling**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router (HashRouter for static hosting compatibility)
- **Validation**: Zod (Static data & Share Link schemas)
- **Testing**:
  - Unit & Component: Vitest + React Testing Library (18 suites, 82 tests)
  - End-to-End: Playwright (Chromium, 9 tests)

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation

```bash
git clone https://github.com/your-username/valorandom.git
cd valorandom
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts Vite local development server |
| `npm run build` | Typechecks and builds production bundle in `dist/` |
| `npm run preview` | Previews production build locally |
| `npm run typecheck` | Runs `tsc --noEmit` in strict mode |
| `npm run lint` | Lints codebase with ESLint |
| `npm test` | Runs Vitest unit and component test suites |
| `npm run test:e2e` | Runs Playwright end-to-end tests against preview server |
| `npm run data:sync` | *(Dev only)* Fetches and syncs data from `valorant-api.com` |
| `npm run data:validate`| Validates static data files against Zod schemas |

---

## 📁 Project Structure

```text
src/
├── components/          # Reusable UI primitives (Button, Card, Badge, Modal, etc.)
│   ├── cards/           # AgentCard, MapCard, WeaponCard
│   └── layout/          # PageShell, Header, Footer
├── data/                # Static JSON datasets (agents, maps, weapons, meta)
├── features/
│   ├── random/          # Pure random logic: rng, singleRandom, filters
│   ├── single/          # Single random UI (PoolSelector, etc.)
│   └── squad/           # Squad algorithm, reducer, and UI components
├── lib/                 # i18n engine, shareLink encoder/decoder, sound
├── pages/               # SingleRandomPage, SquadRandomPage, NotFoundPage
├── styles/              # Global CSS & Tailwind configuration
└── types/               # Domain interfaces & TypeScript definitions
```

---

## 🌐 Deployment

VALORANDOM produces a static client-side bundle in `dist/` (< 120KB gzip). It can be deployed to any static hosting provider:

- **GitHub Pages**: Build output pushed to `gh-pages` branch.
- **Cloudflare Pages / Vercel / Netlify**: Connect repository and set build command to `npm run build` with output directory `dist`.

---

## ⚖️ Disclaimer

VALORANDOM is a fan-made project and is not endorsed by, directly affiliated with, maintained, authorized, or sponsored by Riot Games, Inc. VALORANT and all related media are trademarks or registered trademarks of Riot Games, Inc.
