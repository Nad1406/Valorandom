# VALORANDOM — Tactical Protocol Design System

Synthesized from **Impeccable** (`craft-floor`, visual discipline) and **UI/UX Pro Max** (WCAG accessibility, dark-mode contrast, interaction states), tailored to the authentic **VALORANT Client / Agent Select / Armory** aesthetic.

---

## 1. Visual World & Surface Mode

- **Surface Mode:** **Operate** (fast, precision randomizer tool) infused with **Valorant Tactical Protocol** identity. Scanability, crisp contrast, immediate action feedback, and zero decorative clutter outrank generic SaaS card nesting.
- **Architectural Geometry:** Sharp `2px` corners (`rounded-sm`) paired with intentional 45-degree corner chamfers (`.clip-corner-tl`, `.clip-corner-br`, `.clip-tactical`). No generic pill cards (`rounded-xl` spam) or blurred gradient blobs.
- **Iconography:** Strictly `lucide-react` vector icons (`strokeWidth={2}`, `aria-hidden="true"` on decorative icons). **Zero raw emojis** in UI controls or alerts.

---

## 2. Color Tokens & Contrast (WCAG AA Compliant)

| Role | Token | Hex / Value | Usage |
| :--- | :--- | :--- | :--- |
| Canvas Base | `bg-base` / `val-bg` | `#0A1017` | Main viewport ground with subtle `48px` architectural grid |
| Surface Elevated | `bg-elevated` / `val-navy` | `#0F1923` | Primary HUD panels, Agent/Map/Weapon cards, modal shell |
| Surface Highlight | `surface-hi` | `#1A2736` | Hover states, interactive item wells, selected options |
| Border Hairline | `line` / `val-border` | `#263445` | Crisp 1px structural framing (`rgba(236, 232, 225, 0.14)`) |
| Primary Ink | `ink` / `val-offwhite` | `#ECE8E1` | Headings, active titles, primary readable text (~15:1 contrast) |
| Muted Ink | `ink-muted` / `val-muted` | `#96A4B3` | Secondary descriptions, metadata, labels (~6.6:1 on `#0F1923`) |
| Primary Accent | `val-red` | `#FF4655` | Primary `RANDOMIZE` / `FIND MATCH` CTA, active tabs, critical errors |
| Tactical Confirm | `val-teal` | `#00E5C0` | Locked agents, active rotation, selected pool checkboxes |
| Armory Gold | `val-gold` | `#F5C453` | Weapon credit cost, Initiator role accent |

### Agent Role Tokens
- **Duelist:** `#FF4655` (`role-duelist`)
- **Initiator:** `#F5C453` (`role-initiator`)
- **Controller:** `#8B7CF6` (`role-controller`)
- **Sentinel:** `#00E5C0` (`role-sentinel`)
- **Flex:** `#5AA9E6` (`role-flex`)

---

## 3. Typography & Numeric Discipline

- **Display (`font-display`):** `Big Shoulders Display` (`700`, `800`, `900`), `uppercase`, tight tracking (`-0.02em` to `0.02em`), max hero scale `clamp(2rem, 5vw, 3.75rem)`. Used for Agent/Map/Weapon titles, page H1s, and watermark silhouettes.
- **Tactical HUD (`font-tactical`):** `Barlow Condensed` (`500`, `600`, `700`), `uppercase`, `tracking-widest`. Used for tabs, buttons, badges, filter chips, and telemetry labels.
- **Body (`font-sans`):** `Be Vietnam Pro` (`400`, `500`, `600`, `700`). Full Vietnamese diacritic support for bios, descriptions, and alerts.
- **Tabular Numerals:** Apply `tabular-nums` to all numeric stats, costs, counts (`5 / 5 Slots`), and coordinates.

---

## 4. Interaction, Motion & Browser Surfaces

- **Primary CTA (`.val-btn-match`):** Double-framed Valorant `PLAY` trigger in `#FF4655` with hairline outer bracket, subtle sheen highlight, and clear disabled opacity (`0.45`).
- **Motion Budget:** Animate strictly `transform` and `opacity`. Honour `prefers-reduced-motion` via `useReducedMotion()` (0ms roll resolution) and `@media (prefers-reduced-motion: reduce)`.
- **Browser UI Theming:** `color-scheme: dark`, `accent-color: #FF4655`, themed `::selection`, accessible scrollbar contrast (`scrollbar-color`), and consistent `focus-visible` ring (`2px solid #FF4655`, offset `2px`).
- **Modal Dialogs:** `role="dialog"`, `aria-modal="true"`, `Escape` key dismissal, backdrop click dismissal, explicit close button, and auto-focused search input.
