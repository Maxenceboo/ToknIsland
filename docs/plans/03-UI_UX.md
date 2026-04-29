# Plan UI/UX

## Direction

ToknIsland doit ressembler a un outil de travail dense, calme et rapide.

Pas de landing page dans l'app. Le premier ecran doit etre le cockpit utilisable.

## Layout principal

### Sidebar gauche

- Arborescence de projets importes.
- Projet affiche comme dossier racine.
- IA affichees comme sous-dossiers avec accent couleur, nombre de threads et total tokens.
- Conversations affichees comme fichiers `thread.jsonl`.
- Selection d'un fichier thread pour changer la conversation active.
- Inspecteur de thread avec actions contextuelles : resume, ouvrir dans l'IDE, voir le JSONL brut.
- Vue centrale bascule entre sortie runner et apercu JSONL pour inspecter un thread sans quitter le cockpit.
- Bouton global scan local dans le topbar pour detecter les IA installees ou ouvertes sur le PC.

### Zone centrale

- Terminal local IA via `xterm.js`.
- Barre d'etat agent.
- Saisie clavier directement dans le terminal.
- Actions principales : scan local, stop, resume.

### Panneau droit

- Agent.
- Commande.
- Duree.
- Statut.
- Tokens.
- Cout estime.
- Fichiers detectes.

## Ecrans

### Home cockpit

Etat quand un projet est ouvert :

- sessions a gauche ;
- session active au centre ;
- details a droite.

Etat sans projet :

- action ouvrir dossier ;
- liste derniers projets ;
- aucun texte marketing.

### Analytics

- Heatmap activite.
- Cout total.
- Tokens input/output/cache.
- Filtre par agent, projet, periode.

### Settings

- Commandes agents.
- Chemins outils.
- Preferences overlay.
- Preferences privacy.

## Overlay

### Informations affichees

- Agent actif.
- Etat : running, thinking, waiting, done, failed.
- Duree.
- Petit indicateur tokens/cout si disponible.

### Contraintes

- Ne vole pas le focus.
- N'intercepte pas le curseur en mode pass-through.
- Toujours en haut centre.
- Lisible sans masquer le travail.

## Style

- Dark mode pro.
- Police mono pour logs et terminal.
- Accents par agent :
  - Claude : violet ;
  - Gemini : bleu ;
  - Codex : vert/teal ;
  - custom : couleur configurable.
- Border radius sobre.
- Pas de cartes decoratives inutiles.

## Etats UI obligatoires

- Empty state.
- Loading.
- Running.
- Stopping.
- Failed.
- No logs.
- Permission/path error.
