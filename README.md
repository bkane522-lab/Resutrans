# Resutrans 🎓

App mobile (PWA) pour classer, transcrire et résumer tes vidéos de cours (danse, musique, langues…).

## Ce que ça fait

1. Tu crées un "cours" (titre + thème).
2. Tu importes la vidéo/audio du cours (celle de ton prof).
3. Tu appuies sur **Transcrire** → la transcription apparaît en quelques secondes/minutes (via l'API Whisper de Groq, gratuite).
4. Tu appuies sur **Résumé IA** → un résumé + points clés + objectif pour la prochaine séance sont générés automatiquement.
5. Tu ajoutes tes notes personnelles.
6. Tu peux **exporter en TXT**.

Toutes les données (transcriptions, notes, titres) restent **stockées uniquement sur ton téléphone** (localStorage du navigateur). Rien n'est envoyé sur un serveur — sauf le fichier vidéo/audio et le texte de transcription, qui sont envoyés **directement de ton téléphone vers l'API Groq** au moment où tu appuies sur "Transcrire" ou "Résumé IA".

## Déploiement (5 min, depuis ton téléphone)

1. Va sur GitHub (`bkane522-lab`) → **New repository** → nomme-le par exemple `resutrans`.
2. Ajoute les fichiers de ce zip tels quels, à la racine du repo (pas de dossier `src/`) :
   - `index.html`
   - `manifest.json`
   - `icon.svg`
   - `sw.js`
3. Va sur Vercel → **Add New Project** → importe ce repo GitHub.
4. Aucune configuration nécessaire (pas de build step, pas de variables d'environnement). Clique **Deploy**.
5. Une fois déployé, ouvre l'URL Vercel sur ton téléphone → menu du navigateur → **Ajouter à l'écran d'accueil** (ou "Installer l'application").

## Avant la première utilisation : ta clé Groq

1. Crée un compte gratuit sur [console.groq.com](https://console.groq.com/keys).
2. Génère une clé API (commence par `gsk_...`).
3. Dans l'app, appuie sur **⚙️ Clé** en haut à droite, colle ta clé, enregistre.

⚠️ **Important sur la sécurité** : cette app appelle l'API Groq *directement depuis le navigateur* (pas via un serveur intermédiaire), pour pouvoir gérer des fichiers vidéo volumineux sans limite de taille imposée par Vercel. Cela veut dire que ta clé API est techniquement visible dans le code du navigateur pendant que tu utilises l'app. Pour une app 100% personnelle comme celle-ci, ce n'est pas un problème — mais :
- Ne partage pas le lien Vercel publiquement (garde-le pour toi).
- Si un jour tu veux ouvrir l'app à d'autres personnes, il faudra revenir à un serveur proxy (voir section "Pour aller plus loin").

## Extraction audio automatique

Si le fichier importé dépasse 3 Mo, l'app en extrait l'audio avant l'envoi à Groq :

1. **Copie directe** (par défaut) : la piste audio d'origine est extraite telle quelle, sans ré-encodage — quasi instantané, qualité intacte. Ça suffit pour la grande majorité des clips courts (quelques minutes), car la piste audio seule est presque toujours bien plus légère que la vidéo.
2. **Compression de secours** (seulement si l'étape 1 donne encore un fichier de plus de 25 Mo) : ré-encodage en mono 16kHz à faible débit — plus lent, mais garantit une taille réduite pour les fichiers longs.

Tout se passe **dans le navigateur**, rien n'est envoyé à un serveur pour cette étape.

⚠️ **Premier passage** : le moteur de compression est téléchargé une seule fois (~25-30 Mo), mis en cache ensuite par le navigateur — fais ce premier test en WiFi. Les passages suivants sont rapides.

Si l'extraction échoue pour une raison quelconque (réseau, format non supporté), l'app retente automatiquement d'envoyer le fichier original — utile si le fichier est déjà petit.

## Limites connues

- **Taille de fichier** : même après extraction/compression, le tier gratuit de Groq reste plafonné à 25 Mo. Pour un cours filmé très long (plus de 1h30-2h), il faudra encore le raccourcir ou le couper en plusieurs morceaux avant import.
- **Formats acceptés** : mp4, m4a, mp3, wav, webm, ogg, mpeg — donc les vidéos filmées au téléphone (mp4) fonctionnent directement, pas besoin d'extraire l'audio toi-même.
- **Pas de synchronisation multi-appareils** : les cours sont stockés en local sur l'appareil où tu les crées. Si tu changes de téléphone, tu perds l'historique (sauf si tu exportes en TXT avant).
- **Quota Groq** : comme pour tes autres projets, le tier gratuit Whisper a des limites de requêtes/jour. Si ça bloque, attends quelques heures ou vérifie ton usage sur console.groq.com.

## Pour aller plus loin (idées v2, si besoin)

- Extraction automatique audio-only côté navigateur (réduit la taille avant envoi, permet des vidéos plus longues).
- Un vrai serveur proxy (fonction Vercel) qui cache la clé API, si tu veux un jour partager l'app.
- Sauvegarde/export de tous les cours en un seul fichier (backup complet).
- Recherche texte dans les transcriptions.
- Icône personnalisée (logo lion doré, cohérent avec ton univers visuel).

---

Fait avec 🖤 pour Lionlion — mobile-first, zéro build step, comme d'habitude.
