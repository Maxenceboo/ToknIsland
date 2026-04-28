# Contributing

## Principes

- Garder ToknIsland local-first : aucun appel reseau tiers sans decision explicite.
- Privilegier Rust pour les traitements lourds, fichiers, PTY et analytics.
- Garder React concentre sur l'experience utilisateur, l'etat d'interface et la composition visuelle.
- Eviter les abstractions prematurees. Chaque module doit avoir une responsabilite claire.

## Flux de travail

1. Creer une issue ou rattacher le travail a une entree du backlog.
2. Creer une branche courte selon [la strategie de branches](docs/BRANCHING.md).
3. Documenter les decisions structurantes dans `docs/adr/`.
4. Ajouter ou ajuster les tests avec chaque changement comportemental.
5. Verifier localement avant PR.

## Branches

Le projet utilise `main` comme branche stable.

Les branches de travail doivent utiliser un prefixe clair :

- `feature/*`
- `fix/*`
- `docs/*`
- `chore/*`
- `release/*`

Voir [docs/BRANCHING.md](docs/BRANCHING.md).

## Qualite attendue

- UI non bloquante pendant l'execution des agents.
- Gestion propre des processus enfants.
- Fichiers `.toknisland/` stables, lisibles et recuperables.
- Aucun secret dans les logs ou captures.
