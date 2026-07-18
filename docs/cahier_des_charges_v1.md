Cahier des Charges.docx
•

Dernière mise à jour Aujourd’hui at 8:53 am

CAHIER DES CHARGES
Plateforme de valorisation de la recherche
calédonienne
avec assistant IA intégré
Version
v1.1 — Mise à jour après cadrage initial
Date
Avril 2025
Statut
À valider
Territoire
Nouvelle-Calédonie
1. Présentation du projet
1.1 Contexte
La Nouvelle-Calédonie dispose d'un tissu de chercheurs et d'institutions scientifiques actifs dans des domaines variés : sciences marines, biodiversité terrestre, géologie, sciences humaines et sociales, environnement. Ces travaux sont souvent publiés dans des canaux spécialisés peu accessibles au grand public et insuffisamment valorisés à l'échelle du territoire.
Il n'existe aujourd'hui aucune plateforme centralisée permettant de découvrir, d'explorer et de comprendre l'ensemble de la production scientifique calédonienne, qu'il s'agisse d'articles de recherche, de thèses, de rapports institutionnels ou de projets en cours.
1.2 Vision
Le projet consiste à développer une plateforme numérique de mise en valeur des travaux de recherche des chercheurs néo-calédoniens, accessible à tous les publics — du grand public curieux aux spécialistes — sans distinction de mode ou de profil utilisateur.

Vision synthétique
Une plateforme unique qui rend la recherche calédonienne visible, compréhensible et consultable, enrichie d'un assistant IA conversationnel ancré exclusivement dans la base de données locale.
1.3 Objectifs
Objectifs principaux
Centraliser les travaux de recherche produits en Nouvelle-Calédonie ou portant sur le territoire
Rendre ces travaux accessibles à un large public, avec un niveau de détail scientifique maintenu
Offrir un moteur de recherche classique (par auteur, discipline, institution, type, date)
Intégrer un assistant IA conversationnel répondant exclusivement à partir de la base de données du site
Objectifs secondaires
Valoriser l'identité scientifique et territoriale de la Nouvelle-Calédonie
Créer un outil de référence pour les institutions, les médias et les décideurs
Encourager la visibilité des chercheurs locaux
1.4 Points de décision ouverts

Décisions restant à trancher
Trois des six points de décision initiaux ont été tranchés. Les trois suivants n’ont pas encore été arrêtés et devront faire l’objet d’une décision avant le lancement du développement.
Point de décision
Description & enjeux
Portage institutionnel
Projet tutoré porté par l’IUT de Nouvelle-Calédonie. Le projet est encadré dans le cadre pédagogique de l’IUT, ce qui implique un suivi par des enseignants-tuteurs et une évaluation académique. Les décisions techniques et fonctionnelles sont prises par l’équipe étudiante, sous validation de l’encadrement.
Périmètre au lancement
Au lancement, la plateforme indexera uniquement les travaux d’un ou deux organismes partenaires (à définir). Ce périmètre restreint est adapté au cadre d’un projet tutoré et permet de valider l’ensemble de la chaîne (dépôt, indexation, chatbot IA) avant tout passage à l’échelle.
Gestion des contenus
Les chercheurs déposent eux-mêmes leurs travaux via un formulaire d’auto-dépôt. Un workflow de validation reste nécessaire (validation par l’encadrement ou un référent organisme) avant mise en ligne, afin de garantir la qualité et la cohérence des métadonnées.
Langues
Français uniquement, ou français + anglais ? L'ajout de langues kanak est une option à considérer sur le long terme.
Comptes utilisateurs
La plateforme est-elle entièrement publique (sans compte), ou prévoit-elle un espace connecté pour les chercheurs (dépôt, suivi, profil) ?
Calendrier
Aucune contrainte de délai n'est encore définie. Un MVP (version minimale) pourrait cibler une mise en ligne dans les 6 à 12 mois suivant le démarrage du développement.
2. Public cible
La plateforme adopte une approche de public unique : elle s'adresse à tous les visiteurs sans distinction de profil, en maintenant un niveau de détail scientifique suffisant tout en restant compréhensible par un non-spécialiste.
2.1 Profils utilisateurs identifiés
Profil
Priorité
Besoins principaux
Grand public
Prioritaire
Curiosité générale sur les recherches NC, intérêt pour l'environnement local, les ressources naturelles, l'histoire du territoire.
Chercheurs & académiques
Prioritaire
Recherche de publications, suivi de collègues, découverte de travaux connexes, veille scientifique locale.
Étudiants
Secondaire
Recherche bibliographique pour mémoires et thèses, orientation vers des sujets de recherche locaux.
Institutionnels & décideurs
Secondaire
Besoin de données scientifiques pour orienter des politiques publiques ou des décisions de gestion territoriale.
Médias & journalistes
Tertiaire
Accès rapide à des sources fiables sur des sujets d'actualité liés à la NC (environnement, mines, société).
2.2 Principe d'accessibilité universelle

Principe clé
La plateforme ne distingue pas de mode "expert" et de mode "grand public". Elle vise un équilibre : rigueur scientifique dans les contenus, langage accessible dans la présentation. L'assistant IA joue un rôle central dans cette médiation.
3. Fonctionnalités
3.1 Fonctionnalités principales (MVP)
Catalogue de publications
Affichage des travaux de recherche avec fiche détaillée (titre, auteurs, institution, résumé, discipline, type, date, lien vers le document)
Système de tags par discipline, type de travail (article, thèse, rapport, communication) et institution
Pagination et tri des résultats
Moteur de recherche classique
Recherche textuelle (titre, auteur, mots-clés, résumé)
Filtres combinables : discipline, type, institution, période, auteur
Tri par pertinence, date, popularité
Assistant IA conversationnel
Chatbot intégré à la page d'accueil et consultable depuis toutes les pages
Réponses générées exclusivement à partir de la base de données du site (architecture RAG)
Chaque réponse cite les sources utilisées avec lien vers la fiche correspondante
L'assistant indique explicitement lorsqu'il ne trouve pas de réponse dans la base (pas d'hallucination)
Interface conversationnelle avec historique de session
Fiches chercheurs
Page de profil par auteur : biographie courte, institution, liste des publications indexées
Lien depuis chaque publication vers le profil de ses auteurs
Pages institutionnelles
Présentation des institutions partenaires et de leurs domaines de recherche
Liste des publications associées à chaque institution
3.2 Fonctionnalités secondaires (post-MVP)
Espace chercheur connecté : dépôt de travaux, suivi de ses publications, mise à jour du profil
Système de suggestion : "vous pourriez aussi aimer" basé sur la discipline ou les auteurs
Export bibliographique (BibTeX, RIS, APA)
Newsletter ou fil d'actualité des nouvelles publications
Version anglaise de l'interface
Statistiques de consultation (tableau de bord public ou privé)
3.3 Fonctionnalités exclues du périmètre

Hors périmètre
Les fonctionnalités suivantes ne font pas partie du projet : réseau social entre chercheurs, messagerie interne, système de commentaires publics sur les publications, hébergement des fichiers complets (PDF) en cas de droits éditoriaux restrictifs.
4. Architecture & spécifications techniques
4.1 Architecture générale
La plateforme repose sur trois composants principaux interconnectés :
Frontend web — interface publique responsive accessible sur desktop et mobile
Base de données — stockage structuré des publications, chercheurs, institutions et métadonnées
Module IA (RAG) — système de récupération augmentée (Retrieval-Augmented Generation) connecté exclusivement à la base de données du site

Principe RAG
L'assistant IA n'utilise pas de connaissances générales d'internet. Il interroge uniquement la base de données indexée de la plateforme, garantissant que chaque réponse est traçable et vérifiable. Toute réponse cite sa source parmi les publications du catalogue.
4.2 Exigences techniques
Performance
Temps de chargement de la page d'accueil < 2 secondes (connexion standard)
Temps de réponse du moteur de recherche classique < 1 seconde
Temps de réponse de l'assistant IA < 5 secondes pour une question simple
Accessibilité
Conformité RGAA / WCAG 2.1 niveau AA minimum
Contraste des textes conforme aux exigences d'accessibilité (ratio ≥ 4.5:1 pour le texte courant)
Navigation clavier complète
Textes alternatifs sur tous les éléments visuels significatifs
Compatibilité
Navigateurs : Chrome, Firefox, Safari, Edge (versions N-1)
Responsive design : mobile (375px), tablette (768px), desktop (1280px+)
Dégradation gracieuse si le module IA est indisponible (la recherche classique reste fonctionnelle)
Sécurité
Données utilisateurs conformes au RGPD (si comptes utilisateurs implémentés)
Protection contre les injections SQL et XSS
Accès HTTPS obligatoire
4.3 Contraintes du module IA
Contrainte
Spécification
Source de données
Exclusivement la base de données de la plateforme — aucune requête vers Internet ou modèles génératifs externes non contrôlés
Traçabilité
Chaque réponse doit mentionner les publications sources avec lien vers la fiche
Absence de réponse
Si aucune publication pertinente n'est trouvée, l'assistant doit l'indiquer clairement plutôt que de générer une réponse approximative
Langue
Réponses en français par défaut
Mémoire de session
L'historique de conversation est conservé pendant la session, non au-delà
5. Charte graphique & identité visuelle
5.1 Principes directeurs
Sérieux institutionnel allié à une accessibilité grand public
Ancrage visuel dans le territoire néo-calédonien (couleurs inspirées du lagon, de la latérite, des forêts)
Interface unique sans distinction de mode — un seul niveau de lecture, accessible à tous
5.2 Palette de couleurs (variables principales)
Variable
Hex
Usage
Primary
#030213
Fond sombre principal, header, navigation
Background
#ffffff
Fond de page
Surface
#f3f3f5
Cartes, panneaux, composants
Surface raised
#ececf0
Inputs, composants surélevés
Text primary
#030213
Titres et corps de texte
Text secondary
#717182
Métadonnées, labels
Text disabled
#cbced4
Placeholders, états inactifs
Secondary
#4a5f9c
Boutons secondaires, liens
Secondary light
#5aa7c7
Hover, icônes, badges (lagon clair)
Accent
#f0d05a
CTA principal, mises en valeur
Accent chatbot
#6cd4b8
Interface IA, bulles, indicateurs
Border
#e9ebef
Contours par défaut
Border hover
#cbced4
Focus et hover
UI Error
#d4183d
Erreurs et alertes critiques
UI Success
#6cd4b8
Confirmations (double usage avec Accent chatbot)
UI Warning
#f0d05a
Avertissements (double usage avec Accent)
5.3 Tags de disciplines (couleurs NC)
Discipline
Couleur associée
Sciences marines
#5aa7c7 — Lagon clair
Biodiversité terrestre
#6cd4b8 — Vert turquoise
Géologie & mines
#a44f2c — Latérite
Sciences humaines & sociales
#6a5be8 — Violet
Environnement & climat
#e06f3b — Orange vif
5.4 Interface du chatbot
Fond de la zone de conversation : sable (#F5E6C8)
Bulles IA : fond Primary (#2B2B2B), texte blanc
Bulles utilisateur : fond Accent Chatbot (#6cd4b8 / #00B4CC), texte sombre
En-tête du chatbot : fond Primary dark, identité visuelle distincte
Le chatbot doit être visuellement reconnaissable comme interface IA, distinct du reste du site
6. Contenus & données
6.1 Types de contenus indexés
Type
Description
Articles scientifiques
Publications dans des revues à comité de lecture, avec DOI si disponible
Thèses & mémoires
Doctorats et masters soutenus par des chercheurs affiliés à des institutions NC
Rapports d'étude
Rapports techniques, rapports de mission, études commandées
Communications
Présentations dans des colloques, actes de conférence
Projets de recherche
Descriptions de projets en cours ou terminés
6.2 Métadonnées par publication
Titre complet
Auteur(s) — nom, prénom, institution d'affiliation
Institution(s) porteuse(s)
Discipline principale + disciplines secondaires (tags)
Type de publication
Date de publication / soutenance
Résumé (abstract) — en français, anglais si disponible
Mots-clés
Lien vers le document complet (DOI, URL externe, ou fichier hébergé si droits le permettent)
Langue du document
6.3 Alimentation de la base de données

Point de décision ouvert
La gouvernance éditoriale est définie : les chercheurs déposent eux-mêmes leurs travaux via un formulaire d’auto-dépôt. Un modérateur (encadrant IUT ou référent organisme partenaire) valide chaque soumission avant mise en ligne.
Quelle que soit l'option retenue, les exigences suivantes s'appliquent :
Un workflow de validation est nécessaire avant mise en ligne de tout contenu
Les métadonnées doivent respecter un format standardisé (compatible Dublin Core ou schéma équivalent)
Un système d'import en lot (CSV, API) est souhaitable pour l'alimentation initiale
7. Planning & jalons

Aucune contrainte de délai définie
Le planning ci-dessous est indicatif. Il propose un séquencement réaliste pour un MVP en 6 à 9 mois, à ajuster en fonction des ressources disponibles et des décisions de gouvernance.
Phase
Durée estimée
Livrables / activités
Phase 0 — Cadrage
4 à 6 semaines
Validation du cahier des charges, choix technologiques, identification des organismes partenaires (un ou deux au lancement), définition du périmètre des langues et du modèle de comptes utilisateurs
Phase 1 — Conception
4 à 6 semaines
Wireframes, maquettes UI, architecture de la base de données, choix du modèle IA (RAG), plan d'alimentation initiale
Phase 2 — Développement MVP
12 à 16 semaines
Développement du catalogue, moteur de recherche, fiches publications et chercheurs, intégration du module IA, back-office d'administration
Phase 3 — Alimentation initiale
4 à 8 semaines
Import des premières publications (à définir : périmètre pilote), tests de l'assistant IA sur la base réelle
Phase 4 — Tests & recette
3 à 4 semaines
Tests fonctionnels, tests d'accessibilité, tests de performance, corrections
Phase 5 — Lancement
1 à 2 semaines
Mise en production, communication de lancement, monitoring
8. Critères de succès
8.1 Indicateurs quantitatifs
Nombre de publications indexées au lancement (objectif à définir selon périmètre)
Nombre de visiteurs uniques mensuels (objectif à définir après 3 mois de mise en ligne)
Taux d'utilisation du chatbot IA vs moteur de recherche classique
Temps moyen passé sur le site
Taux de rebond
8.2 Indicateurs qualitatifs
Satisfaction des chercheurs dont les travaux sont indexés
Pertinence et exactitude des réponses du chatbot (évaluation périodique)
Retours des institutions partenaires
Couverture médiatique locale lors du lancement
8.3 Critères d'acceptation du chatbot IA
Critère
Exigence
Exactitude
Les réponses doivent être factuellement correctes par rapport aux sources citées
Traçabilité
100% des réponses doivent citer au moins une source de la base
Honnêteté
Le chatbot doit signaler l'absence de résultat plutôt que d'approximer
Temps de réponse
< 5 secondes pour 95% des requêtes
Langue
Réponses cohérentes et fluides en français
9. Références & inspirations
9.1 Plateformes de référence étudiées
Plateforme
Rôle dans la veille
Consensus (consensus.app)
Chatbot IA sur base académique, interface épurée — référence principale pour le module IA
SciSpace / Typeset (typeset.io)
Plateforme de découverte et d'analyse de littérature scientifique avec chat intégré
Semantic Scholar (semanticscholar.org)
Moteur de recherche académique sémantique — référence pour l'architecture de recherche
HAL (hal.science)
Archive ouverte française — référence pour la structure du catalogue et les métadonnées
ResearchRabbit
Visualisation de réseaux de publications — inspiration pour la découverte de contenus connexes
Google NotebookLM
IA répondant uniquement à partir de documents fournis — référence pour le principe RAG borné
Elicit (elicit.com)
Assistant de recherche académique — référence pour l'UX du chat avec sources citées
9.2 Documents associés
Veille graphique — analyse comparative des plateformes similaires
Charte graphique v1.0 — palette de couleurs, typographie, composants UI
Maquette de page d'accueil — prototype HTML de référence
10. Annexes
10.1 Glossaire
Terme
Définition
RAG (Retrieval-Augmented Generation)
Architecture IA qui interroge une base de données existante avant de générer une réponse, garantissant la traçabilité des sources
MVP (Minimum Viable Product)
Version minimale du produit incluant uniquement les fonctionnalités essentielles pour un premier lancement
Métadonnées
Données structurées décrivant une publication : titre, auteurs, date, discipline, etc.
Open Access
Accès libre et gratuit aux publications scientifiques, sans barrière tarifaire ou technique
Dublin Core
Standard international de métadonnées bibliographiques, largement utilisé dans les bibliothèques numériques
WCAG 2.1 AA
Standard d'accessibilité web définissant les critères de lisibilité et d'utilisabilité pour les personnes en situation de handicap
10.2 Points de décision — récapitulatif
Décision
Statut
Portage institutionnel
✓ Défini — Projet tutoré IUT de Nouvelle-Calédonie
Périmètre des disciplines au lancement
✓ Défini — Travaux d’un ou deux organismes partenaires (à identifier)
Gouvernance éditoriale (saisie et validation)
✓ Défini — Auto-dépôt par les chercheurs + validation encadrement
Langues supportées
Non défini
Comptes utilisateurs chercheurs
Non défini
Calendrier de mise en ligne
Non défini


Améliorer

Commentaire
Liste à puces
Toutes les listes

Texte
Remplacer par

A
Couleur du texte





Alignement


Vous ne pouvez pas créer de tâches ici. Veuillez surligner du texte uniquement afin de créer des tâches.
Plus de paramètres