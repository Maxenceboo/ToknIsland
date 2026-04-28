# Roadmap

Pour le decoupage operationnel, voir aussi [Plans d'execution](plans/INDEX.md).

## Phase 0 - Administration

- Repo initialise.
- Documents de vision, architecture et conventions.
- Templates GitHub.
- ADR initial local-first.

## Phase 1 - Scaffold app

- Initialiser Tauri v2 + React + Tailwind.
- Ajouter structure Rust modulaire.
- Configurer lint, format et tests.

## Phase 2 - Runner MVP

- Lancer une commande agent via PTY.
- Streamer la sortie vers l'UI.
- Interrompre proprement un agent.

## Phase 3 - Persistence

- Creer `.toknisland/`.
- Sauvegarder les threads en JSONL.
- Restaurer `state.json`.

## Phase 4 - Analytics

- Parser les logs.
- Calculer tokens et couts.
- Afficher une heatmap d'activite.

## Phase 5 - Overlay

- Fenetre secondaire always-on-top.
- Transparence.
- Mode sans capture de focus.
