# Démarche et équipe

Comment le projet a été pensé, pourquoi il est construit ainsi, et qui a fait quoi. À lire pour comprendre les choix avant de les modifier.

## Contexte

Lab Horizon est le site de valorisation de la recherche de l’Université de la Nouvelle-Calédonie, réalisé dans le cadre de la SAE 501 à l’IUT. Il rend les travaux des chercheurs du territoire accessibles au grand public, avec un catalogue de publications vulgarisées, et donne aux chercheurs un espace pour relire ces vulgarisations.

Le cahier des charges impose une interface bilingue (français, anglais) et vise l’accessibilité RGAA niveau AA. Le client est la direction de l’IUT, qui arbitre les choix fonctionnels. Un besoin a été posé dès le départ : pouvoir transmettre le projet à une équipe qui n’y a jamais travaillé. Ce dossier de passation y répond.

## Équipe

| Membre (identifiant GitHub) | Rôle | Parties réalisées |
|-----------------------------|------|-------------------|
| Léandre Vigouroux (`Vigourouxleandredesign`, commits `leandre`) | Cadrage UX, front-end, CI/CD, documentation | Arborescence, wireframes, personas et parcours ; site React (public et espace `/compte`) ; dockerisation et monorepo ; pipeline CI/CD, HTTPS, scripts de déploiement et de sauvegarde ; revues de sécurité ; dossier de passation |
| Lorenzo (`Lorenzo`) | Intégration du modèle IA de vulgarisation | Génération des vulgarisations (LM Studio, worker de file Redis), suivi de l’état de génération, tests du flux IA, configuration Docker du worker |
| `greya734` | Back-end : API et base de données | API Laravel, routes, modèles et seeders, écrans d’administration Blade, passage à Laravel 13 |

Répartition mesurée sur l’historique Git (commits hors fusions) : front et documentation majoritairement Léandre, back majoritairement Lorenzo et `greya734`.

## Démarche UX

Le cadrage UX a précédé le code. Il a servi de référence commune à toute l’équipe : les endpoints du back ont été construits sur les besoins du parcours, et sont arrivés déjà alignés sur le front.

| Étape | Document |
|-------|----------|
| Arborescence du site | `docs/ux/01-sitemap-validation.md` |
| Zoning et wireframes | `docs/ux/02-wireframes-zoning.md` |
| Grille des métadonnées d’une publication | `docs/ux/03-metadata-grid-publication.md` |
| Personas et parcours | `docs/ux/04-user-flows-personas.md` |
| Périmètre de la traduction FR/EN | `docs/ux/06-i18n-v1-scope.md` |
| Pages et rôles | `docs/ux/07-pages-roles-roadmap.md` |
| Parcours utilisateur de la V1 | `docs/ux/08-parcours-utilisateur-v1.md` |

Le client voulait voir l’application au plus tôt. Le front a donc été développé d’abord sur des données fictives, puis sur l’API publique HAL, puis branché sur l’API Laravel. Une version de démonstration du front a été mise en ligne sur Netlify dès juillet.

La direction artistique reprend la charte Lab Horizon : bleu marine, beige et teal, police Baloo Chettan 2, et un hibou détective comme mascotte (page 404).

## Choix techniques

| Choix | Pourquoi | Ce qui a été écarté |
|-------|----------|---------------------|
| Front React + Vite + TypeScript | Écosystème courant, typage qui évite les erreurs d’intégration, build rapide | — |
| Couche d’adaptateurs entre les pages et les données (`frontend/src/api/`) | Les pages ne dépendent pas de la source : mock, HAL ou API Laravel se choisit par une variable. Passer de HAL au back n’a demandé aucune réécriture de page | Appeler l’API directement depuis les pages |
| API Laravel + Sanctum (session par cookie) | Framework complet côté back ; cookie `HttpOnly` plutôt qu’un jeton lisible par JavaScript | Jeton en `localStorage` |
| MySQL 8.4 | Version LTS, maintenue jusqu’en 2032 | — |
| Redis + worker de file | La vulgarisation par IA prend plusieurs minutes : elle tourne en arrière-plan sans bloquer le site | Génération pendant la requête |
| Modèle IA local (LM Studio, Mistral) | Contrôle des flux de données, exigence RGPD du cahier des charges | API d’IA externe |
| Docker Compose | Le même environnement pour toute l’équipe et pour le serveur | Installation manuelle de PHP, Node, MySQL |
| Monorepo (front + back + orchestration) | Une seule pipeline, une seule mise à jour, `docker-compose.yml` à la racine. Meilleur compromis pour une petite équipe | Deux dépôts (deux pipelines, plus un dépôt d’orchestration) |
| HTTPS partout, certificat auto-signé sans domaine | Cookies de session jamais en clair, même sans nom de domaine | HTTP en clair, tunnel tiers qui déchiffre le trafic |
| Hooks Git (lefthook) + GitHub Actions + `main` protégée | Les contrôles ne dépendent plus de la mémoire de chacun ni d’un LLM ; un contournement local est rattrapé par la CI | Contrôles lancés à la main ou par l’agent IA |
| Secrets : défense en profondeur | Blocage au commit, analyse de tout l’historique en CI, refus côté GitHub | Une seule vérification |
| Règle de test | Ce qui porte une fonctionnalité ou un risque est testé ; chaque fonctionnalité ou correction arrive avec un test. Exceptions écrites : pas de test dépendant du modèle IA, pas de test au pixel des animations | — |

Avant la mise en production, deux revues de sécurité ont été menées avec un protocole construit pour le projet (`revue-securite-preprod`). Elles ont rendu deux verdicts NO-GO ; les corrections ont été faites, et leurs contrôles ont servi de base à la pipeline CI/CD. Les rapports ne sont volontairement pas versionnés : un document listant les failles des versions passées n’a pas sa place dans le dépôt.

## Modules et services externes

| Module ou service | Rôle | Où |
|-------------------|------|----|
| API publique HAL (archives-ouvertes.fr) | Source des publications, import côté back | `frontend/src/api/`, écrans d’import Laravel |
| LM Studio + modèle `mistral-7b-instruct-v0.3` | Vulgarisation par IA, optionnelle | Profil Docker `llm` |
| React, React Router | Interface et navigation | `frontend/` |
| GSAP, split-type | Animations et apparition des textes | `frontend/` |
| Google Fonts — Baloo Chettan 2 | Police de la charte | `frontend/index.html` |
| Laravel, Sanctum, Tinker | API, authentification, console | `backend/composer.json` |
| smalot/pdfparser | Lecture du texte des PDF à vulgariser | `backend/composer.json` |
| Tailwind CSS, Alpine.js | Écrans d’administration Blade | `backend/package.json` |
| Images Docker officielles : PHP-FPM, Node, nginx (non root), MySQL, Redis, Composer | Exécution et build | `Dockerfile`, `docker-compose.yml` |
| GitHub Actions, Dependabot, Trivy, gitleaks, secretlint, lefthook | Pipeline CI/CD et sécurité | `.github/`, `lefthook.yml` |
| Netlify | Démonstration du front sur données fictives, déployée séparément | Hors de ce dépôt |

## Ce qui a été reporté

L’assistant conversationnel (RAG) et la Progressive Web App, prévus au cahier des charges, sont reportés à une V2 faute d’hébergement dédié. Détail : [03 — Plan d’évolution](./03-plan-evolution.md).

## Limites assumées

- Les tests de parcours dans un navigateur (Playwright) sont prévus mais pas installés.
- Les contre-vérifications des revues de sécurité ont été faites avec le même outil que la revue : une relecture par une personne distincte donnerait un avis plus fiable.
- Une pipeline ne vérifie que ce qui a été prévu : chaque évolution doit arriver avec ses tests, et un test doit échouer quand il le doit.
