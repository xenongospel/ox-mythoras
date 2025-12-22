Inspiration & multiplayer design reference — Mythoras

Purpose
- Collect design inspirations from Path of Exile, Diablo 4, and legacy games (e.g., older Pokémon link-trade) and surface practical, low-cost multiplayer and social features we can implement in early prototypes.

Key inspirations

- Path of Exile (PoE)
  - Always-online architecture but largely solo progression in instances.
  - Social hubs/towns and private hideouts — low-frequency shared spaces.
  - Robust economy via stash tabs and out-of-band trading; in-game trade exists but many players use external trade channels.
  - Leagues provide seasonal shared experiences.

- Diablo 4
  - Seamless shared-world with instanced dungeons and server mediation for co-op play.
  - More real-time coop emphasis; requires heavier backend.

- Pokémon link-era
  - Limited but high-value social ops (trades, battles) implemented without continuous shared world presence.

Low-cost multiplayer vectors (practical)

1) Market/stash-as-service (primary)
 - Implement market service with REST + TanStack Query; flexible UI for posting, browsing, buying.
 - Use stash tabs metadata linked to player account for secure transfers.

2) Hubs/Hideouts
 - Low-bandwidth presence updates for towns; ephemeral visiting to hideouts via invites.

3) Asynchronous competitions & leagues
 - Server-side job processing and leaderboards; low sync surface.

4) Phase-in party co-op
 - Phase 1: peer-hosted, invite-only instances (trust/friend-based).
 - Phase 2: server-backed authoritative parties later.

Security & provenance ideas

- Item provenance hashes: record crafting steps, sources, and actions in item metadata; sign with a server key (or HMAC during prototype).
- Server-side validation for high-value transactions.
- Rate limiting, moderation tools, and fraud detection for market endpoints.

UX & ancillary features

- Player terminal (advanced, opt-in): command palette/terminal with autocomplete for settings, hotkeys, quick actions.
- Mobile companion APIs: market & stash management, notifications.
- Devtools: DevToolkit with clear gating (only in dev or behind flag).

References
- See `specs/tasks/0.3-app-refactor/DISCUSSION.md` for a linked plan and consolidated actions.


