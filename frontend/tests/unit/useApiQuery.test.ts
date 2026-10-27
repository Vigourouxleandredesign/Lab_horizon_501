import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useApiQuery } from '../../src/hooks/useApiQuery'

/** Promesse résolue à la main : contrôle exact de l'ordre des réponses. */
function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('useApiQuery', () => {
  it('passe de loading à success', async () => {
    const { result } = renderHook(() => useApiQuery(() => Promise.resolve('ok'), []))
    expect(result.current.status).toBe('loading')
    await waitFor(() =>
      expect(result.current).toEqual({ status: 'success', data: 'ok', error: null }),
    )
  })

  it('expose une erreur explicite', async () => {
    const { result } = renderHook(() => useApiQuery(() => Promise.reject(new Error('500')), []))
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(result.current.error?.message).toBe('500')
  })

  it('repasse en loading dès que les deps changent (pas de données périmées)', async () => {
    const second = deferred<string>()
    const { result, rerender } = renderHook(
      ({ q }) => useApiQuery(() => (q === 'a' ? Promise.resolve('A') : second.promise), [q]),
      { initialProps: { q: 'a' } },
    )
    await waitFor(() => expect(result.current.data).toBe('A'))

    rerender({ q: 'b' })
    expect(result.current).toEqual({ status: 'loading', data: null, error: null })

    second.resolve('B')
    await waitFor(() => expect(result.current.data).toBe('B'))
  })

  it('ignore la réponse obsolète arrivée après un changement de deps', async () => {
    const slow = deferred<string>()
    const { result, rerender } = renderHook(
      ({ q }) => useApiQuery(() => (q === 'a' ? slow.promise : Promise.resolve('B')), [q]),
      { initialProps: { q: 'a' } },
    )
    rerender({ q: 'b' })
    await waitFor(() => expect(result.current.data).toBe('B'))

    slow.resolve('A')
    await Promise.resolve()
    expect(result.current.data).toBe('B')
  })
})
