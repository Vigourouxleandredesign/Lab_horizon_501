#!/usr/bin/env node
/**
 * Smoke tests — recherche & filtres (section 4 todolist).
 *
 * Prérequis : stack Docker up (backend sur 8081 par défaut).
 *   docker compose up -d frontend backend mysql redis
 *
 * Usage :
 *   npm run test:search-api
 *   API_BASE_URL=http://127.0.0.1:8081 npm run test:search-api
 */
const API_BASE = (process.env.API_BASE_URL ?? 'http://localhost:8081').replace(/\/$/, '')

/** Scénarios calibrés sur le seed `backend/database/seeders/local-content.json`. */
const SCENARIOS = [
  {
    name: 'liste sans filtre',
    params: { page: '1', pageSize: '50' },
    assert: (json) => totalOf(json) >= 10,
  },
  {
    name: 'recherche texte (titre)',
    params: { q: 'leptospirose' },
    assert: (json) => totalOf(json) >= 1 && hasTitleContaining(json, 'leptospirose'),
  },
  {
    name: 'recherche texte (auteur)',
    params: { q: 'Dupont' },
    assert: (json) => totalOf(json) >= 1,
  },
  {
    name: 'filtre catégorie biodiversité (libellé back)',
    params: { category: 'Biodiversité, environnement, santé' },
    assert: (json) => totalOf(json) >= 2,
  },
  {
    name: 'filtre catégorie géosciences',
    params: { category: 'Géosciences' },
    assert: (json) => totalOf(json) >= 5,
  },
  {
    name: 'filtre année 2026',
    params: { year: '2026' },
    assert: (json) => totalOf(json) >= 10,
  },
  {
    name: 'filtre année sans résultat',
    params: { year: '2020' },
    assert: (json) => totalOf(json) === 0,
  },
  {
    name: 'combinaison q + année',
    params: { q: 'leptospirose', year: '2026' },
    assert: (json) => totalOf(json) >= 1,
  },
  {
    name: 'combinaison q + année impossible',
    params: { q: 'leptospirose', year: '2020' },
    assert: (json) => totalOf(json) === 0,
  },
  {
    name: 'état vide (requête absurde)',
    params: { q: 'zzzz-lab-horizon-aucun-resultat' },
    assert: (json) => totalOf(json) === 0,
  },
  {
    name: 'tri pertinence (fallback récent)',
    params: { q: 'TOPOS', sort: 'relevance' },
    assert: (json) => totalOf(json) >= 1,
  },
]

function totalOf(json) {
  return json.meta?.total ?? json.total ?? json.data?.length ?? 0
}

function hasTitleContaining(json, needle) {
  const lower = needle.toLowerCase()
  return (json.data ?? []).some((item) =>
    String(item.titre ?? '').toLowerCase().includes(lower),
  )
}

async function fetchSearch(params) {
  const url = new URL(`${API_BASE}/api/recherches`)
  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') url.searchParams.set(key, String(value))
  }
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} — ${url.pathname}${url.search}`)
  }
  return response.json()
}

async function main() {
  console.log(`Lab Horizon — smoke tests recherche\nBase API : ${API_BASE}\n`)

  let failed = 0

  for (const scenario of SCENARIOS) {
    try {
      const json = await fetchSearch(scenario.params)
      if (!scenario.assert(json)) {
        failed += 1
        console.error(`✗ ${scenario.name} — assertion échouée (total=${totalOf(json)})`)
        continue
      }
      console.log(`✓ ${scenario.name} — ${totalOf(json)} résultat(s)`)
    } catch (error) {
      failed += 1
      const message = error instanceof Error ? error.message : String(error)
      console.error(`✗ ${scenario.name} — ${message}`)
    }
  }

  console.log('')
  if (failed > 0) {
    console.error(`${failed} scénario(s) en échec.`)
    console.error('Vérifiez que Docker tourne : docker compose up -d backend mysql redis')
    process.exit(1)
  }

  console.log(`OK — ${SCENARIOS.length} scénarios passés.`)
}

main()
