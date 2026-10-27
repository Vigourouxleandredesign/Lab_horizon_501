# Passation Lab Horizon

Point d’entrée pour une équipe qui n’a jamais ouvert ce dépôt. Lire les documents dans l’ordre.

| Ordre | Document | Question à laquelle il répond |
|-------|----------|-------------------------------|
| 1 | [01 — À quoi sert chaque élément](./01-a-quoi-sert-chaque-element.md) | Où est le code, pourquoi ce dossier existe, quels fichiers ignorer |
| 2 | [02 — Lancer et relancer](./02-lancer-et-relancer.md) | Démarrer, arrêter, reconstruire après un `git pull` |
| 3 | [03 — Plan d’évolution](./03-plan-evolution.md) | Ce qui est livré, ce qui est V2, ce qui est V3 |
| 4 | [04 — Plan de maintenance](./04-plan-maintenance.md) | Comment ne pas casser le projet au quotidien |
| 5 | [05 — Dossier de rendu](./05-dossier-de-rendu.md) | Ce qui est remis, ce qui ne l’est pas, limites connues |
| 6 | [06 — Contrôles qualité](./06-controles-qualite.md) | Objectif des tests en place, et revue de sécurité prévue |

Version Word de l’ensemble, pour les évaluateurs : [Lab-Horizon-dossier-de-passation.docx](./Lab-Horizon-dossier-de-passation.docx).

## Produit en une phrase

**Lab Horizon** est le site de valorisation de la recherche de l’UNC (IUT de Nouvelle-Calédonie) : un catalogue public de publications vulgarisées, plus un espace chercheur (`/compte`) pour relire ces vulgarisations. L’assistant conversationnel (RAG) n’est pas dans cette livraison.

## Règle de lecture des autres docs

`docs/passation/` décrit **l’état du code**. En cas de contradiction :

| Sujet | Document qui fait foi |
|-------|------------------------|
| Reprendre le projet, le lancer, le maintenir | ce dossier |
| Modèle de données visé | `docs/data-dictionary-v1.md` |
| Parcours et écrans visés | `docs/ux/` |
| Cadrage produit, juridique, hébergement | `docs/cahier_des_charges_v2.md` |
| Contrat HTTP réellement branché | `docs/api-contract-v1.md` et `backend/routes/api.php` |
| Anti-régression | `docs/TESTING.md` |

`docs/project-map.md` et `docs/front-back-status-v1.md` datent d’août 2026 (deux dépôts, SQLite, inscription absente). Ils sont historiques. Le dépôt est aujourd’hui un monorepo, Docker est le chemin nominal, `POST /api/register` existe.

## Compte de démonstration

`test@labhorizon.nc`, créé par le seed Docker. Son mot de passe est `APP_BOOT_PASSWORD` dans `.env`, généré par `scripts/deploy/init-env` et réappliqué à chaque démarrage du back.
