# Branching Strategy

ToknIsland utilise un workflow simple base sur `main` et des branches courtes.

## Branches principales

### `main`

Branche stable du projet.

Regles :

- doit rester propre ;
- recoit les changements par Pull Request ;
- doit contenir du travail documente et comprehensible ;
- ne doit pas contenir de fichiers `.toknisland/`, logs prives ou secrets.

### `feature/*`

Pour ajouter une fonctionnalite.

Exemples :

```text
feature/tauri-scaffold
feature/runner-pty
feature/persistence-jsonl
feature/analytics-heatmap
feature/cockpit-ui
```

### `fix/*`

Pour corriger un bug.

Exemples :

```text
fix/runner-stop-timeout
fix/jsonl-session-resume
```

### `docs/*`

Pour modifier uniquement la documentation, les plans ou les ADR.

Exemples :

```text
docs/branching-strategy
docs/refine-mvp-plan
```

### `chore/*`

Pour la maintenance du repo, CI, formatting, tooling ou dependances.

Exemples :

```text
chore/github-actions
chore/rust-formatting
```

### `release/*`

Pour preparer une version alpha ou stable.

Exemples :

```text
release/0.1.0-alpha.1
release/0.2.0-alpha.1
```

## Workflow standard

1. Mettre `main` a jour.

```powershell
git checkout main
git pull
```

2. Creer une branche de travail.

```powershell
git checkout -b feature/runner-pty
```

3. Travailler et committer.

```powershell
git add .
git commit -m "feat(runner): add pty session skeleton"
```

4. Pousser la branche.

```powershell
git push -u origin feature/runner-pty
```

5. Ouvrir une Pull Request vers `main`.

6. Merger quand la verification est bonne.

## Format des commits

Format recommande :

```text
type(scope): message court
```

Types principaux :

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`

## Branches recommandees pour les prochains chantiers

```text
feature/tauri-scaffold
feature/runner-core
feature/persistence-core
feature/cockpit-ui
feature/analytics-core
feature/overlay-alpha
```

## Regle pratique

```text
main = propre
feature/* = construction
fix/* = reparation
docs/* = documentation
chore/* = maintenance
release/* = preparation version
```

