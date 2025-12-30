0.5 — UI App Shell Improvements

Goal
- Plan and document changes to the application shell so the client behaves like a fixed game viewport, eliminate duplicated HUD elements, and refine header/sidebar controls for a cleaner player experience.

Branch (local)
- `task/0.5-ui-shell`

What to do (high level)
1. Audit and fix viewport overflow caused by hidden sidebar (make shell a fixed viewport; prevent scrollbars).
2. Remove duplicated HUD displays (deduplicate FPS / controls between GameView and shell).
3. Minimize Game View panel header by default (or convert Game View to shell-level primary view).
4. Remove top-level Simulation button and simplify Panels control to icon-only small button.
5. Decide whether Game View should remain a panel or be part of the shell; document recommended approach and migration plan.
6. Add responsive breakpoint guidance for the Game View and shell (spec for behavior across viewport sizes).

Deliverables
- `DISCUSSION.md` — detailed analysis and recommended changes (this file).
- `BRANCH.txt` — branch name.
- `OUTCOME.md` — to be filled after implementation.

Acceptance Criteria
1. No horizontal or vertical scrollbars caused by sidebar hiding mechanism at common resolutions (1280x720, 1440x900, 1920x1080).
2. Single source of truth for HUD values (FPS, position, time) — displayed only once.
3. Header simplified per spec (no Simulation button; Panels button icon-only).
4. Game View header minimized by default or Game View integrated into shell per final decision.



