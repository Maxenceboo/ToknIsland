# Plan Technique

## Architecture de modules

### Rust backend

Structure cible :

```text
src-tauri/src/
  main.rs
  commands/
    mod.rs
    project.rs
    runner.rs
    analytics.rs
    interop.rs
  core/
    mod.rs
    project.rs
    paths.rs
    errors.rs
  runner/
    mod.rs
    agent_runner.rs
    pty_session.rs
    events.rs
  persistence/
    mod.rs
    state.rs
    jsonl.rs
    sqlite.rs
  analytics/
    mod.rs
    parser.rs
    pricing.rs
    heatmap.rs
  overlay/
    mod.rs
  interop/
    mod.rs
    vscode.rs
    terminal.rs
```

### Frontend

Structure cible :

```text
src/
  app/
    App.tsx
    routes.tsx
  components/
    layout/
    sessions/
    terminal/
    analytics/
  features/
    project/
    runner/
    persistence/
    analytics/
  lib/
    tauri.ts
    types.ts
```

## Runner

### Responsabilites

- Construire la commande agent.
- Demarrer PTY.
- Lire les flux sans bloquer.
- Emettre des events structures.
- Arreter proprement.

### Events internes

```text
session_started
output_chunk
stderr_chunk
process_exited
session_interrupted
session_failed
```

### Risques

- Deadlock si lecture bloquante.
- Process enfant orphelin.
- Encoding terminal Windows.
- Sortie volumineuse qui surcharge l'UI.

### Garde-fous

- Threads/tasks separes.
- Backpressure ou batching de chunks.
- Timeout d'arret.
- Logs JSONL append-only.

## Persistence

### `state.json`

Champs cibles :

```json
{
  "version": 1,
  "project_path": "",
  "active_thread_id": "",
  "last_opened_at": "",
  "sessions": []
}
```

### JSONL thread

Chaque ligne est un evenement :

```json
{"type":"output_chunk","timestamp":"","session_id":"","data":""}
```

## Analytics

### Pipeline

1. Lire JSONL.
2. Extraire usage tokens.
3. Normaliser par agent/modele.
4. Appliquer tarif.
5. Produire agregats par jour/session/projet.

### Sorties

- Total tokens.
- Cout estime.
- Heatmap.
- Top sessions.
- Evolution journaliere.

## Interconnectivity

### VS Code

Generer des liens :

```text
vscode://file/<absolute-path>:<line>:<column>
```

### Terminal

Ouvrir :

- Windows : PowerShell.
- macOS : iTerm2 ou Terminal.
- Linux : terminal disponible.

## External Session Discovery

Responsabilites :

- scanner les processus locaux ;
- detecter les CLI d'IA connues ;
- recuperer le dossier de travail quand l'OS le permet ;
- associer la session au projet importe par chemin ;
- eviter les doublons de sessions detectees ;
- permettre d'attacher la session detectee a une conversation.

Contraintes :

- aucune donnee envoyee au reseau ;
- ne pas logger de secrets ou prompts ;
- traiter les commandes/processus comme donnees sensibles dans les exports.

## Tests

- Tests unitaires Rust pour paths, persistence, parser.
- Tests integration pour runner avec commande de test.
- Tests frontend pour composants critiques.
- Tests manuels cross-platform pour overlay.
