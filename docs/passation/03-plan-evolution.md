# Plan d’évolution

Ce document sépare trois choses que les autres docs mélangent : le code remis, le lot V2, le lot V3.

La feuille de route produit est [docs/ux/07-pages-roles-roadmap.md](../ux/07-pages-roles-roadmap.md) (juillet 2026). Le cadrage d’avril est [docs/cahier_des_charges_v2.md](../cahier_des_charges_v2.md). En cas d’écart, **l’état du dépôt** décrit ici prime pour savoir ce qui tourne.

## Livré dans ce dépôt

| Élément | Où | Limite |
|---------|----|--------|
| Catalogue public (accueil, recherche, fiche, domaines, annuaire) | `frontend/src/pages/`, routes dans `app/routes.tsx` | — |
| 11 domaines affichés, dont Mathématiques, Physique, Chimie | `frontend/src/data/categories.ts`, `i18n/domains.ts`, `public/pillules/`, `public/hero/` | Physique n’a pas de ligne en base |
| Espace chercheur `/compte` (nouveautés, recherche, publications, profil, relecture) | `frontend/src/pages/backoffice/` | — |
| Auth Sanctum (inscription, connexion, session) | `backend/routes/api.php`, `frontend/src/auth/` | Compte démo `test@labhorizon.nc` / `password` |
| Seed Docker (catalogue de démo, domaines, mots-clés) | `LocalContentSeeder`, `DomainesSeeder`, `MotsClesSeeder` | `DomainesSeeder` n’insère que `0.chim` et `0.math` |
| Vulgarisation par modèle local | `LlmService`, jobs Laravel, profil Compose `llm` | Inactive par défaut : `LLM_ENABLED=false` |

Physique est prête côté front (slug `physique`, libellé API `Physique`). Elle restera vide dans le catalogue tant que le back n’ajoute pas `0.phys` dans `backend/database/seeders/DomainesSeeder.php`.

## Écart avec le cahier des charges

Le CDC v2 §3.3 plaçait en V1 l’assistant conversationnel (RAG), la PWA et une partie de l’admin de contenu. La feuille de route de juillet a reporté le RAG en V2, faute d’hébergement dédié. **Cette remise ne contient ni le chat RAG, ni la PWA** (pas de manifest, pas de service worker).

## V2

À faire après cette remise, dans l’ordre utile pour un repreneur :

| Sujet | Intention |
|-------|-----------|
| Chatbot RAG | Réponses ancrées dans le corpus, avec citations. Dépend d’un serveur dédié. |
| Admin de contenu | Changer le statut d’une publication, gérer les catégories, journaliser les actions. Aujourd’hui l’admin Laravel est un outil d’exploitation, pas une UI de maintenance pour non-devs. |
| Rôle Pro et messagerie | Hors de cette remise. Les entités du dictionnaire de données restent une référence, pas une obligation. |
| Inscription | Mécanisme de validation (e-mail ou admin) si on le retire du libre accès actuel. |

## V3

| Sujet | Intention |
|-------|-----------|
| Annonces de recherche | Espace pro. |
| Modération | File d’attente admin, au-delà du simple changement de statut. |
| HAL étendu | Plusieurs catégories et plusieurs auteurs par publication. |
