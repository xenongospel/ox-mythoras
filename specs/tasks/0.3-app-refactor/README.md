0.3 — App Refactor & State Strategy

Goal
- Define the refactor approach for `src/App.tsx` to separate Shell, PanelRenderer, GameView, PlayerHUD and a DevToolkit. Capture decisions about global state management and live-service readiness so the implementation can follow a clear architecture.

Branch (local)
- `task/0.3-app-refactor`

What to do (high level)
1. Document the proposed decomposition and migration plan (this task).
2. Capture decisions about global state management (avoid React Context; prefer TanStack ecosystem).
3. Record live-service considerations (offline-first, server-authoritative options, sync strategies).
4. Do NOT implement code in this task — this is a documentation/planning task only.

Deliverables
- `DISCUSSION.md` — detailed notes and recommendations (this file).
- `README.md` (this file) — task overview and branch information.
- `BRANCH.txt` — branch name to use locally.

Acceptance Criteria
1. `DISCUSSION.md` present and reviewed.
2. Branch name recorded in `BRANCH.txt`.
3. Clear, actionable migration steps described for engineering to implement in follow-up tasks.
 
Status
- Completed: yes
- Summary of completed work:
  - Extracted `Shell` component from `App`.
  - Implemented `PanelRenderer` to render panels generically.
  - Moved `AppSidebar` into a dev-only `DevToolkit` gated by `import.meta.env.DEV` and a Ctrl+` hotkey.
  - Implemented `PlayerHUD` overlays (FPS, controls, minimap) and integrated into `App`.
  - App now composes `Shell`, `PanelRenderer`, `PlayerHUD`, and `DevToolkit`.


