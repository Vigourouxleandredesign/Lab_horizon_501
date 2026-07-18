# Lab Horizon — PWA : installation et permissions push (moment + copy)

Contrainte produit : **alertes / push indispensables** pour la veille (Q2) ; PWA comme vecteur. Objectif UX : **maximiser l’acceptation** en demandant au **bon moment**, avec une **valeur claire**.

---

## 1. Principes

- Ne **pas** déclencher la demande de notification au **premier chargement** de l’accueil.
- Associer chaque demande à une **action utilisateur** ou à un **contexte** (activation veille, première sauvegar d’abonnement).
- Toujours proposer un chemin **« Plus tard »** / **« Paramètres »** sans culpabiliser.

---

## 2. Installation PWA (Add to Home Screen)

### Moment recommandé

| Déclencheur | Priorité | Notes |
|-------------|----------|--------|
| Après **première connexion** chercheur (ou pro), depuis le **tableau de bord**, si `beforeinstallprompt` disponible | Haute | L’utilisateur a déjà engagé son identité. |
| Alternative : après avoir **activé au moins un abonnement veille** | Haute | Lien motivation « revenir vite ». |
| Jamais en plein milieu d’une **édition de publication** | — | Interruption cognitive. |

### Copy suggéré (FR)

**Titre** : *« Ajoutez Lab Horizon à votre écran d’accueil »*  
**Corps** : *« Ouvrez l’app en un geste et retrouvez votre veille sans passer par le navigateur. »*  
**Primaire** : *« Installer »*  
**Secondaire** : *« Plus tard »*

### Copy suggéré (EN)

**Title** : *« Add Lab Horizon to your home screen »*  
**Body** : *« Open the app in one tap and get back to your watchlist without digging through browser tabs. »*  
**Primary** : *« Install »*  
**Secondary** : *« Not now »*

---

## 3. Permissions notifications push (veille)

### Moment recommandé

1. **Déclencheur principal** : première fois que l’utilisateur clique **« Activer les alertes »** ou **« Me prévenir des nouveautés »** sur l’écran **Veille** (après avoir suivi au moins un chercheur ou confirmé l’intention).
2. **Déclencheur secondaire** : page **Paramètres → Notifications**, pour utilisateurs ayant refusé au navigateur mais souhaitant réessayer (lien vers doc navigateur si besoin).

### Copy pré-permission (modal ou bannière in-app, **avant** le dialogue système)

**FR**  
- Titre : *« Restez informé de votre veille »*  
- Texte : *« Nous vous enverrons une notification lorsque les chercheurs que vous suivez publient du nouveau contenu. Vous pourrez désactiver cela à tout moment dans les paramètres. »*  
- Bouton : *« Autoriser les notifications »* → ouvre ensuite le prompt natif.  
- Annuler : *« Pas maintenant »*

**EN**  
- Title : *« Stay on top of your watchlist »*  
- Body : *« We’ll notify you when researchers you follow publish new content. You can turn this off anytime in settings. »*  
- Button : *« Allow notifications »*  
- Dismiss : *« Not now »*

### Si l’utilisateur refuse le prompt natif

- Message discret (pas bloquant) : *« Vous pouvez activer les notifications plus tard dans Paramètres › Notifications. »* (FR) / équivalent EN.

---

## 4. Fréquence et anti-harcèlement

- **Pas** de re-demande d’installation la même session après « Plus tard ».
- Relance **installation** : au bout de **7 jours** ou après **3 visites** du tableau de bord (paramétrable), **une seule** bannière non modale.
- **Push** : respect préférences (types d’événements : nouvelle publication d’un suivi, mentions messagerie — à cadrer produit).

---

## 5. Accessibilité

- Les bannières ont un **rôle** `dialog` ou `region` avec `aria-labelledby` ; focus piégé si modale.
- Alternative textuelle pour les icônes « installer » / « cloche ».

---

## 6. Checklist recette

- [ ] Aucun prompt notification sur landing visiteur anonyme.
- [ ] Copy pré-permission affiché avant `Notification.requestPermission()` (ou équivalent).
- [ ] Paramètres permettent désactivation claire des push.
- [ ] FR et EN pour tous les libellés ci-dessus (voir [06-i18n-v1-scope.md](./06-i18n-v1-scope.md)).

---

*Aligné sur le plan Lab Horizon UX.*
