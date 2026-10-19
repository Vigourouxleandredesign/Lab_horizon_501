# Plan de maintenance

Gestes à faire pour ne pas casser le dépôt. L’objectif de chaque contrôle, pour un évaluateur, est dans [06 — Contrôles qualité](./06-controles-qualite.md). Le détail technique est dans [docs/TESTING.md](../TESTING.md). Le démarrage pas à pas est dans [02 — Lancer et relancer](./02-lancer-et-relancer.md).

## Après un changement de code

À la racine :

```powershell
npm run gate
```

Ce contrôle ne demande pas Docker : types, lint, secrets, couleurs, contrat des domaines, tests unitaires, build front.

Avant une remise, avec la pile Docker allumée :

```powershell
npm run gate:full
```

Cela ajoute PHPUnit et les fumées API recherche + auth.

Des tests PHPUnit hérités de Laravel Breeze (`/profile`, manifest Vite absent dans `backend/public/build`) peuvent échouer. Ils ne touchent pas le site React. Les noter dans le compte-rendu, ne pas les traiter comme une régression du catalogue.

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

- Ne pas committer `.env`. Le modèle est `.env.docker.example`.
- `docker compose down` garde MySQL, les PDF uploadés et la config LM Studio. `docker compose down -v` les efface. Ne pas utiliser `-v` sur une base à conserver.
- Le compte seed `test@labhorizon.nc` / `password` est public dans le dépôt. Le changer avant toute exposition hors machine de dev.
- La vulgarisation IA reste coupée (`LLM_ENABLED=false`) tant qu’un modèle n’est pas chargé. La passer à `true` sans modèle fait échouer la génération.
