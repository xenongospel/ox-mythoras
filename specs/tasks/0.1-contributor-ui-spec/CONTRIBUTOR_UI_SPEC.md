Contributor-focused UI Spec — Panels & Core Interaction

Purpose
- Provide a concrete, implementation-oriented spec for contributors building UI panels and game-related interactions. The intent is to be reusable across multiple panels while keeping the rules simple enough for a prototype.

Principles
- Single Responsibility: each panel provides one focused view or workspace (e.g., GameView, Inventory, Chat).
- Predictable shell: every panel uses the same frame (title bar, controls, content area, resize handle) so behavior is consistent.
- Minimal contract surface: panels accept a small set of typed props and emit a few standardized events.
- Accessibility-first: keyboard focus, ARIA attributes, and logical tab order are required.
- Composability: panels should be simple containers — heavy logic should live in hooks or domain modules.

Panel Shell (required)
- Title bar:
  - Contains: drag handle area (left), state indicator (locked/unlocked), title text (center-left), control buttons (right).
  - Drag handle: exposes a stable pointer target with role="toolbar" and aria-label="Drag panel".
  - Buttons: lock/unlock, minimize, close. All buttons must have aria-label and keyboard operability (Enter/Space).
  - Title text must use a single-line truncated layout and support an optional subtitle line.

- Content area:
  - Receives width and height props in pixels.
  - Should be scrollable internally only when content overflows; the panel shell manages overall height/width.
  - Panels should avoid global document-level scroll when interacting.

- Resize handle:
  - Bottom-right (or edges) with a minimum 16x16px interactive area.
  - Must provide aria-roledescription="resize" and keyboard support: Ctrl+Arrow keys to nudge size (+Shift for larger steps).

Panel Props (TypeScript interface suggestion)
interface PanelProps {
  id?: string;
  width: number; // px
  height: number; // px
  locked?: boolean;
  onAction?: (action: { type: string; payload?: any }) => void;
  className?: string;
}

Events & Actions
- Standardize panel→shell communication via `onAction`:
  - type: "request-lock" | "toggle-header" | "minimize" | "focus" | "custom:<domain>"
  - payload: domain data
- Shell→panel props: width, height, show* toggles (e.g., showFPS).
- Panels that require global state should use hooks (e.g., `usePanelState(id)`), not window-scoped singletons.

GameView as canonical panel
- GameView is the primary interaction surface and sets the standard for real-time interactions.
- Required GameView behaviors:
  - Receives `width`, `height`, and `showControls`, `showFPS`, `showMinimap` booleans.
  - Emits `onAction({ type: 'click', payload: { x, y } })` for in-canvas clicks and `onAction({ type: 'context', payload })` for right-clicks.
  - Accepts `focus()` call via `ref` to capture keyboard/mouse input.
  - Should be written as a thin stateless renderer delegating game logic to a simulation/controller module.

Styling & Theming
- Use CSS variables for colors and spacing at the shell level so panels can inherit theme without custom CSS.
- Keep typographic scale consistent — set base font-size at root and scale headers via rem units.
- Panels should opt-in to full-bleed content areas; avoid internal absolute positioning except for overlays.

Accessibility
- All interactive controls must be focusable via keyboard (tabIndex as needed).
- Provide keyboard equivalents for drag/resize and clear ARIA labels describing behaviors.
- Provide visible focus styles that meet 3:1 contrast.

Testing and Contract Validation
- For prototypes, prefer small smoke tests validating:
  - Panel renders with given width/height.
  - `onAction` events are emitted for click/close/lock interactions.
  - Header controls are keyboard-operable.

Developer notes — migrating old panels
- Existing panels should be refactored to implement `PanelProps` and `onAction` where practical.
- Use `SimpleGameViewPanel` as the reference implementation for behavior and prop contracts.


