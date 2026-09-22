# Resutrans V14 — backend Groq uniquement

Application PWA pour transcrire et résumer des audios/vidéos de cours depuis le téléphone.

## Ce qui change en V14

- La clé Groq n'est plus demandée dans l'application.
- La clé doit être cachée dans Vercel avec la variable `GROQ_API_KEY`.
- Le résumé IA passe par `api/summarize.js`.
- Le modèle Groq inaccessible `llama-3.3-70b-versatile` a été retiré.
- Le cache PWA passe en `resutrans-v14-backend-only`.

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

## Variable Vercel obligatoire

Dans Vercel :

`Settings → Environment Variables`

Nom : `GROQ_API_KEY`
Valeur : ta clé Groq
Environnement : `Production`

Puis faire un nouveau déploiement.

## Test

Ouvrir :

`https://resutrans.vercel.app?v=14`

Tester dans cet ordre :

1. petit audio mp3/m4a ;
2. transcription ;
3. résumé IA ;
4. vidéo Android plus lourde.

