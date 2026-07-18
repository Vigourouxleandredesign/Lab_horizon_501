# Lab Horizon — Dictionnaire de données (proposition V1)

Document de travail à corriger selon les choix produit et techniques. Aligné sur `docs/ux`. Les points non tranchés dans ces docs sont signalés **(à valider)**.

**Hiérarchie documentaire (cf. `docs/cahier_des_charges_v2.md`) :** ce dictionnaire est la **référence prioritaire** pour le modèle de données ; les UX décrivent écrans et parcours. **Périmètre V1 :** les entités **messagerie** (`message_thread`, `message`, et dérivés) sont **reportées** — elles restent dans ce document pour **évolution** mais **ne sont pas livrées** dans la première version.

---

## Conventions générales

| Convention | Détail |
|------------|--------|
| **PK** | Identifiant technique opaque (UUID ou équivalent). |
| **FK** | Référence vers une autre entité. |
| **i18n** | Libellés d’interface en clés FR/EN côté front ; ce dictionnaire ne duplique pas tous les libellés UI. |
| **Horodatage** | Prévoir `createdAt` / `updatedAt` sur les entités métier si passage en relationnel. |

---

## Entités et attributs

### `user` — compte utilisateur

| Attribut | Type suggéré | Obligatoire | Description / origine UX |
|----------|----------------|-------------|---------------------------|
| `id` | PK | Oui | |
| `email` | string | Selon auth | Connexion / inscription. |
| `passwordHash` | string | Selon auth | Si mot de passe en base ; sinon via fournisseur OIDC. **(à valider)** |
| `role` | enum | Oui | Ex. `RESEARCHER`, `PRO`, `ADMIN_APP` — matrice visiteur/chercheur/pro/admin. |
| `emailVerifiedAt` | datetime | Non | Si tu gères la vérification. **(à valider)** |
| `locale` | enum | Non | Préférence FR/EN persistée si compte. |
| `createdAt` / `updatedAt` | datetime | Recommandé | |

---

### `researcher_profile` — profil chercheur (vue publique + édition)

| Attribut | Type | Obligatoire | Description / origine UX |
|----------|------|-------------|---------------------------|
| `id` | PK | Oui | Peut être 1–1 avec `user` si tout chercheur = un user. |
| `userId` | FK → `user` | Oui | |
| `displayName` | string | Oui | Nom sur fiche publique. |
| `photoUrl` | string | Non | Avatar. |
| `institution` | string | Non | Institution · filtres recherche « institution ». |
| `keywords` | string[] ou text | Non | Mots-clés / domaines. |
| `availabilityVisible` | boolean | Oui | Opt-in affichage « disponibilité ». |
| `availabilityStatus` | enum ou text | Non | Valeur affichée seulement si `availabilityVisible` **(granularité à valider)**. |
| `publicFields` | JSON | Non | Si tu masques certains champs au public. **(à valider)** |
| `createdAt` / `updatedAt` | datetime | Recommandé | |

**Relations implicites** : publications dont l’auteur est ce chercheur ; abonnés en veille ; *(messagerie — hors implémentation V1)* threads en tant que destinataire/expéditeur.

---

### `category` — catégorie (taxonomie)

| Attribut | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `id` | PK | Oui | |
| `slug` | string | Oui | Route `/categories/:slug`. |
| `labelFr` / `labelEn` | string | Selon stratégie | Carrousel / filtres ; i18n V1. Alternative : uniquement `slug` + traduction UI. **(à valider)** |
| `sortOrder` | int | Non | Ordre carrousel accueil. |
| `parentId` | FK → `category` | Non | Hiérarchie si besoin futur ; **non exigé** dans les UX de référence. |

---

### `publication` — publication « papier »

| Attribut | Type | Obligatoire | Description / origine UX |
|----------|------|-------------|---------------------------|
| `id` | PK | Oui | |
| `authorResearcherId` | FK → `researcher_profile` | Oui | Lien profil / CTA « voir le profil ». Multi-auteurs HAL **(à valider)** : second tableau `publication_author` si besoin. |
| `categoryId` | FK → `category` | Non | Filtre catégorie + fil d’Ariane. Multi-catégories **(à valider)** → table de liaison. |
| `title` | string | Oui | Titre affiché (vulgarisation ou titre court). |
| `slug` | string | Non | Si URLs SEO ; sinon id seul. **(à valider)** |
| `body` | text | Oui | Corps vulgarisé. |
| `lead` | text | Non | Chapô optionnel. |
| `status` | enum | Oui | `DRAFT`, `PENDING_AI_VALIDATION`, `PUBLISHED`. |

**Méta grille Quoi / Qui / Quand / Lab** (voir `docs/ux/03-metadata-grid-publication.md`)

| Attribut | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `metaTitle` | string | Non | Quoi — titre scientifique / revue. |
| `metaAuthors` | string | Non | Qui — auteur(s) texte ou structuré. |
| `metaPublishedAt` | date | Non | Quand — date publication source. |
| `metaLab` | string | Non | Lab / organisme. |
| `sourceSystem` | string | Non | ex. HAL / revue **(à valider)**. |
| `externalId` | string | Non | ID source HAL etc. **(à valider)** |
| `aiProposedBody` | text | Non | Proposition IA avant validation. |
| `publishedAt` | datetime | Non | Mise en ligne effective. |
| `createdAt` / `updatedAt` | datetime | Recommandé | |

---

### `watch_subscription` — veille (suivi de chercheurs)

| Attribut | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `id` | PK | Oui | |
<!-- | `subscriberUserId` | FK → `user` | Oui | Compte qui suit (chercheur prioritaire UX ; pro **à trancher**). | -->
| `followedResearcherId` | FK → `researcher_profile` | Oui | Chercheur suivi. |
| `createdAt` | datetime | Oui | |

Contrainte d’unicité suggérée : `(subscriberUserId, followedResearcherId)`.

---

### `notification_preferences` — préférences alertes / push

| Attribut | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `userId` | FK → `user` | Oui | Paramètres compte. |
| `pushEnabled` | boolean | Oui | Opt-in global. |
| `notifyOnFollowedPublication` | boolean | Non | Aligné copie « chercheurs que vous suivez ». |
| `notifyOnMessage` | boolean | Non | Type messagerie **à cadrer**. |
| `updatedAt` | datetime | Recommandé | |

**Abonnements techniques push** (navigateur) : souvent entité séparée `push_subscription` (`userId`, `endpoint`, clés web-push, `createdAt`) — **(à valider)** selon stack.

---

### `message_thread` — fil de conversation

**Statut périmètre :** hors implémentation **V1** (pas de messagerie directe — cf. CDC v2).

| Attribut | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `id` | PK | Oui | |
| `participantUserIds` | deux FK ou table `thread_participant` | Oui | Messagerie in-app. |
| `lastMessageAt` | datetime | Non | Tri liste threads. |
| `createdAt` | datetime | Oui | |

Modèle relationnel typique : `thread_participant(threadId, userId)` avec contrainte d’unicité par paire si conversation 1–1.

---

### `message` — message

**Statut périmètre :** hors implémentation **V1** (cf. CDC v2).

| Attribut | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `id` | PK | Oui | |
| `threadId` | FK | Oui | |
| `senderUserId` | FK → `user` | Oui | |
| `body` | text | Oui | Pas d’email/tél dans l’UI. |
| `sentAt` | datetime | Oui | Horodatage / locale. |
| `readAt` | datetime | Non | Si accusé de lecture **(non exigé UX)**. |

État « destinataire indisponible » peut être un champ sur `researcher_profile` ou `user` **(à valider)**.

---

### `admin_audit_log` — journal admin (minimal UX)

| Attribut | Type | Obligatoire | Description |
|----------|------|-------------|-------------|
| `id` | PK | Oui | |
| `actorUserId` | FK | Oui | Admin. |
| `action` | string | Oui | Verbe métier ou code. |
| `entityType` | string | Oui | ex. `publication`, `user`. |
| `entityId` | string | Non | |
| `metadata` | JSON | Non | Détail technique. |
| `createdAt` | datetime | Oui | Écran `/journaux` admin. |

---

### Backlog — `research_job_posting` (annonces pro)

À définir lorsque le périmètre sera figé — module `/compte/pro/annonces` (backlog).

---

### Hors modèle métier obligatoire dans les UX de référence

| Sujet | Note |
|--------|------|
| **Chatbot** | Flux UX sans persistance détaillée ; prévoir au besoin `chat_session` / `chat_message` plus tard. |
| **Installation PWA** | Peut rester en `localStorage` ; pas d’entité obligatoire dans les UX. |
| **Pages légales / À propos** | Contenu souvent statique ou CMS séparé. |

---

## Relations (résumé pour schéma / MCD)

```
user 1 — 1 researcher_profile        (si rôle chercheur)
user 1 — * watch_subscription        (subscriber)
researcher_profile 1 — * publication (author)
category 1 — * publication           (si mono-cat ; sinon n-n)
user * — * message_thread            (via participants)   ← V1 : non implémenté
message_thread 1 — * message                              ← V1 : non implémenté
user 1 — 1 notification_preferences  (optionnel fusion avec user)
```

---

## Références

- `docs/ux/README.md`
- Entités dérivées des écrans et flux décrits dans `docs/ux/01` à `06`.

---

*Document de proposition — à corriger avant implémentation schéma.*
