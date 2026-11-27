import { describe, expect, it } from 'vitest'
import { nftsInPriceRange } from '@/features/catalog/nfts-in-price-range.ts'
import type { Nft } from '@/lib/contracts/nft.ts'

const sample: Nft[] = [
  { id: 'a', name: 'A', price: '0.39', image: '/a.png' },
  { id: 'b', name: 'B', price: '1.19', image: '/b.png' },
  { id: 'c', name: 'C', price: '1.99', image: '/c.png' },
]

describe('nftsInPriceRange', () => {
  it('mantém peças dentro do intervalo fechado', () => {
    expect(nftsInPriceRange(sample, '1.00', '2.00').map((nft) => nft.id)).toEqual(['b', 'c'])
  })

  it('devolve vazio quando mínimo passa do máximo', () => {
    expect(nftsInPriceRange(sample, '2.00', '1.00')).toEqual([])
  })

  it('inclui o limite exato do preço', () => {
    expect(nftsInPriceRange(sample, '1.19', '1.19').map((nft) => nft.id)).toEqual(['b'])
  })
})