# LabHorizon — Documentation API Backend

> **Stack backend :** Laravel 12 · MySQL · PHP 8.2
> **URL locale :** `http://127.0.0.1:8000`
> **Branche :** `fullstack` (dossier `/backend`)
> **Dernière mise à jour :** 2026-08-03

---

## Démarrage rapide

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Configurer la BDD dans .env (MySQL)
php artisan migrate

# Lancer le serveur
php artisan serve        # → http://127.0.0.1:8000

# Lancer le worker de jobs (génération LLM asynchrone)
php artisan queue:work   # dans un second terminal
```

---

## Authentification

L'auth utilise la **session cookie** Laravel Breeze — pas de token JWT/Sanctum.
Le frontend React n'utilise pas les pages Blade `/login` et `/register` — tout passe par l'API JSON.

### Configuration CORS

Déjà configuré dans `config/cors.php` pour `localhost:5173`.

```php
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => true,
```

Pour un autre port, modifier `allowed_origins` et les variables `.env` :

```env
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

### Headers requis pour toutes les requêtes POST/PUT/DELETE

```http
Content-Type: application/json
Accept: application/json
X-XSRF-TOKEN: {valeur du cookie XSRF-TOKEN}
```

### Workflow de connexion recommandé (SPA React)

```
1. GET  /sanctum/csrf-cookie   → initialise la session + cookie XSRF-TOKEN
2. POST /api/register          → créer un compte (retourne l'utilisateur)
   ou
   POST /api/login             → se connecter (retourne l'utilisateur)
3. GET  /api/me                → vérifier la session active
4. POST /api/logout            → se déconnecter
```

### Exemple complet en JavaScript

```javascript
// Utilitaire — lire un cookie
function getCookie(name) {
  return decodeURIComponent(
    document.cookie.split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1] ?? ''
  );
}

// 1. Initialiser la session (OBLIGATOIRE avant login/register)
await fetch('http://127.0.0.1:8000/sanctum/csrf-cookie', {
  credentials: 'include'
});

// 2a. Register
const register = await fetch('http://127.0.0.1:8000/api/register', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
  },
  body: JSON.stringify({
    name: 'Jean Dupont',
    email: 'jean@example.com',
    password: 'motdepasse',
    password_confirmation: 'motdepasse',
  })
});

// 2b. Login
const login = await fetch('http://127.0.0.1:8000/api/login', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
  },
  body: JSON.stringify({
    email: 'jean@example.com',
    password: 'motdepasse',
  })
});

// 3. Vérifier la session
const me = await fetch('http://127.0.0.1:8000/api/me', {
  credentials: 'include',
  headers: { 'Accept': 'application/json' }
});

// 4. Logout
await fetch('http://127.0.0.1:8000/api/logout', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
  }
});
```

> ⚠️ `credentials: 'include'` est **indispensable** sur chaque requête pour que le cookie de session soit envoyé.

---

## Endpoints Auth (`/api`)

### `POST /api/register`
Créer un compte chercheur.

**Body (JSON) :**
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "motdepasse",
  "password_confirmation": "motdepasse"
}
```

**Réponse 201 :**
```json
{
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "orcid": null,
    "orcid_verified": false,
    "created_at": "2026-08-03T10:00:00Z"
  }
}
```

**Réponse 422 :** si email déjà utilisé ou mot de passe trop court.

---

### `POST /api/login`
Se connecter.

**Body (JSON) :**
```json
{
  "email": "jean@example.com",
  "password": "motdepasse"
}
```

**Réponse 200 :**
```json
{
  "user": {
    "id": 1,
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "orcid": "0000-0002-1825-0097",
    "orcid_verified": true
  }
}
```

**Réponse 401 :**
```json
{ "message": "Identifiants invalides." }
```

---

### `GET /api/me` 🔒
Retourne l'utilisateur connecté.

**Réponse 200 :**
```json
{
  "id": 1,
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "orcid": "0000-0002-1825-0097",
  "orcid_verified": true
}
```

**Réponse 401 :** si non connecté.

---

### `POST /api/logout` 🔒
Se déconnecter.

**Réponse 200 :**
```json
{ "message": "Déconnecté." }
```

---

## Endpoints Recherches (`/api/recherches`)

### `GET /api/recherches`
Liste publique de toutes les recherches. **Pas d'auth requise.**

**Paramètres query :**
| Paramètre | Type | Description |
|-----------|------|-------------|
| `page` | int | Numéro de page (défaut : 1, 15 résultats/page) |

**Réponse 200 :**
```json
{
  "data": [
    {
      "id": 1,
      "titre": "Titre de la recherche",
      "abstract": "Résumé...",
      "date_production": "2026-01-15",
      "source": "hal",
      "hal_id": "hal-12345678",
      "hal_url": "https://hal.science/hal-12345678v1",
      "pdf_path": "recherches/fichier.pdf",
      "pdf_url": "http://127.0.0.1:8000/files/recherches/fichier.pdf",
      "vulgarisations_count": 2,
      "domaines": [
        { "id": 1, "code": "0.info", "label": "Informatique" }
      ],
      "auteurs": [
        { "id": 1, "nom": "Jean Dupont" }
      ]
    }
  ],
  "links": { "...": "..." },
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 72
  }
}
```

---

### `GET /api/recherches/{id}`
Détail d'une recherche avec vulgarisations. **Pas d'auth requise.**

**Réponse 200 :**
```json
{
  "id": 1,
  "titre": "Titre de la recherche",
  "abstract": "Résumé complet...",
  "date_production": "2026-01-15",
  "source": "hal",
  "hal_id": "hal-12345678",
  "hal_url": "https://hal.science/hal-12345678v1",
  "pdf_path": "recherches/fichier.pdf",
  "pdf_url": "http://127.0.0.1:8000/files/recherches/fichier.pdf",
  "domaines": [
    { "id": 1, "code": "0.info", "label": "Informatique" }
  ],
  "auteurs": [
    { "id": 1, "nom": "Jean Dupont" }
  ],
  "structures": [
    { "id": 1, "nom": "CNRS" }
  ],
  "vulgarisations": [
    {
      "id": 1,
      "titre": "Vulgarisation grand public",
      "resume": "Explication simple...",
      "niveau_public": "grand_public",
      "langue": "fr",
      "pdf_path": null,
      "pdf_url": null,
      "created_at": "2026-08-01T10:00:00Z"
    }
  ]
}
```

**Réponse 404 :** si la recherche n'existe pas.

---

### `GET /api/recherches/{id}/vulgarisations`
Liste des vulgarisations d'une recherche. **Pas d'auth requise.**

**Réponse 200 :**
```json
[
  {
    "id": 1,
    "titre": "Vulgarisation grand public",
    "resume": "Explication simple...",
    "niveau_public": "grand_public",
    "langue": "fr",
    "pdf_path": null,
    "pdf_url": null,
    "created_at": "2026-08-01T10:00:00Z"
  }
]
```

---

### `POST /api/recherches` 🔒
Créer une recherche manuellement. **Auth requise.**

**Body (multipart/form-data) :**
| Champ | Type | Requis | Description |
|-------|------|--------|-------------|
| `titre` | string | ✅ | Titre de la recherche |
| `description` | string | ❌ | Description libre |
| `date_production` | date | ❌ | Format `YYYY-MM-DD` |
| `pdf` | file | ❌ | PDF max 20MB |

**Réponse 201 :**
```json
{
  "id": 5,
  "titre": "Ma recherche",
  "source": "manuel",
  "user_id": 1,
  "created_at": "2026-08-03T10:00:00Z"
}
```

**Réponse 422 :** si validation échoue.

---

### `PUT /api/recherches/{id}` 🔒
Modifier une recherche. **Auth requise + propriétaire uniquement.**

**Body (JSON) :**
```json
{
  "titre": "Nouveau titre",
  "description": "Nouvelle description"
}
```

**Réponse 200 :** objet recherche mis à jour.
**Réponse 403 :** si non propriétaire.

---

### `DELETE /api/recherches/{id}` 🔒
Supprimer une recherche. **Auth requise + propriétaire uniquement.**

**Réponse 200 :**
```json
{ "message": "Recherche supprimée." }
```

**Réponse 403 :** si non propriétaire.

---

## Fichiers PDF

Les PDFs sont servis publiquement via une route Laravel :

```
GET http://127.0.0.1:8000/files/recherches/{fichier}.pdf
GET http://127.0.0.1:8000/files/vulgarisations/{fichier}.pdf
```

> Le champ `pdf_url` est directement disponible dans les réponses JSON.

```javascript
// Pas besoin de reconstruire l'URL
if (recherche.pdf_url) {
  window.open(recherche.pdf_url);
}
```

---

## Domaines disponibles

Les domaines sont retournés directement dans les réponses JSON.

| Code | Label |
|------|-------|
| `0.info` | Informatique |
| `0.math` | Mathématiques |
| `0.phys` | Physique |
| `0.sdv` | Sciences du Vivant |
| `0.shs` | Sciences Humaines et Sociales |
| `0.spi` | Sciences de l'Ingénieur |
| `0.chim` | Chimie |
| `0.scco` | Sciences Cognitives |
| `0.sde` | Sciences de la Terre |
| `0.stat` | Statistiques |
| `...` | *(et sous-domaines HAL)* |

---

## Niveaux de vulgarisation

| Valeur | Description |
|--------|-------------|
| `grand_public` | Grand public |
| `lyceen` | Lycéen |
| `collegien` | Collégien |

## Langues de vulgarisation

| Valeur | Description |
|--------|-------------|
| `fr` | Français |
| `en` | Anglais |

---

## Rôles utilisateur

| Rôle | Description | Accès |
|------|-------------|-------|
| Visiteur | Non connecté | `GET /api/recherches`, `GET /api/recherches/{id}`, `GET /api/recherches/{id}/vulgarisations` |
| Chercheur | Connecté | Tout ce qui précède + création/modification/suppression de ses recherches |

---

## Codes d'erreur

| Code | Signification |
|------|--------------|
| `401` | Non authentifié — session absente ou expirée |
| `403` | Interdit — ressource appartenant à un autre utilisateur |
| `404` | Ressource introuvable |
| `422` | Erreur de validation |
| `500` | Erreur serveur interne |

**Format d'erreur 422 :**
```json
{
  "message": "The titre field is required.",
  "errors": {
    "titre": ["The titre field is required."]
  }
}
```

---

## Import HAL (back-office uniquement)

L'import HAL est géré côté back-office Blade (`/moncompte/hal/import`), pas via l'API.
Les recherches importées sont automatiquement disponibles via `GET /api/recherches`.

---

## Génération de vulgarisation IA (back-office uniquement)

La génération via LLM (LM Studio) est disponible depuis le back-office.
Elle fonctionne de manière **asynchrone** via un job Laravel.

```bash
# Lancer le worker pour traiter les jobs LLM
php artisan queue:work
```

---

## Variables d'environnement

```env
APP_URL=http://127.0.0.1:8000
APP_TIMEZONE=Pacific/Noumea

DB_CONNECTION=mysql
DB_DATABASE=labhorizon
DB_USERNAME=root
DB_PASSWORD=

SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173

MAIL_MAILER=log

LLM_ENABLED=false
LLM_URL=http://localhost:1234/v1
LLM_MODEL=local-model

QUEUE_CONNECTION=database
```
