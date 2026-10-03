# Testing — mandatory gate (anti-regression)

**Status:** Mandatory for contributors and AI agents.  
**Stack:** ESLint · TypeScript · Vite build · Node contract scripts · Vitest (unit) · Laravel PHPUnit · API smoke (Docker) · Playwright E2E *(phased)*

Related: [`llm-pre-commit-gate.md`](./llm-pre-commit-gate.md) *(alias / historique)* · [`front-back-status-v1.md`](./front-back-status-v1.md) · [`tests-parcours-public-rest.md`](./tests-parcours-public-rest.md) · [`api-contract-v1.md`](./api-contract-v1.md)

---

## Gate rule (non-negotiable)

After **any** code change (human or LLM):

1. Run the **required suite for that change** (see matrix below).
2. **All green** → change can be considered done; only then commit / hand off.
3. **Any red** → fix first; do not start another task; do not “validate” the change.

New feature / bugfix in the same PR **must** add or update ≥ 1 relevant test (E7).

---

## Commands (monorepo root)

| Script | What |
|--------|------|
| `npm run typecheck` | **A1** — `tsc -b` (frontend, no emit) |
| `npm run lint` | **A1b** — ESLint frontend |
| `npm run check:secrets` | **A3** — no secret patterns in tracked source |
| `npm run check:colors` | **A4** — no raw `#hex` / `rgb()` in page CSS modules |
| `npm run check:domains` | **C1** — category slugs ↔ i18n ↔ assets ↔ API map |
| `npm run test` | **B** — Vitest unit tests (frontend) |
| `npm run build` | **A2** — production Vite build |
| `npm run test:api` | **C2** — search + auth API smoke (Docker backend) |
| `npm run test:backend` | **C3** — `php artisan test` |
| `npm run gate` | **Default after every change:** A + B + C1 (no Docker) |
| `npm run gate:full` | `gate` + C2 + C3 (Docker + PHP required) |
| `npm run test:e2e` | **D0 / D4 / D5** — Playwright *(not scaffolded yet)* |
| `npm audit --omit=dev --prefix frontend` | **A5** — optional dependency audit |

---

## Suite matrix (what is active when)

| Suite | Status | When to run |
|-------|--------|-------------|
| **A** — typecheck, lint, secrets, colors, build | **Active** | Every change (`gate`) |
| **B** — unit (pure libs: filters, reviewSeen, mappers) | **Active** | Every change (`gate`) |
| **C1** — domain / asset contract | **Active** | Every change (`gate`) |
| **C2** — API smoke search + auth | **Active** when API/auth/search touched; **required** in `gate:full` | Docker backend up |
| **C3** — Laravel PHPUnit | **Active** when `backend/` touched; **required** in `gate:full` | `composer install` done |
| **D0** — smoke public E2E (`/`, `/categories`, `/recherche`, domaine) | **Deferred until** Playwright scaffold lands; **mandatory before prod** | `gate:full` / pre-merge `main` |
| **D1** — content / domaines regression (Maths, Chimie, seed ↔ front) | **Active in C1 + unit** (slugs/i18n/pills/API labels); E2E still deferred | Content + taxonomy PRs |
| **D2** — auth + back-office chercheur E2E | **Deferred until** BO flows stable | During compte / review work |
| **D3** — security functional (session, CSRF, RGPD stubs, 401) | **Deferred with D2** | Pre-prod |
| **D4** — a11y (axe) on key pages | **Planned with D0** | `test:e2e` |
| **D5** — perf / console smoke (no error spam on load) | **Planned with D0** | `test:e2e` |
| **E** — process / agent gate | **Active today** | Process |
| **F** — exclusions | Applied | See below |

---

## Exclusions (F)

Do **not** add:

- Pixel / screenshot tests of GSAP text-reveal or WebGL hero glass  
- E2E for every i18n string  
- Duplicate asserts already covered in unit **and** E2E without value  
- Tests that call a real external LLM (LM Studio) in the default gate  
- Tests for features **not yet implemented** (write them when the feature lands)  
- Forcing Docker rebuild inside `npm run gate` (document rebuild separately)

---

## Layout

```
docs/TESTING.md                 # this file (source of truth)
scripts/
  gate.mjs                      # orchestrator
  check-no-secrets.mjs          # A3
  check-domain-contract.mjs     # C1
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

### A — Static quality (every change)

| ID | Check | Catches (LLM-typical) |
|----|--------|------------------------|
| A1 | `tsc -b` | Broken types, bad imports |
| A1b | ESLint | Hooks rules, dead code patterns |
| A2 | `vite build` | Bundle/asset resolution failures |
| A3 | secrets scan | `.env`, API keys, tokens committed |
| A4 | CSS tokens | Hard-coded colors breaking DA |
| A5 | `npm audit` (optional) | Known vulnerable deps |

### B — Unit (Vitest)

Target pure modules first:

- `lib/categoryFilter.ts` — slug parse, API category labels  
- `lib/reviewSeen.ts` — pending / seen semantics  
- REST mappers (`mapRecherche`, etc.) when touched  

### C — Feature / contract / API

| ID | Check | Intent |
|----|--------|--------|
| C1 | Domain contract | Every `UNC_CATEGORIES` slug has `domainDescriptions`, pill (+ hero when required), and consistent filter mapping |
| C2 | API smoke | Seeded catalogue + Sanctum login/register still work |
| C3 | PHPUnit | Auth, vulgarisation IA, regressions backend |

### D — E2E (phased)

Align with [`tests-parcours-public-rest.md`](./tests-parcours-public-rest.md) for public paths; back-office flows when D2 unlocks.

### E — Process

| ID | Rule |
|----|------|
| E1 | After agent work on `frontend/src`, `backend/app`, `public`, Docker, or config → run `npm run gate` |
| E2 | If auth, recherches API, or Docker networking changed → `npm run gate:full` when Docker is available |
| E3 | Never claim “done” while gate is red |
| E4 | `GATE_SKIP_API=1` only for UI-only machines; **forbidden silent skip** before merge to `main` |
| E5 | After `git pull` on a Docker host: `docker compose up -d --build frontend` (image ≠ git tree) |
| E6 | Report which suites ran / skipped in the handoff note |
| E7 | Same PR: add or update ≥ 1 test when changing behaviour |

---

## AI / agent obligation

Before closing a coding task that touched `frontend/`, `backend/`, `docker-compose.yml`, or root config:

1. Run `npm run gate`
2. If API, auth, seed, or Docker changed — also run `npm run gate:full` when the stack can be up
3. If public UX routes changed and Playwright is enabled — run `npm run test:e2e`
4. Report red tests; do not claim done while red

---

## Quick start (PowerShell)

```powershell
# After every LLM / local change (no Docker required)
npm run gate

# Before PR / merge main (Docker + PHP)
docker compose up -d backend mysql redis
npm run gate:full

# UI-only laptop without API
$env:GATE_SKIP_API = "1"
npm run gate
```

### Expected green output (abbreviated)

```text
[A] typecheck ........ OK
[A] lint ............. OK
[A] check:secrets .... OK
[A] check:colors ..... OK
[C] check:domains .... OK
[B] vitest ........... OK
[A] build ............ OK
GATE: PASS
```

---

## Roadmap (do not block today’s gate)

1. Playwright scaffold — D0 / D4 / D5 on `/`, `/categories`, `/recherche`, `/categories/informatique`  
2. Expand Vitest around `mapRecherche` + auth error mapping  
3. Husky / pre-commit → `npm run gate` (A+B+C1 only)  
4. CI GitHub Actions mirroring `gate` + `gate:full` on PR  
5. Playwright D0 smoke on domain pages (Math / Physique / Chimie assets WebP already wired)
