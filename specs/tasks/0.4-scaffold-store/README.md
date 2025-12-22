0.4 — Scaffold QueryClient & Zustand stores

Goal
- Scaffold the TanStack Query provider and initial Zustand stores for `ui`, `panel`, and `simulation` so we can begin migrating state out of inline hooks and into central stores.

Branch (local)
- `task/0.4-scaffold-store`

What to do
1. Create `QueryClient` instance and provider integration.
2. Add `src/stores/` with initial store files:
   - `queryClient.ts` (export QueryClient)
   - `panelStore.ts` (Zustand store with panel actions)
   - `uiStore.ts` (Zustand store for UI toggles)
   - `simulationStore.ts` (Zustand placeholder for simulation state)
3. Add `BRANCH.txt` recording the local branch name.
4. Do not replace `usePanelManagement` yet; this task only scaffolds stores and wiring.

Deliverables
- `src/stores/queryClient.ts`
- `src/stores/panelStore.ts`
- `src/stores/uiStore.ts`
- `src/stores/simulationStore.ts`
- `specs/tasks/0.4-scaffold-store/BRANCH.txt`

Acceptance Criteria
1. QueryClient provider is added to `src/App.tsx` (wrapping root).
2. Store files exist and export usable hooks.
3. `BRANCH.txt` present.


