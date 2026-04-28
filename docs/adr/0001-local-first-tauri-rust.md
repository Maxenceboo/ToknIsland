# ADR 0001: Local-first desktop app with Tauri and Rust

## Status

Accepted

## Context

ToknIsland doit piloter des agents IA CLI, lire des flux PTY en temps reel, persister des conversations et rester proche de l'environnement local du developpeur.

Une application web hebergee ajouterait des contraintes de privacy, de latence, d'acces fichiers et de controle processus.

## Decision

ToknIsland sera une application desktop Tauri v2 avec backend Rust et frontend React.

Les traitements lourds, la gestion des fichiers, le PTY et les analytics seront traites cote Rust. React restera responsable de l'interface et des interactions.

## Consequences

- Meilleur acces aux APIs OS.
- Donnees locales par defaut.
- Complexite cross-platform a traiter explicitement.
- Besoin de tests precis autour des processus enfants et du focus overlay.

## Alternatives considered

- Application web SaaS : rejetee pour privacy et acces local.
- Electron : rejetee au profit d'une empreinte memoire cible plus basse.

