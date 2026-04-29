# Plan MVP

## But MVP

Livrer une version minimale mais utile de ToknIsland pour un developpeur solo.

Le MVP ne cherche pas a tout supporter. Il prouve le coeur du produit : detecter les IA locales deja installees ou ouvertes, les organiser par projet et garder une trace exploitable.

## Scope inclus

### Projet

- Importer un ou plusieurs dossiers projet locaux.
- Garder une bibliotheque locale des projets deja importes.
- Eviter les doublons si un projet est importe plusieurs fois.
- Restaurer les projets importes et le thread actif au redemarrage.
- Creer `.toknisland/` si absent.
- Afficher le projet courant.
- Afficher les IA configurees ou detectees pour le projet.
- Afficher plusieurs conversations par IA.

### Discovery locale

- Detecter les commandes IA installees sur le PC local.
- Detecter automatiquement une IA deja ouverte dans un autre terminal local.
- Attacher une session externe detectee au projet correspondant.
- Importer les conversations detectees sans reimport manuel si le projet est deja connu.

### Runner controle

- Configurer une commande agent simple.
- Lancer l'agent dans un PTY seulement si l'utilisateur choisit explicitement de demarrer une nouvelle session.
- Afficher la sortie en temps reel.
- Envoyer une interruption utilisateur.
- Marquer la session comme terminee, interrompue ou echouee.

### Persistence

- Creer un `thread_id`.
- Ecrire les evenements en JSONL.
- Maintenir `state.json`.
- Structurer `state.json` par projet importe, IA, puis conversations.
- Recharger la derniere session au demarrage.
- Restaurer la timeline runner recente dans le cockpit preview.

### UI

- Layout principal en trois zones :
  - sidebar projets, IA et conversations ;
  - centre session terminal ;
  - panneau details/metadata.
- Boutons scan local, stop, resume.
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

### MVP-2 Discovery locale

- Les IA installees ou ouvertes localement sont detectees.
- Les sessions detectees apparaissent dans l'UI.
- Une session detectee peut etre attachee a un projet.

### MVP-3 Persistence simple

- Les evenements sont ecrits dans JSONL.
- La session reapparait apres redemarrage.

### MVP-4 Polissage utilisable

- Gestion erreurs de base.
- Etats UI clairs.
- README de lancement dev.

## Critere de fin MVP

Depuis un dossier projet, ToknIsland detecte les IA locales et les sessions deja ouvertes, les rattache au projet, affiche les conversations, puis les retrouve apres redemarrage.
