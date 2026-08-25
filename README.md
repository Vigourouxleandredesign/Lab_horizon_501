# Lab Horizon — SAE 501

Plateforme de valorisation de la recherche calédonienne (IUT de Nouvelle-Calédonie), avec assistant IA (RAG) et PWA.

## Structure du dépôt

| Dossier | Rôle |
|---------|------|
| `frontend/` | Application React (Vite + TypeScript) |
| `backend/` | API REST Laravel 12 + MySQL |
| `docs/` | Cahier des charges, dictionnaire de données, spécifications UX |
| `docs/archive/` | Livrables historiques (wireframe HTML, export Figma, logos) — référence uniquement |
| `docker-compose.yml` | Front, back, MySQL 8.4 et Redis 7 |

## Docker (front + back)

Deux conteneurs applicatifs (React/Nginx et Laravel) communiquent sur le réseau Compose. Le navigateur n’appelle que le front (`http://localhost:8080`) : Nginx y reverse-proxy `/api`, `/sanctum` et `/files` vers le back.

```bash
cp .env.docker.example .env
# APP_KEY : optionnel au premier `up` (générée dans le conteneur).
# Pour la garder d’un redémarrage à l’autre : php artisan key:generate --show
docker compose up --build
```

- Site : `http://localhost:8080`
- API Laravel directe (debug) : `http://localhost:8081`
- MySQL : `localhost:3306`

Au premier démarrage, Laravel migre puis **seed** le contenu local (17 recherches, chemins PDF vers `public/files/recherches/`). Compte démo : `test@labhorizon.nc` / `password`.

Ne pas committer `.env` (mots de passe, `APP_KEY`).

## Démarrer le frontend (sans Docker)

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Autres scripts : `npm run build` (production), `npm run lint`, `npm run preview`.

Les scripts sont aussi disponibles depuis la racine : `npm run dev`, `npm run build`, `npm run preview`.

## Documents de référence (ordre d'autorité)

1. `docs/data-dictionary-v1.md` — modèle de données
2. `docs/ux/` — parcours, écrans, composants
3. `docs/cahier_des_charges_v2.md` — cadrage produit, contraintes, calendrier

## Déploiement démo (Netlify)

- Config versionnée : `frontend/netlify.toml` (build + redirect SPA React Router).
- Déploiement manuel depuis `frontend/` : `netlify deploy --prod --dir=dist` (après `npm run build`).
- URL production : https://labhorizon.netlify.app
- Le dossier `frontend/.netlify/` (lien CLI local) est **ignoré par Git** — voir `.gitignore`.

## Git & secrets

- Politique complète : `.gitignore` à la racine (frontend, backend Laravel, `.env`, bases SQLite, etc.).
- **`.cursor/rules/`** est versionné (charte projet) ; **`.cursor/mcp.json`** est ignoré (config locale).
- Ne jamais committer `.env` — modèles : `frontend/.env.example`, `backend/.env.example`, `.env.docker.example`.

## État du projet

- Frontend : pages publiques + espace chercheur, couche API (`frontend/src/api/`)
- Backend : Laravel 12, API REST, MySQL (SQLite possible en local hors Docker)
- Docker : `docker compose up --build` (front, back, MySQL, Redis)
- PWA : à venir (manifest, service worker)
- Rôles V1 : visiteur public (sans compte) + chercheur (connecté)
