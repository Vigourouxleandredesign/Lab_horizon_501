# Cursor — configuration projet

## Versionné dans Git (recommandé)

- **`rules/*.mdc`** — charte d'équipe (qualité, sécurité, text reveal héros, etc.).
  Tous les contributeurs Cursor bénéficient des mêmes conventions.

## Ignoré par Git (local)

- **`skills/revue-securite-preprod/`** — protocole de revue avant mise en production (v2.1), installé sur la machine. Son corpus de test et ses archives ne sont pas versionnés. Une revue ne démarre qu’avec la charte signée.
- **`mcp.json`** — serveurs MCP propres à la machine (URLs localhost, tokens éventuels).
  Chaque développeur configure le sien localement.
