# Lab Horizon — Périmètre i18n V1 (français / anglais)

Exigence : **V1 bilingue FR + EN** (Q12). Ce document liste **écrans** et **composants** à traiter comme **obligatoires** pour une expérience cohérente (pas une langue « en rattrapage »).

---

## 1. Navigation & structure

| Élément | FR | EN | Notes |
|---------|----|----|--------|
| Menu principal (Accueil, Chercheurs, À propos, Connexion) | Oui | Oui | Libellés courts |
| Fil d’Ariane | Oui | Oui | Segments traduits |
| Pied de page (Mentions, Confidentialité, Cookies) | Oui | Oui | Pages légales complètes |
| Libellés de rôles (Espace chercheur, Espace pro) | Oui | Oui | Cohérence avec inscription |

---

## 2. Écrans prioritaires (liste de contrôle)

| Écran / route (logique) | Contenu à traduire |
|-------------------------|-------------------|
| Accueil | Hero, CTA, titres de sections, carrousel catégories |
| Recherche & résultats | Placeholders, filtres, tris, états vides |
| Détail publication | Titres, corps, **bloc méta** (libellés Quoi/Qui/Quand/Lab), CTA |
| Profil chercheur | Champs, disponibilité, liste publications, CTA message |
| Connexion / inscription | Formulaires, erreurs validation, CGU |
| Tableau de bord chercheur | Onglets, états publications, boutons |
| Veille | Liste suivis, alertes, paramètres |
| Éditeur publication | Labels champs, étapes validation IA |
| Messagerie | Liste threads, saisie, horodatage relatif (locale) |
| Paramètres compte | Langue, notifications, confidentialité |
| Chatbot | Prompts système côté UX (accroches), boutons |
| Erreurs globales | 404, 500, hors ligne PWA |

---

## 3. Composants transversaux

| Composant | Obligation V1 |
|-----------|----------------|
| **Sélecteur de langue** (header ou footer) | Oui — persiste préférence (cookie / compte) |
| **Format date / heure** | `Intl` ou équivalent : locale `fr-NC` ou `fr-FR` vs `en-AU`/`en-GB` selon choix produit |
| **Nombre** (pagination, compteurs) | Séparateurs selon locale |
| **Formulaires** | Libellés, aide inline, messages d’erreur |
| **Modales PWA / push** | Voir [05-pwa-push-install-ux.md](./05-pwa-push-install-ux.md) |

---

## 4. Contenu scientifique (publications)

| Type | Stratégie |
|------|-----------|
| Texte vulgarisé | **Langue du contenu** : une publication peut être en FR ou EN selon auteur ; l’UI reste dans la langue **interface** choisie. |
| Titres HAL / revue | Souvent en anglais : **ne pas traduire automatiquement** sans validation ; afficher tel quel avec UI en FR. |
| Métadonnées structurées | Libellés **Quoi / Qui / Quand / Lab** traduits ; valeurs brutes issues sources. |

---

## 5. Hors périmètre V1 (sauf décision contraire)

- Langues régionales additionnelles (ex. corpus kanak) — **non** dans ce document Q12 ; réouverture ultérieure.
- Traduction automatique du corps des articles pour l’utilisateur — **produit distinct** (optionnel).

---

## 6. Livrable pour développement

- Fichiers de clés : `fr.json` / `en.json` (ou structure équivalente) couvrant au minimum les sections **2** et **3**.
- Revue **copy** par un locuteur pour l’anglais (style plateforme recherche, pas marketing excessif).

---

*Aligné sur le plan Lab Horizon UX et sur la réponse Q12.*
