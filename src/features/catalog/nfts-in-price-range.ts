import type { Nft } from '@/lib/contracts/nft.ts'

function parseEthMilli(value: string) {
  if (!/^\d+(\.\d{1,3})?$/.test(value)) return null
  const [whole, fraction = ''] = value.split('.')
  const padded = `${fraction}000`.slice(0, 3)
  return BigInt(whole) * 1000n + BigInt(padded)
}

export function nftsInPriceRange(nfts: readonly Nft[], min: string, max: string): Nft[] {
  const minMilli = parseEthMilli(min)
  const maxMilli = parseEthMilli(max)
  if (minMilli === null || maxMilli === null || minMilli > maxMilli) return []
  return nfts.filter((nft) => {
    const priceMilli = parseEthMilli(nft.price)
    if (priceMilli === null) return false
    return priceMilli >= minMilli && priceMilli <= maxMilli
  })
}