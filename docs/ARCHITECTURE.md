# Architecture

## Modules cibles

### Runner

Responsable de l'execution des agents IA via `portable-pty`.

- demarre un processus agent ;
- lit `stdout` et `stderr` en streaming ;
- expose les evenements au frontend via commandes/evenements Tauri ;
- gere l'interruption et l'arret propre.

### Persistence

Responsable du dossier `.toknisland/` dans chaque projet ouvert.

Structure cible :

```text
.toknisland/
  state.json
  threads/
    <thread-id>.jsonl
  index/
    toknisland.sqlite
```

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

