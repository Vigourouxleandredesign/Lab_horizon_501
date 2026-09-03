# Lab Horizon — Points bloquants back (V2)

> **Pour qui :** dev back (niveau junior OK) — repo `labhorizon`  
> **Dernier test live :** 12 août 2026 — front Vite `http://localhost:5173` + Laravel `http://127.0.0.1:8000`  
> **Commit back testé :** `1baee8c` (`main`)  
> **Important :** le front s’adapte déjà aux noms JSON du back (`/api/recherches`, snake_case, pagination Laravel). Ce document ne parle **que** de ce qui casse ou manque **côté Laravel**.

---

## 1. En deux minutes — ce qui marche / ce qui ne marche pas

### Ça marche (testé en live)

| Quoi | Preuve | Pourquoi c’est OK |
|------|--------|-------------------|
| Serveur Laravel | `GET /up` → **200** | L’app démarre |
| Liste publique des recherches | `GET /api/recherches` → **200** | Route + contrôleur API OK |
| Détail d’une recherche | `GET /api/recherches/1` → **200** (domaines, auteurs, vulgarisations) | Relations Eloquent chargées correctement |
| Cookie CSRF | `GET /sanctum/csrf-cookie` → **204** + cookie `XSRF-TOKEN` | Première étape du login SPA OK |
| CORS pour le front Vite | `OPTIONS` depuis `http://localhost:5173` → `Access-Control-Allow-Origin` + `credentials=true` | Le navigateur a le droit d’appeler l’API depuis le front |

**En clair :** le **catalogue public** (liste + détail) est utilisable par le front React dès maintenant.

### Ça ne marche pas (testé ou vérifié dans le code)

| Quoi | Résultat | Pourquoi (explication simple) |
|------|----------|-------------------------------|
| **Login JSON** `POST /api/login` | **500** — `Session store not set on request` | Les routes `/api/*` n’ont **pas** le middleware de **session**. Or `AuthApiController` appelle `$request->session()->regenerate()`. Sans session démarrée → crash. |
| **Qui suis-je ?** `GET /api/me` | **401** | Normal : sans login réussi, pas de cookie de session valide. |
| **Logout** `POST /api/logout` | Non testable tant que login casse | Même cause : auth sessionnelle. |
| **Inscription JSON** | **404** | Seule la page Blade `/register` existe. Pas de `POST /api/register`. |
| **Chercheurs / dashboard / review** | **404** | Ces URLs n’existent pas dans `routes/api.php`. |
| **Job vulgarisation IA** | Cassé dans le code | Voir § P1 ci-dessous. |

**En clair :** le front peut **lire** les recherches, mais **pas se connecter**. Tant que le login API renvoie 500, le parcours chercheur React (compte, session) reste bloqué.

```
Workflow attendu (API_README)          État réel au test
─────────────────────────────          ─────────────────
1. GET  /sanctum/csrf-cookie    →      OK (204 + cookie)
2. POST /api/login              →      KO (500 Session store not set)
3. GET  /api/me                 →      KO (401 — pas de session)
4. POST /api/logout             →      non testable
```

---

## 2. À corriger en priorité (ordre = importance)

### P0 — Activer la session sur les routes `/api` (bloquant auth)

**Fichiers concernés :**
- `bootstrap/app.php` (aujourd’hui `withMiddleware` est **vide**)
- éventuellement config Sanctum / `.env` (`SANCTUM_STATEFUL_DOMAINS`)

**Le problème, en langage simple :**

Imagine deux “portails” Laravel :

1. **`web`** (pages Blade `/login`, `/moncompte`) → a déjà une **session** (comme un panier de site classique).
2. **`api`** (JSON `/api/...`) → par défaut **sans session** (pensé pour des tokens).

Ton `AuthApiController::login()` utilise quand même la **session** (`$request->session()->regenerate()`).  
Résultat : Laravel répond *« je n’ai pas de magasin de session sur cette requête »* → **500**.

Ce n’est **pas** un bug du front. Le front envoie bien cookies + `X-XSRF-TOKEN`.

**Ce qu’il faut faire (checklist) :**

1. Sur Laravel 12, brancher le middleware **stateful** Sanctum (ou équivalent session) sur le groupe `api`, pour que les origines front (`localhost`, `127.0.0.1`, port Vite) démarrent une session.
2. Documenter dans `.env.example` :
   - `SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1`
   - éventuellement `SESSION_DOMAIN` si besoin
3. **Test de validation** (à refaire après fix) :
   ```text
   GET  /sanctum/csrf-cookie
   POST /api/login   { "email": "...", "password": "..." }
   → doit renvoyer 200 + { "user": { ... } }  (plus de 500)
   GET  /api/me
   → doit renvoyer 200 avec le même user (plus de 401)
   ```
   Idéalement depuis le navigateur sur `http://localhost:5173` (pas seulement Postman sans cookies).

**Quand c’est OK :** le front pourra enfin brancher `/connexion` en mode `rest`.

---

### P1 — Réparer `GenerateVulgarisationJob` (admin IA)

**Fichier :** `app/Jobs/GenerateVulgarisationJob.php`

**Le problème, en langage simple :**

Le contrôleur envoie le job comme ça :

```php
GenerateVulgarisationJob::dispatch($recherche, $niveau, $langue);
```

Mais le constructeur du job est **vide** — il n’enregistre pas ces 3 valeurs.  
Ensuite `handle()` lit `$this->recherche`, `$this->niveau`, `$this->langue` → propriétés inexistantes → plantage quand `php artisan queue:work` traite le job.

Il manque aussi l’import de `LlmService` en tête de fichier.

**Ce qu’il faut faire :**

1. Constructeur du type :
   ```php
   public function __construct(
       public Recherche $recherche,
       public string $niveau,
       public string $langue,
   ) {}
   ```
   (avec `SerializesModels` / traits queue Laravel habituels)
2. `use App\Services\LlmService;`
3. Tester : lancer une génération depuis `/moncompte/.../vulgariser` + `php artisan queue:work` → une ligne apparaît dans `vulgarisations`.

**Impact front :** aucun pour l’instant (l’IA reste admin Blade). Mais le README promet déjà l’async — il faut que ça marche.

---

### P2 — Endpoints encore absents (roadmap, pas un crash)

Ces routes **ne sont pas dans** `routes/api.php`. Le front les appelle en vain → **404**. Ce n’est pas urgent pour le catalogue public, mais nécessaire pour le parcours chercheur complet.

| Besoin | URL attendue | Pourquoi le front en a besoin |
|--------|--------------|-------------------------------|
| Inscription | `POST /api/register` | Page `/inscription` React |
| Dashboard | `GET /api/me/dashboard` | Page `/compte` |
| Mes publications | `GET /api/me/publications` | Liste dans `/compte` |
| Validation vulgarisation | `GET/POST …/review` + `…/validate` | Flux “valider la vulgarisation” |
| Chercheurs | `GET /api/researchers`, `GET /api/researchers/:id` | Fiches chercheurs (connectés seulement) |
| Follow / veille | `POST /api/researchers/:id/follow` | Bouton suivre |
| Filtres recherche | `q`, `category`, `year`, `sort` sur `GET /api/recherches` | Aujourd’hui seul `page` marche |
| Statut publication | champ genre `PUBLISHED` / `DRAFT` | Pour ne pas exposer les brouillons au public |

**À livrer au fil de l’eau** selon priorité produit. Sans ça, le front garde du **mock** sur compte / chercheurs.

---

### P3 — Sécurité (plus tard, avant mise en ligne)

- Ajouter un **throttle** (limite de tentatives) sur `POST /api/login` — le login Blade Breeze en a déjà un ; l’API JSON, non.
- Upload PDF : `mimetypes:application/pdf` est déjà là — suffisant en local pour V1.

---

### P4 — Doc à nettoyer (non bloquant)

- `API_README.md` parle encore d’une branche `fullstack` qui n’existe pas sur GitHub.
- Niveaux `lyceen` / `collegien` dans le README vs `grand_public` / `chercheurs` dans le code — aligner (lycée/collège hors produit).

---

## 3. Déjà réglé (ne pas retravailler)

| Sujet | Statut |
|-------|--------|
| Bug SQL colonnes `auteur` / `domaine` sur admin recherches | ✅ Corrigé |
| Double upload PDF | ✅ Corrigé |
| `routes/api.php` + contrôleurs API | ✅ Présents |
| `config/cors.php` | ✅ OK (confirmé au test) |
| Routes `/api/login`, `/logout`, `/me` **déclarées** | ✅ Présentes — mais login **non fonctionnel** tant que P0 n’est pas fait |
| Naming / pagination / IDs | ➡️ Le **front** mappe déjà — pas ton problème |

---

## 4. Mini glossaire (si tu débutes Laravel)

| Mot | Sens ici |
|-----|----------|
| **Blade** | Pages HTML générées par Laravel (`/login`, `/moncompte`) — le front React **ne les utilise pas** |
| **API JSON** | Routes `/api/...` qui renvoient du JSON — c’est ce que React consomme |
| **Session / cookie** | Façon dont Laravel se souvient que l’utilisateur est connecté (sans JWT) |
| **CSRF / XSRF-TOKEN** | Jeton anti-falsification de formulaire ; le front le renvoie en header sur les POST |
| **CORS** | Règles qui autorisent le navigateur à appeler `8000` depuis la page `5173` |
| **Sanctum stateful** | Mode Sanctum qui active la session sur l’API pour une SPA (React) |

---

## 5. Prochaine étape (ordre recommandé)

1. **P0** — faire marcher `POST /api/login` + `GET /api/me` (plus de 500 / 401 après login)  
2. **P1** — réparer le job de vulgarisation  
3. **P2** — ajouter les endpoints manquants selon la roadmap  

Doc côté front (état branchement) : `docs/front-back-status-v1.md`.

---

*Mis à jour après test live du 12 août 2026 — résultats §1 = source de vérité pour “ça marche / ça marche pas”.*
