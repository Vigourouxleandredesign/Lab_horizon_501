# À quoi sert chaque élément

## Racine

| Chemin | Rôle | Pourquoi il est là |
|--------|------|--------------------|
| `frontend/` | Site React (Vite, TypeScript). Public + espace `/compte`. | Une seule interface pour le visiteur et le chercheur. |
| `backend/` | API Laravel 12, auth Sanctum, fichiers PDF, jobs de vulgarisation. | Les données et les droits ne vivent pas dans le navigateur. |
| `docker-compose.yml` | Front Nginx, back, MySQL 8.4, Redis 7, LM Studio en option. | Une commande pour tout relancer ensemble. |
| `.env.docker.example` | Modèle de `.env` racine lu par Compose. | Les secrets ne sont pas dans Git. |
| `package.json` | Scripts du monorepo : `dev`, `gate`, `gate:full`. `npm install` y installe les hooks Git. | Un seul endroit pour lancer les contrôles. |
| `lefthook.yml` | Hooks Git : contrôles au commit et au push. | Une erreur est arrêtée avant d’entrer dans l’historique. |
| `.github/` | Pipeline CI/CD (GitHub Actions) et Dependabot. | Rien n’arrive sur `main` sans contrôles verts sur une machine propre. |
| `scripts/` | Déploiement (`scripts/deploy/` : création du `.env`, sauvegarde, restauration, Linux et Windows), gate anti-régression, contrôles de la CI (`scripts/ci/` : secrets, audit, tests back), contrats domaines, imports PDF locaux. | Les contrôles ne dépendent pas d’un outil installé au hasard. |
| `docs/` | Cahier des charges, UX, contrat API, passation. | Le produit se comprend sans lire tout le code. |
| `docs/passation/` | Ce dossier. | Première lecture d’une équipe nouvelle. |
| `Ressources/` | PDF sources utilisés pour remplir la démo. | Matière de test, pas le site publié. |

## À ne pas prendre pour le produit

| Chemin | Nature |
|--------|--------|
| `docs/archive/` | Anciennes maquettes et exports. Référence visuelle seulement. |
| `v2.zip`, `redteam-preprod-audit.zip`, `v2.1.zip`, `lab_horizon_501.bundle`, `lab_horizon_501.txt` | Archives et exports ponctuels. Hors dépôt. Le protocole de revue, s’il est installé, est local et non versionné. |
| `*.bundle`, `lab_horizon_501.txt` | Archives Git ou exports ponctuels. |
| `LEANDRE PPP_3.srt` | Sous-titres d’une vidéo personnelle, hors projet. |

## Frontend — `frontend/src/`

| Chemin | Rôle |
|--------|------|
| `app/routes.tsx` | Toutes les URL. Public sous `/`, chercheur sous `/compte`. |
| `pages/` | Écrans publics. |
| `pages/backoffice/` | Écrans `/compte` (nouveautés, recherche, publications, profil). |
| `components/` | Header, héros, cartes, champs mot de passe. |
| `components/backoffice/` | Cadre de l’espace chercheur (sidebar, barre basse). |
| `auth/` | Session Sanctum. `RequireAuth` ferme `/compte` et `/chercheurs/:id`. |
| `api/` | Accès données. Trois modes : `mock`, `hal`, `rest`. |
| `api/rest/` | Forme JSON Laravel → objets utilisés par les pages. |
| `data/categories.ts` | Les 11 domaines affichés (slugs, libellés FR/EN). |
| `i18n/` | Textes d’interface FR/EN, y compris les descriptions de domaines. |
| `assets/figmaHomeAssets.ts` | Pastilles et héros. Un slug sans fichier ici casse la page domaine. |
| `style/global.css` | Tokens de couleur `--lh-*`. Les pages ne portent pas de couleur en dur. |
| `hooks/useTextReveal.ts` | Révélation de texte des héros (GSAP). Norme du projet. |
| `public/pillules/`, `public/hero/` | Images servies telles quelles. |

Le mode données se choisit avec `VITE_DATA_SOURCE` (`rest` dans l’image Docker). `mock` permet de travailler l’UI sans API. `hal` interroge archives-ouvertes.fr.

## Backend — points utiles

| Chemin | Rôle |
|--------|------|
| `routes/api.php` | Auth (`register`, `login`, `logout`, `me`) et recherches (lecture publique, écriture authentifiée). |
| `app/Http/Controllers/API/` | Ces routes. |
| `app/Http/Controllers/Admin/` | Écrans Blade (import HAL, vulgarisation). Outil d’exploitation, pas le site React. |
| `app/Services/HalImportService.php` | Correspondance libellés HAL ↔ codes domaines. |
| `app/Services/LlmService.php` et `app/Jobs/` | Vulgarisation via LM Studio. Inactif si `LLM_ENABLED=false`. |
| `database/seeders/LocalContentSeeder.php` | Catalogue de démo. |
| `database/seeders/DomainesSeeder.php` | Ajoute Chimie (`0.chim`) et Mathématiques (`0.math`). Physique n’y est pas. |
| `database/seeders/MotsClesSeeder.php` | Mots-clés de filtre. |
| `public/files/recherches/` | PDF et couvertures servis par l’API. |
| `API_README.md` | Détail des endpoints. |

## Docker — qui parle à qui

Le navigateur n’ouvre que `https://localhost:8443` (`http://localhost:8080` y redirige). Nginx, dans l’image front, porte le certificat TLS et transmet `/api`, `/sanctum` et `/files` au back. Le back parle à MySQL et Redis par leur nom de service (`mysql`, `redis`), jamais par `localhost`. LM Studio, s’il est lancé, est `http://lm-studio:1234/v1` depuis le back.

MySQL est publié sur le port **hôte 3307** (le 3306 est souvent déjà pris par un MySQL Windows). À l’intérieur du réseau Docker, le port reste 3306.

## Pages que le visiteur peut ouvrir

| URL | Rôle |
|-----|------|
| `/` | Accueil |
| `/recherche` | Catalogue filtré |
| `/publications/:id` | Fiche |
| `/categories`, `/categories/:slug` | Domaines |
| `/chercheurs` | Annuaire (page publique) |
| `/chercheurs/:id` | Fiche chercheur, compte requis |
| `/a-propos`, `/mentions-legales`, `/confidentialite`, `/cookies` | Institutionnel |
| `/connexion`, `/inscription` | Auth, joignables par URL |
| `/compte/nouveautes`, `/compte/recherche`, `/compte/publications`, `/compte/profil` | Espace chercheur |
| `/compte/publications/:id/review` | Relecture d’une vulgarisation |

Les quatre entrées du menu chercheur sont figées dans `backofficeNavigation.ts` : nouveautés, recherche, publications, profil.
