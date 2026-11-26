import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { cartQueryKey, quoteQueryKey } from '@/lib/query/cart.ts'
import { clearSessionCache, privateQueryKey, sessionQueryKey } from '@/lib/query/session.ts'

describe('cache da sessão', () => {
  it('tira a sessão e a chave privada e deixa o catálogo', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(sessionQueryKey, {
      id: 'usr-ada',
      name: 'Ada',
      email: 'ada@kurio.test',
    })
    queryClient.setQueryData(privateQueryKey('usr-ada'), { cart: ['sage-nomad-009'] })
    queryClient.setQueryData(cartQueryKey('usr-ada'), { lines: [{ nftId: 'sage-nomad-009' }] })
    queryClient.setQueryData(quoteQueryKey('usr-ada'), { total: '1.706' })
    queryClient.setQueryData(cartQueryKey(null), { lines: [{ nftId: 'emerald-ape-042' }] })
    queryClient.setQueryData(['nfts'], [{ id: 'neon-vessel-552' }])

    clearSessionCache(queryClient, 'usr-ada')

    expect(queryClient.getQueryData(sessionQueryKey)).toBeUndefined()
    expect(queryClient.getQueryData(privateQueryKey('usr-ada'))).toBeUndefined()
    expect(queryClient.getQueryData(cartQueryKey('usr-ada'))).toBeUndefined()
    expect(queryClient.getQueryData(quoteQueryKey('usr-ada'))).toBeUndefined()
    expect(queryClient.getQueryData(cartQueryKey(null))).toEqual({ lines: [{ nftId: 'emerald-ape-042' }] })
    expect(queryClient.getQueryData(['nfts'])).toEqual([{ id: 'neon-vessel-552' }])
  })
})
