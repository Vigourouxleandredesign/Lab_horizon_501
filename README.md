# Lab Horizon — SAE 501

Site de valorisation de la recherche de l’UNC (IUT de Nouvelle-Calédonie) : catalogue public de publications vulgarisées, et espace chercheur `/compte` pour les relire. L’assistant conversationnel (RAG) et la PWA ne sont pas dans cette livraison.

**Première lecture pour une équipe nouvelle :** [docs/passation/](docs/passation/README.md).

- Démonstration en ligne du front, sur données fictives : https://lab-horizon.netlify.app
- Démarche UX, choix techniques et équipe : [docs/passation/07-demarche-et-equipe.md](docs/passation/07-demarche-et-equipe.md)

## Démarrer

Prérequis : Docker (Engine + Compose 2.24 ou plus sous Linux, Docker Desktop sous Windows) et Git. Node.js 22 seulement pour développer.

```
git clone https://github.com/Vigourouxleandredesign/Lab_horizon_501.git
cd Lab_horizon_501
sh scripts/deploy/init-env.sh        # Windows : powershell -ExecutionPolicy Bypass -File scripts\deploy\init-env.ps1
docker compose up -d --build
```

`init-env` crée `.env` et génère les secrets ; avec une adresse (`init-env.sh https://192.168.1.20`), il prépare aussi un serveur. Procédure complète, Linux et Windows, sauvegardes : [docs/passation/02-lancer-et-relancer.md](docs/passation/02-lancer-et-relancer.md).

| Adresse | Service |
|---------|---------|
| https://localhost:8443 | Site (entrée unique). `http://localhost:8080` y redirige |
| http://localhost:8081 | API Laravel, dépannage (machine seulement) |
| localhost:3307 | MySQL, machine seulement (le 3306 de l’hôte reste libre) |

Le site est servi en HTTPS avec un certificat auto-signé généré au premier démarrage : le navigateur affiche une alerte, à accepter une fois. Détail et vrai certificat : [docs/passation/02-lancer-et-relancer.md](docs/passation/02-lancer-et-relancer.md).

Compte de démonstration : `test@labhorizon.nc`, mot de passe = `APP_BOOT_PASSWORD` du `.env` (généré par `init-env`, affiché à la fin du script).

LM Studio est un profil à part (`docker compose --profile llm up -d lm-studio`). Par défaut `LLM_ENABLED=false` : le catalogue fonctionne sans modèle. Détail : [docs/passation/02-lancer-et-relancer.md](docs/passation/02-lancer-et-relancer.md).

Après un `git pull` : sauvegarder (`scripts/deploy/backup.sh`), puis `docker compose up -d --build`. Sans `--build`, le site reste l’ancienne version.

## Documents qui font foi

| Sujet | Document |
|-------|----------|
| Reprendre, lancer, maintenir | `docs/passation/` |
| Modèle de données visé | `docs/data-dictionary-v1.md` |
| Parcours et écrans visés | `docs/ux/` |
| Cadrage produit | `docs/cahier_des_charges_v2.md` |
| Contrat HTTP branché | `docs/api-contract-v1.md` |
| Anti-régression et sécurité (CI/CD) | `docs/TESTING.md` |
| Revue de sécurité avant MEP | Protocole installé localement, hors dépôt |

`docs/project-map.md` et `docs/front-back-status-v1.md` sont historiques (août 2026).

## Contrôle

Pipeline CI/CD obligatoire. `npm install` à la racine installe les hooks Git : chaque commit est contrôlé (format, lint, types, tests, secrets, dépendances), chaque push relance l’audit des dépendances, et GitHub Actions rejoue tout, images Docker de prod comprises. `main` n’accepte que des pull requests dont la CI est verte. Détail : [docs/TESTING.md](docs/TESTING.md).

Tout vérifier à la main :

```powershell
npm run gate
```

Ne pas committer `.env`. Modèles : `.env.docker.example`, `frontend/.env.example`, `backend/.env.example`.
