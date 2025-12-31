# DETAILED SUMMARY OF CURRENT PROJECT — ox-mythoras

Last updated: 2025-12-31

This document is the **single source of truth** for:
- What this repository is building (the product direction).
- How you expect an Agent (and contributors) to work in this repo (process + auditing rules).
- The current architectural direction and why it evolved that way.

Primary sources:
- `specs/EXPORTED_CHAT.md` (historical decisions and prior work)
- `specs/UNIVERSAL_TASKS_SPEC.md` (process contract)
- `specs/tasks/*` (task-by-task audit trail)
- `specs/CODEBASE_ANALYSIS.md`, `specs/INITIALIZATION_DOCUMENT.md`, `specs/TAURI_BACKEND_SPEC.md` (architecture snapshots)

---

## Project North Star

### What we are building
- **Desktop-first** prototype client built with **React + TypeScript (Vite)**, packaged with **Tauri**.
- A **game-centric UI shell** where the **Game View is the primary interaction surface**.
- A modular panel ecosystem where secondary panels (inventory, chat, map, etc.) can exist, but the design is optimized around a **fixed game viewport** and predictable UX.

### What “prototype” means here
- Prioritize **iteration speed**, **organization**, and **clear documentation** over hardening.
- Avoid getting “hung up” on unit tests early; however, small smoke/contract checks are welcome when they protect core behavior.
- Keep architecture forward-compatible (offline-first now, possible online/live-service later), but don’t overbuild prematurely.

---

## Non‑negotiables / Working Agreements (Agent Expectations)

### Specs-first workflow and where decisions live
- New work should be tracked under `specs/tasks/` as a versioned task folder (see “Task system” below).
- High-level cross-task conventions live in `specs/UNIVERSAL_TASKS_SPEC.md`.
- Tauri/Rust backend status is documented in `specs/TAURI_BACKEND_SPEC.md`.
- “How the UI/panels should work” is documented as contributor-facing specs (see 0.1/0.2).

### Task system (auditing rules)
Canonical source: `specs/UNIVERSAL_TASKS_SPEC.md`.

- **Folder convention**: `specs/tasks/<version>-<short-name>/`
- **Semantic task versions**:
  - Use prototype versions: **`0.x`**.
  - **Versions must be unique and strictly increasing**. Never reuse a version.
  - If a task was mistakenly created with the wrong version, rename it (folders/docs) so the audit trail is monotonic and unambiguous.
- **Required task artifacts**:
  - `README.md`: goal, requirements, deliverables, acceptance criteria (and “Branch (local)”).
  - `BRANCH.txt`: the branch name for the task.
  - Task-specific spec docs as needed (e.g., `CONTRIBUTOR_*_SPEC.md`, `DISCUSSION.md`, audits, changelogs).
  - `OUTCOME.md` (recommended by the universal spec; not all tasks currently include it).

### Git workflow (local branches per task)
- For each task create a **local** feature branch named:
  - `task/<version>-<short-name>` (example: `task/0.2-panel-ui`)
- Record the branch name in:
  - `BRANCH.txt`
  - The task `README.md` (“Branch (local)” section)
- **No pushing** unless explicitly requested. Keep work local by default.

### Design priorities that guide decisions
- **Game View is special**:
  - It is a “main context” surface (the viewport) that other UI may orbit around.
  - It must be treated differently from secondary draggable/resizable panels.
- **Consistency via reusable contracts**:
  - Prefer a small, well-documented “panel contract” and shared wrappers/templates so future panels don’t re-invent chrome, ARIA, sizing semantics, etc.
- **Organization over tests** (for now), but keep behavior easy to validate manually.

---

## Current Architecture Snapshot (What matters today)

### Core UI composition direction
The project is evolving toward a clean separation of responsibilities:
- **Shell**: top-level chrome (header + fixed viewport container).
- **Game View container**: ensures the main viewport is full-size and stable.
- **Panel renderer / panel system**: renders secondary panels generically.
- **HUD + Dev tools**: consolidated and gated to avoid duplicated UI and layout instability.

This is explicitly discussed in task `0.3` and the later UI-shell work in task `0.5`.

### Panel philosophy (canonical vs secondary)
Key points (from 0.1/0.2 and later refinement in 0.5):
- **Game View is canonical**:
  - Full available width/height.
  - Often locked and treated like shell content (even if implemented as a “panel component” internally).
  - Sets the standard for real-time interaction patterns and overlays.
- **Secondary panels**:
  - Must adhere to a consistent panel contract.
  - Should be responsive and adapt to breakpoints (floating → dock → modal) rather than breaking layout.

### State strategy direction (prototype → production)
From task `0.3`:
- Prefer **TanStack Query** for server-synced state.
- Prefer a small global store (not React Context), with the documented recommendation being **Zustand** for client-local/global state (UI toggles, panel state, simulation/HUD state).
- Keep persistence behind an adapter layer so desktop (Tauri filesystem) and future server persistence can coexist.

---

## Tauri Backend Snapshot (What exists today)

Canonical source: `specs/TAURI_BACKEND_SPEC.md`.

- Rust side is intentionally minimal:
  - A single example command: `greet(name) -> String`.
  - Plugin: `tauri_plugin_opener`.
- Tauri config (`src-tauri/tauri.conf.json`) is configured for Vite dev at `http://localhost:1420`.
- Window size for the prototype is set to **1280×720** to make UI dimensions predictable.
- Future direction (not yet implemented): Tauri-backed persistence commands such as `save_layout` / `load_layout`.

---

## Task Timeline (0.1 → 0.5)

This section is the human-readable audit trail of the repo’s recent evolution. Refer to each task folder for full details.

### 0.1 — Contributor-focused UI spec
Folder: `specs/tasks/0.1-contributor-ui-spec/`

- **Intent**: establish consistent contributor rules for panels and interactions (reusability + accessibility).
- **Primary artifact**: `CONTRIBUTOR_UI_SPEC.md` (panel shell rules, panel props contract suggestion, Game View canonical behaviors).

### 0.2 — Panel Template & startup layout
Folder: `specs/tasks/0.2-panel-ui/` (branch: `task/0.2-panel-ui`)

- **Intent**:
  - Ensure the app starts focused: **Game View is the only startup panel**.
  - Introduce `PanelTemplate` and documented panel helper/types for consistency.
  - Set Tauri start window size (1280×720).
  - Document the Tauri backend.
- **Docs**: `CONTRIBUTOR_FOCUSED_SPEC.md` is the task-level implementation notes for 0.2.

### 0.3 — App refactor & state strategy
Folder: `specs/tasks/0.3-app-refactor/` (branch: `task/0.3-app-refactor`)

- **Intent**: refactor direction for `App.tsx` (Shell, PanelRenderer, GameViewContainer, PlayerHUD, DevToolkit) and confirm state strategy.
- **Key decisions**:
  - TanStack Query + Zustand as the pragmatic path.
  - Persistence should be abstracted behind adapters (Tauri filesystem vs future remote).
  - Be mindful of online/live-service viability, but keep prototype pragmatic.

### 0.4 — Scaffold QueryClient & Zustand stores
Folder: `specs/tasks/0.4-scaffold-store/` (branch: `task/0.4-scaffold-store`)

- **Intent**: introduce the providers/stores without fully migrating existing hook logic yet.
- **Deliverable shape** (per README): initial `ui`, `panel`, `simulation` stores and a QueryClient provider integration.

### 0.5 — UI App Shell improvements (planning + audit + partial implementation trail)
Folder: `specs/tasks/0.5-ui-shell/` (branch noted in README: `task/0.5-ui-shell`)

- **Intent**: make the app behave like a fixed viewport game client:
  - eliminate scrollbars/overflow caused by sidebar behavior,
  - deduplicate HUD,
  - simplify header controls,
  - clarify whether Game View is “a panel” or promoted to shell-level content (recommended: keep component modular but treat it as special main view).
- **Artifacts**:
  - `DISCUSSION.md`: recommended approach and concrete steps.
  - `ISSUES_AND_ACTIONS.md`: observed problems + phased fix plan.
  - `RESPONSIVE.md`: breakpoint policy (XL/L/M/S), dock/modal rules.
  - `MIGRATION_CSS_AUDIT.md`: Tailwind/inline-style guidance.
  - `CHANGELOG.md`: notes about prototype additions like PanelDock, breakpoint hook, viewport/HUD changes.

---

## Audit Notes (Consistency checks)

These are **notes only** (no changes made here), to keep expectations explicit:
- Task `0.5-ui-shell/` currently does **not** appear to include `BRANCH.txt` even though `specs/UNIVERSAL_TASKS_SPEC.md` calls it required. (The branch is recorded in `README.md`.)
- Task `0.1-contributor-ui-spec/README.md` mentions `ARCHIVE_DECISIONS.md`, but that file is not present in the folder listing.
- `specs/DESIGN_DOCUMENT.md` currently appears to be empty.

---

## Open Decisions / Next Steps (High-signal, aligned to current direction)

- **Game View integration**: confirm the final stance:
  - Keep Game View implemented as a “panel component” for modularity, but render it via a dedicated shell container that enforces full-viewport behavior and minimizes/hides panel chrome.
- **Persistence adapter**:
  - Decide when to introduce a Tauri filesystem-backed adapter for saves/layouts and how it coexists with localStorage during prototyping.
- **Viewport and resizing robustness**:
  - Implement (or continue implementing) the 0.5 “Phase A” safety items: minimum window size, clamp available width/height, clamp panel resize to mins, and keep HUD clipped inside Game View bounds.


