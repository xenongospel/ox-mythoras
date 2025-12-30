Changelog — task 0.5 UI Shell

2025-12-23 — Added Panel Dock (prototype)
- Added `src/components/PanelDock.tsx` — a lightweight dock showing available panels and allowing toggling them on/off.
- Dock behavior:
  - Horizontal compact dock on small/medium breakpoints (bottom center).
  - Vertical dock on large/extra-large (left center).
  - Uses `PANEL_CONFIGS` to render icons and titles.
  - Adds/removes panels via `panelStore`.

2025-12-23 — Responsive improvements
- Added `src/hooks/useBreakpoint.ts` to centralize breakpoint logic.
- PanelRenderer now docks panels at bottom on md/sm breakpoints.
- DevToolkit hidden on md/sm breakpoints.

2025-12-23 — HUD / viewport fixes
- Centralized HUD into `simulationStore`.
- Removed GameView-embedded HUD duplicate overlays.
- Enforced fixed viewport (`html, body, #root` overflow hidden) via Tailwind base layer.



