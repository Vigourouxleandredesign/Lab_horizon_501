# Plan de maintenance

Gestes à faire pour ne pas casser le dépôt. L’objectif de chaque contrôle, pour un évaluateur, est dans [06 — Contrôles qualité](./06-controles-qualite.md). Le détail technique est dans [docs/TESTING.md](../TESTING.md). Le démarrage pas à pas est dans [02 — Lancer et relancer](./02-lancer-et-relancer.md).

## Après un changement de code

Rien à lancer à la main : les contrôles tournent au commit. Une seule condition, une fois par clone, à la racine :

```powershell
npm install
```

Cette commande installe les hooks Git. Ensuite :

- `git commit` lance les contrôles liés aux fichiers modifiés (front, back, dépendances, secrets). Prettier remet en forme le front et re-stage les fichiers tout seul. Si un contrôle est rouge, le commit n’est pas créé : corriger, puis recommiter.
- `git push` relance l’audit des dépendances.
- La pull request rejoue tout sur GitHub, plus les images Docker de prod. On ne merge sur `main` qu’avec une CI verte.

Ne jamais contourner un hook (`--no-verify`). La CI rejouera le même contrôle et bloquera le merge.

Pour tout vérifier d’un coup sans commiter : `npm run gate` (sans Docker), `npm run gate:full` (pile Docker allumée), `npm run gate:security` (secrets et dépendances).

Un contrôle rouge se corrige dans le code. Modifier un test, une règle ESLint, un seuil d’audit ou la config d’un scanner pour faire passer un rouge au vert est interdit sans accord explicite, écrit dans la pull request.

## Mettre à jour une dépendance

Dependabot ouvre chaque lundi des pull requests vers `develop` (npm, Composer, actions GitHub, images Docker). Les relire et les merger si la CI est verte. Une faille publiée sur une dépendance déjà installée fait passer la CI au rouge, même sans nouveau commit : la CI tourne aussi chaque nuit.

Si aucune version corrigée n’existe en amont, forcer la sous-dépendance corrigée (`overrides` dans `package.json`) et vérifier que le résultat ne change pas. Exemple déjà en place : `postcss-selector-parser` sous Tailwind 3 côté Blade, CSS produit identique à l’octet.

## Calendrier des fins de support

Une brique sans correctif de sécurité doit être remplacée avant sa date de fin. PHP et Laravel n’ont pas de version « longue durée » : une montée de version par an garde le projet maintenu. Dates relevées sur endoflife.date en octobre 2026.

| Brique | Version | Fin du support de sécurité | Prochaine action |
|--------|---------|----------------------------|------------------|
| PHP (image du back, CI) | 8.4 | 31/12/2028 | Passer en 8.5 courant 2028 |
| Laravel | 13 | 17/03/2028 | Laravel 14 courant 2027 |
| PHPUnit | 12 (avec Laravel 13) | Suit la version de Laravel | Avec Laravel |
| Node.js (build des images, `.nvmrc`) | 22 LTS | 30/04/2027 | Passer en 26 LTS (jusqu’au 30/04/2029) |
| MySQL | 8.4 LTS | 30/04/2032 | Ne pas changer de version majeure sans sauvegarde et test de restauration |
| Redis | 7.4 | 01/12/2029 | — |
| nginx (image du front) | 1.30, branche stable | Remplacée chaque année par la stable suivante | Monter vers la stable suivante au printemps |
| Alpine (base des images) | 3.24 | 01/06/2028 | Suit les images officielles |

À vérifier au moins une fois par an sur https://endoflife.date. La CI signale déjà chaque nuit toute faille connue dans les dépendances et les images : une exécution nocturne rouge sans nouveau commit signifie qu’une faille a été publiée, pas que quelqu’un a cassé le projet.

Les pull requests Dependabot arrivent chaque lundi sur `develop`. Ne jamais fusionner une version majeure de MySQL ou de PHP sans l’avoir testée sur une copie des données.

## Réglages GitHub à reproduire

Une partie de la protection n’est pas dans le dépôt : ce sont des réglages du dépôt GitHub. Un fork, un transfert ou un nouveau dépôt ne les copie pas. Sans eux, la CI tourne mais ne bloque plus rien, et un secret peut être poussé.

| Réglage | Où (Settings) | Valeur |
|---------|---------------|--------|
| Protection de `main` | Branches → règle sur `main` | Pull request obligatoire ; contrôles requis : `Front — qualité & tests`, `Back — tests`, `Sécurité — secrets & dépendances`, `Docker — images, config & smoke prod`, `Dépendances — revue de PR` ; branche à jour avant merge ; appliquer aux administrateurs ; force-push et suppression interdits ; conversations résolues |
| Secret scanning et push protection | Code security | Activés |
| Alertes Dependabot et mises à jour de sécurité | Code security | Activées (active aussi le graphe de dépendances, requis par la revue de PR) |

Les contrôles requis n’apparaissent dans la liste qu’après un premier passage de la CI sur le nouveau dépôt. Vérification : un `git push` direct sur `main` doit être refusé (`GH006 Protected branch update failed`).

## Mettre un vrai certificat

Sans domaine, le certificat auto-signé suffit (voir [02 — Lancer et relancer](./02-lancer-et-relancer.md)). Avec un domaine :

1. Obtenir `tls.crt` (chaîne complète) et `tls.key` pour ce domaine, par exemple avec Let’s Encrypt.
2. Les déposer dans le volume `labhorizon_frontend-certs`, ou monter un dossier du serveur sur `/etc/nginx/certs` à la place du volume. Le conteneur les utilise tels quels et ne génère plus rien.
3. `sh scripts/deploy/init-env.sh https://<domaine>` (Windows : `init-env.ps1`) règle l’adresse, les ports 80/443, Sanctum et CORS. Puis `HSTS_MAX_AGE=31536000` dans `.env`.
4. `docker compose up -d --build`.

HSTS reste à 0 tant que le certificat n’est pas reconnu : il oblige le navigateur à refuser le HTTP pour ce nom pendant un an.

## Revue de sécurité

Le protocole n’est pas versionné. Sur la machine où il a été installé, il est dans `.cursor/skills/revue-securite-preprod/`. Avant de s’en servir, vérifier qu’il est encore fiable :

```powershell
python .cursor/skills/revue-securite-preprod/tests/test_recon.py
```

Un échec interdit de lancer la revue. La revue elle-même ne démarre que lorsque le responsable recopie la phrase exacte de `templates/charte-engagement.md`, avec l’identifiant de charte et le hash du commit. Un « ok » ne suffit pas.

## Après un git pull

```
sh scripts/deploy/backup.sh          # Windows : scripts\deploy\backup.ps1
git pull
docker compose up -d --build
```

Les images ne relisent pas le dépôt : sans `--build`, le site reste l’ancienne version. Les migrations de base s’appliquent seules au démarrage, d’où la sauvegarde juste avant.

## Sauvegarder et restaurer

Une sauvegarde est une archive unique `backups/labhorizon-AAAAMMJJ-HHMMSS.tar.gz` : la base MySQL complète et les fichiers uploadés (PDF). La stack doit être démarrée. Aucun mot de passe n’est tapé : le script utilise ceux des conteneurs.

| Action | Linux | Windows (PowerShell) |
|--------|-------|----------------------|
| Sauvegarder | `sh scripts/deploy/backup.sh` | `powershell -ExecutionPolicy Bypass -File scripts\deploy\backup.ps1` |
| Restaurer | `sh scripts/deploy/restore.sh backups/labhorizon-<date>.tar.gz` | `powershell -ExecutionPolicy Bypass -File scripts\deploy\restore.ps1 backups\labhorizon-<date>.tar.gz` |

- Les 14 dernières sauvegardes sont gardées (`BACKUP_KEEP=30` sous Linux, `-Keep 30` sous Windows pour changer).
- La restauration **remplace** la base par celle de l’archive et demande de taper `OUI` (`--yes` / `-Yes` pour l’automatiser). Les fichiers uploadés de l’archive sont remis en place ; ceux ajoutés depuis restent. Le back redémarre à la fin : le mot de passe du compte de démo redevient celui du `.env` actuel, et les migrations s’appliquent si l’archive vient d’une version plus ancienne.
- `backups/` est hors Git. Les archives contiennent les comptes (hash des mots de passe) : les copier hors de la machine (disque externe, autre serveur), jamais dans un dépôt.
- Changer de serveur : sauvegarder, copier l’archive, déployer sur le nouveau serveur (chapitre 02), restaurer.

Planifier une sauvegarde chaque nuit :

| Système | Commande, à adapter au chemin du clone |
|---------|----------------------------------------|
| Linux (`crontab -e`) | `0 2 * * * cd /opt/Lab_horizon_501 && sh scripts/deploy/backup.sh >> backups/sauvegarde.log 2>&1` |
| Windows | `schtasks /Create /TN "LabHorizon-Sauvegarde" /SC DAILY /ST 02:00 /TR "powershell -NoProfile -ExecutionPolicy Bypass -File C:\LabHorizon\scripts\deploy\backup.ps1"` — tourne quand la session qui l’a créée est ouverte, comme Docker Desktop |

Tester une restauration de temps en temps : une sauvegarde jamais restaurée n’est pas une sauvegarde.

## Ajouter un domaine

Quatre endroits doivent rester alignés. `npm run check:domains` échoue si l’un manque.

| Étape | Fichier |
|-------|---------|
| Slug et libellés FR/EN | `frontend/src/data/categories.ts` |
| Textes de page | `frontend/src/i18n/domains.ts` |
| Pastille et couple héro (fond + calque) | `frontend/src/assets/figmaHomeAssets.ts` et fichiers dans `frontend/public/pillules/` et `frontend/public/hero/` |
| Libellé envoyé à l’API, identique à la colonne `domaines.label` | `frontend/src/lib/categoryFilter.ts` |
| Ligne en base | `backend/database/seeders/DomainesSeeder.php` |

Les images de calque (zindex 1) sont en WebP avec couche alpha. Ne pas les réenregistrer en JPEG.

## Données et secrets

- Ne pas committer `.env`. Le modèle est `.env.docker.example`. Le hook refuse un `.env`, une clé ou un certificat, et GitHub refuse le push d’un secret connu.
- Garder une copie du `.env` hors du serveur, à part des sauvegardes. Sans lui, la base existante n’est plus accessible ; une sauvegarde se restaure en revanche sur une installation neuve.
- Le certificat TLS et sa clé vivent dans le volume `labhorizon_frontend-certs`, jamais dans le dépôt.
- `APP_KEY` ne se change pas après la mise en service : la changer déconnecte tous les utilisateurs.
- Ne pas passer `SESSION_SECURE_COOKIE=false` en production : les cookies de session partiraient en clair.
- `docker compose down` garde MySQL, les PDF uploadés et la config LM Studio. `docker compose down -v` les efface. Ne pas utiliser `-v` sur une base à conserver, et sauvegarder avant.
- Le compte de démonstration `test@labhorizon.nc` est créé par le seed avec un mot de passe public (`password`), puis remplacé à chaque démarrage par `APP_BOOT_PASSWORD` (`.env`). C’est ce mot de passe qui sert à se connecter.
- La vulgarisation IA reste coupée (`LLM_ENABLED=false`) tant qu’un modèle n’est pas chargé. La passer à `true` sans modèle fait échouer la génération.
