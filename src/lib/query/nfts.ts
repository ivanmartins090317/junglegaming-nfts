import { useQuery } from '@tanstack/react-query'
import { fetchCatalog, fetchNft } from '@/lib/api/nfts.ts'

export const catalogQueryKey = ['nfts'] as const

export function nftQueryKey(nftId: string) {
  return ['nfts', nftId] as const
}

export function useCatalogQuery() {
  return useQuery({
    queryKey: catalogQueryKey,
    queryFn: fetchCatalog,
    retry: false,
  })
}

export function useNftQuery(nftId: string) {
  return useQuery({
    queryKey: nftQueryKey(nftId),
    queryFn: () => fetchNft(nftId),
    retry: false,
  })
}
