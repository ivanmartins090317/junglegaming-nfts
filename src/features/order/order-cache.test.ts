import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { orderQueryKey } from '@/lib/query/order.ts'
import { clearSessionCache } from '@/lib/query/session.ts'

describe('leitura do pedido', () => {
  it('sai junto com o que é privado e o catálogo fica', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(orderQueryKey('usr-ada', 'ped-ada-1'), { id: 'ped-ada-1' })
    queryClient.setQueryData(orderQueryKey('usr-bruno', 'ped-bruno-1'), { id: 'ped-bruno-1' })
    queryClient.setQueryData(['nfts'], [{ id: 'ivory-baron-088' }])

    clearSessionCache(queryClient, 'usr-ada')

    expect(queryClient.getQueryData(orderQueryKey('usr-ada', 'ped-ada-1'))).toBeUndefined()
    expect(queryClient.getQueryData(orderQueryKey('usr-bruno', 'ped-bruno-1'))).toEqual({ id: 'ped-bruno-1' })
    expect(queryClient.getQueryData(['nfts'])).toEqual([{ id: 'ivory-baron-088' }])
  })
})
