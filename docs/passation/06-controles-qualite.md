# Contrôles qualité

Deux familles de contrôles protègent la remise. La première tourne déjà dans le dépôt. La seconde est installée comme skill d’équipe : c’est une revue de sécurité avant mise en production, pas une batterie de tests automatique.

Le détail technique des tests, en anglais et à l’usage des développeurs, est dans [docs/TESTING.md](../TESTING.md). Ce chapitre en donne l’objectif pour un évaluateur.

## Tests déjà en place

Ils empêchent qu’une modification casse le socle sans qu’on s’en aperçoive : le site doit compiler, les domaines affichés doivent avoir leurs textes et leurs images, et les quelques règles métier pures (filtre de catégorie, suivi de relecture) doivent rester vraies.

Commande du quotidien, à la racine, sans Docker : `npm run gate`. Avant une remise, avec Docker allumé : `npm run gate:full`.

| Contrôle | Objectif | Ce qu’il ne garantit pas |
|----------|----------|--------------------------|
| Types et lint | Le front TypeScript se compile et respecte les règles de code | Le parcours visiteur |
| Secrets | Pas de clé ou de mot de passe évident dans le code versionné | Un secret collé dans un fichier ignoré par le motif |
| Couleurs | Les pages utilisent les couleurs du projet, pas une couleur en dur | La qualité graphique |
| Domaines | Chaque domaine a son texte, sa pastille et son héro | Que la base contient les publications de ce domaine |
| Tests unitaires | Le filtre de catégories et le suivi « vulgarisation déjà ouverte » se comportent comme prévu | Les écrans React |
| Build | Le site de production se construit | Qu’il répond une fois déployé |
| Fumées API (`gate:full`) | La recherche et la connexion de démo répondent | Tous les cas d’erreur |
| PHPUnit (`gate:full`) | Les tests Laravel du dépôt passent | Les tests Breeze `/profile` peuvent échouer sans toucher au site React |

Un gate vert signifie : le socle est cohérent et livrable. Il ne signifie pas que chaque écran a été rejoué à la main, ni qu’un audit de sécurité a eu lieu. Les parcours automatisés dans un navigateur (Playwright) sont prévus dans `docs/TESTING.md` et ne sont pas encore installés.

## Revue de sécurité installée

Le protocole `revue-securite-preprod` 2.1.0 est installé localement dans `.cursor/skills/revue-securite-preprod/`. Il n’est pas versionné : son corpus de test et ses archives restent hors dépôt. Le texte du protocole n’a pas été modifié.

Son auto-test (`python .cursor/skills/revue-securite-preprod/tests/test_recon.py`) a passé : 12 tests. Il vérifie que la reconnaissance repère les pistes attendues, ignore le code sain, masque les secrets et refuse d’écrire son résultat dans le dépôt audité.

Son objectif est autre que celui du gate. Le gate vérifie que le projet se construit et que quelques contrats tiennent. La revue lit le code et la configuration avant une mise en production, et rend un verdict : **GO**, **GO sous conditions**, **NO-GO**, ou **avis impossible** si les preuves manquent.

Ce n’est ni un exercice d’attaque, ni un test d’intrusion. C’est une revue en boîte blanche : accès aux sources, charte d’engagement signée avant de commencer, preuves localisées (fichier et ligne), secrets masqués dans le rapport.

Elle couvre notamment l’autorisation sur les données, l’authentification, les injections, les secrets, les dépendances, Docker, et les écarts de configuration. Le rapport classe chaque constat et dit quoi corriger avant d’ouvrir le service.

La revue n’a pas été jouée sur ce dépôt. Le protocole l’interdit tant que le responsable n’a pas recopié, mot pour mot, la phrase de `templates/charte-engagement.md`, avec l’identifiant de charte et le hash complet du commit. La remise actuelle reste donc couverte par le gate, pas par un verdict de sécurité.
