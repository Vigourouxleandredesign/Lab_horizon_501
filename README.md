# Lab Horizon — SAE 501

Site de valorisation de la recherche de l’UNC (IUT de Nouvelle-Calédonie) : catalogue public de publications vulgarisées, et espace chercheur `/compte` pour les relire. L’assistant conversationnel (RAG) et la PWA ne sont pas dans cette livraison.

**Première lecture pour une équipe nouvelle :** [docs/passation/](docs/passation/README.md).

## Démarrer

Prérequis : Docker Desktop, Git, Node.js 22.

```powershell
copy .env.docker.example .env
docker compose up -d --build
```

| Adresse | Service |
|---------|---------|
| http://localhost:8080 | Site (entrée unique) |
| http://localhost:8081 | API Laravel, dépannage |
| localhost:3307 | MySQL (le 3306 de l’hôte reste libre) |

Compte seed : `test@labhorizon.nc` / `password`. À changer avant toute exposition hors machine de dev.

LM Studio est un profil à part (`docker compose --profile llm up -d lm-studio`). Par défaut `LLM_ENABLED=false` : le catalogue fonctionne sans modèle. Détail : [docs/passation/02-lancer-et-relancer.md](docs/passation/02-lancer-et-relancer.md).

Après un `git pull`, reconstruire l’image front, sinon l’écran reste l’ancienne version : `docker compose up -d --build frontend`.

## Documents qui font foi

| Sujet | Document |
|-------|----------|
| Reprendre, lancer, maintenir | `docs/passation/` |
| Modèle de données visé | `docs/data-dictionary-v1.md` |
| Parcours et écrans visés | `docs/ux/` |
| Cadrage produit | `docs/cahier_des_charges_v2.md` |
| Contrat HTTP branché | `docs/api-contract-v1.md` |
| Anti-régression | `docs/TESTING.md` |
| Revue de sécurité avant MEP | Protocole installé localement, hors dépôt |

`docs/project-map.md` et `docs/front-back-status-v1.md` sont historiques (août 2026).

## Contrôle

```powershell
npm run gate
```

Ne pas committer `.env`. Modèles : `.env.docker.example`, `frontend/.env.example`, `backend/.env.example`.
