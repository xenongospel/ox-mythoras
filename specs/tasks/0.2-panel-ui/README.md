0.2 — Panel Template & Startup Layout

Goal
- Provide the implementation artifacts and documentation for task 0.2: make the `Game View` the sole startup panel, introduce a reusable `PanelTemplate`, and prepare the codebase for future panel implementations.

Branch (local)
- `task/0.2-panel-ui` (create locally before implementing the task and record here)

Requirements
1. Ensure default layout on startup contains only `gameview`.
2. Add `PanelTemplate` component and helper functions/types under `src/components/`.
3. Update layout/hooks (`usePanelManagement`, `useLayoutManagement`) to default to Game View and reset to a single locked Game View.
4. Update Tauri start window size to 1280x720 in `src-tauri/tauri.conf.json`.
5. Document the Tauri backend and record changes in `specs/TAURI_BACKEND_SPEC.md`.

Deliverables
- `src/components/PanelTemplate.tsx`
- `src/hooks/usePanelManagement.ts` (createDefaultLayout changes)
- `src/hooks/useLayoutManagement.ts` (resetLayout changes)
- `src-tauri/tauri.conf.json` (window size)
- `specs/TAURI_BACKEND_SPEC.md` (documentation)
- `OUTCOME.md` (this folder) — to be filled after verification.

Owner
- You (project lead) / contributor assigned locally

Estimate
- 1–3 hours to implement and verify locally.

Acceptance Criteria
1. App starts with only the `Game View` panel present.
2. `PanelTemplate` exists and is documented.
3. Tauri window size reflects 1280x720.
4. Branch name recorded in this README and `BRANCH.txt`.



