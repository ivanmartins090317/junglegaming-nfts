import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { catalogSearch } from '@/features/catalog/catalog-search.ts'
import { NftDetail } from '@/features/detail/nft-detail.tsx'

export const Route = createFileRoute('/nfts/$nftId')({
  validateSearch: catalogSearch,
  search: {
    middlewares: [stripSearchParams({ q: '' })],
  },
  component: NftDetailRoute,
})

function NftDetailRoute() {
  const { nftId } = Route.useParams()
  return <NftDetail nftId={nftId} />
}
