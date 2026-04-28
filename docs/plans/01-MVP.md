# Plan MVP

## But MVP

Livrer une version minimale mais utile de ToknIsland pour un developpeur solo.

Le MVP ne cherche pas a tout supporter. Il prouve le coeur du produit : piloter un agent CLI local et garder une trace exploitable.

## Scope inclus

### Projet

- Importer un ou plusieurs dossiers projet locaux.
- Creer `.toknisland/` si absent.
- Afficher le projet courant.
- Afficher les IA configurees ou detectees pour le projet.
- Afficher plusieurs conversations par IA.

### Runner

- Configurer une commande agent simple.
- Lancer l'agent dans un PTY.
- Afficher la sortie en temps reel.
- Envoyer une interruption utilisateur.
- Marquer la session comme terminee, interrompue ou echouee.

### Persistence

- Creer un `thread_id`.
- Ecrire les evenements en JSONL.
- Maintenir `state.json`.
- Structurer `state.json` par projet importe, IA, puis conversations.
- Recharger la derniere session au demarrage.

### UI

- Layout principal en trois zones :
  - sidebar projets, IA et conversations ;
  - centre session terminal ;
  - panneau details/metadata.
- Boutons start, stop, resume.
- Statuts visibles : idle, running, stopped, failed.

### Privacy

- Aucune telemetrie.
- Aucune integration reseau.
- `.toknisland/` ignore par Git.

## Scope exclu du MVP

- Multi-agent simultane avance.
- Marketplace d'agents.
- Authentification.
- Sync cloud.
- Collaboration temps reel.
- Overlay complet cross-platform.
- Tarification exhaustive de tous les modeles.

## Milestones MVP

### MVP-1 Scaffold

- App Tauri demarre.
- Frontend affiche shell UI.
- Backend expose une commande healthcheck.

### MVP-2 Runner simple

- Une commande locale peut etre lancee.
- La sortie apparait dans l'UI.
- Stop fonctionne.

### MVP-3 Persistence simple

- Les evenements sont ecrits dans JSONL.
- La session reapparait apres redemarrage.

### MVP-4 Polissage utilisable

- Gestion erreurs de base.
- Etats UI clairs.
- README de lancement dev.

## Critere de fin MVP

Depuis un dossier projet, on peut lancer un agent, voir sa sortie, fermer ToknIsland, rouvrir ToknIsland et retrouver la session sauvegardee.
