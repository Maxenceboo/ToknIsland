# Plan Release

## Objectif

Preparer ToknIsland pour des releases alpha testables, sans promettre une stabilite prematuree.

## Canaux

### Local dev

Pour le developpement quotidien.

### Alpha privee

Build partage a quelques testeurs autorises.

### Public source-available

Repo visible publiquement avec licence source-available, sans autorisation commerciale.

## Versioning

Format recommande :

```text
0.MAJOR_MINOR.PATCH-alpha.N
```

Exemples :

```text
0.1.0-alpha.1
0.1.0-alpha.2
0.2.0-alpha.1
```

## Checklist pre-release

- [ ] Build Windows fonctionne.
- [ ] App demarre sans configuration secrete.
- [ ] `.toknisland/` est cree localement et ignore par Git.
- [ ] Stop runner fonctionne.
- [ ] Aucune telemetrie.
- [ ] Licence source-available visible.
- [ ] README precise les limites commerciales.
- [ ] Notes de release redigees.

## Notes de release

Template :

```text
# ToknIsland <version>

## Added

-

## Fixed

-

## Known issues

-

## Privacy

- No telemetry.
- Local data only.
```

## Critere alpha 1

L'alpha 1 est publiable quand le MVP Runner + Persistence fonctionne sur Windows avec une UI minimale.

