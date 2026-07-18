# Lab Horizon — Grille métadonnées « papier » (Quoi / Qui / Quand / Lab)

Référence Q6 : métadonnées issues revues / HAL, affichées de façon **fixe et prévisible** pour la confiance, sans surcharger le corps du texte.

---

## 1. Champs (ordre logique)

| Clé | Libellé FR (exemple) | Libellé EN (exemple) | Source typique |
|-----|----------------------|----------------------|----------------|
| **quoi** | Titre scientifique ou titre court | Title | HAL / revue |
| **qui** | Auteur(s) | Author(s) | HAL |
| **quand** | Date de publication | Published | HAL |
| **lab** | Laboratoire / organisme | Lab / Organization | Profil / HAL |

**Règle** : si un champ est absent côté données, afficher « — » ou masquer la ligne (préférer une ligne masquée pour éviter les blocs vides).

---

## 2. Décision d’emplacement : haut-droite vs bas-droite

| Contexte | Recommandation | Justification |
|----------|----------------|---------------|
| **Desktop**, article avec **sidebar** ou grille 2 colonnes | **Haut-droite** (aligné avec le titre / début de lecture) | L’œil scanne titre puis méta ; cohérence avec les revues. |
| **Desktop**, article **pleine largeur** sans sidebar | **Bas-droite** du bloc contenu OU **sous-titre** en bandeau | Évite un vide en haut si le titre est long ; le bloc méta peut suivre le premier paragraphe. |
| **Mobile** | **Sous le titre (H1)**, bloc pleine largeur **empilé** | Pas de « coin droit » pertinent ; une seule colonne. |

**Décision produit figée pour cohérence maquette** :

- **Desktop (≥ 1024 px)** : bloc **C** en **colonne droite**, **haut** aligné avec le **début du titre** (ou la ligne de base du H1). Si la colonne droite est trop étroite, passer le bloc en **stack** sous le titre sur tablette.
- **Mobile (< 768 px)** : bloc **C** **immédiatement après le H1**, avant le corps, pleine largeur (équivalent informationnel du « coin HD » en vertical).

---

## 3. Spécification grille (desktop)

```
┌────────────────────────────────────────────────────────────────┐
│ Fil d’Ariane (pleine largeur)                                   │
├─────────────────────────────────────┬──────────────────────────┤
│ Colonne principale (min ~60%)       │ Colonne méta (max ~35%)   │
│                                     │ ┌──────────────────────┐ │
│ H1 Titre article                    │ │ Quoi                 │ │
│                                     │ │ [valeur]             │ │
│ Lead / chapô optionnel              │ ├──────────────────────┤ │
│                                     │ │ Qui                  │ │
│ Corps…                              │ │ [valeur]             │ │
│                                     │ ├──────────────────────┤ │
│                                     │ │ Quand                │ │
│                                     │ │ [date localisée]     │ │
│                                     │ ├──────────────────────┤ │
│                                     │ │ Lab / Organisme      │ │
│                                     │ │ [valeur]             │ │
│                                     │ └──────────────────────┘ │
│ (suite corps)                       │ (sticky optionnel : le   │
│                                     │  bloc suit au scroll     │
│                                     │  jusqu’à fin article)    │
└─────────────────────────────────────┴──────────────────────────┘
```

- **Sticky** : option — si le texte est long, le bloc méta peut rester visible (`position: sticky; top: …`) pour rappel constant (à valider accessibilité : pas de piège au clavier).

---

## 4. Spécification grille (mobile)

```
┌──────────────────────────────┐
│ Fil d’Ariane                  │
├──────────────────────────────┤
│ H1 Titre                      │
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ Quoi    [valeur]         │ │
│ │ Qui     [valeur]         │ │
│ │ Quand   [date]           │ │
│ │ Lab     [valeur]         │ │
│ └──────────────────────────┘ │
├──────────────────────────────┤
│ Corps article…               │
└──────────────────────────────┘
```

**Alternative mobile** (si le bloc méta est jugé trop haut) : **accordéon « À propos de cette publication »** sous le titre, ouvert par défaut une première visite, replié ensuite (cookie / préférence). À trancher en test utilisateur.

---

## 5. Hiérarchie typographique

- **Libellés** (Quoi, Qui…) : `text-sm`, couleur secondaire, poids medium.
- **Valeurs** : `text-base`, couleur texte principal.
- **Quand** : format date selon locale (FR/EN) — voir [06-i18n-v1-scope.md](./06-i18n-v1-scope.md).

---

## 6. Critères d’acceptation (recette UX)

- [ ] Même ordre des champs sur tous les articles.
- [ ] Pas de déplacement aléatoire du bloc entre pages (toujours même breakpoint pour colonne vs stack).
- [ ] Contraste WCAG AA sur libellés et valeurs.
- [ ] Lecteur vocal : ordre DOM = H1, puis bloc méta, puis corps (cohérent avec mobile).

---

*Aligné sur le plan Lab Horizon UX — fichier plan non modifié.*
