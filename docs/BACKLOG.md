# Backlog

## Epic: Runner

- [ ] Choisir l'API interne `AgentRunner`.
- [ ] Implementer lancement PTY.
- [ ] Streamer stdout/stderr sans bloquer.
- [ ] Ajouter interruption utilisateur.
- [ ] Journaliser les evenements de session.

## Epic: Persistence

- [ ] Definir schema `state.json`.
- [ ] Definir schema d'evenements JSONL.
- [ ] Creer `.toknisland/` au premier lancement projet.
- [ ] Ajouter index SQLite local.

## Epic: Overlay

- [ ] Definir comportement Windows.
- [ ] Definir comportement macOS.
- [ ] Definir comportement Linux Wayland.
- [ ] Tester non-activation et focus IDE.

## Epic: Analytics

- [ ] Definir format token usage normalise.
- [ ] Parser logs Claude/Codex.
- [ ] Calculer couts par modele.
- [ ] Generer donnees heatmap.

## Epic: Interconnectivity

- [ ] Ouvrir fichier dans VS Code.
- [ ] Ouvrir terminal systeme au bon dossier.
- [ ] Gerer erreurs lorsque l'app cible manque.

