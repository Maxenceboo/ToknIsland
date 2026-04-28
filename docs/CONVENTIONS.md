# Conventions

## Nommage

- Modules Rust : `snake_case`.
- Types Rust : `PascalCase`.
- Composants React : `PascalCase`.
- Hooks React : `useSomething`.
- Fichiers docs : `UPPER_SNAKE_CASE.md` pour les documents structurants.

## Commits

Format recommande :

```text
type(scope): message court
```

Types :

- `feat`
- `fix`
- `docs`
- `refactor`
- `test`
- `chore`

Exemples :

```text
docs(architecture): add runner module overview
feat(runner): stream pty output to frontend
```

## ADR

Toute decision structurante va dans `docs/adr/`.

Format :

- contexte ;
- decision ;
- consequences ;
- alternatives considerees.

