import { createFileRoute } from '@tanstack/react-router'
import { EmptyRoute } from '@/components/layout/empty-route.tsx'

export const Route = createFileRoute('/nfts/$nftId')({
  component: NftDetailRoute,
})

function NftDetailRoute() {
  const { nftId } = Route.useParams()
  return <EmptyRoute title="Detalhe" extra={nftId} />
}
