import { Link, useSearch } from '@tanstack/react-router'
import { catalogSearchParams, normalizeCatalogQuery } from '@/features/catalog/catalog-search.ts'
import { NftNotFoundError } from '@/lib/api/nfts.ts'
import { useNftQuery } from '@/lib/query/nfts.ts'
import type { Nft } from '@/lib/contracts/nft.ts'

interface NftDetailProps {
  nftId: string
}

export function NftDetail({ nftId }: NftDetailProps) {
  const { q } = useSearch({ from: '/nfts/$nftId' })
  const query = normalizeCatalogQuery(q)
  const nft = useNftQuery(nftId)
  const message = detailMessage(nft.isPending, nft.isError, nft.error)

  return (
    <article className="max-w-[420px]">
      <Link
        to="/"
        search={catalogSearchParams(query)}
        className="inline-flex text-[14px] leading-none text-text-accent no-underline"
      >
        Voltar
      </Link>
      <div className="mt-6">
        {message ? <p className="m-0 text-[14px] font-normal leading-[16px] text-foreground">{message}</p> : null}
        {nft.data ? <NftDetailBody nft={nft.data} /> : null}
      </div>
    </article>
  )
}

function detailMessage(isPending: boolean, isError: boolean, error: unknown) {
  if (isPending) return 'Carregando'
  if (error instanceof NftNotFoundError) return 'NFT não encontrado.'
  if (isError) return 'Não foi possível carregar a peça.'
  return null
}

function NftDetailBody({ nft }: { nft: Nft }) {
  return (
    <div>
      <div className="relative rounded-[15px] bg-surface-card p-1">
        <img
          src={nft.image}
          alt={nft.name}
          width={420}
          height={420}
          className="aspect-square w-full rounded-[15px] object-cover"
        />
        {nft.rare ? (
          <span className="absolute top-2 left-2 inline-flex h-8 items-center bg-primary px-2 text-[13px] font-medium leading-none text-ink">
            RARO
          </span>
        ) : null}
      </div>
      <h1 className="m-0 mt-4 text-[15px] font-normal leading-[18px] text-foreground">{nft.name}</h1>
      <p className="m-0 mt-3 flex items-center gap-2 text-[16px] font-bold leading-5 text-primary">
        {nft.price} ETH
        {nft.compareAt ? (
          <span className="text-[14px] font-normal text-text-secondary line-through">
            {nft.compareAt} ETH
          </span>
        ) : null}
      </p>
    </div>
  )
}
