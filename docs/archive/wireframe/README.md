# Lab Horizon — Wireframe HTML (SAE 501)

Prototype navigable aligné sur [docs/ux](../docs/ux/README.md) (zones A/B/C/D, parcours visiteur / chercheur / recherche).

## Visualiser

- Ouvrez `index.html` dans un navigateur (double-clic ou **Live Server** dans l’éditeur).
- Ou en ligne de commande, depuis ce dossier : `npx --yes serve .` puis ouvrez l’URL affichée.

## Tokens (source unique)

Toutes les couleurs et variables globales sont dans **`tokens.css`** (préfixe `--lh-*` pour la charte, alias `--color-*` pour la compatibilité du wireframe). Ne modifier que ce fichier pour ajuster la palette ou les rayons / ombres.

## Figma

Lien maquette : [Maquette SAE 501](https://www.figma.com/design/LmhmIU3tKxLy7J201nstnN/Maquette-SAE-501?node-id=1-247). Ajuster `:root` si la maquette diverge.

## Fichiers

| Fichier | Rôle |
|---------|------|
| `index.html` | Structure : accueil, recherche, publication, profil, dashboard + chatbot FAB |
| `styles.css` | Mise en page responsive, étiquettes de zones wireframe |
| `app.js` | Navigation SPA légère, FR/EN, carrousel, panneau assistant |

## Raccourcis wireframe

- **Êtes-vous chercheur ?** → espace tableau de bord (démo).
- **Rechercher** / **Filtres avancés** → écran recherche avec rail filtres.
- Navigation header : bascule entre les vues.
- **FR | EN** : libellés interface (contenu fictif inchangé).
