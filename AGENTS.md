# AI Agent Instructions

These instructions apply to AI assistants working in this repository.

## Project Identity

ToknIsland is a source-available, local-first desktop app for running, observing,
persisting, and resuming AI agent CLI sessions.

Target stack:

- Backend: Rust, Tauri v2, Tokio, portable-pty
- Frontend: React, Tailwind CSS, Lucide Icons
- Data: SQLite for local indexing, JSONL for raw logs
- OS targets: Windows, macOS, Linux

## License And Ownership

ToknIsland is **source-available, not open source**.

- Read `LICENSE` before changing distribution or reuse language.
- Read `TRADEMARKS.md` before using the ToknIsland name, branding, logo, or visual identity.
- Do not suggest permissive relicensing unless the project owner explicitly asks.
- Commercial use, resale, hosted services, paid services, and competing commercial products require written permission.

## Privacy Rules

- Local-first is a core product constraint.
- Do not add telemetry by default.
- Do not add third-party network calls without a documented decision.
- Never commit `.toknisland/`, real JSONL session logs, API keys, private prompts, screenshots with sensitive content, or user secrets.
- Keep `.toknisland/` ignored by Git.

## Planning And Documentation

Before substantial work, read the relevant docs:

- `docs/PRODUCT_VISION.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/BACKLOG.md`
- `docs/plans/INDEX.md`
- `docs/BRANCHING.md`
- `docs/SECURITY_PRIVACY.md`

Create or update an ADR in `docs/adr/` when a decision changes architecture,
privacy, persistence, process execution, cross-platform behavior, or release
strategy.

## Branching

`main` must stay clean and stable.

Use short working branches:

- `feature/*`
- `fix/*`
- `docs/*`
- `chore/*`
- `release/*`

Pull Requests should target `main`.

Commit format:

```text
type(scope): short message
```

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.

## Architecture Priorities

### Runner

- Use `portable-pty` to run AI CLI agents.
- Stream stdout/stderr without blocking the UI.
- Handle interrupts and process shutdown cleanly.
- Avoid orphan child processes.

### Persistence

- Create `.toknisland/` at the opened project root.
- Store conversations in `.toknisland/threads/<uuid>.jsonl`.
- Maintain `.toknisland/state.json` for resume.
- Use SQLite for local indexing when needed.

### Overlay

- Use a transparent borderless Tauri secondary window.
- Position it top-center and always-on-top.
- It must not steal focus from the IDE.
- Use OS-specific ignore-cursor-events or non-activating behavior where needed.

### Analytics

- Parse token usage from logs.
- Track `input_tokens`, `output_tokens`, and `cache_read_tokens`.
- Apply pricing tables explicitly.
- Generate GitHub-style activity heatmap data.

### Interconnectivity

- Support VS Code deep links with `vscode://file/...`.
- Open system terminals through platform-appropriate process APIs.

## UI Direction

- Build the usable cockpit first, not a landing page.
- Use a dense, calm, professional dark UI.
- Prefer explicit controls, stable layout, clear states, and predictable navigation.
- Use Lucide icons when available.
- Keep heavy file/process/token work in Rust.

## Verification

For meaningful changes:

- run the relevant checks if tooling exists;
- note manual verification when automated tests are not available;
- keep changes scoped to the requested work;
- do not revert unrelated user changes.

