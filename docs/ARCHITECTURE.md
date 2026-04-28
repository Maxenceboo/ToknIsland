# Architecture

## Modules cibles

### Runner

Responsable de l'execution des agents IA via `portable-pty`.

- demarre un processus agent ;
- lit `stdout` et `stderr` en streaming ;
- expose les evenements au frontend via commandes/evenements Tauri ;
- gere l'interruption et l'arret propre.

### Persistence

Responsable de la bibliotheque locale des projets importes et du dossier `.toknisland/` dans chaque projet ouvert.

Structure cible :

```text
.toknisland/
  state.json
  threads/
    <thread-id>.jsonl
  index/
    toknisland.sqlite
```

Le modele logique suit :

```text
ToknIsland local library
  Imported project
    Agent workspace
      Conversation/thread
        JSONL events
```

Un meme projet peut donc contenir plusieurs IA, et chaque IA peut posseder plusieurs conversations.

Un projet importe une fois reste connu par ToknIsland. Si l'utilisateur tente de reimporter le meme chemin, l'app selectionne le projet existant au lieu de creer un doublon.

La bibliotheque de projets importes doit etre restauree au demarrage. En mode desktop, cette restauration viendra du stockage local ToknIsland ; en preview navigateur, elle peut etre simulee via `localStorage`.

La visualisation principale doit reprendre une metaphore d'explorateur de fichiers :

```text
project folder
  agent folder
    thread.jsonl
```

Les dossiers/fichiers sont une representation UI. Le stockage reel reste `.toknisland/`, `state.json`, `threads/*.jsonl` et l'index local.

### External Session Discovery

ToknIsland doit detecter automatiquement les agents IA deja ouverts dans d'autres terminaux locaux.

Le flux cible :

```text
App startup / project refresh
  scan local processes
  detect AI CLI command
  infer project cwd
  match imported project by path
  attach or import conversation
```

La detection ne doit pas envoyer de donnees a un serveur. Elle lit uniquement l'etat local de la machine, avec prudence sur les chemins, commandes et logs sensibles.

### Overlay

Fenetre Tauri secondaire transparente, sans bordure, toujours en haut au centre.

Point critique : utiliser les APIs OS adaptees pour ignorer les evenements curseur ou creer une fenetre non activante, afin de ne pas voler le focus de l'IDE.

### Analytics

Parse les logs JSONL pour extraire :

- `input_tokens`
- `output_tokens`
- `cache_read_tokens`
- timestamp
- agent
- modele

Les agregats alimentent les couts, tendances et heatmaps.

### Interconnectivity

Gere les liens sortants vers :

- VS Code : `vscode://file/...`
- terminaux systeme : PowerShell, iTerm2, terminal Linux

## Frontend

React gere l'interface, les panneaux, les controles, les vues analytics et les interactions utilisateur.

Tailwind CSS sert au style, avec une direction visuelle sombre, dense et pro. Les icones viennent de Lucide.
