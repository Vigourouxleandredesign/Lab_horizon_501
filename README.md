# Lab Horizon — SAE 501

Plateforme de valorisation de la recherche calédonienne (IUT de Nouvelle-Calédonie), avec assistant IA (RAG) et PWA.

## Structure du dépôt

| Dossier | Rôle |
|---------|------|
| `frontend/` | Application React (Vite + TypeScript) — future PWA |
| `backend/` | API REST Laravel + MySQL (à créer) |
| `docs/` | Cahier des charges, dictionnaire de données, spécifications UX |
| `docs/archive/` | Livrables historiques (wireframe HTML, export Figma, logos) — référence uniquement |

## Démarrer le frontend

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

- Politique complète : `.gitignore` à la racine (frontend, backend Laravel à venir, `.env`, bases SQLite, etc.).
- **`.cursor/rules/`** est versionné (charte projet) ; **`.cursor/mcp.json`** est ignoré (config locale).
- Ne jamais committer `.env` — seul `frontend/.env.example` sert de modèle.

## État du projet

- Frontend : pages publiques + backoffice chercheur (mock), couche API prête (`frontend/src/api/`)
- Backend : à venir (Laravel + SQLite, API REST)
- PWA : à venir (manifest, service worker)
- Rôles V1 : visiteur public (sans compte) + chercheur (connecté)
