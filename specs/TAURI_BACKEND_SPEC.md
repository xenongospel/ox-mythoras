Tauri backend — current state (analysis)

This file documents what currently exists in `src-tauri/` and the Rust-side capabilities available to the frontend.

Overview
- The Rust side is minimal and serves primarily to package the web frontend as a native application and expose a tiny command surface.

Key files
- `src-tauri/tauri.conf.json`
  - Configures Tauri build hooks and the dev URL (`http://localhost:1420`).
  - Sets the application window size and bundle configuration (icons, bundle targets).
  - Updated start window size for prototype to `1280x720`.

- `src-tauri/Cargo.toml`
  - Standard Rust/Cargo manifest for the Tauri application. (Contains dependencies including `tauri-plugin-opener`.)

- `src-tauri/src/lib.rs`
  - Exposes a single Tauri command: `greet(name: &str) -> String`.
  - Initializes `tauri_plugin_opener`.
  - Registers `greet` via `invoke_handler`.
  - `run()` creates the Tauri builder and runs the application.

- `src-tauri/src/main.rs`
  - Thin entry that delegates to `ox_mythoras_lib::run()`.

Capabilities & notes
- Commands: only `greet` is present — useful as an example of how to call Rust from the frontend.
- Plugins: `tauri_plugin_opener` is initialized. No other plugins or filesystem integrations currently configured.
- Packaging hooks: `beforeDevCommand` runs `pnpm dev`; `beforeBuildCommand` runs `pnpm build`. Frontend dist is `../dist`.

Recommended small improvements
1. Add a dedicated Rust command for layout persistence if you want desktop-backed saving (`save_layout` / `load_layout`) and wire it to the frontend via `invoke`.
2. Consider adding a basic `version` or `app_info` command to expose build-time metadata to the frontend.
3. If you want native filesystem saving for layouts, add `tauri-plugin-fs` (or use `tauri::api::path` + standard Rust fs).

If you want, I can:
- Add example commands (`save_layout` / `load_layout`) and wire a simple filesystem-backed layout persistence (task 0.3).
- Add brief examples in the frontend showing how to call `greet` and how to call a future `save_layout`.



