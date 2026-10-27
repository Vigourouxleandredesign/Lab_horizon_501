# Lancer et relancer

Deux usages. **Déployer** le site (DSI, serveur ou PC de test) ne demande que Docker et Git. **Développer** demande en plus Node.js 22 : voir la dernière partie.

## Prérequis pour déployer

| Système | À installer | Remarque |
|---------|-------------|----------|
| Linux (recommandé pour un serveur) | Docker Engine 24 ou plus, avec le plugin Compose **2.24 ou plus** ; Git | Utilisateur dans le groupe `docker`, ou commandes précédées de `sudo` |
| Windows 10 ou 11 | Docker Desktop (moteur WSL 2) ; Git for Windows | Redémarrage automatique : voir « Redémarrage de la machine » |

Machine : 2 cœurs, 4 Go de RAM (environ 1,5 Go utilisés en pic), 10 Go de disque libre. Processeur Intel/AMD ou ARM 64 bits (Raspberry Pi 4/5 en OS 64 bits). Ports libres : 8080 et 8443, ou 80 et 443 sur un serveur.

Vérifier la version de Compose avant de commencer :

```
docker compose version
```

## Déployer en quatre étapes

### 1. Récupérer le code

```
git clone https://github.com/Vigourouxleandredesign/Lab_horizon_501.git
cd Lab_horizon_501
```

### 2. Créer le fichier `.env`

Le script copie `.env.docker.example` vers `.env` et génère les quatre secrets obligatoires. Il ne remplace jamais un secret déjà présent.

Linux :

```bash
sh scripts/deploy/init-env.sh
```

Windows (PowerShell) :

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy\init-env.ps1
```

Sans argument, le site sera sur `https://localhost:8443`. Pour un serveur, passer l’adresse que les visiteurs taperont : le script règle `APP_URL`, les ports 80/443, `SANCTUM_STATEFUL_DOMAINS`, `CORS_ALLOWED_ORIGINS` et le certificat.

```
sh scripts/deploy/init-env.sh https://192.168.1.20
sh scripts/deploy/init-env.sh https://labhorizon.exemple.nc
```

Le script affiche à la fin le **mot de passe du compte de démonstration** `test@labhorizon.nc`. Il reste lisible dans `.env` (`APP_BOOT_PASSWORD`).

### 3. Démarrer

```
docker compose up -d --build
```

Le premier build prend 5 à 10 minutes (plus sur une machine modeste). Le premier démarrage prend environ une minute : création des tables, catalogue de démonstration et compte test.

### 4. Vérifier

```
docker compose ps
```

Les quatre services (`frontend`, `backend`, `mysql`, `redis`) doivent être `healthy`. Puis :

| Système | Commande | Réponse attendue |
|---------|----------|------------------|
| Linux | `curl -k https://localhost:8443/up` | page « Application up » |
| Windows | `curl.exe -k https://localhost:8443/up` | page « Application up » |

Ouvrir l’adresse du site dans un navigateur, accepter l’alerte du certificat (voir HTTPS), puis se connecter avec `test@labhorizon.nc` et le mot de passe affiché à l’étape 2.

## Adresses

| Adresse | Service |
|---------|---------|
| https://localhost:8443 | Site (entrée unique). `http://localhost:8080` y redirige |
| http://localhost:8081 | API Laravel directe, dépannage — joignable depuis la machine seulement |
| localhost:3307 | MySQL (utilisateur et mot de passe du `.env`) — machine seulement |
| http://localhost:3001 | Bureau LM Studio, seulement si le profil `llm` est lancé — machine seulement |

## Le fichier `.env`

| Variable | Rôle | À savoir |
|----------|------|----------|
| `APP_KEY` | Clé de chiffrement des sessions | Générée une fois. La changer déconnecte tout le monde |
| `DB_PASSWORD`, `DB_ROOT_PASSWORD` | Mots de passe MySQL | Fixés à la création de la base : les changer ensuite ne change pas la base |
| `APP_BOOT_PASSWORD` | Mot de passe de `test@labhorizon.nc` | Réappliqué à chaque démarrage. Pour le changer : modifier `.env`, puis `docker compose up -d` |
| `APP_URL`, `HTTP_PORT`, `HTTPS_PORT` | Adresse et ports du site | Réglés par `init-env` |
| `SANCTUM_STATEFUL_DOMAINS`, `CORS_ALLOWED_ORIGINS` | Adresses autorisées à se connecter | Mêmes valeurs que `APP_URL` |
| `TLS_SAN`, `HSTS_MAX_AGE` | Certificat HTTPS | Voir HTTPS |

Si un secret manque, `docker compose` refuse de démarrer et nomme la variable : relancer `init-env`.

Changer d’adresse plus tard (passage sur l’IP du serveur, puis sur un domaine) : relancer `init-env` avec la nouvelle adresse, régénérer le certificat (section HTTPS), puis `docker compose up -d`. Aucune reconstruction n’est nécessaire : le site appelle l’API sur l’adresse de la page.

## HTTPS

Le site n’est servi qu’en HTTPS, même sans nom de domaine. Le Nginx du front porte le certificat ; le HTTP ne fait que rediriger. Les cookies de session sont marqués `Secure` et `HttpOnly` : le navigateur ne les envoie jamais en clair.

Sans certificat fourni, le conteneur en génère un auto-signé au premier démarrage et le garde dans le volume `labhorizon_frontend-certs`. Le navigateur affiche une alerte « connexion non privée » : c’est attendu, l’accepter une fois. Le chiffrement est réel, seule l’identité du serveur n’est pas garantie par une autorité.

Le certificat contient `localhost`, `127.0.0.1` et l’adresse passée à `init-env` (`TLS_SAN`). Si l’adresse change après le premier démarrage, le régénérer :

```
docker compose down
docker volume rm labhorizon_frontend-certs
docker compose up -d
```

Le jour où un nom de domaine existe, voir « Mettre un vrai certificat » dans [04 — Plan de maintenance](./04-plan-maintenance.md).

## Redémarrage de la machine

Les conteneurs sont en `restart: unless-stopped` : ils repartent seuls si Docker repart.

| Système | À faire une fois |
|---------|------------------|
| Linux | `sudo systemctl enable docker` |
| Windows | Docker Desktop → Settings → General → « Start Docker Desktop when you sign in », et une session Windows ouverte automatiquement. Sans session ouverte, Docker Desktop ne démarre pas : le site reste arrêté après une mise à jour Windows. Pour un serveur, préférer Linux |

## Mettre à jour après un git pull

```
sh scripts/deploy/backup.sh          # Windows : scripts\deploy\backup.ps1
git pull
docker compose up -d --build
```

Les migrations de base s’appliquent seules au démarrage : d’où la sauvegarde juste avant. Détail et restauration : [04 — Plan de maintenance](./04-plan-maintenance.md).

## Arrêter et reprendre

```
docker compose stop          # garde les volumes (base, PDF uploadés, certificat, config LM)
docker compose start         # reprend les mêmes données
docker compose down          # retire les conteneurs, garde les volumes
docker compose down -v       # EFFACE aussi MySQL, Redis, PDF, certificat et LM Studio
```

`down -v` efface les données. Sauvegarder avant, et ne jamais l’utiliser sur une base que l’on veut garder.

## Reprendre une installation antérieure

Avant novembre 2026, le projet Compose portait le nom du dossier du clone (par exemple `projetsae501`) ; il s’appelle maintenant `labhorizon`. Les anciens volumes ne sont pas repris automatiquement, et les anciens conteneurs bloquent le démarrage (« container name already in use »). Pour garder les données :

Linux :

```bash
sh scripts/deploy/init-env.sh                                  # complète l'ancien .env (APP_KEY…)
COMPOSE_PROJECT_NAME=projetsae501 sh scripts/deploy/backup.sh  # sauvegarde l'ancienne base
docker compose -p projetsae501 down                            # arrête l'ancienne installation
docker compose up -d --build
sh scripts/deploy/restore.sh backups/labhorizon-<date>.tar.gz
```

Windows (PowerShell) :

```powershell
powershell -ExecutionPolicy Bypass -File scripts\deploy\init-env.ps1
$env:COMPOSE_PROJECT_NAME = 'projetsae501'; powershell -ExecutionPolicy Bypass -File scripts\deploy\backup.ps1; Remove-Item Env:COMPOSE_PROJECT_NAME
docker compose -p projetsae501 down
docker compose up -d --build
powershell -ExecutionPolicy Bypass -File scripts\deploy\restore.ps1 backups\labhorizon-<date>.tar.gz
```

Remplacer `projetsae501` par le nom du dossier de l’ancien clone, en minuscules. `docker compose ls` liste les projets présents.

## Sans le modèle d’IA

C’est le mode par défaut (`LLM_ENABLED=false`). Le catalogue, la connexion et l’espace chercheur fonctionnent. La génération de vulgarisation répond qu’elle n’est pas disponible.

## Avec LM Studio

Image lourde (plusieurs Go), profil séparé :

```
docker compose --profile llm up -d lm-studio
docker compose exec lm-studio lms get mistral-7b-instruct-v0.3
docker compose exec lm-studio lms load mistral-7b-instruct-v0.3
```

Puis dans `.env` : `LLM_ENABLED=true`. Le nom chargé doit être le même que `LLM_MODEL`. L’UI noVNC est sur http://localhost:3001, joignable depuis la machine seulement : l’API et le bureau LM Studio n’ont pas d’authentification. Le volume `labhorizon_lmstudio-config` conserve le modèle après un `down` sans `-v`.

## Développer

Prérequis en plus de Docker : Node.js 22. PHP et Composer ne sont pas obligatoires : les contrôles du back passent par un conteneur si PHP est absent.

```
npm install
```

À la racine, `npm install` installe les hooks Git : les contrôles qualité et sécurité tournent ensuite à chaque commit (voir [04 — Plan de maintenance](./04-plan-maintenance.md)).

Front seul, sans Docker : laisser `VITE_DATA_SOURCE=mock`, ou pointer `frontend/.env.development` vers la stack Docker (`VITE_API_BASE_URL=https://localhost:8443`, certificat accepté une fois dans le navigateur).

```
cd frontend
npm install
npm run dev
```

Le site Vite est sur http://localhost:5173.

Tout vérifier d’un coup : `npm run gate` (sans Docker : types, lint, secrets, couleurs, domaines, tests unitaires, build), ou `npm run gate:full` avec la pile Docker allumée (ajoute PHPUnit, les fumées API et l’audit des dépendances). Tout doit être vert : un échec est une régression à corriger. La CI GitHub rejoue ces contrôles sur les images de prod à chaque pull request.

## Dépannage court

| Symptôme | Cause fréquente | Action |
|----------|-----------------|--------|
| `required variable … is missing a value` au démarrage | `.env` absent ou incomplet | Lancer `init-env` (étape 2) |
| Connexion refusée avec `password` | Le mot de passe du compte de démo est `APP_BOOT_PASSWORD` | Lire `APP_BOOT_PASSWORD` dans `.env` |
| `container name … is already in use` | Ancienne installation encore présente | Section « Reprendre une installation antérieure » |
| Site arrêté après un redémarrage Windows | Docker Desktop ne démarre qu’à l’ouverture de session | Section « Redémarrage de la machine » |
| Page ancienne après un pull | Images non reconstruites | `docker compose up -d --build` |
| Login impossible depuis un autre appareil | Adresse absente de `SANCTUM_STATEFUL_DOMAINS` / `CORS_ALLOWED_ORIGINS`, ou isolation Wi-Fi | Relancer `init-env` avec l’adresse utilisée |
| Alerte « connexion non privée » | Certificat auto-signé | Attendu sans domaine : accepter l’alerte une fois |
| Alerte persistante via l’IP du serveur | IP absente du certificat | Relancer `init-env` avec l’IP, régénérer le certificat (section HTTPS) |
| Le compte de démo est déconnecté après chaque redémarrage | Son mot de passe est réécrit au démarrage (limite connue, côté back) | Se reconnecter. Les autres comptes restent connectés |
| `backend` redémarre en boucle après avoir vidé le catalogue | Le seed se relance sur une base sans publication et échoue sur le compte existant (limite connue, côté back) | Restaurer la dernière sauvegarde |
| MySQL « port already allocated » | Un MySQL Windows tient le 3306 | Le compose publie déjà **3307** |
| Vulgarisation en erreur | `LLM_ENABLED=true` sans modèle chargé | Charger le modèle, ou repasser `LLM_ENABLED=false` |
| Domaine Physique vide | Le front l’affiche, le seeder ne l’insère pas | Attendu tant que `0.phys` n’est pas ajouté côté back |
