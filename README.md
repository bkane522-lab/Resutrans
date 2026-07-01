# Resutrans 🎓

App mobile (PWA) pour classer, transcrire et résumer tes vidéos de cours (danse, musique, langues…).

## Navigateur recommandé

⚠️ **Utilise Chrome.** L'extraction audio (nécessaire pour les vidéos de plus de 3 Mo) ne fonctionne pas de façon fiable dans **Edge sur Android** — bug constaté avec les fonctions audio avancées utilisées. Si l'app détecte qu'elle tourne dans Edge, un avertissement s'affiche automatiquement sur l'écran d'accueil.

Pour l'installer et l'utiliser sans souci : ouvre le lien Vercel dans Chrome, puis "Ajouter à l'écran d'accueil" depuis Chrome (pas depuis Edge), pour que l'app installée utilise le bon moteur.

## Ce que ça fait

1. Tu crées un "cours" (titre + thème).
2. Tu importes la vidéo/audio du cours (celle de ton prof).
3. Tu appuies sur **Transcrire** → la transcription apparaît en quelques secondes/minutes (via l'API Whisper de Groq, gratuite).
4. Tu appuies sur **Résumé IA** → un résumé + points clés + objectif pour la prochaine séance sont générés automatiquement.
5. Tu ajoutes tes notes personnelles.
6. Tu peux **exporter en TXT**.

**Outil séparé disponible** : depuis l'écran d'accueil, "🎵 Extraire l'audio d'une vidéo" ouvre un outil indépendant qui fait uniquement l'extraction — tu obtiens un fichier audio téléchargeable, à importer ensuite dans un cours pour le transcrire. Pratique pour tester l'extraction isolément si un fichier pose problème, ou pour préparer plusieurs fichiers audio à l'avance.

**Thème libre** : le champ "Thème" propose des suggestions (Kizomba, Urban Kiz, Semba, Tarraxo, Zouk, Afrobeats, Kompa...) mais reste un champ texte libre — tu peux taper n'importe quoi d'autre.

**Sauvegarde / restauration** : depuis l'écran d'accueil, "⬇️ Exporter tout" télécharge un fichier JSON avec tous tes cours (titres, transcriptions, résumés, notes). "📤 Restaurer" permet de recharger ce fichier — utile si tu changes de téléphone ou si tu veux garder une copie de secours. La restauration ajoute les cours manquants sans écraser ceux déjà présents.

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

Si le fichier importé dépasse 3 Mo, l'app en extrait l'audio avant l'envoi à Groq, **entièrement dans le navigateur** (aucun téléchargement, aucune librairie externe) :

1. La vidéo est lue en arrière-plan, muette (rien n'est audible), à vitesse normale.
2. L'audio est capté et compressé au fur et à mesure (format opus, très efficace) dans un fichier bien plus léger.
3. Ce fichier compressé est envoyé à la place de la vidéo d'origine.

Cette méthode traite le fichier progressivement plutôt que de le charger entièrement en mémoire d'un coup — elle fonctionne donc de façon fiable même sur des vidéos très volumineuses (300+ Mo), là où un traitement "en un bloc" peut échouer sur mobile.

**Contrepartie : l'extraction prend la durée réelle de la vidéo** (un cours de 6 min prend ~6 min à traiter). C'est le compromis pour une fiabilité maximale.

**Capacité résultante : environ 1h30 de cours par fichier** dans la limite gratuite de 25 Mo de Groq.

Si l'extraction échoue pour une raison quelconque (format non supporté), l'app retente automatiquement d'envoyer le fichier original — utile si le fichier est déjà petit.

## Limites connues

- **Taille de fichier** : le tier gratuit de Groq reste plafonné à 25 Mo, soit ~1h30 de cours une fois l'audio extrait. Pour un cours plus long, il faudra le couper en plusieurs morceaux avant import (dis-le-moi si besoin, on peut ajouter un découpage automatique).
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
