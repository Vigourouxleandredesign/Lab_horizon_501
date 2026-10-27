# Testing — mandatory gate (anti-regression + security)

**Status:** Mandatory and **automated** for every contributor, human or AI agent.  
**Stack:** Prettier · ESLint · TypeScript · Vite build · Node contract scripts · Vitest (unit) · Laravel PHPUnit · secretlint + gitleaks · npm/Composer audit · Trivy (images + config) · actionlint · API smoke on the production Docker stack · Playwright E2E *(phased)*

Related: [`llm-pre-commit-gate.md`](./llm-pre-commit-gate.md) *(alias / historique)* · [`front-back-status-v1.md`](./front-back-status-v1.md) · [`tests-parcours-public-rest.md`](./tests-parcours-public-rest.md) · [`api-contract-v1.md`](./api-contract-v1.md)

---

## Gate rule (non-negotiable)

The gate is no longer something a person or an LLM has to remember to run. It runs on machines, gives the same result twice for the same input, and blocks:

1. **`git commit`** → pre-commit hook (lefthook) runs the suites matching the staged files. Red = no commit.
2. **`git push`** → pre-push hook runs the dependency audit (advisories change daily).
3. **Push / pull request** → GitHub Actions replays everything on a clean machine, plus the Docker production checks.
4. **Merge on `main`** (= production) → only through a pull request whose CI is green. `main` is protected, admins included.

A red gate is fixed **in the code, the dependencies or the test environment** — never by weakening a test, lowering a threshold or silencing a rule (see *Security policy*).

New feature / bugfix in the same PR **must** add or update ≥ 1 relevant test (E7).

---

## Setup (once per clone)

```powershell
npm install          # root: installs lefthook + secretlint and the Git hooks ("prepare")
npm ci --prefix frontend
```

PHP is optional on the machine: backend checks use local PHP 8.2+ if present, otherwise a `composer:2.9` container (`scripts/ci/php.mjs`, Docker Desktop required).

---

## Where each check runs

| ID | Check | pre-commit (staged) | pre-push | CI | Manual |
|----|-------|:---:|:---:|:---:|--------|
| A0 | Prettier (front) — auto-fix + re-stage | ✓ | | check | `npm run format` |
| A1 | `tsc -b` (via build) | ✓ | | ✓ | `npm run typecheck` |
| A1b | ESLint, **0 warning** | ✓ | | ✓ | `npm run lint` |
| A2 | `vite build` | ✓ | | ✓ | `npm run build` |
| A3 | Secrets — forbidden files + secretlint | ✓ | | ✓ | `npm run check:secrets` |
| A3t | Secret scanner self-test | when its config changes | | ✓ | `npm run test:secrets` |
| A3g | gitleaks — whole Git history | | | ✓ | — |
| A4 | CSS tokens (no raw colors) | ✓ | | ✓ | `npm run check:colors` |
| A5 | Dependency audit — npm front + back + Composer, **any severity**, abandoned packages | when manifests change | ✓ | ✓ + nightly | `npm run audit` |
| A6 | actionlint (the CI's own config) | | | ✓ | — |
| A7 | Trivy config — Dockerfiles (non-root, healthcheck…) | | | ✓ | — |
| A8 | Trivy image — production images, every fixable CVE | | | ✓ + nightly | — |
| B | Vitest unit | ✓ | | ✓ | `npm run test` |
| C1 | Domain / asset contract | ✓ | | ✓ | `npm run check:domains` |
| C2 | API smoke search + auth | | | ✓ (prod stack) | `npm run test:api` |
| C3 | PHPUnit (Blade assets built + `.env`, like prod) | when `backend/` changes | | ✓ | `npm run test:backend` |
| D-docker | Production stack boots healthy, containers non-root, HTTP → HTTPS redirect, TLS ≤ 1.1 refused, session cookies `Secure` + `HttpOnly`, site + `/up` + API (and C2) through HTTPS, certificate verified (never `curl -k`); `.env` created by `scripts/deploy/init-env.sh`, compose refuses an unfilled `.env`, no hard-coded origin in the front bundle, log rotation, a regular user's session survives a backend restart, backup → damage → restore round trip | | | ✓ | — |
| R | Dependency review (new deps in a PR) | | | ✓ (PR) | — |

Files: [`lefthook.yml`](../lefthook.yml) (hooks) · [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) (CI) · [`.github/dependabot.yml`](../.github/dependabot.yml) (update PRs).

Hooks and CI call **the same scripts**: green locally = green in CI.

---

## Commands (monorepo root)

| Script | What |
|--------|------|
| `npm run gate` | A + B + C1 in one go (no Docker) — same as before, still useful for agents |
| `npm run gate:full` | `gate` + C3 + C2 + A5 (Docker stack up) |
| `npm run gate:security` | A3 self-test + A3 + A5 |
| `npm run check:secrets` | A3 on every tracked file |
| `npm run test:secrets` | A3t — proves the scanner still catches tokens, private keys, `.env` |
| `npm run audit` | A5 |
| `npm run test:backend` | C3 (PHP local or container) |
| `npm run format` | Prettier on the front |
| `npm run test:e2e` | **D0 / D4 / D5** — Playwright *(not scaffolded yet)* |

`GATE_SKIP_API=1` only skips C2 in `gate:full` on a UI-only laptop. CI never skips it.

---

## Security policy

| Rule | How it is enforced |
|------|--------------------|
| No secret reaches GitHub | pre-commit secretlint + forbidden filenames, CI gitleaks on the whole history, GitHub **push protection** server side (works even with `--no-verify`) |
| No known vulnerable dependency in production | A5 blocks at **any** severity. No upstream fix → `overrides` / targeted update (example: `postcss-selector-parser` forced to 7.1.x under Tailwind 3, CSS output checked byte-identical) |
| No vulnerable OS package in the images | `apk upgrade` at build + A8 blocks every CVE that has a fix. CVEs without any upstream fix are listed in the CI log (non-blocking: no remediation exists) |
| No root container, no missing healthcheck | A7 + D-docker (`id -u` ≠ 0) |
| HTTPS only, no cleartext session cookie | Front Nginx terminates TLS (self-signed if no cert is mounted), HTTP only redirects, `SESSION_SECURE_COOKIE=true` by default; checked by D-docker |
| Reproducible pipeline | Actions pinned by commit SHA, scanner images by digest, tools by lockfile, Prettier exact version, LF line endings (`.gitattributes`) |
| Stay patched | Dependabot weekly PRs (npm, Composer, Actions, Docker, Compose, 7-day cooldown) + nightly CI |

Documented exceptions (each one targeted, versioned, reviewed in PR):

- `.gitleaks.toml` — `scripts/pdf-extract-test-data.json`, rule `generic-api-key` only: document slugs in a `key` field, not secrets.

---

## GitHub settings (not in the repo — recreate on fork / transfer)

| Setting | Value |
|---------|-------|
| Branch protection `main` | PR required; required checks (GitHub Actions app): `Front — qualité & tests`, `Back — tests`, `Sécurité — secrets & dépendances`, `Docker — images, config & smoke prod`, `Dépendances — revue de PR`; strict (up to date); enforce admins; no force-push / deletion; conversation resolution |
| Secret scanning + push protection | Enabled |
| Dependabot alerts + security updates | Enabled (also enables the dependency graph needed by dependency review) |

Check: a direct `git push` to `main` must be rejected with `GH006`.

---

## Suite matrix (what is active when)

| Suite | Status | When |
|-------|--------|------|
| **A** — format, typecheck, lint, secrets, colors, build, audit, config scans | **Active, automated** | Hook + CI |
| **B** — unit (filters, reviewSeen, `useApiQuery`) | **Active, automated** | Hook + CI |
| **C1** — domain / asset contract | **Active, automated** | Hook + CI |
| **C2** — API smoke search + auth | **Active, automated** | CI on the production Docker stack |
| **C3** — Laravel PHPUnit | **Active, automated** | Hook when `backend/` changes + CI |
| **D-docker** — production stack smoke | **Active, automated** | CI |
| **D0** — smoke public E2E (`/`, `/categories`, `/recherche`, domaine) | **Deferred until** Playwright scaffold lands; **mandatory before prod** | CI |
| **D1** — content / domaines regression | **Active in C1 + unit**; E2E deferred | Content + taxonomy PRs |
| **D2** — auth + back-office chercheur E2E | **Deferred until** BO flows stable | During compte / review work |
| **D3** — security functional (session, CSRF, RGPD stubs, 401) | **Deferred with D2** | Pre-prod |
| **D4** — a11y (axe) on key pages | **Planned with D0** | `test:e2e` |
| **D5** — perf / console smoke | **Planned with D0** | `test:e2e` |
| **E** — process | **Active** | Hooks + branch protection |
| **F** — exclusions | Applied | See below |

**Pending decision — backend code style (Pint):** not enforced. Enforcing it means reformatting 23 existing PHP files owned by the backend developer; the decision is theirs. Enabling it later is one job in `lefthook.yml` and one CI step.

---

## Exclusions (F)

Do **not** add:

- Pixel / screenshot tests of GSAP text-reveal or WebGL hero glass  
- E2E for every i18n string  
- Duplicate asserts already covered in unit **and** E2E without value  
- Tests that call a real external LLM (LM Studio) in the default gate  
- Tests for features **not yet implemented** (write them when the feature lands)  
- Forcing Docker rebuild inside the pre-commit hook (CI builds the images)

---

## Layout

```
lefthook.yml                    # Git hooks (pre-commit, pre-push)
.github/workflows/ci.yml        # CI/CD — required to merge on main
.github/dependabot.yml          # dependency update PRs
.secretlintrc.json              # A3 rules ; .gitleaks.toml (A3g)
docs/TESTING.md                 # this file (source of truth)
scripts/
  gate.mjs                      # manual orchestrator (gate / gate:full / gate:security)
  check-domain-contract.mjs     # C1
  ci/
    check-secrets.mjs           # A3
    check-secrets.test.mjs      # A3t
    audit.mjs                   # A5
    backend-test.mjs            # C3 (Blade assets + .env + composer test)
    smoke-session.mjs           # D-docker: session survives a backend restart
  deploy/                       # used by the DSI and replayed by the CI
    init-env.sh / .ps1          # creates .env, generates secrets, sets the server address
    backup.sh / .ps1            # MySQL dump + uploaded files → backups/*.tar.gz
    restore.sh / .ps1           # restores an archive (asks for confirmation)
    php.mjs                     # PHP local, else container
frontend/
  scripts/
    check-colors.mjs            # A4
    test-search-api.mjs         # C2
    test-auth-api.mjs           # C2
  tests/
    unit/                       # B
backend/
  tests/                        # C3 (PHPUnit)
```

---

## Suite details

### A — Static quality and security

| ID | Check | Catches (LLM-typical) |
|----|--------|------------------------|
| A0 | Prettier | Inconsistent formatting, noisy diffs |
| A1 | `tsc -b` | Broken types, bad imports |
| A1b | ESLint, 0 warning | Hooks rules (set-state-in-effect, Fast Refresh), dead code patterns |
| A2 | `vite build` | Bundle/asset resolution failures |
| A3 | secrets | `.env`, API keys, tokens, private keys (PKCS#1 and PKCS#8) committed |
| A4 | CSS tokens | Hard-coded colors breaking DA |
| A5 | audit | Known vulnerable or abandoned deps |
| A6–A8 | actionlint, Trivy | Broken CI config, root containers, vulnerable images |

### B — Unit (Vitest)

- `lib/categoryFilter.ts` — slug parse, API category labels  
- `lib/reviewSeen.ts` — pending / seen semantics  
- `hooks/useApiQuery.ts` — loading → success / error, loading again when deps change, stale responses ignored  
- REST mappers (`mapRecherche`, etc.) when touched  

### C — Feature / contract / API

| ID | Check | Intent |
|----|--------|--------|
| C1 | Domain contract | Every `UNC_CATEGORIES` slug has `domainDescriptions`, pill (+ hero when required), and consistent filter mapping |
| C2 | API smoke | Seeded catalogue + Sanctum login/register work on the real production images |
| C3 | PHPUnit | Auth, Breeze views (with the real Vite manifest), vulgarisation IA, `/up` health route used by the Docker healthcheck |

### D — E2E (phased)

Align with [`tests-parcours-public-rest.md`](./tests-parcours-public-rest.md) for public paths; back-office flows when D2 unlocks.

### E — Process

| ID | Rule |
|----|------|
| E1 | Hooks are installed by `npm install` at the root; never bypass them (`--no-verify`, `LEFTHOOK=0`) |
| E2 | `main` only receives pull requests with a green CI; no direct push, admins included |
| E3 | Never claim “done” while a hook or the CI is red |
| E4 | Never fix red by weakening a test, a rule or a threshold — fix the code; exceptions are targeted, versioned and reviewed |
| E5 | After `git pull` on a Docker host: `docker compose up -d --build frontend` (image ≠ git tree) |
| E6 | Report which suites ran / skipped in the handoff note |
| E7 | Same PR: add or update ≥ 1 test when changing behaviour |

---

## AI / agent obligation

1. Let the hooks run; a red hook means the task is not done.
2. Run `npm run gate` while iterating if useful; the hook will run the same checks at commit time.
3. Never edit a test, an ESLint rule, an audit threshold or a scanner config to turn red into green without stating it explicitly and getting approval.
4. Report red checks; do not claim done while red.

---

## Roadmap

1. Playwright scaffold — D0 / D4 / D5 on `/`, `/categories`, `/recherche`, `/categories/informatique`, added to CI  
2. Expand Vitest around `mapRecherche` + auth error mapping  
3. Backend style (Pint) once the backend developer agrees  
4. Playwright D0 smoke on domain pages (Math / Physique / Chimie assets WebP already wired)
