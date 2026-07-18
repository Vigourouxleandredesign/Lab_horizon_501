# Cahier des charges — Lab Horizon

**Plateforme de valorisation de la recherche calédonienne avec assistant IA intégré**

| Champ | Valeur |
|-------|--------|
| **Nom officiel du produit** | **Lab Horizon** |
| **Version du document** | v2.0 |
| **Date** | Avril 2026 |
| **Statut** | À valider par la direction de l’IUT |
| **Territoire** | Nouvelle-Calédonie |
| **Référence projet** | SAE 501 — IUT de Nouvelle-Calédonie |

---

## 0. Hiérarchie des documents (autorité)

Pour lever toute ambiguïté entre livrables successifs :

| Rang | Document | Usage |
|------|-----------|--------|
| **1** | **`docs/data-dictionary-v1.md`** | Référence pour le **modèle de données**, attributs et relations à implémenter (sous réserve du périmètre fonctionnel ci-dessous). |
| **2** | **`docs/ux/`** (ensemble) | Référence pour **parcours**, **écrans**, **composants** et **UX** ; **sauf** fonctionnalités explicitement hors périmètre V1 (voir §3.4). |
| **3** | **`docs/cahier_des_charges_v2.md`** | **Présent document** — cadrage produit, contraintes juridiques, techniques et calendrier **arrêtés**. |

Les versions antérieures (ex. export `cahier_des_charges_v1`) restent utiles comme historique mais ne prévalent pas sur la v2 en cas de contradiction.

---

## 1. Présentation du projet

### 1.1 Contexte

La Nouvelle-Calédonie dispose d’un tissu de chercheurs et d’institutions scientifiques actifs ; les travaux sont souvent publiés dans des canaux peu accessibles au grand public et insuffisamment valorisés à l’échelle du territoire. Il n’existe pas aujourd’hui de plateforme centralisée permettant de découvrir, d’explorer et de comprendre cette production scientifique locale.

### 1.2 Vision

**Lab Horizon** est une plateforme web qui rend la recherche calédonienne **visible**, **compréhensible** et **consultable**, avec un **assistant IA conversationnel** dont les réponses sont **ancrées dans les données indexées par la plateforme** (architecture RAG).

### 1.3 Objectifs principaux

- Centraliser les travaux concernés par le périmètre défini avec l’IUT (dont récupération depuis **HAL** pour les chercheurs concernés au lancement).
- Rendre ces travaux accessibles à un large public tout en conservant une base scientifique exploitable par les spécialistes.
- Offrir une **recherche** avec filtres (dont disponibilité, catégorie, institution selon les écrans UX).
- Intégrer un **assistant IA** répondant à partir du **catalogue et des vulgarisations stockés en base**, avec **sources citées** et honnêteté en cas d’absence de résultat pertinent.

### 1.4 Objectifs secondaires

- Valoriser l’identité scientifique et territoriale de la Nouvelle-Calédonie.
- Constituer un outil de référence pour institutions, médias et décideurs.
- Renforcer la visibilité des chercheurs suivis dans le périmètre projet.

---

## 2. Parties prenantes, gouvernance et propriété

| Rôle | Responsabilité |
|------|----------------|
| **Direction de l’IUT** | Arbitrages fonctionnels et éditoriaux ; **modération** ; validation des livrables majeurs ; **propriété** et **exploitation** de la plateforme après livraison. |
| **Équipe projet (SAE)** | Conception, développement, documentation technique, mise en œuvre conforme au présent cahier des charges. |
| **Conditions générales d’utilisation** | Rédigées par le **développement front**, **validées par la direction** avant mise en ligne. |

---

## 3. Périmètre fonctionnel

### 3.1 Alignement UX

Le produit **s’aligne sur les spécifications UX** décrites dans `docs/ux/` (sitemap, wireframes, flux utilisateurs, grille métadonnées publications, PWA/push, i18n), **à l’exception** suivante :

### 3.2 Hors périmètre V1 — Messagerie directe

La **messagerie in-app entre utilisateurs** (threads, conversations) **n’est pas implémentée dans cette version**. Les entités correspondantes dans le dictionnaire de données demeurent des **références pour évolution ultérieure** ; elles ne constituent pas une obligation de livraison pour le lot courant.

### 3.3 Fonctionnalités attendues V1 (synthèse)

Sans liste exhaustive au niveau maquette, la V1 inclut notamment :

- Parcours **grand public** et **connecté** (chercheur / pro selon UX), **sans** messagerie.
- **Catalogue de publications** avec fiche détail (corps vulgarisé, grille métadonnées Quoi / Qui / Quand / Lab issue des sources documentées dans `docs/ux/03-metadata-grid-publication.md`).
- **Recherche** avec filtres et vues publications / chercheurs conformément aux UX.
- **Profils chercheurs** et annuaire.
- **Espace connecté chercheur** : tableau de bord, publications (états brouillon / validation IA / publié), **veille et abonnements**, **aperçu public**, **paramètres** (langue, notifications push, confidentialité).
- **Assistant IA (RAG)** disponible depuis l’interface, avec citations et gestion des cas sans réponse pertinente.
- **Application administrable** (chemins admin prévus dans les UX — utilisateurs, publications, catégories, journaux selon périmètre réalisé).
- **PWA / notifications push** dans les conditions décrites dans les UX (veille).

### 3.4 Fonctionnalités explicitement hors périmètre (rappel)

- **Messagerie directe** (V1).
- Fonctions non prévues dans les documents d’autorité ou reportées explicitement au backlog (ex. annonces « espace pro » si non réalisées dans le lot).

---

## 4. Contenus, données et sources au lancement

### 4.1 Origine des contenus

Au **lancement**, les contenus proviennent :

- De **chercherches identifiées au périmètre IUT**, avec **récupération des métadonnées et références via HAL** (flux, import ou mapping selon implémentation retenue).
- Du **stockage en base de données** des **publications** et des **vulgarisations** associées (texte vulgarisé validé dans le workflow métier).

### 4.2 Stockage

- Les **publications** et **vulgarisations** pertinentes sont **hébergées en base** sur l’infrastructure de l’IUT.
- Les **fichiers complets** (PDF) restent soumis aux **droits éditoriaux** : lien vers ressource externe (HAL, DOI, etc.) lorsque l’hébergement local du PDF n’est pas autorisé.

### 4.3 Workflow éditorial

La **direction** assure la **cohérence** et la **modération** sur la base des règles arrêtées avec les encadrants ; les flux détaillés (validation IA / validation humaine) suivent les UX et le modèle de données.

---

## 5. Intelligence artificielle et conformité

### 5.1 Principes RAG (inchangés)

- Réponses fondées sur le **corpus indexé** de la plateforme ; **traçabilité** par **citations** vers les fiches publications.
- Comportement **transparent** lorsque **aucune source pertinente** n’est trouvée.

### 5.2 Mémoire et vie privée (assistant)

Conformément au cadrage **CDC** : **historique de conversation limité à la session** ; pas de conservation prolongée au-delà pour l’assistant sur ce périmètre sans décision contraire ultérieure et mise à jour des CU.

### 5.3 Fournisseurs et modalités techniques

| Option | Condition |
|--------|-----------|
| **Mistral** | Envisagé pour respecter les **exigences RGPD** et le contrôle des flux de données. |
| **Copilot (ou équivalent)** | Possible **uniquement** sous **contrat** garantissant la conformité **RGPD** et les clauses validées par la direction. |
| **Modèle local / open source** | Alternative ou complément selon **tests** et **budget** disponible après phase d’évaluation. |

Le **choix définitif du modèle et du mode d’hébergement** (local, cloud souverain ou sous contrat) est **validé après tests**, dans le respect des contraintes légales et du présent document.

---

## 6. Protection des données et cadre utilisateurs

### 6.1 RGPD

Application des **principes classiques** RGPD : licéité, minimisation, information des personnes concernées, droits d’accès / rectification / effacement dans les conditions légales, registre des traitements et sous-traitants pertinents, analyse des transferts hors UE si usage de prestataires.

### 6.2 Public cible comptes

Les **comptes** concernent des **chercheurs et acteurs professionnels** du périmètre défini ; **pas de mineurs** comme population cible des comptes utilisateurs.

### 6.3 Documents légaux

- **Politique de confidentialité** et **mentions** cohérentes avec les traitements réels.
- **Conditions générales d’utilisation** : rédaction **côté développement front**, **validation par la direction** avant publication.

---

## 7. Internationalisation

- **Français et anglais** : **interface obligatoirement bilingue** sur **l’ensemble de l’application** ( périmètre aligné sur `docs/ux/06-i18n-v1-scope.md`).
- Les **contenus scientifiques** peuvent demeurer dans leur langue d’origine ; les **libellés d’interface** et le **comportement i18n** (dates, formats) couvrent FR et EN.

---

## 8. Hébergement et performance cible

| Sujet | Décision |
|-------|----------|
| **Hébergement** | **Nouvelle-Calédonie**, **serveur de l’IUT**. |
| **Charge attendue** | Ordre de grandeur **~100 visites par jour**, **inférieur à 1 000 visites par jour** en pic raisonnable de dimensionnement. |
| **Sécurité** | HTTPS obligatoire ; bonnes pratiques contre injections (SQL, XSS) ; sauvegardes et accès administrateurs définis avec l’exploitant. |

Les objectifs chiffrés de performance du CDC initial (temps de chargement, temps de réponse recherche et IA) restent **des objectifs de conceptions** ; la recette précisera les mesures sur l’infrastructure IUT.

---

## 9. Accessibilité et compatibilité

- **Visée** : conformité **RGAA / WCAG 2.1 niveau AA** comme objectif de recette (cf. version antérieure du CDC pour détail des critères).
- **Navigateurs** : Chrome, Firefox, Safari, Edge (versions N-1).
- **Responsive** : mobile, tablette, desktop (breakpoints conformes aux maquettes UX).

---

## 10. Charte graphique

Les principes directeurs et la palette définis dans le livrable « Charte graphique / prototype » associés au projet initial restent **valables** pour Lab Horizon, sous réserve d’harmonisation avec les composants finaux. Ajustements **validés par la direction** si écart nécessaire pour l’accessibilité.

---

## 11. Calendrier et livrables (arrêté projet)

| Jalons | Échéance |
|--------|-----------|
| **Version prête pour tests** (application **fonctionnelle** et **maintenable**) | **Fin août** (avant campagne de tests). |
| **Livrable définitif** (après retours de test et stabilisation) | **Septembre**. |

Critère d’acceptation intermédiaire : code structuré, documenté pour reprise par l’IUT ou un prestataire, déploiement possible sur l’environnement cible.

---

## 12. Critères de succès (indicateurs)

Les indicateurs quantitatifs et qualitatifs (publications indexées, trafic, usage du chatbot, satisfaction, exactitude des réponses IA) restent pertinents ; les **cibles chiffrées** pourront être fixées par la **direction** après mise en ligne initiale.

Critères d’acceptation du **chatbot** : exactitude relative aux sources citées, traçabilité des sources, honnêteté en absence de corpus pertinent, temps de réponse conforme aux tests sur l’infrastructure réelle.

---

## 13. Annexes et références

| Référence | Contenu |
|-----------|---------|
| `docs/data-dictionary-v1.md` | Modèle de données |
| `docs/ux/` | UX détaillée |
| `docs/cahier_des_charges_v1.md` | Historique et inventaire fonctionnel élargi |

---

## 14. Récapitulatif des décisions v2

| Sujet | Décision |
|-------|-----------|
| Nom produit | **Lab Horizon** |
| Documents d’autorité | **Dictionnaire** puis **UX** ; CDC v2 pour arbitrages globaux |
| Messagerie | **Hors V1** |
| Propriété / exploitation | **IUT** (direction) |
| Contenus lancement | **HAL** + stockage **BDD** publications et vulgarisations |
| IA | **Mistral** ou **Copilot sous contrat RGPD** ; **local / open source** selon tests et budget |
| Mémoire assistant | **Session (CDC)** |
| Utilisateurs | Chercheurs / pros ; **pas de mineurs** |
| CU | Front + **validation direction** |
| i18n | **FR + EN** sur toute l’app |
| Hébergement | **NC — serveur IUT** ; charge ~**100**/j, **inférieur à 1 000**/j |
| Calendrier | **Tests avant fin août** — **livrable septembre** |

---

*Document préparé pour validation par la direction de l’IUT de Nouvelle-Calédonie.*
