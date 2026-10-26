# Contrôles qualité

Deux familles de contrôles protègent la remise. La première est automatique : une pipeline CI/CD qui tourne à chaque commit et à chaque merge sur `main`. La seconde est installée comme skill d’équipe : c’est une revue de sécurité avant mise en production, pas une batterie de tests automatique.

Le détail technique des tests, en anglais et à l’usage des développeurs, est dans [docs/TESTING.md](../TESTING.md). Ce chapitre en donne l’objectif pour un évaluateur.

## Pipeline CI/CD

Jusqu’ici, les contrôles étaient lancés à la main ou par l’assistant IA, avec `npm run gate`. Un oubli, ou un LLM qui affirme « c’est vert », suffisait à laisser passer une régression. Ces mêmes contrôles tournent maintenant sur des machines, à chaque étape, et donnent le même résultat si on les relance à l’identique.

| Moment | Outil | Ce qui est bloqué |
|--------|-------|-------------------|
| `git commit` | Hook pre-commit (lefthook), installé par `npm install` à la racine | Le commit, tant qu’un contrôle lié aux fichiers modifiés est rouge |
| `git push` | Hook pre-push | Le push, si une dépendance a une faille connue |
| Push et pull request | GitHub Actions (`.github/workflows/ci.yml`) | Le merge : tout est rejoué sur une machine propre, plus les images Docker de prod |
| Merge sur `main` | Protection de branche GitHub | Tout commit sur `main` (la prod) qui ne vient pas d’une pull request à CI verte, administrateurs compris |

Un hook local peut toujours être contourné (`--no-verify`). C’est pour cela que la CI et la protection de `main` existent : elles ne se contournent pas.

Règle : un contrôle rouge se corrige dans le code, les dépendances ou l’environnement de test. On n’assouplit ni le test, ni la règle, ni le seuil. Les seules exceptions sont ciblées, écrites dans le dépôt et justifiées (un faux positif gitleaks, documenté dans `docs/TESTING.md`).

## Ce que chaque contrôle garantit

| Contrôle | Objectif | Ce qu’il ne garantit pas |
|----------|----------|--------------------------|
| Format (Prettier) | Le code front a une seule mise en forme, les diffs ne montrent que les vrais changements | La qualité du code |
| Types et lint | Le front TypeScript se compile et respecte les règles de code, sans aucun avertissement toléré | Le parcours visiteur |
| Secrets | Aucun fichier `.env`, aucune clé, aucun token dans un fichier versionné, ni dans l’historique Git. GitHub refuse aussi le push d’un secret connu | Un secret dans un format que personne ne reconnaît |
| Auto-test des secrets | Le scanner détecte toujours un token, une clé privée et un `.env` générés pour l’occasion | — |
| Dépendances | Aucune faille connue, quelle que soit sa gravité, dans les paquets npm et Composer ; aucun paquet abandonné | Une faille pas encore publiée |
| Couleurs | Les pages utilisent les couleurs du projet, pas une couleur en dur | La qualité graphique |
| Domaines | Chaque domaine a son texte, sa pastille et son héro | Que la base contient les publications de ce domaine |
| Tests unitaires | Le filtre de catégories, le suivi « vulgarisation déjà ouverte » et le chargement des données API se comportent comme prévu | Les écrans React |
| Build | Le site de production se construit | Qu’il répond une fois déployé |
| PHPUnit | Les tests Laravel passent, vues Blade comprises, dans un environnement construit comme la prod | Le site React |
| Images Docker | Aucun conteneur en root, un healthcheck présent, aucune faille corrigeable dans les paquets système | Les failles sans correctif publié (listées dans le journal CI) |
| Stack de prod | Les images de prod démarrent, le site, `/up` et l’API répondent à travers le front, la recherche et la connexion fonctionnent | Tous les cas d’erreur |
| Configuration de la CI | Le fichier de pipeline lui-même est valide | — |

Une pipeline verte signifie : le socle est cohérent, livrable, et sans faille connue au moment du contrôle. Il ne signifie pas que chaque écran a été rejoué à la main, ni qu’un audit de sécurité a eu lieu. Les parcours automatisés dans un navigateur (Playwright) sont prévus dans `docs/TESTING.md` et ne sont pas encore installés.

Les failles sont publiées tous les jours. La CI tourne donc aussi chaque nuit, et Dependabot ouvre chaque semaine des pull requests de mise à jour, elles-mêmes validées par la CI.

## Revue de sécurité installée

Le protocole `revue-securite-preprod` 2.1.0 est installé localement dans `.cursor/skills/revue-securite-preprod/`. Il n’est pas versionné : son corpus de test et ses archives restent hors dépôt. Le texte du protocole n’a pas été modifié.

Son auto-test (`python .cursor/skills/revue-securite-preprod/tests/test_recon.py`) a passé : 12 tests. Il vérifie que la reconnaissance repère les pistes attendues, ignore le code sain, masque les secrets et refuse d’écrire son résultat dans le dépôt audité.

Son objectif est autre que celui de la pipeline. La pipeline vérifie que le projet se construit et que quelques contrats tiennent. La revue lit le code et la configuration avant une mise en production, et rend un verdict : **GO**, **GO sous conditions**, **NO-GO**, ou **avis impossible** si les preuves manquent.

Ce n’est ni un exercice d’attaque, ni un test d’intrusion. C’est une revue en boîte blanche : accès aux sources, charte d’engagement signée avant de commencer, preuves localisées (fichier et ligne), secrets masqués dans le rapport.

Elle couvre notamment l’autorisation sur les données, l’authentification, les injections, les secrets, les dépendances, Docker, et les écarts de configuration. Le rapport classe chaque constat et dit quoi corriger avant d’ouvrir le service.

La revue n’a pas été jouée sur ce dépôt. Le protocole l’interdit tant que le responsable n’a pas recopié, mot pour mot, la phrase de `templates/charte-engagement.md`, avec l’identifiant de charte et le hash complet du commit. La remise actuelle reste donc couverte par la pipeline CI/CD, pas par un verdict de sécurité.
