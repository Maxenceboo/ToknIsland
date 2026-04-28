# Contributing

## Principes

- Garder ToknIsland local-first : aucun appel reseau tiers sans decision explicite.
- Privilegier Rust pour les traitements lourds, fichiers, PTY et analytics.
- Garder React concentre sur l'experience utilisateur, l'etat d'interface et la composition visuelle.
- Eviter les abstractions prematurees. Chaque module doit avoir une responsabilite claire.

## Flux de travail

1. Creer une issue ou rattacher le travail a une entree du backlog.
2. Documenter les decisions structurantes dans `docs/adr/`.
3. Ajouter ou ajuster les tests avec chaque changement comportemental.
4. Verifier localement avant PR.

## Qualite attendue

- UI non bloquante pendant l'execution des agents.
- Gestion propre des processus enfants.
- Fichiers `.toknisland/` stables, lisibles et recuperables.
- Aucun secret dans les logs ou captures.

