# Lab Horizon — Wireframes annotés (zoning)

Légende des zones : **A** = navigation / contexte, **B** = contenu principal, **C** = actions secondaires ou métadonnées, **D** = persistant (chatbot, langue).

---

## 1. Accueil

Ordre vertical aligné Q5 : hero chercheur → recherche → carrousel catégories → aperçu chercheurs → qui sommes-nous.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ A  [Logo]                    [FR|EN]              [Connexion — discret]    │
├──────────────────────────────────────────────────────────────────────────┤
│ B  HERO                                                                   │
│    Titre valeur + sous-texte                                              │
│    [ CTA primaire : Êtes-vous chercheur ? ]  → connexion / onboarding     │
├──────────────────────────────────────────────────────────────────────────┤
│ B  RECHERCHE GLOBALE                                                      │
│    [ 🔍 Mots-clés __________________________ ] [ Rechercher ]             │
│    Lien : Filtres avancés (dispo · catégorie · institution)             │
├──────────────────────────────────────────────────────────────────────────┤
│ B  CARROUSEL CATÉGORIES                                                   │
│    [ Bio ] [ Droit ] [ Chimie ] [ … ]  → scroll horizontal                │
├──────────────────────────────────────────────────────────────────────────┤
│ B  LES CHERCHEURS (aperçu)                                                │
│    [ avatar ] [ avatar ] [ avatar ]   [ Voir l’annuaire → ]             │
├──────────────────────────────────────────────────────────────────────────┤
│ B  QUI SOMMES-NOUS (ancre ou section)                                     │
│    Texte + éventuellement chiffres clés / partenaires                     │
├──────────────────────────────────────────────────────────────────────────┤
│ A  PIED : Mentions · Confidentialité · Cookies                            │
└──────────────────────────────────────────────────────────────────────────┘
     D  [ Chatbot — FAB fixe bas-droite ]
```

**Zoning** : une seule colonne mobile ; desktop identique ou hero deux colonnes (texte + visuel) sans multiplier les chemins.

---

## 2. Recherche & résultats

```
┌──────────────────────────────────────────────────────────────────────────┐
│ A  [Logo]   Retour accueil    [FR|EN]    [Connexion]                      │
├───────────────────┬────────────────────────────────────────────────────────┤
│ C  FILTRES        │ B  BARRE RECHERCHE (sticky optionnel)                  │
│  (desktop rail    │     [ mots-clés conservés ____________ ] [ Filtrer ]   │
│   ou drawer        ├────────────────────────────────────────────────────────┤
│   mobile)         │ B  ONGLETS ou TOGGLE : [ Publications | Chercheurs ] │
│  Disponibilité    ├────────────────────────────────────────────────────────┤
│  Catégorie        │ B  LISTE — cartes                                       │
│  Institution      │     ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  [ Appliquer ]    │     │ carte 1     │ │ carte 2     │ │ carte 3     │   │
│                   │     └─────────────┘ └─────────────┘ └─────────────┘   │
│                   │     Pagination ou infinite scroll                      │
└───────────────────┴────────────────────────────────────────────────────────┘
     D  [ Chatbot ]
```

**Zoning** : **C** ne duplique pas la barre — les mots-clés restent dans **B** en tête de colonne principale.

---

## 3. Détail publication (« papier »)

Choix documenté : bloc métadonnées **haut-droite ou bas-droite** — voir [03-metadata-grid-publication.md](./03-metadata-grid-publication.md).

### Variante desktop (métadonnées haut-droite)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ A  Fil d’Ariane : Accueil > Catégorie > Titre court                        │
├──────────────────────────────────────────────────┬───────────────────────┤
│ B  TITRE (H1)                                    │ C  Bloc méta          │
│                                                  │  Quoi / Qui / Quand   │
│ B  Corps article (vulgarisation validée)        │  Lab                  │
│  paragraphes…                                    │  (pile compacte)      │
│                                                  │                       │
│ B  … suite …                                     │                       │
├──────────────────────────────────────────────────┴───────────────────────┤
│ B  CTA : [ Voir le profil du chercheur ]   [ Message ] si droits          │
│          Si non connecté : Message grisé + « Connexion pour contacter »  │
└──────────────────────────────────────────────────────────────────────────┘
     D  [ Chatbot ]
```

### Variante mobile

Colonne unique : **titre + méta** en tête (méta sous le titre ou encart compact), puis corps, puis CTA.

---

## 4. Profil chercheur (vue publique)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ A  Fil d’Ariane : Accueil > Chercheurs > Nom                               │
├──────────────────────────────────────────────────────────────────────────┤
│ B  EN-TÊTE                                                                │
│    [ Photo ]   Nom                                                        │
│                Institution · mots-clés / badges catégories                 │
│                [ Disponibilité ] seulement si opt-in (Q4)                  │
├──────────────────────────────────────────────────────────────────────────┤
│ B  PUBLICATIONS LIÉES                                                     │
│    Liste ou grille de cartes (titres + date)                              │
├──────────────────────────────────────────────────────────────────────────┤
│ B  CTA : [ Message ] — selon droits ; pas d’email/tél en clair si règle Q9 │
└──────────────────────────────────────────────────────────────────────────┘
     D  [ Chatbot ]
```

---

## 5. Tableau de bord chercheur (connecté)

Zones fonctionnelles (pas une liste plate) :

```
┌──────────────────────────────────────────────────────────────────────────┐
│ A  [Logo] Lab Horizon    Vue chercheur    [Messages] [Paramètres] [Déco] │
├──────────────────────────────────────────────────────────────────────────┤
│ B  AUJOURD’HUI                                                            │
│    [ + Nouvelle publication ]  [ Brouillons ]  [ Fil veille — aperçu ]   │
├────────────────────────────┬─────────────────────────────────────────────┤
│ B  RACCOURCIS NAV (tabs)    │                                             │
│  Veille | Publications |    │  (contenu de l’onglet actif : liste,       │
│  Profil | Aperçu public     │   formulaires, etc.)                        │
└────────────────────────────┴─────────────────────────────────────────────┘
```

**Onglet Publications (aperçu zoning)** :

```
│    États : Brouillon | En attente validation IA | Publié                   │
│    Table ou cartes avec actions : Éditer · Voir · Retirer                  │
```

**Onglet Aperçu public** : rendu identique au profil public + bandeau « C’est ainsi que les visiteurs vous voient » (Q10).

---

## 6. Messagerie

```
┌──────────────────────────────────────────────────────────────────────────┐
│ A  Retour compte    Messages                                               │
├──────────────────┬───────────────────────────────────────────────────────┤
│ B  LISTE THREADS │ B  FIL DE CONVERSATION                                  │
│  recherche fil   │   (pas d’email/tél dans l’en-tête — Q9)                │
│  ┌─────────────┐ │   Bulles + horodatage                                   │
│  │ thread actif│ │   [ Zone saisie __________________ ] [ Envoyer ]      │
│  └─────────────┘ │                                                       │
│  …               │                                                       │
└──────────────────┴───────────────────────────────────────────────────────┘
```

**Mobile** : liste plein écran → détail thread (navigation empilée).

---

## Synthèse zoning

| Écran | Zone persistante D (chatbot) | Zone sensible confidentialité |
|-------|------------------------------|-------------------------------|
| Accueil | Oui | — |
| Recherche | Oui | — |
| Détail publication | Oui | CTA message si connecté |
| Profil chercheur | Oui | Dispo conditionnelle ; pas coordonnées en clair |
| Dashboard | Optionnel (réduit distraction) | Aperçu public |
| Messages | Non (recommandé) | Jamais PII dans en-tête public |

*Référence : plan Lab Horizon UX — ne pas modifier le fichier plan.*
