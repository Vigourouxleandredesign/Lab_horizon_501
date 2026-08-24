# Lab Horizon — carte du projet (stack & PDF)

Vue d’ensemble du monorepo SAE 501 : **ce qui tourne aujourd’hui**, **ce qui est vraiment nécessaire (KISS)**, et **ce qui est reporté**.

> Document de compréhension équipe — à jour au **15/08/2026**.  
> Complète (sans remplacer) : `docs/frontend-architecture.md`, `docs/front-back-status-v1.md`, `backend/API_README.md`.

---

## 1. Stack — actuelle vs prévue

### 1.1 En place aujourd’hui et nécessaire (KISS)

Le cœur du produit V1 : **catalogue lisible + fiche vulgarisée + PDF source**, servi par une API.

| Couche | Stack actuelle | Pourquoi c’est nécessaire |
|--------|----------------|---------------------------|
| Frontend | React 19 · Vite 8 · TypeScript · React Router 7 · CSS modules | SPA publique (recherche, domaines, détail publication) |
| Backend API | Laravel 12 · PHP 8.2 | Persistance + `GET /api/recherches` (+ détail) |
| Base | SQLite en local (dev) | Suffisant pour tester ; pas besoin de MySQL pour avancer |
| Fichiers | PDF sous `backend/public/files/` | Lien « document source » |
| Contenu lisible | Champs `titre` / `abstract` / `vulgarisations.resume` | Page détail sans forcer le téléchargement PDF |
| Config front | `VITE_DATA_SOURCE=rest` + `VITE_API_BASE_URL` | Brancher le front sur le back |

**Minimum pour une démo convaincante :** front `rest` + back `php artisan serve` + quelques recherches avec accroche (+ PDF optionnel).

### 1.2 En place, utile, mais pas le cœur produit

Présent dans le repo ; utile pour démo / intégration / polish — **pas bloquant** pour valider le concept « lecture vulgarisée ».

| Élément | Stack / lieu | Statut KISS |
|---------|--------------|-------------|
| Motion héros | GSAP · SplitType | Polish UI — norme héros, pas lié aux PDF |
| Mode `mock` | `frontend/src/api/mock/` | Dev front sans back |
| Mode `hal` | API archives-ouvertes.fr | Bonus recherche externe |
| Auth session | Sanctum / Breeze · `/api/login` · `/api/me` | Espace chercheur ; **souvent cassée (P0)** — le catalogue public s’en passe |
| Admin Blade | `/moncompte`, CRUD Blade | Outil back — le React n’en dépend pas |
| Import HAL | `HalImportService` | Option d’alimentation |
| Netlify | preview front | Démo temporaire, pas la prod IUT |
| Scripts PDF | `scripts/*.py` / `*.php` · PyMuPDF | **Outil de test local** — pas un service runtime |
| Contournement covers | `mapRecherche.ts` parse `description` | Palliatif tant qu’il n’y a pas de champ API `covers` |

### 1.3 Prévu / présent mais pas nécessaire maintenant

À ne **pas** traiter comme requis pour la V1 catalogue.

| Élément | Où on le trouve | Quand |
|---------|-----------------|-------|
| MySQL prod | `.env.example` back | Déploiement serveur IUT |
| Champ API `pdf_url` / `covers[]` | Manque back | Souhaitable ; front contourne déjà |
| LLM vulgarisation auto | `LlmService` · `GenerateVulgarisationJob` | Plus tard — job encore fragile |
| `smalot/pdfparser` | dépendance Composer | Prévu côté back ; **extract actuel = scripts Python** |
| Assistant RAG | CDC / roadmap UX | **V2** (infra) |
| PWA | roadmap | **V2** (pas le cœur catalogue) |
| Espace chercheur complet (API) | endpoints dashboard / review absents | Bloqué back + auth |
| Rôle Pro, admin UI riche | roadmap UX | **V2+** |

### 1.4 Lecture KISS (à retenir)

```
Nécessaire maintenant
  React (catalogue + fiche) + Laravel (recherches + fichiers PDF)
  + texte d’accroche en base (manuel ou script de test)

Pas nécessaire pour valider le produit
  RAG · PWA · extract PDF temps réel · MySQL · covers « propres » en API
  · auth chercheur (tant qu’on démo le public)
```

---

## 2. Architecture runtime

```
Visiteur (localhost:5173)
  └─ React Router · pages · PublicationCard / PublicationPage
       └─ Couche frontend/src/api/ (facades)
            ├─ mock  → données locales          (dev sans back)
            ├─ hal   → API archives-ouvertes.fr (option)
            └─ rest  → Laravel (127.0.0.1:8000)  ← cible intégration
                         ├─ GET /api/recherches
                         ├─ GET /api/recherches/:id
                         ├─ auth session (P0 : souvent cassée)
                         └─ fichiers /files/recherches/…

Hors requête HTTP (tests locaux seulement)
  Ressources/*.pdf
    → scripts PHP/Python
    → SQLite + covers JPG dans public/files/
```

| De | Vers | Mécanisme |
|----|------|-----------|
| Visiteur `:5173` | Facades `api/*` | `VITE_DATA_SOURCE` |
| Mode `rest` | Laravel `:8000/api` | cookies + CSRF |
| `GET /api/recherches` | `mapRecherche.ts` | DTO `Publication*` |
| PDF / covers | `/files/...` | fichiers sous `backend/public/` |

---

## 3. Arborescence du dépôt

### Racine monorepo

| Dossier | Rôle | KISS |
|---------|------|------|
| `frontend/` | App React (UI) | Nécessaire |
| `backend/` | API Laravel | Nécessaire |
| `docs/` | CDC, UX, contrats | Référence |
| `Ressources/` | PDF fournis (ne pas publier tels quels) | Données de test |
| `scripts/` | Import + extract PDF locaux | Outil de test, pas runtime |
| `.cursor/` | Règles Cursor | Outil équipe |

### Frontend — `frontend/src/`

| Chemin | Rôle |
|--------|------|
| `api/` | Facades `mock` \| `hal` \| `rest` + DTO `types.ts` |
| `api/rest/` | Client Laravel + `mapRecherche` (PDF / covers) |
| `pages/` | Pages (Home, Search, Publication…) |
| `components/` | Cartes, états de requête, UI partagée |
| `hooks/` | `useApiQuery`, `useTextReveal`, locale… |
| `lib/` | config env, GSAP defaults, heroGlass |
| `i18n/` | Copies FR / EN |
| `data/` | Domaines UNC (slugs) |

### Backend — points clés

| Chemin | Rôle | Nécessaire catalogue ? |
|--------|------|------------------------|
| `app/Http/Controllers/API/RechercheApiController.php` | Liste / détail JSON | Oui |
| `app/Models/Recherche.php` (+ vulgarisations) | Données fiche | Oui |
| `public/files/` | PDF (+ covers test) | Oui (PDF) |
| `routes/api.php` | Endpoints `/api/*` | Oui |
| `API_README.md` | Démarrage back | Doc |
| `app/Http/Controllers/API/AuthApiController.php` | Login / me | Chercheur seulement |
| `app/Http/Controllers/Admin/` | Blade CRUD | Non (React) |
| `app/Services/LlmService.php` · `Jobs/` | LLM async | Plus tard |

---

## 4. Pipeline PDF (outil de test — pas le runtime)

**Pas un module applicatif de production.**  
Sert à remplir la base pour démo : titre, accroche, 1–2 images, PDF téléchargeable.

Le front **n’extrait pas** les PDF : il affiche ce que la base / les fichiers exposent (`mapRecherche.ts`).

### Étapes (local)

| Étape | Ce qui se passe | Obligatoire ? |
|-------|-----------------|---------------|
| 1. Sources | `Ressources/**/*.pdf` | Si tu veux ces docs de test |
| 2. Import | `import-ressources-pdfs.php` → fichiers + rows | Oui pour avoir les PDF en base |
| 3. Extract | `extract-pdf-teasers.py` → titre, accroche, JPG | Non si tu saisis l’accroche à la main |
| 4. Apply DB | `apply-pdf-extract.php` | Lié à l’étape 3 |
| 5. Front map | `pdf_path` → URL, `description` → covers | Oui pour afficher lien / images |
| 6. UI | `PublicationPage` / `PublicationCard` | Oui |

**KISS contenu :** une accroche en `abstract` / vulgarisation suffit à rendre la fiche vendeuse. Les covers sont un plus.

### Fichiers PDF à connaître

| Fichier / dossier | Rôle |
|-------------------|------|
| `scripts/import-ressources-pdfs.php` | Copie PDF + crée recherches |
| `scripts/extract-pdf-teasers.py` | Extract titre / accroche / images |
| `scripts/apply-pdf-extract.php` | Applique le JSON en base |
| `scripts/pdf-extract-test-data.json` | Manifest extract |
| `backend/public/files/recherches/` | PDF |
| `backend/public/files/recherches/covers/` | JPG test |
| `frontend/src/api/rest/mapRecherche.ts` | URL PDF + covers côté front |
| `frontend/src/pages/PublicationPage.tsx` | Affichage |

### Commandes locales

```bash
cd frontend && npm run dev
cd backend && php artisan serve
php scripts/import-ressources-pdfs.php
python scripts/extract-pdf-teasers.py
```

Exemple fichier : `http://127.0.0.1:8000/files/recherches/<fichier>.pdf`

---

## 5. Produit — maintenant vs plus tard

| Périmètre | Maintenant | Plus tard |
|-----------|------------|-----------|
| **Visiteur** | Accueil, domaines, recherche, fiche + accroche + PDF | — |
| **Chercheur** | UI mock / partiel ; auth API souvent HS | Auth stable + dashboard / review API |
| **PDF** | Fichier servi + extract offline pour tests | Champ `covers` / `pdf_url` propres |
| **RAG / PWA / LLM auto** | Hors chemin critique | V2 |

---

## 6. Docs liées

| Document | Sujet |
|----------|--------|
| `docs/frontend-architecture.md` | Couche API front, modes data |
| `docs/api-contract-v1.md` | Contrat front ↔ back |
| `docs/front-back-status-v1.md` | Ce qui marche / est bloqué |
| `docs/backend-blocking-issues-v1.md` | Points bloquants back |
| `docs/ux/` | Parcours, pages, roadmap |
| `backend/API_README.md` | Démarrage Laravel + endpoints |
