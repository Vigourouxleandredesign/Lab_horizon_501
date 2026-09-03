#!/usr/bin/env node
/**
 * Smoke tests — inscription & auth (section 6.2 todolist).
 *
 * Prérequis : stack Docker up (backend sur 8081 par défaut).
 *   docker compose up -d backend mysql redis
 *
 * Usage :
 *   npm run test:auth-api
 *   API_BASE_URL=http://127.0.0.1:8081 npm run test:auth-api
 */
const API_BASE = (process.env.API_BASE_URL ?? 'http://localhost:8081').replace(/\/$/, '')

/** Jar cookie minimal pour Sanctum (session + XSRF-TOKEN). */
const cookieJar = new Map()

function storeCookies(response) {
  const setCookies = response.headers.getSetCookie?.() ?? []
  for (const raw of setCookies) {
    const [pair] = raw.split(';')
    const eq = pair.indexOf('=')
    if (eq === -1) continue
    cookieJar.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim())
  }
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([k, v]) => `${k}=${v}`).join('; ')
}

function xsrfToken() {
  const raw = cookieJar.get('XSRF-TOKEN')
  if (!raw) return null
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

async function apiFetch(path, { method = 'GET', body } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = xsrfToken()
  if (token && method !== 'GET') headers['X-XSRF-TOKEN'] = token
  const cookie = cookieHeader()
  if (cookie) headers.Cookie = cookie

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  storeCookies(response)

  let json
  const text = await response.text()
  if (text) {
    try {
      json = JSON.parse(text)
    } catch {
      json = { raw: text }
    }
  }

  return { response, json }
}

async function initCsrf() {
  const { response } = await apiFetch('/sanctum/csrf-cookie')
  if (!response.ok) throw new Error(`CSRF init HTTP ${response.status}`)
  if (!xsrfToken()) throw new Error('Cookie XSRF-TOKEN absent après /sanctum/csrf-cookie')
}

function uniqueEmail() {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@lab-horizon.test`
}

async function runScenario(name, fn) {
  try {
    await fn()
    console.log(`✓ ${name}`)
    return true
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`✗ ${name} — ${message}`)
    return false
  }
}

async function main() {
  console.log(`Lab Horizon — smoke tests auth\nBase API : ${API_BASE}\n`)

  let failed = 0
  const email = uniqueEmail()
  const password = 'motdepasse123'

  if (
    !(await runScenario('CSRF — /sanctum/csrf-cookie', async () => {
      cookieJar.clear()
      await initCsrf()
    }))
  ) {
    failed += 1
  }

  if (
    !(await runScenario('Inscription — POST /api/register (201)', async () => {
      cookieJar.clear()
      await initCsrf()
      const { response, json } = await apiFetch('/api/register', {
        method: 'POST',
        body: {
          name: 'Test Chercheur',
          email,
          password,
          password_confirmation: password,
        },
      })
      if (response.status !== 201) {
        throw new Error(`HTTP ${response.status} — ${JSON.stringify(json)}`)
      }
      if (!json?.user?.email || json.user.email !== email) {
        throw new Error('Réponse user invalide')
      }
    }))
  ) {
    failed += 1
  }

  if (
    !(await runScenario('Session — GET /api/me après inscription', async () => {
      const { response, json } = await apiFetch('/api/me')
      if (response.status !== 200) throw new Error(`HTTP ${response.status}`)
      if (json?.email !== email) throw new Error(`Email session inattendu : ${json?.email}`)
    }))
  ) {
    failed += 1
  }

  if (
    !(await runScenario('Inscription doublon — email déjà pris (422)', async () => {
      await initCsrf()
      const { response } = await apiFetch('/api/register', {
        method: 'POST',
        body: {
          name: 'Doublon',
          email,
          password,
          password_confirmation: password,
        },
      })
      if (response.status !== 422) throw new Error(`Attendu 422, reçu ${response.status}`)
    }))
  ) {
    failed += 1
  }

  if (
    !(await runScenario('Inscription — mot de passe trop court (422)', async () => {
      cookieJar.clear()
      await initCsrf()
      const { response } = await apiFetch('/api/register', {
        method: 'POST',
        body: {
          name: 'Court',
          email: uniqueEmail(),
          password: 'abc',
          password_confirmation: 'abc',
        },
      })
      if (response.status !== 422) throw new Error(`Attendu 422, reçu ${response.status}`)
    }))
  ) {
    failed += 1
  }

  if (
    !(await runScenario('Connexion — POST /api/login', async () => {
      cookieJar.clear()
      await initCsrf()
      const { response, json } = await apiFetch('/api/login', {
        method: 'POST',
        body: { email, password },
      })
      if (response.status !== 200) throw new Error(`HTTP ${response.status}`)
      if (json?.user?.email !== email) throw new Error('Login user invalide')
    }))
  ) {
    failed += 1
  }

  if (
    !(await runScenario('Déconnexion — POST /api/logout', async () => {
      const { response } = await apiFetch('/api/logout', { method: 'POST' })
      if (response.status !== 200) throw new Error(`HTTP ${response.status}`)
      const me = await apiFetch('/api/me')
      if (me.response.status !== 401) throw new Error('Session encore active après logout')
    }))
  ) {
    failed += 1
  }

  console.log('')
  if (failed > 0) {
    console.error(`${failed} scénario(s) en échec.`)
    console.error('Vérifiez que Docker tourne : docker compose up -d backend mysql redis')
    process.exit(1)
  }

  console.log('OK — 6 scénarios auth passés.')
}

main()
