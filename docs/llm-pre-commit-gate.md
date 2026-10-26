# Gate anti-régression LLM — alias

> **Source of truth:** [`TESTING.md`](./TESTING.md)

Ce fichier est conservé pour les liens historiques. Toute la matrice A–F, les commandes (`npm run gate`, `npm run gate:full`) et les obligations agent sont dans **TESTING.md**.

## Ce qui a changé

La gate lancée par le LLM (ou à la main) est devenue une pipeline CI/CD : hook pre-commit et pre-push (`lefthook.yml`), GitHub Actions (`.github/workflows/ci.yml`), merge sur `main` conditionné à une CI verte. Les contrôles tournent sur des machines et ne dépendent plus de la bonne volonté de l’agent.

| Situation | Ce qui se passe |
|-----------|-----------------|
| `git commit` | Hook pre-commit, automatique (après `npm install` à la racine) |
| `git push` | Audit des dépendances, automatique |
| Pull request | CI complète, obligatoire pour merger sur `main` |
| Vérifier à la main | `npm run gate` / `npm run gate:full` / `npm run gate:security` |

Les anciens scripts `gate:llm*` restent des alias de compatibilité vers `gate` / `gate:full`.
