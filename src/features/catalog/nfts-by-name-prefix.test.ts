import { describe, expect, it } from 'vitest'
import type { Nft } from '@/lib/contracts/nft.ts'
import { nftsByNamePrefix } from '@/features/catalog/nfts-by-name-prefix.ts'

const pieces: Nft[] = [
  { id: 'emerald-ape-042', name: 'Emerald Ape #042', price: '1.19', image: '/home/emerald.png' },
  { id: 'sage-nomad-009', name: 'Sage Nomad #009', price: '1.69', image: '/home/sage.png' },
  {
    id: 'neon-vessel-552',
    name: 'Neon Vessel #552',
    price: '1.99',
    compareAt: '2.29',
    image: '/home/neon.png',
    rare: true,
  },
  { id: 'cosmic-bloom-118', name: 'Cosmic Bloom #118', price: '1.29', image: '/home/cosmic.png' },
  { id: 'violet-nomad-314', name: 'Violet Nomad #314', price: '1.39', image: '/home/violet.png' },
  { id: 'ivory-baron-088', name: 'Ivory Baron #088', price: '1.79', image: '/home/ivory.png' },
  { id: 'golden-beat-207', name: 'Golden Beat #207', price: '0.99', image: '/home/golden.png' },
  { id: 'golden-signal-160', name: 'Golden Signal #160', price: '0.39', image: '/home/golden.png' },
]

function names(nfts: readonly Nft[]) {
  return nfts.map((nft) => nft.name)
}

describe('recorte pelo começo do nome', () => {
  it('devolve a lista inteira, na mesma ordem, quando a busca está vazia', () => {
    const result = nftsByNamePrefix(pieces, '')
    expect(names(result)).toEqual(names(pieces))
    expect(result).not.toBe(pieces)
  })

  it('aceita maiúsculas e minúsculas no começo do nome', () => {
    expect(names(nftsByNamePrefix(pieces, 'neon'))).toEqual(['Neon Vessel #552'])
    expect(names(nftsByNamePrefix(pieces, 'NEON'))).toEqual(['Neon Vessel #552'])
    expect(names(nftsByNamePrefix(pieces, 'nEoN'))).toEqual(['Neon Vessel #552'])
    expect(names(nftsByNamePrefix(pieces, 'sage'))).toEqual(['Sage Nomad #009'])
  })

  it('não recorta por trecho no meio ou no fim do nome', () => {
    expect(nftsByNamePrefix(pieces, 'nomad')).toEqual([])
    expect(nftsByNamePrefix(pieces, '552')).toEqual([])
    expect(nftsByNamePrefix(pieces, 'vessel')).toEqual([])
    expect(nftsByNamePrefix(pieces, ' neon')).toEqual([])
  })

  it('mantém a ordem da loja quando mais de uma peça entra', () => {
    expect(names(nftsByNamePrefix(pieces, 'gold'))).toEqual([
      'Golden Beat #207',
      'Golden Signal #160',
    ])
  })
})
