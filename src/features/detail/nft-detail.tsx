import { Link, useSearch } from '@tanstack/react-router'
import { SiteFooter } from '@/components/layout/site-footer.tsx'
import { catalogSearchParams, normalizeCatalogQuery } from '@/features/catalog/catalog-search.ts'
import { nftDetailContent } from '@/features/detail/nft-detail-content.ts'
import { NftDetailGallery } from '@/features/detail/nft-detail-gallery.tsx'
import { NftDetailInfo } from '@/features/detail/nft-detail-info.tsx'
import { NftDetailTabs } from '@/features/detail/nft-detail-tabs.tsx'
import { NftRelated } from '@/features/detail/nft-related.tsx'
import { NftNotFoundError } from '@/lib/api/nfts.ts'
import { useNftQuery } from '@/lib/query/nfts.ts'
import type { Nft } from '@/lib/contracts/nft.ts'

interface NftDetailProps {
  nftId: string
}

const crumbClass = 'text-[14px] leading-5 text-foreground no-underline'

export function NftDetail({ nftId }: NftDetailProps) {
  const { q } = useSearch({ from: '/nfts/$nftId' })
  const query = normalizeCatalogQuery(q)
  const nft = useNftQuery(nftId)
  const message = detailMessage(nft.isPending, nft.isError, nft.error)

  return (
    <>
      <article>
        <Breadcrumb query={query} />
        {message ? (
          <p className="m-0 mt-6 text-[14px] font-normal leading-[16px] text-foreground">{message}</p>
        ) : null}
        {nft.data ? <NftDetailBody nft={nft.data} query={query} /> : null}
      </article>
      <SiteFooter />
    </>
  )
}

function Breadcrumb({ query }: { query: string }) {
  return (
    <nav aria-label="Trilha" className="flex items-center gap-2">
      <Link to="/" className={crumbClass}>
        Início
      </Link>
      <span aria-hidden="true" className={crumbClass}>
        /
      </span>
      <Link to="/" search={catalogSearchParams(query)} className={`${crumbClass} font-bold`}>
        Mercado
      </Link>
    </nav>
  )
}

function detailMessage(isPending: boolean, isError: boolean, error: unknown) {
  if (isPending) return 'Carregando'
  if (error instanceof NftNotFoundError) return 'NFT não encontrado.'
  if (isError) return 'Não foi possível carregar a peça.'
  return null
}

function NftDetailBody({ nft, query }: { nft: Nft; query: string }) {
  const content = nftDetailContent(nft)
  return (
    <div className="mt-2.5">
      <div className="desktop:grid desktop:grid-cols-[minmax(0,571px)_minmax(0,1fr)] desktop:gap-x-[33px]">
        <NftDetailGallery nft={nft} />
        <NftDetailInfo nft={nft} content={content} />
      </div>
      <NftDetailTabs content={content} />
      <NftRelated currentId={nft.id} query={query} />
    </div>
  )
}
