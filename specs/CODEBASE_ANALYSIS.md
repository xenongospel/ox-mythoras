# Codebase Analysis — ox-mythoras

This document is a developer-focused analysis of the `ox-mythoras` repository. It consolidates what the project is trying to achieve, the responsibilities of each layer, how data and control flow through the system, notable implementation patterns, gaps, and recommended next steps.

---

## 1) High-level intent

- Desktop-first campaign/game management UI built with React + TypeScript and packaged with Tauri.
- Primary UX: a flexible, movable/resizable panel system (Game View, Inventory, World Map, Chat, Squads, Competitions, etc.) that a DM or player can arrange, persist, and use.
- App aims to be a native-feeling desktop app (via Tauri) while remaining web-first in development (Vite).

---

## 2) Layers and responsibilities

- `src/` — Application source (React + TypeScript)
  - UI layer (components): visual building blocks and panels live under `src/components/` and `src/components/ui/`.
  - Top-level app: `src/App.tsx` — header, panel rendering loop, sidebar, global state hooks usage.
  - Config: `src/config/panels.tsx` — panel-to-component mapping and `PANEL_CONFIGS`.
  - Constants: `src/constants/` (e.g., layout constants such as grid size, header height, sidebar width).
  - Hooks: `src/hooks/` — behavioural logic (drag/resize interactions, panel management, layout persistence).
  - Types: `src/types/` — domain types (panel shapes, props).
  - Utils: `src/utils/` — miscellaneous helpers (e.g., `formatting.ts`).

- Build / Tooling
  - `package.json` + Vite config: dev/build workflow and dependencies (React, Vite, TypeScript, Tailwind, React Three, Radix UI, Tauri API).
  - `src-tauri/` — Tauri configuration and minimal Rust glue (packaging).

- Persistence/Platform
  - Local persistence is currently via `localStorage` (layouts under key `mythoras-layouts`).
  - Native packaging and OS concerns delegated to Tauri (Rust side).

---

## 3) Key runtime flows

- Panel lifecycle and rendering
  - Panels are stored in state via `usePanelManagement()` and each item includes position, size, id, title, type, locked flag.
  - `App.tsx` maps `panels` → `PANEL_COMPONENTS[panel.type]` and renders each panel absolutely positioned.
  - Panels optionally show a header with drag handle and controls (lock/unlock, minimize, close).

- Drag & resize
  - `useDragAndResize()` exposes `handleMouseDown`, `draggedPanel`, and `isResizing`. Mouse events set temporary dragging/resizing state used to update panel positions/sizes.
  - Grid snapping is applied via `GRID_SIZE` (20px in config) and layout math references constants in `src/constants/layout`.

- Persistence (save/load)
  - Layouts saved to `localStorage` as JSON; `saveLayout()` and `loadLayout()` exist in `App.tsx` and rely on `createDefaultLayout()` / `resetLayout()` from `usePanelManagement`.

- Panel configuration
  - `src/config/panels.tsx` centralizes `PANEL_COMPONENTS` and `PANEL_CONFIGS` which define min sizes, aspect ratios, icons, and whether panels are main views.

---

## 4) Notable implementation patterns & libraries

- UI primitives: a local `components/ui/` set implements small building blocks (`Button`, `Input`, `Popover`, etc.). Radix UI and `lucide-react` provide some primitives/icons.
- Component mapping: panels are registered centrally in `config/panels.tsx` which allows the `App` loop to be generic.
- Hooks-first architecture: interaction logic is encapsulated into hooks (`usePanelManagement`, `useDragAndResize`) which makes unit testing and reasoning about state easier.
- Tauri integration: `package.json` scripts and `src-tauri/tauri.conf.json` expect `pnpm dev` / `vite` to be used during development; the Rust side appears minimal and used for packaging and optional native plugins.
- Optional 3D: dependencies like `@react-three/fiber` and `@react-three/drei` suggest possible or planned 3D visualization in `Game View`.

---

## 5) Important files (quick map)

- `package.json` — dependency list and scripts (Vite, Tauri, TypeScript)
- `src/main.tsx` — React mount/entry
- `src/App.tsx` — main app: header, panel rendering loop, sidebar, global UI toggles
- `src/config/panels.tsx` — `PANEL_COMPONENTS` / `PANEL_CONFIGS`
- `src/hooks/usePanelManagement.ts` — panel state, persistence helpers
- `src/hooks/useDragAndResize.ts` — pointer interaction logic
- `src/components/` — individual panels (SimpleGameViewPanel, InventoryPanel, WorldMapPanel, ChatPanel, etc.) and `components/ui/` primitives
- `src/constants/layout.ts` — `GRID_SIZE`, `HEADER_HEIGHT`, `SIDEBAR_WIDTH`
- `src/utils/formatting.ts` — helper functions used in header/date display
- `src-tauri/tauri.conf.json` + Rust files — native packaging and build hooks
- `specs/INITIALIZATION_DOCUMENT.md` — existing high-level analysis (this repo)

See Appendix for component-to-file mapping discovered (partial).

---

## 6) Observations and gaps (what I noticed)

- TypeScript noise: there are unused imports and variables which will cause `tsc --noEmit` to report issues. Some alias imports may lack declaration files.
- Missing tests: no test harness or unit tests for core hooks or components.
- Some panels are placeholders: many panel components return `BasicPlaceholder` — useful for scaffolding but incomplete for UX.
- Accessibility: drag handles and interactive controls may need ARIA attributes and keyboard fallbacks.
- Lazy-loading: heavy panels (e.g., 3D Game View) are not yet lazy-loaded — initial load time could be improved by code-splitting.
- Local-only persistence: layouts are stored in `localStorage` only; consider offering file export/import or Tauri-backed filesystem persistence for desktop builds.

---

## 7) Recommended short-term next steps

1. Run `pnpm tsc --noEmit` and fix the highest-priority TypeScript errors (unused imports/implicit anys). Add `src/types/module-aliases.d.ts` for any versioned aliases.
2. Add unit tests for `usePanelManagement` and `useDragAndResize` to lock behavior early.
3. Replace `BasicPlaceholder` for the highest-priority panels (Inventory, GameView) with lightweight implementations or demos.
4. Add lazy-loading for heavy panels (dynamic import + React.Suspense) to speed startup.
5. Add an explicit contributor-focused spec in `specs/` describing the panel lifecycle (events, hooks, and responsibilities). Consider adding a small diagram.
6. Consider storing layouts in the native filesystem via Tauri for a desktop-first persistence option.

---

## Appendix — Component → file mapping (partial, observed)

- `App` (main loop): `src/App.tsx`
- Panel config & mapping: `src/config/panels.tsx`
- Grid and layout constants: `src/constants/layout.ts`
- Formatting helpers: `src/utils/formatting.ts`
- `usePanelManagement`: `src/hooks/usePanelManagement.ts`
- `useDragAndResize`: `src/hooks/useDragAndResize.ts`
- `PANEL_TYPES` / placeholders: `src/components/constants/panels.tsx`
- UI primitives: `src/components/ui/*`
- Tauri config: `src-tauri/tauri.conf.json`

If you want, I can also:
- Produce a DOT/mermaid diagram of the panel rendering and event flow.
- Generate `src/types/module-aliases.d.ts` and attempt an initial `pnpm tsc --noEmit` to list top TypeScript issues and optionally fix the trivial ones.
- Create a contributor onboarding checklist file in `specs/CONTRIBUTOR_GUIDE.md`.



