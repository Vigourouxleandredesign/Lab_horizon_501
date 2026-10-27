# Plan de maintenance

Gestes à faire pour ne pas casser le dépôt. L’objectif de chaque contrôle, pour un évaluateur, est dans [06 — Contrôles qualité](./06-controles-qualite.md). Le détail technique est dans [docs/TESTING.md](../TESTING.md). Le démarrage pas à pas est dans [02 — Lancer et relancer](./02-lancer-et-relancer.md).

## Après un changement de code

Rien à lancer à la main : les contrôles tournent au commit. Une seule condition, une fois par clone, à la racine :

```powershell
npm install
```

Cette commande installe les hooks Git. Ensuite :

- `git commit` lance les contrôles liés aux fichiers modifiés (front, back, dépendances, secrets). Prettier remet en forme le front et re-stage les fichiers tout seul. Si un contrôle est rouge, le commit n’est pas créé : corriger, puis recommiter.
- `git push` relance l’audit des dépendances.
- La pull request rejoue tout sur GitHub, plus les images Docker de prod. On ne merge sur `main` qu’avec une CI verte.

Ne jamais contourner un hook (`--no-verify`). La CI rejouera le même contrôle et bloquera le merge.

Pour tout vérifier d’un coup sans commiter : `npm run gate` (sans Docker), `npm run gate:full` (pile Docker allumée), `npm run gate:security` (secrets et dépendances).

Un contrôle rouge se corrige dans le code. Modifier un test, une règle ESLint, un seuil d’audit ou la config d’un scanner pour faire passer un rouge au vert est interdit sans accord explicite, écrit dans la pull request.

## Mettre à jour une dépendance

Dependabot ouvre chaque lundi des pull requests vers `develop` (npm, Composer, actions GitHub, images Docker). Les relire et les merger si la CI est verte. Une faille publiée sur une dépendance déjà installée fait passer la CI au rouge, même sans nouveau commit : la CI tourne aussi chaque nuit.

Si aucune version corrigée n’existe en amont, forcer la sous-dépendance corrigée (`overrides` dans `package.json`) et vérifier que le résultat ne change pas. Exemple déjà en place : `postcss-selector-parser` sous Tailwind 3 côté Blade, CSS produit identique à l’octet.

## Réglages GitHub à reproduire

Une partie de la protection n’est pas dans le dépôt : ce sont des réglages du dépôt GitHub. Un fork, un transfert ou un nouveau dépôt ne les copie pas. Sans eux, la CI tourne mais ne bloque plus rien, et un secret peut être poussé.

| Réglage | Où (Settings) | Valeur |
|---------|---------------|--------|
| Protection de `main` | Branches → règle sur `main` | Pull request obligatoire ; contrôles requis : `Front — qualité & tests`, `Back — tests`, `Sécurité — secrets & dépendances`, `Docker — images, config & smoke prod`, `Dépendances — revue de PR` ; branche à jour avant merge ; appliquer aux administrateurs ; force-push et suppression interdits ; conversations résolues |
| Secret scanning et push protection | Code security | Activés |
| Alertes Dependabot et mises à jour de sécurité | Code security | Activées (active aussi le graphe de dépendances, requis par la revue de PR) |

Les contrôles requis n’apparaissent dans la liste qu’après un premier passage de la CI sur le nouveau dépôt. Vérification : un `git push` direct sur `main` doit être refusé (`GH006 Protected branch update failed`).

## Mettre un vrai certificat

Sans domaine, le certificat auto-signé suffit (voir [02 — Lancer et relancer](./02-lancer-et-relancer.md)). Avec un domaine :

1. Obtenir `tls.crt` (chaîne complète) et `tls.key` pour ce domaine, par exemple avec Let’s Encrypt.
2. Les déposer dans le volume `frontend-certs`, ou monter un dossier du serveur sur `/etc/nginx/certs` à la place du volume. Le conteneur les utilise tels quels et ne génère plus rien.
3. Dans `.env` : `APP_URL`, `SANCTUM_STATEFUL_DOMAINS`, `CORS_ALLOWED_ORIGINS` sur le domaine, `HTTPS_PORT=443`, `HTTP_PORT=80`, puis `HSTS_MAX_AGE=31536000`.
4. `docker compose up -d --build`.

HSTS reste à 0 tant que le certificat n’est pas reconnu : il oblige le navigateur à refuser le HTTP pour ce nom pendant un an.

## Revue de sécurité

Le protocole n’est pas versionné. Sur la machine où il a été installé, il est dans `.cursor/skills/revue-securite-preprod/`. Avant de s’en servir, vérifier qu’il est encore fiable :

```powershell
python .cursor/skills/revue-securite-preprod/tests/test_recon.py
```

Un échec interdit de lancer la revue. La revue elle-même ne démarre que lorsque le responsable recopie la phrase exacte de `templates/charte-engagement.md`, avec l’identifiant de charte et le hash du commit. Un « ok » ne suffit pas.

## Après un git pull

L’image Nginx du front ne relit pas le dépôt. Sans reconstruction, l’écran reste l’ancienne version.

```powershell
docker compose up -d --build frontend
```

Si `backend/`, un Dockerfile ou `docker-compose.yml` a changé : `docker compose up -d --build`.

## Ajouter un domaine

Quatre endroits doivent rester alignés. `npm run check:domains` échoue si l’un manque.

| Étape | Fichier |
|-------|---------|
| Slug et libellés FR/EN | `frontend/src/data/categories.ts` |
| Textes de page | `frontend/src/i18n/domains.ts` |
| Pastille et couple héro (fond + calque) | `frontend/src/assets/figmaHomeAssets.ts` et fichiers dans `frontend/public/pillules/` et `frontend/public/hero/` |
| Libellé envoyé à l’API, identique à la colonne `domaines.label` | `frontend/src/lib/categoryFilter.ts` |
| Ligne en base | `backend/database/seeders/DomainesSeeder.php` |

Les images de calque (zindex 1) sont en WebP avec couche alpha. Ne pas les réenregistrer en JPEG.

## Données et secrets

- Ne pas committer `.env`. Le modèle est `.env.docker.example`. Le hook refuse un `.env`, une clé ou un certificat, et GitHub refuse le push d’un secret connu.
- Le certificat TLS et sa clé vivent dans le volume `frontend-certs`, jamais dans le dépôt.
- Ne pas passer `SESSION_SECURE_COOKIE=false` en production : les cookies de session partiraient en clair.
- `docker compose down` garde MySQL, les PDF uploadés et la config LM Studio. `docker compose down -v` les efface. Ne pas utiliser `-v` sur une base à conserver.
- Le compte seed `test@labhorizon.nc` / `password` est public dans le dépôt. Le changer avant toute exposition hors machine de dev.
- La vulgarisation IA reste coupée (`LLM_ENABLED=false`) tant qu’un modèle n’est pas chargé. La passer à `true` sans modèle fait échouer la génération.
