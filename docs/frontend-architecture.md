# Lab Horizon — Frontend (Vite + React)

## Sources de données

| Variable | Valeurs | Effet |
|----------|---------|--------|
| `VITE_DATA_SOURCE` | `mock` (défaut), `hal`, `rest` | Choisit l'adaptateur de la couche `src/api/` |
| `VITE_API_BASE_URL` | ex. `http://localhost:8000` | Requis en mode `rest` — API Laravel |

### Modes

- **`mock`** — Données locales (`data/labData.ts`). Aucun réseau. Idéal pour maquettes et CI.
- **`hal`** — Recherche publique branchée sur [HAL](https://api.archives-ouvertes.fr/search/). Démo d'une vraie API externe avant le back Laravel.
- **`rest`** — API Laravel (cookies de session + CSRF). **Mode hybride V1 :** auth + catalogue `/api/recherches` via adaptateur `src/api/rest/`, compte et chercheurs restent en mock tant que leurs endpoints back n’existent pas.

Exemple :

```env
VITE_DATA_SOURCE=mock
# VITE_DATA_SOURCE=hal
# VITE_DATA_SOURCE=rest
# VITE_API_BASE_URL=http://localhost:8000
```

## Architecture `src/`

```
src/
├── api/              # Façades + adaptateurs (mock | hal | rest)
│   ├── types.ts      # DTO UI stables (camelCase) — pages ne voient que ça
│   ├── http.ts       # fetch + cookies + X-XSRF-TOKEN + ApiError
│   ├── rest/         # Mappers Laravel (/api/recherches → DTO)
│   ├── publications.ts
│   ├── researchers.ts
│   ├── auth.ts
│   ├── account.ts
│   └── index.ts      # Point d'entrée public
├── auth/             # AuthContext + RequireAuth
├── components/       # UI réutilisable (PublicationCard, QueryStates…)
├── components/backoffice/  # Layout espace chercheur (sans chrome public)
├── pages/            # Une page = une route ; structure fixe, contenu via api/
├── hooks/            # useApiQuery, useLocale, useSiteNavigation…
├── data/             # Données statiques (catégories, nav, mock seed)
└── i18n/             # Copy FR/EN par feature
```

### Règle d'or

**Les pages n'importent jamais `data/labData` directement.** Elles appellent `src/api/*`.
Changer de source = variable d'environnement, pas réécriture des pages.

### Motif page type

1. Paramètres URL (`useParams`, `useSearchParams`)
2. `useApiQuery((signal) => facadeFn(..., signal), [deps])`
3. Rendu via `LoadingState` / `ErrorState` / `EmptyState`
4. Composants présentation (`PublicationCard`, etc.)

## Contrats REST attendus (Laravel)

**Référence partagée (2 repos séparés) :** [`docs/api-contract-v1.md`](./api-contract-v1.md)  
— besoins, endpoints, taxonomie JSON (camelCase), auth Sanctum, checklist d’alignement.

Résumé des facades (détail dans le contrat + en-têtes de `src/api/*`) :

| Façade | Endpoints runtime (back actuel) |
|--------|----------------------------------|
| `publications` | `GET /api/recherches`, `GET /api/recherches/:id` (mappés vers DTO) |
| `auth` | `GET /api/me`, `POST /api/login`, `POST /api/logout` + `/sanctum/csrf-cookie` ; register → 501 |
| `researchers` | Mock tant que `/api/researchers` absent |
| `account` | Mock tant que dashboard / review absents |

Voir aussi : [`docs/front-back-status-v1.md`](./front-back-status-v1.md).

## Sécurité front

- Session via **cookies httpOnly** (`credentials: 'include'`) — pas de JWT en localStorage.
- `RequireAuth` = confort UX ; la barrière réelle est **401/403 côté API**.
- Profils chercheurs : route protégée + onglet recherche conditionné (D3).
- Timeout réseau systématique (`http.ts`).

## Routes

| Zone | Layout | Exemples |
|------|--------|----------|
| Public | `AppFrame` | `/`, `/recherche`, `/publications/:id`, `/categories/:slug` |
| Chercheur (lecture) | `AppFrame` + `RequireAuth` | `/chercheurs/:id` |
| Backoffice | `BackofficeLayout` + `RequireAuth` | `/compte`, `/compte/publications/:id/review` |
| Accès caché | `AppFrame` (sans nav) | `/connexion`, `/inscription` |

Connexion/inscription **non listées** dans la nav publique (doc 07 §3, D9) — URL communiquée par le référent.

## Évolutions prévues, non implémentables sans back

- Recherche agrégée HAL + Google Scholar + Scholar médical (API Laravel)
- Vulgarisation LLM (POC hors dépôt) — flux de validation en place, contenu mocké
- Inscription avec validation admin/email
- Notifications push PWA (doc 05)

Voir aussi : `docs/ux/08-parcours-utilisateur-v1.md`
