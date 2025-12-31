Responsive breakpoints — task 0.5

Purpose
- Define responsive behavior and breakpoints for the app shell and Game View so the client behaves predictably across window sizes (desktop, laptop, small laptop, large tablet) and to provide guidance for implementation and QA.

Goals
- Ensure Game View remains the primary full-viewport canvas on wide screens and gracefully degrades to stacked or modal presentation on narrow screens.
- Prevent layout overflow and preserve usability for panel controls and DevToolkit.
- Provide clear acceptance criteria and test steps for responsive behavior.

Target breakpoints (desktop-first)
- XL (>= 1600px): Full desktop. Game View + right dev sidebar visible; panels can be arranged in multi-column layouts.
- L (>= 1280px & <1600px): Standard laptop. Game View fills most width; DevToolkit opens as overlay/side rail; optional secondary panels displayed as bottom row.
- M (>= 1024px & <1280px): Small laptop / large tablet. Collapse auxiliary panels into a collapsible bottom drawer; Game View remains primary above fold.
- S (< 1024px): Tablet/phone width. Use single-column stacked UI: Game View as primary full-screen modal; auxiliary panels accessible via modal menus or full-screen overlays; DevToolkit hidden or accessed via separate debug route.

Behavior rules
- Game View sizing:
  - Always calculate available viewport using container width/height minus any visible shell chrome (header/footer).
  - On breakpoint transitions, recalc and reflow Game View size and update rendering canvas immediately (use ResizeObserver or window resize handler).

- Panels:
  - Panels respond to breakpoints:
    - XL/L: panels are floating/resizable as now.
    - M: panels snap to bottom dock (collapsed by default).
    - S: panels convert to modal sheets; opening a panel pauses main interaction focus.
  - Persist panel layout per breakpoint if desirable (advanced).

- DevToolkit:
  - Visible only in XL/L as a side rail by default.
  - In M, DevToolkit collapses into floating button that opens a modal.
  - In S, DevToolkit is hidden unless explicitly enabled via an env flag.

- Header & Controls:
  - Keep header compact at all sizes; prefer icon-only controls on the far right.
  - Remove textual labels for header buttons on M and S; use tooltips.

Implementation notes
- CSS:
  - Use Tailwind responsive utilities for most adjustments (sm:, md:, lg:, xl:).
  - Avoid large media-query blocks; prefer utility-driven classes and conditional rendering in React for structural changes.
  - Use `ResizeObserver` on the GameView container to trigger reflow rather than relying solely on window.resize.

- JS/React:
  - Centralize breakpoint detection via a small hook `useBreakpoint()` that exposes current breakpoint key and width/height.
  - On breakpoint changes, dispatch actions to `uiStore` to adapt panel presentation (dock/stack/modal).
  - Keep animation/transitions smooth: prefer CSS transitions for transforms; avoid layout-triggering animations that cause reflow.

Accessibility & UX
- Ensure modals and drawers trap focus and restore focus when closed.
- Provide keyboard shortcuts to open/close panel drawer and DevToolkit in M/S modes.
- Test with reduced motion preferences and screen readers.

Testing & Acceptance
- Manual checks at widths: 1920, 1600, 1366, 1280, 1024, 768, 375.
- Automated tests:
  - Snapshot tests for critical layout components at breakpoints (GameView, header, DevToolkit).
  - Integration test: resize window and assert GameView canvas dimensions update and no body scrollbars appear.

Migration steps
1. Add `useBreakpoint()` hook (reads window.innerWidth and maps to keys; debounced).
2. Update `usePanelManagement` and `PanelRenderer` to respect breakpoint policy (dock or modal behavior).
3. Add CSS Tailwind utility classes for breakpoint-driven styles.
4. Add ResizeObserver to GameView container to recalc canvas size on content size changes.

Notes
- Start with a simple breakpoint map (sm/md/lg/xl) and iterate based on playtesting feedback.
- Keep mobile behavior conservative (focus on inventory/market features rather than realtime play).




