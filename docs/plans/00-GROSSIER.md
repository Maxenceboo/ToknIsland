# Plan Grossier

## Objectif

Construire ToknIsland comme cockpit desktop local-first pour agents IA CLI.

La premiere grande version doit permettre de lancer un agent, suivre sa sortie, sauvegarder la session, reprendre le contexte, consulter les couts/tokens et ouvrir les fichiers concernes dans l'IDE.

## Phases

### Phase 0 - Administration

Statut : fait.

- Repo Git initialise.
- Documents de cadrage.
- Licence source-available.
- Templates GitHub.
- ADR initiale.

### Phase 1 - Fondation app

Objectif : avoir une app Tauri v2 + React qui demarre proprement.

- Scaffold Tauri v2.
- React + Tailwind + Lucide.
- Structure Rust modulaire.
- Commandes Tauri de base.
- CI format/lint/test.

### Phase 2 - Runner MVP

Objectif : lancer un agent CLI dans un PTY et streamer la sortie.

- `portable-pty`.
- Process lifecycle.
- Flux stdout/stderr.
- Stop/interruption.
- Events vers React.

### Phase 3 - Persistence

Objectif : rendre les sessions recuperables.

- Creation `.toknisland/`.
- `threads/<uuid>.jsonl`.
- `state.json`.
- Index SQLite local.

### Phase 4 - Interface cockpit

Objectif : rendre l'outil utilisable au quotidien.

- Liste projets.
- Liste sessions.
- Vue terminal/session.
- Panneau details.
- Actions : start, stop, resume, open file.

### Phase 5 - Analytics

Objectif : comprendre activite, tokens et couts.

- Parsing logs.
- Normalisation usage tokens.
- Tarifs modeles.
- Heatmap activite.
- Vue couts par agent/modele/projet.

### Phase 6 - Overlay

Objectif : afficher un etat discret sans voler le focus de l'IDE.

- Fenetre secondaire transparente.
- Always on top.
- Position haut centre.
- Ignore cursor events / non-activating selon OS.

### Phase 7 - Release alpha

Objectif : construire un package testable.

- Build Windows.
- Verification install/run.
- Notes de release.
- Checklist privacy.

## Definition de succes

- Un utilisateur peut lancer un agent depuis ToknIsland.
- L'UI reste fluide pendant les sorties longues.
- Une session peut etre reprise apres fermeture.
- Les logs restent locaux.
- L'overlay ne vole pas le focus.
- L'empreinte memoire reste surveillee avec objectif < 80 Mo.

