# Lancer et relancer

Prérequis : Docker Desktop, Git, Node.js 22. PHP et Composer ne sont nécessaires que pour lancer le back **sans** Docker : les contrôles du back passent par un conteneur si PHP est absent.

## Premier démarrage

À la racine du dépôt :

```powershell
npm install
copy .env.docker.example .env
docker compose up -d --build
```

`npm install` à la racine installe les hooks Git : les contrôles qualité et sécurité tournent ensuite à chaque commit (voir [04 — Plan de maintenance](./04-plan-maintenance.md)).

Le premier `up` migre la base et exécute les seeders (`RUN_MIGRATIONS` et `RUN_SEED` sont à `true` dans Compose).

| Adresse | Service |
|---------|---------|
| https://localhost:8443 | Site (entrée unique). `http://localhost:8080` y redirige |
| http://localhost:8081 | API Laravel directe, dépannage |
| localhost:3307 | MySQL (utilisateur et mot de passe du `.env`) |
| http://localhost:3001 | Bureau LM Studio, seulement si le profil `llm` est lancé |

Compte seed : `test@labhorizon.nc` / `password`.

`APP_KEY` peut rester vide au premier démarrage : le conteneur la génère. Pour la conserver d’un volume à l’autre :

```powershell
docker compose exec backend php artisan key:generate --show
```

Coller la valeur dans `.env`, puis `docker compose up -d`.

## HTTPS

Le site n’est servi qu’en HTTPS, même sans nom de domaine. Le Nginx du front porte le certificat ; le HTTP ne fait que rediriger. Les cookies de session sont marqués `Secure` et `HttpOnly` : le navigateur ne les envoie jamais en clair.

Sans certificat fourni, le conteneur en génère un auto-signé au premier démarrage et le garde dans le volume `frontend-certs`. Le navigateur affiche une alerte « connexion non privée » : c’est attendu, l’accepter une fois. Le chiffrement est réel, seule l’identité du serveur n’est pas garantie par une autorité.

Pour joindre le site par l’adresse du serveur (ex. `https://192.168.1.20`), l’ajouter au certificat avant le premier démarrage :

```
TLS_SAN=IP:192.168.1.20
HTTPS_PORT=443
HTTP_PORT=80
APP_URL=https://192.168.1.20
```

Puis reporter cette origine dans `SANCTUM_STATEFUL_DOMAINS` et `CORS_ALLOWED_ORIGINS`. Si le certificat existe déjà, le régénérer : `docker compose down`, `docker volume rm <projet>_frontend-certs`, `docker compose up -d`.

Le jour où un nom de domaine existe, voir « Mettre un vrai certificat » dans [04 — Plan de maintenance](./04-plan-maintenance.md).

## Après un git pull

L’image Nginx du front ne relit pas le dépôt toute seule. Sans reconstruction, l’écran reste l’ancienne version.

```powershell
docker compose up -d --build frontend
```

Si `backend/`, les Dockerfiles ou `docker-compose.yml` ont changé :

```powershell
docker compose up -d --build
```

## Arrêter et reprendre

```powershell
docker compose stop          # garde les volumes (base, PDF uploadés, config LM)
docker compose start         # reprend les mêmes données
docker compose down          # retire les conteneurs, garde les volumes
docker compose down -v       # efface aussi MySQL, Redis, storage et LM Studio
```

`down -v` oblige à re-seeder. Ne pas l’utiliser sur une base que l’on veut garder.

## Sans le modèle d’IA

C’est le mode par défaut (`LLM_ENABLED=false`). Le catalogue, la connexion et l’espace chercheur fonctionnent. La génération de vulgarisation répond qu’elle n’est pas disponible.

## Avec LM Studio

Image lourde, profil séparé :

```powershell
docker compose --profile llm up -d lm-studio
docker compose exec lm-studio lms get mistral-7b-instruct-v0.3
docker compose exec lm-studio lms load mistral-7b-instruct-v0.3
```

Puis dans `.env` : `LLM_ENABLED=true`. Le nom chargé doit être le même que `LLM_MODEL`. L’UI noVNC est sur http://localhost:3001. Le volume `lmstudio-config` conserve le modèle après un `down` sans `-v`.

## Front seul, sans Docker

Utile pour l’UI. L’API n’est pas là : laisser `VITE_DATA_SOURCE=mock`, ou pointer `.env.development` vers un back déjà lancé.

```powershell
cd frontend
npm install
npm run dev
```

Le site Vite est sur http://localhost:5173.

## Vérifier que ça répond

```powershell
npm run gate
```

Ce contrôle ne demande pas Docker (types, lint, secrets, couleurs, domaines, tests unitaires, build).

Avec la pile Docker allumée :

```powershell
npm run gate:full
```

Ajoute les tests PHPUnit, les fumées API recherche + auth et l’audit des dépendances. Tout doit être vert : un échec est une régression à corriger. La CI GitHub rejoue ces contrôles sur les images de prod à chaque pull request.

## Dépannage court

| Symptôme | Cause fréquente | Action |
|----------|-----------------|--------|
| Page ancienne après un pull | Image front non reconstruite | `docker compose up -d --build frontend` |
| Login impossible depuis le téléphone | Isolation des clients Wi-Fi, ou origine CORS absente | Rester sur la machine hôte, ou ajouter l’origine dans `CORS_ALLOWED_ORIGINS` et `SANCTUM_STATEFUL_DOMAINS` |
| Alerte « connexion non privée » | Certificat auto-signé | Attendu sans domaine : accepter l’alerte une fois |
| Alerte persistante via l’IP du serveur | IP absente du certificat | Renseigner `TLS_SAN`, régénérer le certificat (section HTTPS) |
| MySQL « port already allocated » | Un MySQL Windows tient le 3306 | Le compose publie déjà **3307** |
| Vulgarisation en erreur | `LLM_ENABLED=true` sans modèle chargé | Charger le modèle, ou repasser `LLM_ENABLED=false` |
| Domaine Physique vide | Le front l’affiche, le seeder ne l’insère pas | Attendu tant que `0.phys` n’est pas ajouté côté back |
