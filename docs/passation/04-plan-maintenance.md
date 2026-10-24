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
- `docker compose down` garde MySQL, les PDF uploadés et la config LM Studio. `docker compose down -v` les efface. Ne pas utiliser `-v` sur une base à conserver.
- Le compte seed `test@labhorizon.nc` / `password` est public dans le dépôt. Le changer avant toute exposition hors machine de dev.
- La vulgarisation IA reste coupée (`LLM_ENABLED=false`) tant qu’un modèle n’est pas chargé. La passer à `true` sans modèle fait échouer la génération.
