# Dossier de rendu

Ce qui est remis avec le dépôt, ce qui ne l’est pas, et les limites à connaître avant de le présenter.

## Remis

| Élément | Où |
|---------|----|
| Monorepo front React + API Laravel | `frontend/`, `backend/` |
| Orchestration | `docker-compose.yml`, `.env.docker.example` |
| Catalogue de démo et compte chercheur | seeders Laravel, au premier `docker compose up` |
| Documentation qui fait foi | `docs/passation/`, `docs/data-dictionary-v1.md`, `docs/ux/`, `docs/cahier_des_charges_v2.md`, `docs/api-contract-v1.md`, `docs/TESTING.md` |
| Contrôle anti-régression | `npm run gate` à la racine. Objectif : [06 — Contrôles qualité](./06-controles-qualite.md) |
| Version Word du dossier | `docs/passation/Lab-Horizon-dossier-de-passation.docx` |

Première lecture : [README de la passation](./README.md).

## Non remis

| Élément | Pourquoi |
|---------|----------|
| `.env` et secrets (`APP_KEY`, mots de passe MySQL) | Créés sur la machine, absents de Git |
| Modèles LM Studio | Volume Docker local, profil `llm` optionnel |
| Base déjà remplie en dehors du seed | Les volumes ne voyagent pas avec le Git |
| Protocole de revue et archives (`v2.zip`, `v2.1.zip`, `redteam-preprod-audit.zip`) | Installés localement, hors dépôt. Le corpus de test ne voyage pas avec le code |
| `lab_horizon_501.bundle`, `lab_horizon_501.txt` | Exports ponctuels, hors dépôt |
| `LEANDRE PPP_3.srt` | Fichier personnel, hors produit |

## Limites connues

- Pas d’assistant conversationnel (RAG). Pas de PWA.
- Le domaine Physique s’affiche. La table `domaines` ne contient pas `0.phys` tant que le seeder n’est pas étendu. Mathématiques et Chimie, elles, sont dans `DomainesSeeder`.
- `docs/project-map.md` et `docs/front-back-status-v1.md` datent d’août 2026 (SQLite, inscription absente). Ils décrivent un état dépassé. Le chemin nominal est le monorepo Docker, et `POST /api/register` existe.
- `npm run gate:full` peut remonter des échecs PHPUnit Breeze (`/profile`, manifest Vite Laravel). Ils ne décrivent pas l’état du catalogue React.

## Compte de démonstration

`test@labhorizon.nc` / `password`. À changer avant toute exposition hors machine de dev.
