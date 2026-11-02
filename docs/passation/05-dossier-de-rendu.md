# Dossier de rendu

Ce qui est remis avec le dépôt, ce qui ne l’est pas, et les limites à connaître avant de le présenter.

## Remis

| Élément | Où |
|---------|----|
| Monorepo front React + API Laravel | `frontend/`, `backend/` |
| Orchestration | `docker-compose.yml`, `.env.docker.example` |
| Catalogue de démo et compte chercheur | seeders Laravel, au premier `docker compose up` |
| Documentation qui fait foi | `docs/passation/`, `docs/data-dictionary-v1.md`, `docs/ux/`, `docs/cahier_des_charges_v2.md`, `docs/api-contract-v1.md`, `docs/TESTING.md` |
| Contrôle anti-régression et sécurité | Pipeline CI/CD : hooks Git (`lefthook.yml`), GitHub Actions (`.github/workflows/ci.yml`), `main` protégée. Objectif : [06 — Contrôles qualité](./06-controles-qualite.md) |
| Version Word du dossier | `docs/passation/Lab-Horizon-dossier-de-passation.docx` |

Première lecture : [README de la passation](./README.md).

## Non remis

| Élément | Pourquoi |
|---------|----------|
| `.env` et secrets (`APP_KEY`, mots de passe MySQL) | Créés sur la machine, absents de Git |
| Modèles LM Studio | Volume Docker local, profil `llm` optionnel |
| Base déjà remplie en dehors du seed | Les volumes ne voyagent pas avec le Git |
| Protocole de revue de sécurité (`.cursor/skills/revue-securite-preprod/`) | Installé localement, non versionné. Son corpus de test ne voyage pas avec le code |

## Limites connues

- Pas d’assistant conversationnel (RAG). Pas de PWA.
- Le domaine Physique s’affiche. La table `domaines` ne contient pas `0.phys` tant que le seeder n’est pas étendu. Mathématiques et Chimie, elles, sont dans `DomainesSeeder`.
- `docs/project-map.md` et `docs/front-back-status-v1.md` datent d’août 2026 (SQLite, inscription absente). Ils décrivent un état dépassé. Le chemin nominal est le monorepo Docker, et `POST /api/register` existe.
- Le certificat HTTPS est auto-signé tant que le projet n’a pas de nom de domaine : chiffrement réel, alerte du navigateur à accepter.
- Le compte de démonstration est déconnecté à chaque redémarrage du back : son mot de passe est réécrit au démarrage (`backend/docker/entrypoint.sh`). Les autres comptes restent connectés. Correctif proposé au développeur back.
- Si toutes les publications sont supprimées, le back ne redémarre plus : le seed se relance et échoue sur le compte existant. Restaurer la dernière sauvegarde. Correctif proposé au développeur back.
- Pas de déploiement continu (CD) : il sera branché sur GitHub Actions quand le serveur sera choisi. Aujourd’hui, mise à jour manuelle (chapitre 02).
- Le style du code PHP (Pint) n’est pas contrôlé : l’appliquer reformaterait 23 fichiers du back, décision laissée au développeur back.

## Compte de démonstration

`test@labhorizon.nc`. Mot de passe : `APP_BOOT_PASSWORD` dans `.env` (généré par `scripts/deploy/init-env`).
