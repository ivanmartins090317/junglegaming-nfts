import { isAxiosError } from 'axios'
import type { Nft } from '@/lib/contracts/nft.ts'
import { apiClient } from '@/lib/api/client.ts'

export class NftNotFoundError extends Error {
  constructor() {
    super('NFT não encontrado.')
    this.name = 'NftNotFoundError'
  }
}

export async function fetchCatalog(): Promise<Nft[]> {
  const response = await apiClient.get<Nft[]>('/api/nfts')
  return response.data
}

export async function fetchNft(nftId: string): Promise<Nft> {
  try {
    const response = await apiClient.get<Nft>(`/api/nfts/${encodeURIComponent(nftId)}`)
    return response.data
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 404) throw new NftNotFoundError()
    throw error
  }
}
