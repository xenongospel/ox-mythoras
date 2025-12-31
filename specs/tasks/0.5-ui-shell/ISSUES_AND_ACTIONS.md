ISSUES & ACTIONS — task 0.5 UI Shell

Summary
- This document records observed runtime/layout problems discovered during prototype testing and proposes concrete, prioritized actions. The user requested no code changes now — this file captures the investigation and proposed fixes so we can implement them in controlled steps.

Problems observed

1) Panels misbehave when window is resized below minimum panel dimensions
- Symptom: When the overall client/window is resized smaller than panels' default/min sizes, panels start to overlap, move unexpectedly, or become partially inaccessible. Resizing and docking logic (PanelRenderer, usePanelManagement, useDragAndResize) can compute positions/sizes that don't respect min constraints or available space.
- Likely causes:
  - The app allows panel width/height to be set below their configured minWidth/minHeight during resize operations.
  - The repositioning logic doesn't correctly clamp panel positions when availableWidth/availableHeight get smaller than some panels.
  - Panel docking logic (for small breakpoints) may still allow floating panels to be positioned off-canvas.

2) No minimum native window size enforced (Tauri)
- Symptom: The desktop window can be resized arbitrarily small, which exposes the app to extreme layout edge-cases.
- Recommendation:
  - Enforce a minimum native window size in the Tauri config (e.g., width: 100, height: 100 for now) so the OS window manager won't let the user shrink below safe limits.
  - Also add an in-app guard: clamp availableWidth/availableHeight to a sensible minimum (e.g., 100px) before computing panel layout changes.

3) HUD elements appear outside the Game View panel and can be obscured on resize
- Symptom: FPS/controls/minimap are rendered by the PlayerHUD or container and may not be clipped/anchored to the Game View panel. When panels move or the Game View resizes, HUD appears detached.
- Recommendation:
  - Make Game View the single authoritative renderer for realtime overlays when it is the main view (keep PlayerHUD only as an aggregator or removed).
  - Move HUD markup inside the Game View panel so that it is positioned relative to the Game View area and gets clipped/masked naturally.
  - Ensure only one component renders HUD (avoid duplicate renderers).

4) Sidebar visible on startup despite preference
- Symptom: The sidebar sometimes shows on app launch even though `uiStore` default is false.
- Likely causes:
  - Persisted layouts (localStorage) may contain sidebar state that rehydrates and overrides default.
  - Multiple sources of truth (component state vs uiStore vs persisted data) cause a mismatch.
- Recommendation:
  - Decide canonical source for `sidebarOpen` (prefer `uiStore` with persistence adapter that enforces default on first run).
  - When migrating, add a one-time migration step that normalizes persisted layouts to ensure `sidebarOpen` default is respected.

5) Overlap between Game View panel and sidebar during resize
- Symptom: While resizing the window, the Game View panel sometimes overlaps and obscures the sidebar even when the sidebar is open.
- Likely causes:
  - Layout calculations for availableWidth may be performed before the sidebar's transform/transition completes, leading to stale measurements.
  - Z-index ordering may allow the Game View to render above the sidebar while it should remain below.
- Recommendation:
  - Simplest immediate mitigation: comment out (disable) the in-app sidebar while the prototype is stabilised, and move developer tools into a separate window (Tauri window) or gated DevToolkit.
  - Longer-term fix: coordinate animation/measurement using ResizeObserver and disable pointer-events on transitioning elements or wait for transitionend before recalculating layout.

Proposed prioritized actions (implementation plan)

Phase A — Safety & UX (high priority)
1. Add Tauri minimum window size (tauri.conf.json) and an in-app clamp to `getAvailableWidth/getAvailableHeight` that returns Math.max(raw, 100).
2. Prevent panels from being resized or positioned below their configured minWidth/minHeight in `useDragAndResize` and panel resize handlers (clamp values).
3. Move HUD overlays into the Game View panel component (or ensure PlayerHUD is rendered inside the current Game View bounding box). Make `simulationStore` authoritative.
4. Disable (comment out) the DevToolkit/sidebar from main window render until we have a robust layout (optionally spawn a separate Tauri devtools window).

Phase B — Robustness
1. Update reposition logic to handle narrow viewports: when availableWidth < sum of fixed panels, convert some panels to docked/modal mode automatically.
2. Use ResizeObserver on GameView container and sidebar to coordinate layout recalculations during transitions and window resizes.
3. Improve z-index management: ensure sidebar and docks have higher stacking context than game panels where appropriate.

Phase C — Polishing
1. Persist user layout choices but store defaults per breakpoint; ensure migrations don't override intentional defaults.
2. Add unit/integration tests for layout behavior (resize scenarios).
3. Add visual regression tests for critical breakpoints.

Notes on developer-window idea
- Spawning a separate DevToolkit window is feasible with Tauri: create a new Tauri window (Rust side) that loads a route or a separate frontend entry for devtools. This avoids overlaying the main client and prevents layout interference. It also makes it simple to toggle/debug without affecting player UX.

Acceptance criteria (for Phase A)
- Normal window resizing down to minimum (100x100) does not cause panels to overlap or disappear.
- HUD overlays are visible only inside the Game View when it is the main view and get clipped correctly when Game View is out of view.
- Sidebar is closed by default on first run and is not obscured by the Game View while open (or sidebar is removed per prototype).

Next steps
- If you approve Phase A, I will create a feature branch `task/0.5-ui-shell-phaseA` and implement the ordered changes, starting with Tauri config and in-app clamps, then panel clamping, then HUD movement, and finally commenting out the sidebar and adding a Tauri-based DevToolkit window skeleton.




