# Lab Horizon — Flux utilisateurs détaillés (personas)

Trois parcours prioritaires : **visiteur + chatbot**, **chercheur (publication + validation IA)**, **professionnel (recherche + filtres + message)**.

---

## 1. Visiteur / étudiant — découverte + chatbot

**Objectif** : explorer publications et profils sans compte ; utiliser le LLM pour affiner la recherche documentaire (Q11).

```mermaid
flowchart TD
  start([Arrivée accueil])
  start --> home[Parcourir hero / catégories / recherche]
  home --> results[Résultats publications ou chercheurs]
  results --> detail[ Détail publication ou profil ]
  home --> chat[Ouvre chatbot FAB]
  results --> chat
  detail --> chat
  chat --> refine[Reformule besoin / suggestions]
  refine --> results
  detail --> gate{Contacter ou veille}
  gate -->|Oui| login[Écran connexion / inscription]
  gate -->|Non| home
```

**Points d’attention UX**

- Message clair sur les actions verrouillées : *« Créez un compte chercheur pour publier »* / *« Connectez-vous pour contacter »*.
- Le chatbot reste disponible **sans** compte (Q11).

---

## 2. Chercheur — journée « réussie » : publication + validation IA

**Objectif** : publier ou mettre à jour ; validation **systématique** avant mise en ligne (Q3) ; aperçu public (Q10).

```mermaid
flowchart TD
  L([Connexion chercheur])
  L --> D[Tableau de bord]
  D --> N{Nouveau ou brouillon}
  N -->|Nouveau| E[Éditeur publication]
  N -->|Brouillon| E
  E --> IA[Proposition vulgarisation IA]
  IA --> V{Validation chercheur}
  V -->|Refus / réédition| E
  V -->|Acceptation| P[Publication en ligne]
  P --> A[Aperçu public / Voir comme les visiteurs]
  D --> W[Veille]
  W --> Push[Réglages alertes push PWA]
```

**Micro-copy suggérée (hors scope fichier copy PWA)** : après validation, écran de confirmation + lien direct *« Voir ma fiche publique »*.

---

## 3. Professionnel — recherche + filtres + message

**Objectif** : mots-clés en priorité (Q7) ; filtres disponibilité, catégorie, institution ; contact par **messagerie in-app** (Q8), sans exposition mail/téléphone en V1 si aligné Q9.

```mermaid
flowchart TD
  E([Arrivée même accueil que public Q10])
  E --> S[Barre recherche mots-clés]
  S --> F[Panneau filtres dispo catégorie institution]
  F --> R[Liste résultats chercheurs ou publications]
  R --> RP[Profil chercheur]
  RP --> C{Compte pro connecté}
  C -->|Non| L[Connexion / inscription pro]
  L --> RP
  C -->|Oui| M[Ouvre conversation]
  M --> MSG[Fil messagerie]
```

**Variante** : depuis résultats **publications** → détail papier → profil auteur → message (flux linéaire recherche thématique).

---

## 4. Synthèse des sorties / états d’erreur (transversal)

| Étape | État | Comportement |
|-------|------|----------------|
| Envoi message | Destinataire indisponible | Message in-app + retry |
| Validation IA | Échec génération | Brouillon sauvegardé + message explicite |
| Recherche | Zéro résultat | Suggestions catégories + chatbot |

---

## 5. Admin (rappel)

Parcours **séparé** : authentification forte, pas de chemin depuis l’app grand public (sécurité perçue). Détail dans [01-sitemap-validation.md](./01-sitemap-validation.md).

---

*Document d’implémentation du plan Lab Horizon UX — fichier plan source non modifié.*
