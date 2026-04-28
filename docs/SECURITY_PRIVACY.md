# Security & Privacy

## Positionnement

ToknIsland est local-first. Les conversations, logs et index restent sur la machine de l'utilisateur.

## Donnees sensibles

Ne jamais committer :

- `.toknisland/`
- fichiers `.jsonl` de sessions ;
- captures contenant des prompts prives ;
- secrets d'API ;
- chemins utilisateur inutiles dans des rapports publics.

## Reseau

Aucun appel reseau tiers ne doit etre ajoute sans :

- issue dediee ;
- justification produit ;
- option de desactivation ;
- documentation de la donnee transmise.

## Processus enfants

Les processus agents doivent pouvoir etre :

- identifies ;
- interrompus ;
- termines proprement ;
- traces dans les logs locaux.

