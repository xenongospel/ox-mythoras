Contributor-focused Panel Implementation Notes (0.2)

This file is the task-level copy of the contributor-focused spec adapted for implementers working on `0.2-panel-ui`.

Highlights / Implementation decisions
- Use `PanelTemplate` as the outer wrapper for all new panels to ensure consistent ARIA attributes, sizing, and state helpers.
- The `Game View` is the canonical main panel and remains special: it receives the full available width/height and will be `locked`.
- Panels should rely on the shell for header controls and must accept the standard `PanelProps` interface defined in `src/components/PanelTemplate.tsx`.

Developer notes
- Branch: `task/0.2-panel-ui` (local)
- Verify `createDefaultLayout()` and `resetLayout()` in `src/hooks/usePanelManagement.ts` and `src/hooks/useLayoutManagement.ts`.
- Confirm `src-tauri/tauri.conf.json` window values: width 1280, height 720.

Testing checklist
1. Start app (dev server) and confirm only gameview panels array exists.
2. Resize window and ensure gameview panel fills available space.
3. Open `specs/TAURI_BACKEND_SPEC.md` and ensure documentation reflects current Rust commands and plugins.



