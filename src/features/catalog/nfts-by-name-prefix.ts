import type { Nft } from '@/lib/contracts/nft.ts'

export function nftsByNamePrefix(nfts: readonly Nft[], query: string): Nft[] {
  if (query.length === 0) return [...nfts]
  const prefix = query.toLowerCase()
  return nfts.filter((nft) => nft.name.toLowerCase().startsWith(prefix))
}
