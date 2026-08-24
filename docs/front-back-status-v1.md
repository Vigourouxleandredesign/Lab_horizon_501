# Lab Horizon — Vue d’ensemble Front ↔ Back (état actuel)

> **Date :** août 2026  
> **Repos front :** repo local `frontend/` (Vite + React)  
> **Repos back :** [greya734/labhorizon](https://github.com/greya734/labhorizon) — commit `1baee8c` (`main`)  
> **Décision d’alignement :** on **adapte le front au back** (chemins, shapes JSON), une fois les points techniques de session stabilisés.

Ce document répond à trois questions :

1. Que peut-on faire **aujourd’hui** avec ce front et ce back ?
2. Que peut-on faire en **adaptant uniquement le front** au back existant ?
3. Qu’est-ce qui **ne peut pas** être fait tant que le back n’ajoute pas d’endpoints / de modèle ?

---

## 1. Cadre projet (rappel)

| Élément | État |
|---------|------|
| Organisation | **2 repos séparés** (front / back) |
| Front | Architecture API-ready (`mock` \| `hal` \| `rest`) — défaut = `mock` |
| Back | Laravel 12 + MySQL — admin Blade `/moncompte` + API JSON partielle `/api/*` |
| Déploiement serveur | **Pas encore** — local uniquement |
| Preview temporaire | Netlify front en `mock` (pas la cible finale) |

### Ce que le back expose réellement aujourd’hui

| Zone | Endpoints | Statut |
|------|-----------|--------|
| Auth JSON | `POST /api/login`, `POST /api/logout`, `GET /api/me` | ✅ Présents |
| Recherches | `GET/POST/PUT/DELETE /api/recherches`, `GET …/vulgarisations` | ✅ Présents |
| CORS | `config/cors.php` → `localhost:5173` + credentials | ✅ Présent |
| CSRF | Workflow `/sanctum/csrf-cookie` documenté | ⚠️ À valider en cross-origin |
| Register JSON | `POST /api/register` | ❌ Absent (Blade seulement) |
| Chercheurs | `/api/researchers…` | ❌ Absent |
| Compte / dashboard | `/api/me/dashboard`, `/api/me/publications`, review/validate | ❌ Absents |
| Statut publication | champ `status` (DRAFT / PUBLISHED…) | ❌ Absent |

---

## 2. Déjà faisable aujourd’hui (sans brancher `rest`)

Le front fonctionne **en autonomie** grâce au mode `mock` (et optionnellement `hal` pour la recherche publique).

| Parcours / page | Mode | Commentaire |
|-----------------|------|-------------|
| Accueil, À propos, Légal, Catégories | `mock` | Contenu statique / local — aucun back requis |
| Recherche publications + filtres | `mock` ou `hal` | `hal` = vraie API HAL externe |
| Page publication détail | `mock` ou `hal` | Corps vulgarisé mocké |
| Connexion / navigation compte | `mock` | Compte démo `chercheur@demo.unc.nc` |
| Fiche chercheur `/chercheurs/:id` | `mock` | Données locales, derrière `RequireAuth` |
| Espace `/compte` + review vulgarisation | `mock` | Flux D6 simulé en mémoire |
| Inscription | `mock` | Refusée volontairement (message → compte démo) |

**Verdict :** le site public + la démo chercheur sont livrables en l’état pour maquettes, démos et Netlify.  
**Rien de ceci ne consomme encore le back Laravel.**

---

## 3. Faisable en adaptant le front au back

Périmètre : endpoints **déjà présents** côté Laravel.  
Travail front uniquement (adaptateur REST + config + CSRF).  
**Prérequis back :** session cookie cross-origin fonctionnelle (middleware Sanctum stateful — à confirmer / corriger côté back si le login échoue).

### 3.1 Ce qu’on peut brancher

| Fonctionnalité front | Endpoint back | Travail front requis |
|----------------------|---------------|----------------------|
| Connexion `/connexion` | `POST /api/login` + `GET /api/me` | Mapper `{ user: { name, email… } }` → `SessionUser` (`displayName`, `role?`, `researcherId?`) |
| Déconnexion | `POST /api/logout` | Déjà prévu — ajouter `X-XSRF-TOKEN` |
| Hydratation session au chargement | `GET /api/me` | Idem mapping |
| Liste publications (recherche / domaines) | `GET /api/recherches?page=` | Adapter chemin + pagination Laravel `{ data, meta }` → `{ items, total }` |
| Détail publication | `GET /api/recherches/{id}` | Mapper `titre`→`title`, `domaines[]`→`category`, `auteurs[]`→`authorName`, `vulgarisations[].resume`→`lead`/`paragraphs`, `hal_url`→`sourceUrl` |
| PDFs | champ `pdf_url` / route `/files/…` | Brancher les liens média sur `pdf_url` |

### 3.2 Checklist front (phase intégration minimale)

1. ✅ **Client HTTP** — `X-XSRF-TOKEN` + body vide (`frontend/src/api/http.ts`).
2. ✅ **Adaptateur REST publications** — `/api/recherches` + mappers (`frontend/src/api/rest/`).
3. ✅ **Adaptateur REST auth** — `{ user }` / `name` → `SessionUser` ; register → 501.
4. ✅ **Config locale** — `frontend/.env.development` (`rest` + `http://127.0.0.1:8000`).
5. ⏳ **Test E2E local** — `php artisan serve` + `npm run dev` : login → `/api/me` → liste → détail (dépend session SPA back / P0).
6. ✅ **Gestion 404** — REST détail → `null` (aligné mock).

**Mode hybride :** en `rest`, `researchers` + `account` restent sur mock (`*_API_READY = false`) pour ne pas casser `/compte` et `/chercheurs/:id`.

### 3.3 Limites assumées de cette phase

Même après adaptation front, ces comportements **ne seront pas au niveau produit V1** :

| Limite | Pourquoi |
|--------|----------|
| Pas de filtres recherche (`q`, catégorie, année, tri) | Le back n’accepte que `page` |
| Pas de règle D4 (brouillon vs publié) | Aucun champ `status` — **toutes** les recherches sont publiques |
| Contenu vulgarisé peu structuré | Un seul champ `resume` (texte libre), pas `lead` + `paragraphs[]` |
| Rôles `RESEARCHER` / `ADMIN` | Absents du modèle `User` — le front devra mocker / omettre |
| Pagination | Format Laravel à mapper ; pas de `pageSize` côté back (fixe à 15) |

**Verdict phase 3 :** on peut obtenir une **connexion réelle + catalogue recherches + détail + PDF**, suffisant pour une première intégration locale. Ce n’est pas encore le parcours chercheur complet.

---

## 4. Impossible pour l’instant (manque côté back)

Sans nouveaux endpoints / modèle, **aucune adaptation front ne suffit**.

| Fonctionnalité produit | Page / façade front | Manque back |
|------------------------|---------------------|-------------|
| Inscription chercheur | `/inscription` → `POST /api/register` | Endpoint JSON absent (Blade seulement) |
| Annuaire / fiche chercheurs (D3) | `/chercheurs/:id`, onglet recherche | Pas d’API chercheurs ni profil riche |
| Veille / follow (D5) | `followResearcher` | Pas d’endpoint ni table follows |
| Dashboard compte | `/compte` → `getDashboard` | Pas de `/api/me/dashboard` |
| Mes publications | `/compte` → `getMyPublications` | Pas de `/api/me/publications` |
| Validation vulgarisation (D6) | `/compte/publications/:id/review` | Pas de review/validate API |
| Filtre publications publiées (D4) | Règle publique | Pas de `status` sur `recherches` |
| Recherche filtrée (D8) | `SearchPage` filtres | Pas de query params côté API |
| Génération IA côté front | — | Job admin Blade seulement ; `GenerateVulgarisationJob` encore incomplet (constructeur vide) |

**Verdict :** le **parcours chercheur connecté** (compte, validation, veille, profils) reste **mock-only** jusqu’à livraison back.

---

## 5. Cartographie page par page

| Route front | Aujourd’hui (`mock`) | Avec adaptateur REST | Bloqué sans back |
|-------------|----------------------|----------------------|------------------|
| `/` | ✅ | Contenu statique | — |
| `/recherche` | ✅ | Liste via `/api/recherches` (sans filtres riches) | Filtres avancés |
| `/publications/:id` | ✅ | Détail via `/api/recherches/:id` | Structure vulgarisation riche |
| `/categories`, `/categories/:slug` | ✅ | Liste filtrable côté front si domaines mappés | Filtre serveur |
| `/connexion` | ✅ démo | ✅ login réel (si session OK) | — |
| `/inscription` | ⚠️ refus démo | ❌ | `POST /api/register` |
| `/chercheurs/:id` | ✅ mock | ❌ | API researchers |
| `/compte` | ✅ mock | ❌ | dashboard + mes pubs |
| `/compte/publications/:id/review` | ✅ mock | ❌ | review / validate |
| Admin Blade `/moncompte` | — | Hors front React | Coexistence à trancher |

---

## 6. Ce qu’il te reste à faire (front) — feuille de route

### Court terme — phase intégration minimale

Objectif : front en `rest` qui **se connecte** et **affiche les recherches** du back.

| # | Tâche | Statut |
|---|-------|--------|
| F1 | `X-XSRF-TOKEN` dans `http.ts` | ✅ |
| F2 | Mapper auth `{ user }` → `SessionUser` | ✅ (smoke session = P0 back) |
| F3 | Adaptateur `recherches` → DTO | ✅ |
| F4 | `.env.development` (`rest` + URL back) | ✅ |
| F5 | Test login + liste + détail en local | ⏳ à faire avec back up |

### Moyen terme — après livraisons back

| # | Tâche | Bloqué par back |
|---|-------|-----------------|
| F6 | Brancher inscription | `POST /api/register` |
| F7 | Brancher `/compte` | dashboard + mes publications |
| F8 | Brancher review / validate | endpoints D6 |
| F9 | Brancher chercheurs + follow | API researchers |
| F10 | Appliquer filtres recherche | query params API |

### Décisions produit à garder ouvertes

1. Le React `/compte` **remplace** ou **coexiste** avec Blade `/moncompte` ?
2. Faut-il un champ `status` sur `recherches` (D4) ?
3. La vulgarisation reste un `resume` libre, ou le back structure `lead` / `paragraphs` ?

---

## 7. Synthèse en une phrase

| Niveau | Situation |
|--------|-----------|
| **Aujourd’hui** | Front complet en **démo mock** ; back a une **API auth + recherches** utilisable en principe |
| **Après adaptation front** | Connexion réelle + catalogue + détail + PDF — **parcours public enrichi** |
| **Pas encore** | Compte chercheur, validation, profils, veille, inscription JSON, filtres, statut de publication |

---

## 8. Documents liés

| Document | Rôle |
|----------|------|
| `docs/api-contract-v1.md` | Contrat d’alignement (à mettre à jour pour refléter `/api/recherches` réel) |
| `docs/backend-blocking-issues-v1.md` | Points bloquants envoyés au back (partie partiellement corrigée) |
| `docs/frontend-architecture.md` | Architecture facades `mock` / `hal` / `rest` |
| `backend/API_README.md` | Doc API telle que livrée par le back |

---

*Document de pilotage front — à mettre à jour à chaque livraison back significative.*
