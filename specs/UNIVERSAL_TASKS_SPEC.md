Universal Tasks Spec — ox-mythoras

This document describes the task-oriented folder convention and the README semantics each task must include.

Folder layout (under `specs/`):

- `specs/tasks/` — root for all tasks (each task gets a versioned folder).
- `specs/tasks/<version>-<short-name>/` — one folder per task. Use semantic numbering: major.minor (e.g., `0.1-panel-ui-spec`).
  - `README.md` — human-friendly brief describing the task, acceptance criteria, stakeholders, and estimate.
  - `CONTRIBUTOR_SPEC.md` — in-depth spec or design doc required to complete the task.
  - `OUTCOME.md` — short list of expected artifacts (files changed, tests added, behavior).
  - `notes/` — optional folder for screenshots, tracings, or exploratory notes.
  - `BRANCH.txt` — (required) file containing the local feature branch name used for the task (format: `task/<version>-<short-name>`).

Task README semantics (`README.md`):

- **Title** — one-line task title using versioned prefix.
- **Goal** — 1-2 sentence statement of what success looks like.
- **Requirements** — numbered list of requirements; each requirement should be testable/observable.
- **Deliverables** — files, UI changes, and documentation that will be produced.
- **Owner** — who is responsible.
- **Estimate** — rough time estimate (hours).
- **Acceptance Criteria** — pass/fail checks the reviewer can run.

Versioning rules:

- Use semantic versioning for tasks. For prototypes, prefer `0.x`. Increment minor for feature tasks (0.1 → 0.2), major for breaking changes (1.0).
- Each task folder name begins with the version (e.g., `0.1-panel-ui-spec`).

Branch rules (required)
- Create a local feature branch for each task with the name `task/<version>-<short-name>` (example: `task/0.2-panel-ui`).
- Record the branch name in `BRANCH.txt` in the task folder and in the `README.md` under "Branch (local)".
- Do not reuse version numbers. Versions must be unique and strictly increasing.

Workflow:

1. Create a task folder following the naming rules.
2. Add `README.md` describing the task.
3. Add `CONTRIBUTOR_SPEC.md` with the required technical details.
4. Implement changes in codebase and update `OUTCOME.md` with paths and summary.

This file should be used as the canonical template for all future work items stored in `specs/tasks/`.


Constants & magic-number policy

Purpose
- Reduce scattered literal numbers across the codebase by centralizing tunable values and defaults. This makes prototype tuning, auditing, and later production hardening easier.

Where to put constants
- Use `src/constants/` for runtime constants. Prefer a focused file for cross-cutting values:
  - `src/constants/values.ts` — global, high-level values (simulation ticks, query defaults, UI defaults).
  - `src/constants/layout.ts` — layout-specific values (GRID_SIZE, HEADER_HEIGHT, SIDEBAR_WIDTH).

Guidelines
- Named constants only: avoid inline numeric literals (e.g., replace `50` with `SIMULATION.TICK_MS`).
- Group related constants under objects (e.g., `SIMULATION`, `QUERY`, `UI`) to make import surfaces small and semantic.
- Use units in names when relevant (e.g., `STALE_TIME_MS`, `TICK_MS`).
- For constants that may need runtime tuning during development, surface them via the `uiStore` or `DevToolkit` so developers can adjust without code changes.
- Add a short JSDoc comment above each constant explaining purpose and acceptable range.
- When adding a new constant, update `specs/UNIVERSAL_TASKS_SPEC.md` (this file) with a one-line justification and reference where it is used.

Runtime overrides & environment
- Prefer compile-time defaults in `values.ts`. If a runtime override is required for testing or CI, read overrides from:
  - `import.meta.env` (build-time env), or
  - `uiStore` (for dev tuning).
- Do not read raw environment variables across many files; centralize env reads in a single adapter or the constants module.

Testing and audit
- Add unit tests for any constants that materially affect behavior (e.g., tick durations, timeouts) to guard against regressions when adjusting values.
- Keep a changelog entry in the task folder when changing core constants that may affect gameplay or network semantics.

Example
- `src/constants/values.ts` contains:
  - `export const SIMULATION = { TICK_MS: 50 }`
  - `export const QUERY = { STALE_TIME_MS: 60000, RETRY: 1 }`
  - `export const UI = { DEFAULT_FPS: 60 }`

