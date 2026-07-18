# Lab Horizon — Validation du sitemap (app principale vs admin)

Document de cadrage pour validation équipe : rôles, accès, module futur « annonces pro ».

## 1. Deux applications distinctes

| Entrée | Public | Objectif |
|--------|--------|----------|
| **App principale** | Grand public, étudiants, comptes chercheurs, comptes professionnels | Découverte, publications, veille, messagerie, chatbot |
| **App admin** | Administrateurs / opérateurs plateforme | Gouvernance, sécurité, modération éventuelle, audit |

**Décision UX** : URL ou sous-domaine séparé pour l’admin (ex. `admin.labhorizon.nc`) afin de ne pas mélanger les parcours ni les mental models.

---

## 2. Sitemap app principale (validé pour implémentation)

```
/                          Accueil
/recherche                 Résultats (query + filtres)
/categories                Index catégories
/categories/:slug          Liste filtrée par catégorie
/publications/:id          Détail publication (« papier »)
/chercheurs                Annuaire chercheurs
/chercheurs/:id            Profil chercheur (vue publique)
/a-propos                  Qui sommes-nous
/connexion                 Connexion
/inscription               Inscription (rôles : chercheur / pro selon produit)
/mentions-legales          …
/confidentialite           …
/cookies                   …

--- Espace connecté (préfixe /compte ou layout dédié) ---

/compte                    Tableau de bord (chercheur ou pro)
/compte/veille             Veille + abonnements + réglages alertes
/compte/publications       Liste + création / édition
/compte/publications/nouveau
/compte/publications/:id/editer
/compte/messages           Messagerie
/compte/profil             Édition profil
/compte/apercu             Aperçu « voir comme le public »
/compte/parametres         Langue, notifications push, confidentialité

--- Évolution (backlog) ---

/compte/pro/annonces       Annonces de recherche (comptes pro) — *à trancher produit*
```

---

## 3. Sitemap admin (minimal)

```
/                          Tableau de bord admin
/utilisateurs              Liste / rôles
/publications              Modération (si activée)
/categories                Gestion taxonomie
/parametres                Système, conformité
/journaux                  Audit / logs
```

---

## 4. Matrice d’accès par rôle (rappel validation)

| Fonctionnalité | Visiteur | Chercheur | Pro | Admin (app principale) |
|----------------|----------|-----------|-----|-------------------------|
| Lire publications & profils publics | Oui | Oui | Oui | N/A |
| Chatbot | Oui | Oui | Oui | N/A |
| Recherche + filtres (dont dispo / institution) | Oui | Oui | Oui | N/A |
| Veille + push PWA | Non | Oui | Selon rôle* | N/A |
| Publier / valider IA | Non | Oui | Non | N/A |
| Messagerie | Non | Oui | Oui (vers chercheurs) | N/A |
| Annonces de recherche | Non | Non | Module futur | N/A |

\*À trancher : le pro suit-il une veille métier ou uniquement recherche + messages ? Par défaut plan UX : veille prioritaire **chercheur** ; pro = recherche + filtres + contact.

---

## 5. Module « annonces de recherche » (pro)

- **Statut** : backlog — ne bloque pas la V1 de l’arborescence.
- **Pré-requis UX** : emplacement navigation réservé (ex. libellé « Espace pro » → sous-page « Annonces » une fois le module livré).
- **Question ouverte équipe** : un compte pro peut-il publier sans validation modération ? Impact sur le sitemap admin (file d’attente).

---

## 6. Points à valider en réunion (checklist)

- [ ] Séparation URL admin confirmée.
- [ ] Règle « pro et veille » : oui / non / partielle.
- [ ] Module annonces : V2 ou plus ; libellé navigation provisoire masqué ou « Bientôt ».
- [ ] Modération publications : nécessaire dès V1 ? (impact fil admin)

---

*Document aligné sur le plan Lab Horizon UX et sur Lab-Horizon_Q-R_Concepteur-UX.txt.*
