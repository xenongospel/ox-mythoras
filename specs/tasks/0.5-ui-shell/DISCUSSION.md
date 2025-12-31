UI App Shell — task 0.5 discussion

Context
- Current behavior: the right-hand sidebar is animated off-screen when closed by translating it; this can create layout overflow and visible scrollbars. HUD information is duplicated (inside Game View and in shell). Some header controls (Simulation toggle, Panels label) are redundant or too large for a compact header.

Goals for 0.5
- Make the app a fixed viewport where the Game View content matches the viewport size and does not cause overflow when sidebars animate.
- Remove duplicate HUD elements and centralize HUD rendering.
- Minimize the Game View header (or integrate Game View as shell content) while preserving modularization.
- Simplify header controls (remove Simulation button; make Panels control icon-only).

Analysis & recommended actions

1) Fixed viewport & sidebar behavior
- Problem: using CSS transform/translate to move the sidebar can still allow the sidebar element to occupy layout space (depending on absolute/relative positioning and overflow settings), and CSS transforms can create compositing but not remove scrollable content in all layouts.
- Recommendation:
  - Ensure the main shell root uses overflow: hidden and a fixed viewport sizing:
    - `html, body, #root` and the top-level app container should be height: 100%; overflow: hidden.
    - The central content area (Game area) should use absolute/flex layout inside the fixed container, not expanding the document flow.
  - Position the DevToolkit/sidebar as `position: absolute` or `position: fixed` within the shell so its off-screen transform does not change document size.
  - When hiding the sidebar, prefer translateX with the sidebar element removed from layout (absolute/fixed) or use `right: -width` with overflow hidden on parent.
  - Add CSS rules to prevent body scroll when app is mounted (desktop app still should not scroll).
  - Add breakpoints and container queries: for small viewports collapse panels into a stacked modal rather than sidebars.

2) HUD deduplication
- Problem: FPS/Pos/Time appear in both Game View overlays and Shell HUD.
- Recommendation:
  - Choose a single authoritative HUD location (prefer Game View overlay for real-time info).
  - Remove duplicate shell widgets; keep a compact shell indicator (e.g., a small status dot) if needed.
  - Create a `hudStore` or use `simulationStore` to centralize FPS/pos/time data; both GameView and any shell widgets read from the store.
  - Ensure only one renderer displays current values to avoid sync or visual mismatch.

3) Game View header & modularization decision
- Options:
  - Keep Game View as a panel (modular): Pros — reusability, consistent panel lifecycle. Cons — needs special-casing to be primary full-screen panel, risk of duplicated chrome.
  - Promote Game View to shell content (not a draggable/resizable panel): Pros — simpler layout and guaranteed full-viewport behavior. Cons — loses panel modularity; migration effort for panel components.
- Recommendation:
  - Keep Game View component modular (to retain panel implementation) but treat its component as a special main view:
    - When a panel of type `gameview` exists and is flagged as `isMainView`, render it in a dedicated `GameViewContainer` that enforces full size and hides its panel title bar (or renders a minimized header).
    - This preserves modularity but ensures the Game View behaves like shell-level content.

4) Header controls & simulation button
- Remove the Simulation button from the shell header. Expose simulation controls inside DevToolkit for dev usage and as a small control in PlayerHUD for play (if needed).
- Panels button: show icon-only (no label); reduce padding to ~8px and keep aligned to right edge.

5) Implementation steps (concrete)
 1. Add CSS/Layout rules:
    - Ensure root and container are fixed height and overflow:hidden.
    - Make main content area absolute/flex so sidebar transforms do not cause scroll.
 2. Create `GameViewContainer` that:
    - Detects `gameview` panel from store.
    - Renders it full-size.
    - Suppresses panel header or renders minimized header.
 3. Centralize HUD values in `simulationStore` and remove duplicates.
 4. Update `AppSidebar`/`DevToolkit` to not display HUD data.
 5. Update header:
    - Remove simulation button.
    - Change Panels control to icon-only small button; ensure accessible tooltip.
 6. Add breakpoints and fallback behaviors.

Acceptance criteria
- Fixed viewport with no scrollbars at standard window sizes.
- Single HUD source visible (no duplicates).
- Game View header minimized and Game View fills main content area.
- Header simplified per spec.




