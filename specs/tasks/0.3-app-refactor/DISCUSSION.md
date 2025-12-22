App refactor discussion — task 0.3

Scope
- This document captures architecture guidance and decisions for refactoring `src/App.tsx` and for choosing a global state strategy appropriate for a prototype that may evolve into a live service.

1) Live-service considerations (early-stage)
- Decide now whether the project targets an online/live-service model (like Path of Exile) vs purely local single-player.
- Recommended early design decisions:
  - Separate simulation from persistence: keep an in-memory simulation engine (client-side) that can be snapshot/serialized and a persistence layer (local or remote) that stores authoritative state.
  - Design for both offline-first and online modes:
    - Offline-first: allow full local play and periodic sync to server (conflict resolution strategy required).
    - Online modes: consider server-authoritative design for competitive or shared-world features; client-side prediction/local simulation for responsiveness.
  - Use event-sourcing or command log approach for authoritative changes (helps with replays, debugging, deterministic rollback).
  - Plan for identity/auth (players, sessions) early: add a simple auth abstraction so later integration with online services is straightforward.
  - Persistence options: for desktop builds, prefer Tauri-backed filesystem APIs for saves; for online, REST/GraphQL + WebSockets for realtime sync.

Tradeoffs / Notes
- Early use of network-related libs and schema design pays off (e.g., defining payloads/commands early).
- Keep network logic isolated behind an adapter layer so local-only prototypes don't carry heavy remote dependencies.

2) Global state strategy (no React Context)
- Requirements:
  - Avoid leaking framework-specific context across the app.
  - Support both local (ephemeral) state and server-backed cached state.
  - Good developer ergonomics (time-travel, snapshots, easy mocking).
  - Integration with data fetching/caching for remote interactions.

- Recommended approach (prototype → production)
  - Use TanStack Query (React Query) for server-synced data: caching, background refetch, mutation handling, and devtools.
  - For global client state (simulation state, UI toggles, transient panel state), prefer a small, focused store:
    - Options: Zustand (lightweight, flexible), or TanStack Store (if you want TanStack ecosystem consistency).
    - Recommendation: TanStack Query + Zustand is pragmatic: Query handles server state, Zustand handles client-local/global state without React Context.
  - Keep simulation engine state outside React (pure JS/TS module or class-like interface) and expose hooks/adapters to read from the store (reads via selectors) and to dispatch commands.

Why TanStack Query + Zustand?
- TanStack Query strengths: robust server state management, retries, cache invalidation, devtools, and good community support.
- Zustand strengths: tiny API surface, minimal boilerplate, works well with non-React code, supports middleware (persistence, devtools), and plays nicely with Tauri and local persistence.
- If you prefer to standardize on TanStack entirely, evaluate `@tanstack/store` for local state (but ecosystem maturity is smaller compared to Zustand).

3) Architectural notes for integrating with Tauri and future servers
- Keep persistence layer abstracted: implement a `PersistenceAdapter` with two implementations:
  - LocalFileAdapter (Tauri fs APIs) — for desktop saves/loads.
  - RemoteAdapter (HTTP/WS) — for cloud saves and multiplayer sync.
- Implement a `SyncCoordinator` for transition between offline and online modes; handle conflict resolution strategies explicitly.
- Avoid coupling UI directly to persistence; UI should call domain actions (e.g., "saveLayout", "applySnapshot") exposed by domain services which use the adapter underneath.

4) Migration steps (high level)
1. Document decisions (this file).
2. Introduce a store choice in the codebase (install deps, add minimal store scaffolding).
3. Extract panel management into `PanelContext` or `PanelService` backed by the chosen store (no React Context required: use hooks that read from the store).
4. Split `App.tsx` into `Shell`, `PanelRenderer`, `GameViewContainer`, `PlayerHUD`, and `DevToolkit` components.
5. Replace direct localStorage usage with `PersistenceAdapter` and wire Tauri adapter for desktop builds.
6. Add TanStack Query for remote data fetching where appropriate; add examples for one data resource.

5) Prototype caveats
- For the prototype, favor pragmatic choices that accelerate iteration:
  - Use Zustand for client global state if you want low-friction setup.
  - Use TanStack Query for any server-like data even if it's mocked locally (helps later).
  - Keep the simulation engine decoupled to allow running locally and later on server if desired.

6) Next actions (task 0.4 will implement)
- Create a follow-up task 0.4 to scaffold the store, add devtools, and extract `usePanelManagement` into a store-backed service.

Notes
- No code changes are made in this task; this is planning and documentation only.


---

Round 2 — Multiplayer strategy, migration confirmation, and simulation engine

Quoted reference from above (for context):

> "Design for both offline-first and online modes:
>  - Offline-first: allow full local play and periodic sync to server (conflict resolution strategy required).
>  - Online modes: consider server-authoritative design for competitive or shared-world features; client-side prediction/local simulation for responsiveness."

Summary answer to the multiplayer concern
- Short answer: full real-time, server-authoritative multiplayer (action-combat with tight synchronization) is a large engineering surface and will slow development if attempted early. It requires server infrastructure, deterministic simulation or reconciliation, latency compensation, security, and substantial testing.
- Practical compromise: support "minimum viable multiplayer" features that deliver social value without requiring full realtime engineering:
  - Asynchronous trade/market system (web-backed): a web market where clients push/list items and others browse/purchase; implement via REST + TanStack Query and a small web service. This gives player-to-player interaction, economy, and a social loop with much lower engineering cost.
  - Trade leagues / competitions as asynchronous events: match results and leaderboards driven by server-side jobs or batched matches rather than live sessions.
  - Optional near-realtime services later: WebSocket-based chat, notifications, or market price updates can be introduced incrementally.
  - If/when realtime combat is desired, design the codebase and simulation engine to support both local simulation and server-authoritative reconciliation; but defer heavy realtime until core systems (economy, progression, UI) are stable.

Concrete smaller-multiplayer ideas (low friction)
- Web-based market (recommended first multiplayer surface)
  - Desktop client posts sell orders to a market service; market offers browsing/filters and buy actions.
  - Use TanStack Query on the client to cache market data and mutate orders.
  - Keep market interactions asynchronous — no need for frame-level synchronization.
- Trade league (asynchronous)
  - Players register entries; server runs simulated matches or validates player-submitted outcomes.
  - Leaderboards and reward payouts are server-driven but asynchronous.
- Social overlays (later)
  - Chat, friend lists, matchmaking endpoints; begin with simple REST endpoints and add WebSocket presence later.

Final solution decision for state & data tooling
- Use TanStack Query + Zustand:
  - TanStack Query: server-synced resources, caching, background refresh, and easy devtools.
  - Zustand: global client-local state for UI, simulation toggles, transient panel state, and any non-server state.
  - Rationale: this combo keeps server and client concerns separated, gives excellent developer ergonomics, and maps cleanly to Tauri + web-backend models.

Confirmed migration steps (high level)
1. Add dependencies: install `@tanstack/react-query` (TanStack Query) and `zustand` (and devtools middleware if desired).
2. Scaffold providers: add `QueryClient` provider at app root and create a small `store/` folder for Zustand stores (e.g., `uiStore`, `panelStore`, `simulationStore`).
3. Extract panel management into a store-backed service:
   - Move `usePanelManagement` logic into `panelStore` with the same API (actions: addPanel, removePanel, toggleLock, resetLayout, createDefaultLayout).
   - Replace direct hook usage in components with selectors and action calls from the store.
4. Replace direct localStorage usage with `PersistenceAdapter` abstraction; provide a local Tauri implementation and a possible HTTP-backed implementation later.
5. Add `SimulationEngine` module (see description below) and wire its lifecycle to the store (start/stop ticks, snapshot, step).
6. Lazy-load DevToolkit and archive/guard dev-only UI behind an environment flag or hotkey.
7. Create a small Market service prototype (mock server or lightweight backend) and integrate via TanStack Query; ensure mutations use optimistic responses where appropriate.
8. Add auth abstraction (simple token/identity provider) used by market and any server interactions.
9. Add tests for store behaviors and simulation snapshots (unit tests), and add an integration test for market flows.

What the simulation engine is and how it is used in Mythoras
- Definition: the Simulation Engine is the deterministic, rule-driven core that advances game state over time. It is responsible for applying game rules, resolving events, and producing a sequence of state snapshots or events that the UI consumes.
- Responsibilities:
  - Tick loop / scheduler: advances simulation in discrete ticks (or frames) and processes queued commands/events.
  - Deterministic rules application: combat resolution, NPC AI decisions, resource generation, day/night and campaign progression.
  - Command handling & validation: accepts player or system commands (move, interact, start match) and enqueues them for execution in the simulation loop.
  - Snapshotting and serialization: produces compact snapshots or diffs that can be persisted or sent to a server for rehydration or auditing.
  - Replay / rollback support: by storing a command log (or event stream), the engine can replay events to reach a later state or roll back if needed.
- Where it sits in the architecture:
  - Client-side: runs locally for single-player and provides snappy UX; UI reads state and renders it (GameView).
  - Server-side (optional): for online modes the same deterministic rules can run server-side (or in a headless runner) to provide authoritative outcomes.
  - Interface: expose a minimal API: `start()`, `stop()`, `step(delta)`, `enqueueCommand(cmd)`, `getSnapshot()`, `applySnapshot(snapshot)`, `serialize()`.
- Why it's important early:
  - Decoupling the simulation logic from UI and persistence makes it easier to switch between local and server-authoritative modes later.
  - Designing commands/events early (shapes and schemas) simplifies later network sync and debugging.

Next actions (task 0.4 suggestion)
- Scaffold Zustand stores and a QueryClient provider (small PR).
- Create placeholder `SimulationEngine` module with the public API (no internal heavy logic yet) and unit tests for snapshot/serialization interfaces.
- Prototype a minimal Market service and integrate it via TanStack Query (mock server).

--- end Round 2


Round 3 — Inspiration, stance on POE/Diablo 4, and low-friction multiplayer vectors

Reference back to Round 2:

> Summary answer to the multiplayer concern:
> - Short answer: full real-time, server-authoritative multiplayer (action-combat with tight synchronization) is a large engineering surface and will slow development if attempted early.
> - Practical compromise: support "minimum viable multiplayer" features that deliver social value without requiring full realtime engineering...

Objective
- Provide practical, game-design-informed options inspired by Path of Exile (PoE) and Diablo 4, plus other legacy examples (older Pokémon link-trade style), and recommend lightweight approaches we can adopt without large engineering cost.

Path of Exile (PoE) — relevant takeaways
- PoE is always-online but primarily single-player in activity: players progress solo in instances but interact socially via towns/hubs, public areas, and trading systems.
- Social vectors used:
  - Towns/hub areas where players can see each other and interact (low-frequency movement, not tightly synchronized combat).
  - Hideouts (private spaces) that can be visited and shared.
  - Stash and trading systems: PoE’s economy is rich; trading is often out-of-band (forum, trade websites) and in-game via stash tabs and player-to-player messages.
  - Leagues: seasonal, shared-world modifications that create shared meta and drive social engagement.

Diablo 4 — relevant takeaways
- Diablo 4 mixes open-world shared spaces with instanced content; it's designed to support cooperative play more directly with server authority.
- Social vectors:
  - Seamless world encounters, phasing, and instanced dungeons that can accept multiple players.
  - Persistent shared world resources/events that encourage players encountering each other.
  - More server reliance: requires heavier backend for world state and session management.

Legacy examples (Pokemon link / trading)
- Early Pokémon allowed limited operations (trading, battles) without requiring fully synchronized world presence; trades were asynchronous and constrained.
- These examples demonstrate that robust social features (trade, collection, leaderboards) can be implemented with modest networking.

Recommended low-friction multiplayer vectors for Mythoras
1. Web-based market & stash integration (primary recommendation)
   - Implement a market service where players can post sell orders and purchase asynchronously.
   - Client uses TanStack Query to list/query market data, optimistic updates for quick UI feedback.
   - For desktop/Tauri builds, allow optional local stash export/import; for shared market, require account-linked stash tabs.
   - Benefit: immediate social economy without realtime complexity; enables trade leagues and persistent player-driven economy.

2. Shared hubs & non-combat social spaces
   - Implement towns/hub instances where players can meet, chat, and access services (trade, crafting stations).
   - Hubs are low-frequency world state: easier to sync (mostly positional and presence updates).
   - Avoid server-authoritative combat in hubs — just allow emotes, trade requests, and invites.

3. Asynchronous leagues & competitions
   - Players submit entries or perform solo runs; leaderboard and rewards are distributed asynchronously.
   - Server-side simulation or batched validation for competitive features.

4. Hideouts and shared content (PoE-style)
   - Allow players to build and share a hideout; visiting can be an out-of-band operation (link/invite), low-bandwidth.
   - Use invites and ephemeral sessions for visiting, not persistent shared world simulation.

5. Minimal party co-op (phased approach)
   - Phase 1 (prototype): party invites -> create shared instance that runs on one player's client (peer-hosted) with limited trust for casual play and risk of cheat; suitable for early prototypes or friends-only sessions.
   - Phase 2: server-mediated party instances (server-authoritative) for public or ranked co-op (requires more engineering).
   - Phase 1 allows quick testing and fun without deep server work; Phase 2 is for mature features.

Security and item verification considerations (prototype -> production)
- Client-limited visibility increases attack surface when multiplayer interactions are allowed. Steps to mitigate:
  - Signed metadata for valuable items: items carry a cryptographic signature over key metadata and "provenance" steps (craft steps, sources). During prototyping, a simpler HMAC approach with server verification is acceptable.
  - Server-side validation for critical transactions: purchases, high-value trades, and leaderboard submissions should be validated server-side.
  - Rate limiting and abuse detection on market endpoints, plus fraud detection for trade loops.
  - Tighter measures for hosted multiplayer: do not trust client for authoritative item creation; use server validation or signed receipts.

Developer-friendly terminal / advanced client tools (design note)
- Idea: provide an optional, discoverable "player terminal" that surfaces advanced operations (commands, hotkey binding, quick settings) with autocomplete and argument support.
- Useful for power users and devs; make it opt-in and gated behind an advanced preference to avoid exposing complexity to casual players.
- For prototypes, provide a light mock of the terminal that allows quick toggles, event injection, and hotkey mapping.

Additional considerations
- Parties, guilds, and friends list: build a minimal friends system early (local cache + remote store) to enable invitations and quick social interactions.
- Mobile companion / management app: design APIs and data models with mobile in mind (e.g., market management, stash browsing, notifications) so later expandability is viable.
- Devtools transparency: include dev-only tools (DevToolkit) but document why they exist and make them easily toggleable so that production builds hide them.

Reference note
- See `Round 2` above for the canonical decision to use TanStack Query + Zustand and the confirmed migration steps; this section builds on that.

Consolidated actions (all discussions)
1. (0.2) Make GameView the startup-only panel and create `PanelTemplate`.
2. (0.3) Decompose `App.tsx` into Shell, PanelRenderer, GameViewContainer, PlayerHUD, DevToolkit.
3. (0.3) Adopt TanStack Query + Zustand for server and client state respectively.
4. (0.4) Scaffold Zustand stores and QueryClient provider; migrate `usePanelManagement` into a store-backed service.
5. (0.4) Create `SimulationEngine` placeholder module with public API and unit tests for snapshots.
6. Prototype market service (mock server) and integrate via TanStack Query (task 0.5).
7. Implement PersistenceAdapter abstraction and a Tauri-backed local file adapter.
8. Add auth abstraction and simple identity model.
9. Design and prototype minimal party/co-op flow (Phase 1: peer-hosted local instance for friends).
10. Audit security around item provenance and design a signing/verification model for valuable items.
11. Add mobile-friendly API endpoints for market and stash management (later task).
12. Add developer terminal (opt-in) and DevToolkit gating for debug-only tools.

--- end Round 3
