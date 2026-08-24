# Lab Horizon — Contrat d’intégration Front ↔ Back (V1)

> **Document de référence partagé** entre le repo front et le repo back.  
> Objectif : aligner endpoints, noms de champs JSON et points de connexion — sans fusionner les dépôts.  
> **Source de vérité front (types TypeScript) :** `frontend/src/api/types.ts`  
> **Références produit :** `docs/data-dictionary-v1.md`, `docs/ux/08-parcours-utilisateur-v1.md`

---

## 1. Cadre de collaboration

| Élément | Décision |
|---------|----------|
| Organisation Git | **2 repos séparés** : 1 front (React/Vite) + 1 back (Laravel) |
| Qui fait quoi | Front aligne ses facades/adapters sur le contrat ; back expose l’API conforme au contrat |
| Déploiement serveur | **Pas encore** — travail en local (manque de ressources physiques) |
| Preview temporaire | Netlify front en mode `mock` uniquement (pas la cible finale) |

### Branches (identique sur chaque repo, en parallèle)

```
main          → prod-like / référence stable
dev           → intégration continue (branche de travail commune)
feature/*     → nouvelles fonctionnalités
fix/*         → corrections
```

Chacun travaille sur son repo. L’alignement se fait via **ce document** + les merges `feature|fix` → `dev` → `main` de chaque côté.

### Config front pour parler au back (local)

| Environnement | Variables |
|---------------|-----------|
| Dev | `VITE_DATA_SOURCE=rest` + `VITE_API_BASE_URL=http://localhost:8000` |
| Prod-like local | Même schéma, URL back locale (ou future URL serveur) |
| Sans API (défaut actuel) | `VITE_DATA_SOURCE=mock` |

Un seul codebase front — **pas** de dossiers `frontend-dev` / `frontend-prod`.

---

## 2. Besoins fonctionnels couverts par l’API

| Besoin | Règle produit | Zone API |
|--------|---------------|----------|
| Consulter publications vulgarisées | Public → uniquement `PUBLISHED` (D4) | Publications |
| Rechercher / filtrer | Catégorie, année, tri, pagination (D8) | Publications |
| Se connecter / s’inscrire | Session chercheur (D9 : pas dans la nav publique) | Auth |
| Voir profils chercheurs | Réservé aux connectés (D3) | Chercheurs |
| Suivre un chercheur (veille) | Connecté (D5) | Chercheurs |
| Tableau de bord chercheur | Connecté | Compte |
| Valider une vulgarisation | Connecté (D6) | Compte |

---

## 3. Points de connexion techniques

| Point | Convention |
|-------|------------|
| Transport | HTTPS / HTTP local — JSON (`Accept: application/json`) |
| Base URL front | `VITE_API_BASE_URL` (ex. `http://localhost:8000`) |
| Préfixe API | `/api/...` |
| Auth | **Laravel Sanctum SPA** — cookies de session httpOnly |
| CSRF | `GET /sanctum/csrf-cookie` avant login/register ; header `X-XSRF-TOKEN` sur les mutations |
| Credentials | Front envoie `credentials: 'include'` |
| CORS | Origine front (`localhost:5173`, etc.) autorisée **avec** `Access-Control-Allow-Credentials: true` |
| Erreurs | HTTP status standard ; body JSON optionnel. **404** = ressource absente / non visible |
| IDs | Chaînes JSON (`"id": "…"`) — UUID ou cast string côté API |

---

## 4. Taxonomie — conventions de nommage

### Style JSON (réponses / bodies API)

| Règle | Exemple |
|-------|---------|
| **camelCase** pour tous les champs JSON | `displayName`, `dateLabel`, `pageSize` |
| Enums en **SCREAMING_SNAKE** ou valeur fixe documentée | `PUBLISHED`, `RESEARCHER` |
| Listes paginées | Toujours `{ "items": [...], "total": number }` |
| Query params | `q`, `category`, `year`, `sort`, `page`, `pageSize` |

> Le back peut garder ses noms métier en base (`titre`, `domaine`…).  
> L’**API JSON** doit exposer les noms de ce contrat (Resources / transformers Laravel).

### Enums V1 (à figer ensemble)

| Nom | Valeurs | Notes |
|-----|---------|-------|
| `PublicationStatus` | `DRAFT` \| `PENDING_AI_VALIDATION` \| `PUBLISHED` | Public = `PUBLISHED` seulement. `PRIVATE` éventuel = hors V1 sauf accord. |
| `PublicationSource` | `local` \| `hal` | Transparence provenance |
| `SessionUser.role` | `RESEARCHER` \| `ADMIN` | V1. Rôles `PRO` / `ADMIN_APP` du dictionnaire = évolution future |
| `sort` (query) | `recent` \| `relevance` | |

### Mapping indicatif back actuel → JSON contrat

Aide pour le repo back (modèles `Recherche`, `Vulgarisation`, `User`) — **non bloquant** si le schéma évolue, tant que le JSON sortant respecte la taxonomie.

| Champ JSON | Origine probable back | Remarque |
|------------|----------------------|----------|
| `title` | `recherches.titre` | |
| `category` | `recherches.domaine` | Aligner avec les slugs/libellés catégories front |
| `year` | année de `date_production` | number ou null |
| `dateLabel` | date formatée affichage | string localisée |
| `authorName` | `auteur` ou `users.name` | |
| `authorId` | id profil / user | null si source HAL pure |
| `institution` | `structure` | |
| `source` | `manuel`→`local`, `hal`→`hal` | |
| `status` | **à créer** | colonne / enum |
| `lead`, `paragraphs[]` | dérivés de vulgarisation | structure à définir côté back |
| `sourceUrl` | `hal_url` | |
| `displayName` | `users.name` | session + profil |

---

## 5. Catalogue des endpoints

Base : `{VITE_API_BASE_URL}`

### 5.1 Auth

| Méthode | Endpoint | Auth | Body | Réponse |
|---------|----------|------|------|---------|
| GET | `/sanctum/csrf-cookie` | Non | — | Cookie CSRF |
| POST | `/api/login` | Non (+ CSRF) | `LoginPayload` | `SessionUser` |
| POST | `/api/logout` | Session | — | 204 / vide |
| GET | `/api/me` | Session | — | `SessionUser` ou **401** |
| POST | `/api/register` | Non (+ CSRF) | `RegisterPayload` | `SessionUser` |

```ts
LoginPayload    = { email, password }
RegisterPayload = { name, email, password }
SessionUser     = { id, displayName, email, role, researcherId }
```

### 5.2 Publications (public, filtre D4 côté serveur)

| Méthode | Endpoint | Query | Réponse |
|---------|----------|-------|---------|
| GET | `/api/publications` | `q`, `category`, `year`, `sort`, `page`, `pageSize` | `SearchResult<PublicationSummary>` |
| GET | `/api/publications/:id` | — | `PublicationDetail` ou **404** |

```ts
PublicationSummary = {
  id, title, category, year, dateLabel,
  authorName, authorId, institution, source
}
PublicationDetail = PublicationSummary & {
  status, lead, paragraphs, meta, sourceUrl, related
}
meta = { scientificTitle, authors, publishedAt, lab }
```

### 5.3 Chercheurs (session obligatoire — D3)

| Méthode | Endpoint | Query | Réponse |
|---------|----------|-------|---------|
| GET | `/api/researchers` | `q`, `category` | `SearchResult<ResearcherSummary>` |
| GET | `/api/researchers/:id` | — | `ResearcherProfile` ou **404** |
| POST | `/api/researchers/:id/follow` | — | 204 / vide |

Sans session → **401** ou **403**.

```ts
ResearcherSummary = { id, displayName, institution, domain, category, photoUrl }
ResearcherProfile = ResearcherSummary & { available, publications }
```

### 5.4 Compte chercheur (session obligatoire)

| Méthode | Endpoint | Body | Réponse |
|---------|----------|------|---------|
| GET | `/api/me/dashboard` | — | `DashboardData` |
| GET | `/api/me/publications` | — | `ResearcherPublicationItem[]` |
| GET | `/api/me/publications/:id/review` | — | `PublicationReview` |
| POST | `/api/me/publications/:id/validate` | `ValidatePublicationPayload` | 204 / vide |

```ts
DashboardData = { dateLabel, greeting, stats, watchItems }
stats         = { views, publicationsCount, watchNewCount, draftsCount }
watchItems[]  = { id, keyword, newCount, dateLabel }
ValidatePublicationPayload = {
  accepted,
  vulgarizedTitle?, vulgarizedLead?, vulgarizedParagraphs?
}
```

---

## 6. Checklist d’alignement (suivi commun)

Cocher au fil des livraisons (front **et** back).

### Infra

- [ ] CORS + credentials (origines locaux front)
- [ ] Sanctum stateful domains configurés
- [ ] `GET /sanctum/csrf-cookie` OK
- [ ] Front : header `X-XSRF-TOKEN` sur POST/PUT/PATCH/DELETE

### Auth

- [ ] `POST /api/login` → `SessionUser`
- [ ] `GET /api/me` → `SessionUser` | 401
- [ ] `POST /api/logout`
- [ ] `POST /api/register` (mécanisme de validation inscription à trancher)

### Publications

- [ ] `GET /api/publications` (pagination + filtres)
- [ ] `GET /api/publications/:id`
- [ ] Filtre serveur : anonyme = `PUBLISHED` uniquement

### Chercheurs

- [ ] `GET /api/researchers` (+ auth)
- [ ] `GET /api/researchers/:id`
- [ ] `POST /api/researchers/:id/follow`

### Compte

- [ ] `GET /api/me/dashboard`
- [ ] `GET /api/me/publications`
- [ ] `GET …/review` + `POST …/validate`

---

## 7. Points encore ouverts (à trancher ensemble)

1. Mécanisme d’inscription chercheur (email institutionnel ? validation admin ?).
2. Admin Blade `/moncompte` : coexistence temporaire ou remplacement par le front `/compte`.
3. Stockage du corps vulgarisé (`paragraphs[]`) côté back.
4. Scope V1 du moteur IA : contenu pré-généré / mocké OK, ou génération back dès V1 ?
5. Agrégation HAL : via le back uniquement, ou front mode `hal` en complément jusqu’à ce que le back le prenne en charge ?

---

## 8. Comment utiliser ce document au quotidien

| Rôle | Usage |
|------|--------|
| **Dev front** | Implémenter / ajuster `src/api/*` pour coller aux endpoints et champs listés ici |
| **Dev back** | Implémenter `routes/api.php` + Resources JSON avec **exactement** ces noms camelCase |
| **Les deux** | Toute évolution de contrat = mise à jour de **ce fichier** + `frontend/src/api/types.ts`, puis PR sur `dev` de chaque repo |

En cas de conflit entre une implémentation et ce document : **mettre à jour le contrat d’abord**, puis les deux codes.

---

*Document vivant — V1 — juillet 2026.*
