# Resutrans — version finalisation audio

Application mobile PWA pour transcrire et résumer des cours depuis un téléphone.

## Objectif

Resutrans sert à éviter les services web très chers pour les transcriptions de cours personnels :

1. crée un cours ;
2. importe un fichier audio ou vidéo ;
3. appuie sur **Transcrire** ;
4. génère ensuite un **Résumé IA** ;
5. exporte le résultat en TXT ou sauvegarde tous les cours en JSON.

## Ce qui est inclus dans cette version

- Import audio : mp3, m4a, wav, webm, ogg, etc.
- Import vidéo : mp4, mov, m4v, etc.
- Préparation automatique d'un audio léger quand le fichier est une vidéo ou quand l'audio est trop lourd.
- Mode séparé **Vidéo lourde / Android** pour les fichiers ScreenRecorder ou les grosses vidéos.
- Barre de progression pendant l'extraction audio.
- Messages d'erreur compréhensibles au lieu de messages techniques comme `Unable to decode audio data`.
- Titres automatiques si le cours est créé sans titre.
- Sauvegarde complète des cours et restauration via fichier JSON.
- Cache PWA mis à jour avec une stratégie réseau d'abord pour éviter de rester bloqué sur une vieille version.

## Important sur les limites

L'application fonctionne dans le navigateur, directement sur le téléphone. C'est pratique et économique, mais ça dépend des capacités du navigateur et du fichier.

- Pour les audios déjà légers, l'app envoie directement le fichier à Groq.
- Pour les vidéos, l'app extrait l'audio avant l'envoi.
- L'extraction prend la durée réelle de la vidéo : une vidéo de 10 minutes demande environ 10 minutes.
- Pour les très gros fichiers ou les enregistrements d'écran Android mal finalisés, le navigateur peut refuser de lire l'audio. Dans ce cas, il faut réencoder/couper la vidéo ou filmer normalement avec la caméra.
- La limite par fichier côté transcription audio reste autour de 25 Mo. L'app prépare un audio léger pour rester sous cette limite, mais un très long cours peut devoir être coupé en plusieurs parties.

## Navigateur conseillé

Utilise **Chrome sur Android**. Edge Android peut bloquer certaines fonctions audio du navigateur.

## Clé Groq

La transcription utilise l'API audio Groq depuis ton navigateur.

1. Va sur `console.groq.com/keys`.
2. Crée une clé API.
3. Dans l'app, ouvre **⚙️ Clé**.
4. Colle la clé et enregistre.

La clé est stockée uniquement dans le localStorage de ton téléphone. Comme l'appel à Groq est fait directement depuis le navigateur, garde le lien de l'application privé.

## Déploiement Vercel

Aucun build n'est nécessaire.

Place ces fichiers à la racine du dépôt GitHub :

- `index.html`
- `manifest.json`
- `sw.js`
- `vercel.json`
- `icon.svg`
- `icon-192.png`
- `icon-192-maskable.png`
- `icon-512.png`
- `icon-512-maskable.png`
- `.well-known/assetlinks.json`

Puis redéploie sur Vercel.

Après déploiement, recharge l'app. Si l'ancienne version reste affichée, ferme l'app PWA, vide le cache Chrome ou réinstalle la PWA.
