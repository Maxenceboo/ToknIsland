# ToknIsland

ToknIsland est une application desktop native cross-platform pour piloter, observer et reprendre des sessions d'agents IA locaux comme Claude Code, Codex et d'autres CLI.

Le produit vise une experience pro, rapide et locale-first :

- execution d'agents via PTY sans bloquer l'interface ;
- persistance locale des conversations dans `.toknisland/` ;
- overlay discret qui ne vole pas le focus de l'IDE ;
- analytics de tokens et couts a partir des logs ;
- liens directs vers VS Code et terminaux systeme.

## Statut

Phase actuelle : administration du repo et cadrage produit/architecture.

Le code applicatif Tauri/Rust/React n'est pas encore initialise dans ce repo.

## Stack cible

- Backend : Rust, Tauri v2, Tokio, portable-pty
- Frontend : React, Tailwind CSS, Lucide Icons
- Data : SQLite pour l'index local, JSONL pour les logs bruts
- OS : Windows, macOS, Linux

## Documents utiles

- [Vision produit](docs/PRODUCT_VISION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Roadmap](docs/ROADMAP.md)
- [Backlog](docs/BACKLOG.md)
- [Plans d'execution](docs/plans/INDEX.md)
- [Strategie de branches](docs/BRANCHING.md)
- [Conventions](docs/CONVENTIONS.md)
- [Securite et privacy](docs/SECURITY_PRIVACY.md)
- [Decisions d'architecture](docs/adr/0001-local-first-tauri-rust.md)

## License

ToknIsland is **source-available**, not open source.

The source code is visible for transparency, learning, review, and
non-commercial contribution. Commercial use, resale, hosted use, paid services,
and competing commercial products are not permitted without prior written
permission.

See [LICENSE](LICENSE).
