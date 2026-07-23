
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
=======
<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

