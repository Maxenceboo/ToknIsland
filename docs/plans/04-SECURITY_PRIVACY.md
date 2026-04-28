# Plan Securite Et Privacy

## Objectif

ToknIsland doit etre fiable parce qu'il reste local, explicite et controlable.

## Regles principales

- Pas de telemetrie par defaut.
- Pas d'appel reseau tiers par defaut.
- Pas de sync cloud dans le MVP.
- Pas de secrets dans les logs.
- `.toknisland/` jamais commit.

## Donnees locales

### `.toknisland/`

Contient :

- `state.json`
- `threads/*.jsonl`
- index SQLite
- metadata locales

Ne contient pas :

- tokens API en clair ;
- secrets utilisateurs ;
- donnees reseau envoyees sans consentement.

## Processus agents

### Risques

- Commande mal configuree.
- Processus qui continue apres fermeture.
- Log trop verbeux contenant un secret.
- Chemin utilisateur expose dans issue publique.

### Protections

- Afficher la commande avant execution.
- Stop explicite.
- Nettoyage des processus au shutdown.
- Warnings avant partage/export.
- Redaction future des secrets connus.

## Contributions

Les contributeurs ne doivent pas publier :

- sessions JSONL reelles ;
- captures avec prompts prives ;
- chemins personnels inutiles ;
- cles API ;
- informations client.

## Checklist PR privacy

- [ ] Aucune telemetrie ajoutee.
- [ ] Aucun appel reseau silencieux.
- [ ] Aucune donnee sensible dans fixture/test.
- [ ] `.toknisland/` reste ignore.
- [ ] Les erreurs n'affichent pas de secret.

