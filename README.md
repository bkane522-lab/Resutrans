# Resutrans V17 — bouton installer

Application PWA pour transcrire et résumer des audios/vidéos de cours depuis le téléphone.

## Ce qui change en V17

- Ajout d'un bouton public `Installer l'application` sur l'accueil.
- Le bouton disparaît automatiquement quand l'application est déjà installée.
- Si le navigateur ne permet pas l'installation directe, l'app affiche l'instruction courte : menu ⋮ puis `Ajouter à l'écran d'accueil`.
- L'accueil reste sans détails techniques `API`, `Groq`, `Vercel` ou clé.
- Le cache PWA passe en `resutrans-v17-install-button`.

## Fichiers importants

À mettre à la racine du dépôt GitHub :

- `index.html`
- `sw.js`
- `manifest.json`
- `vercel.json`
- dossier `api/`
  - `api/transcribe.js`
  - `api/summarize.js`
- `README.md`

## Configuration serveur

Dans Vercel :

`Settings → Environment Variables`

Nom : `GROQ_API_KEY`
Valeur : ta clé Groq
Environnement : `Production`

Puis faire un nouveau déploiement.

## Test

Ouvrir :

`https://resutrans.vercel.app?v=17`

Tester dans cet ordre :

1. petit audio mp3/m4a ;
2. transcription ;
3. résumé IA ;
4. vidéo Android plus lourde.
