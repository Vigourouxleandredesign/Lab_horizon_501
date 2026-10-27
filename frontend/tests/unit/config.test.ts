import { describe, expect, it } from 'vitest'
import { resolveApiBaseUrl } from '../../src/lib/config'

describe('resolveApiBaseUrl', () => {
  it('same-origin : prend l’adresse de la page (image Docker portable)', () => {
    expect(resolveApiBaseUrl('same-origin', 'https://192.168.1.20')).toBe('https://192.168.1.20')
    expect(resolveApiBaseUrl('same-origin', 'https://labhorizon.example')).toBe(
      'https://labhorizon.example',
    )
  })

  it('URL explicite : utilisée telle quelle (développement Vite)', () => {
    expect(resolveApiBaseUrl('https://localhost:8443', 'http://localhost:5173')).toBe(
      'https://localhost:8443',
    )
  })

  it('non configurée : chaîne vide (le mode rest signale l’erreur)', () => {
    expect(resolveApiBaseUrl(undefined, 'https://x')).toBe('')
    expect(resolveApiBaseUrl('same-origin', undefined)).toBe('')
  })
})
