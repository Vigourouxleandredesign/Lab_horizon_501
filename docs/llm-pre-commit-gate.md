# Gate anti-régression LLM — alias

> **Source of truth:** [`TESTING.md`](./TESTING.md)

Ce fichier est conservé pour les liens historiques. Toute la matrice A–F, les commandes (`npm run gate`, `npm run gate:full`) et les obligations agent sont dans **TESTING.md**.

## Rappel rapide

| Situation | Commande |
|-----------|----------|
| Après chaque modification (humain / LLM) | `npm run gate` |
| Avant PR / merge `main` (Docker + PHP) | `npm run gate:full` |
| Machine UI sans API | `$env:GATE_SKIP_API = "1"` puis `npm run gate` *(C2 skip documenté)* |

Les anciens scripts `gate:llm*` restent des alias de compatibilité vers `gate` / `gate:full`.
