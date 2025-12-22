# Initialization Document — ox-mythoras

This document is an initialization-level understanding of the `ox-mythoras` codebase (Tauri + React + TypeScript + Vite). It summarizes the architecture, key components, data flow, build/dev setup, and an evaluation of the current repository state with recommended next steps.

---

## High-level goal and intent

From reading the repository, the application is a desktop-first game/campaign management UI built with React and packaged via Tauri. The UI exposes a flexible panel system (game view, inventory, world map, chat, squads, competitions, etc.). Panels are movable/resizable, persisted as layouts, and the app offers a right-hand sidebar for panel management, saving/loading layouts, and toggles for UI features.

Key user-facing intents:
- Provide a main `Game View` canvas and many auxiliary panels a DM/player might use.
- Offer drag-and-resize panel management with snap-to-grid.
- Save and restore panel layouts to localStorage.
- Run as a Tauri desktop app for better OS integration and shipping as native binary.

---

## Project layout (important files)

- `src/` — Application source (React + TypeScript)
  - `main.tsx` — App mount / entry
  - `App.tsx` — Primary top-level UI (header, main canvas, panel rendering loop, right sidebar)
  - `components/` — Panels and UI primitives; includes `ui/` subfolder with shared components
    - `SimpleGameViewPanel.tsx`, `InventoryPanel.tsx`, `WorldMapPanel.tsx`, `ChatPanel.tsx`, etc.
    - `BasicPlaceholder.tsx` — small placeholder used for panels not yet implemented
    - `constants/` and `config/` — various panel and layout constants
  - `hooks/` — `useDragAndResize`, `usePanelManagement`, `useLayoutManagement` for state and interactivity
  - `config/panels.tsx` — map of panel type -> React component and `PANEL_CONFIGS` describing sizing constraints
  - `constants/layout.ts` — grid size, header height, sidebar width
  - `types/` — panel types and other domain types
  - `utils/formatting.ts` — date/time formatting helpers

- `specs/` — design documents; will add initialization document here (`INITIALIZATION_DOCUMENT.md`)
- `src-tauri/` — Tauri-specific files and Rust glue
  - `tauri.conf.json` — configured devUrl, beforeDevCommand, etc.
  - `Cargo.toml` — Rust side package config

---

## Runtime & dev setup

- The app is a Vite project configured for Tauri with `@vitejs/plugin-react-swc`.
- Vite server is configured with `server.port` 1420 and `strictPort: true` in `vite.config.ts` which matches the `devUrl` in `src-tauri/tauri.conf.json`.
- Package manager scripts (via `package.json`):
  - `pnpm dev` runs Vite
  - `pnpm build` runs `tsc && vite build`
  - Tauri dev is expected to run `pnpm dev` before opening via `tauri` tooling.
- The repository uses TypeScript with `jsx: react-jsx` and `moduleResolution: bundler`.

Node and environment notes:
- The project expects modern Node (we used Node 22 to ensure compatibility with the Tauri tooling and plugins during development).

---

## Key runtime behaviors and UX flow

- Panels are defined in `PANEL_COMPONENTS` and `PANEL_CONFIGS`. `App.tsx` iterates `panels` from `usePanelManagement()` and looks up the React component by `panel.type`.
- Each panel is positioned absolutely and receives `width`, `height`, and optional UI toggles (e.g., `showFPS` for `gameview`).
- `useDragAndResize` handles mouse interactions for dragging and resizing; it returns `draggedPanel`, `isResizing`, and `handleMouseDown` used by `App.tsx`.
- `usePanelManagement` exposes functions such as `addPanel`, `removePanel`, `togglePanelLock`, `resetLayout`, `createDefaultLayout`, `getAvailableWidth`, and `getAvailableHeight`.
- Layout persistence: saved layouts are stored in `localStorage` under the key `mythoras-layouts` and can be loaded from the sidebar.

---

## Tauri integration

- `src-tauri/tauri.conf.json` configures Tauri to launch a dev frontend at `http://localhost:1420`.
- The Rust backend is minimal (Tauri and `tauri-plugin-opener` installed), providing OS-level packaging and plugin hooks.
- Build hooks in `tauri.conf.json` call `pnpm dev` (development) and `pnpm build` (production) before launching Tauri.

---

## Code health and static checks

- The repo uses TypeScript strict options. Running `pnpm tsc --noEmit` surfaces unused variables, missing types, and a handful of module resolution warnings associated with versioned import aliases (these are addressed at build-time via Vite aliases).
- Several components have unused imports or declared-but-unused variables; these should be cleaned up for developer ergonomics and to satisfy `tsc` in CI.

---

## Evaluation of current implementation (what exists)

1. Panel system & layout
   - Implemented: core panel rendering loop (`App.tsx`) with title bar, drag/resize handles, and conditional header rendering.
   - Implemented: `PANEL_CONFIGS` for sizing constraints and icons.
   - Implemented: `PANEL_COMPONENTS` mapping to real components and placeholder components for unimplemented features.
   - Implemented: `useDragAndResize` and `usePanelManagement` hooks provide the majority of the interaction logic.

2. Panels and UI
   - Implemented: several panels (Inventory, World Map, Chat, Competitions, SimpleGameView, SimpleSquad).
   - Many panels are partially implemented or use `BasicPlaceholder` as a stopgap.
   - The UI library is a local, opinionated set of primitives in `components/ui/*` (button, popover, toggle, etc.).

3. Persistence and layout management
   - Implemented: Save/load layouts using localStorage; createDefaultLayout and resetLayout logic exists.

4. Build & Tauri
   - Implemented: Tauri configuration wired to Vite dev server; Rust/Cargo files present.
   - Already set up to use `pnpm dev` as the frontend dev command (updated during debugging).

---

## Gaps and immediate improvements

- Clean up TypeScript errors/warnings: many unused imports/variables and some implicit any parameters; run `pnpm tsc` and address the top 20 issues.
- Module alias types: add `src/types/module-aliases.d.ts` to declare versioned alias modules used in imports so `tsc` won't error about missing type declarations.
- Tests: no test harness exists — add unit tests for key hooks (`useDragAndResize`, `usePanelManagement`) and snapshot tests for core rendering.
- Accessibility: ensure keyboard navigation and ARIA attributes in panel controls (drag handles, title buttons).
- Panel lifecycle: consider lazy-loading heavy panels (dynamic imports) to speed startup.

---

## Recommended next steps (short-term roadmap)

1. Fix TypeScript noise and add module alias d.ts entries so `pnpm tsc` is clean.
2. Add documentation to `specs/` about panel lifecycle and event flow (for contributors).
3. Add unit tests for core hooks.
4. Replace placeholders with initial implementations for highest-priority panels (Inventory, GameView).
5. Add CI: run `pnpm tsc --noEmit` and `pnpm test` on PRs.

---

## Appendix — Useful locations

- `src/App.tsx` — main layout, panel rendering loop.
- `src/config/panels.tsx` — panel -> component mapping and configs.
- `src/hooks/usePanelManagement.ts` — panel state persistence and helpers.
- `src/hooks/useDragAndResize.ts` — mouse interactions giving drag/resize behavior.
- `src/components/ui/` — UI primitives.
- `src-tauri/tauri.conf.json` — Tauri frontend dev URL and pre-dev/before build commands.

---

If you want, I can expand any section (e.g., a detailed call graph for panel rendering, or a contributor onboarding checklist) or generate the `src/types/module-aliases.d.ts` file and fix the top TypeScript errors next.







