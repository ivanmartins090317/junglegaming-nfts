import { Link } from '@tanstack/react-router'
import { catalogSearchParams } from '@/features/catalog/catalog-search.ts'
import { useCatalogQuery } from '@/lib/query/nfts.ts'
import type { Nft } from '@/lib/contracts/nft.ts'

const relatedCount = 5
const dotCount = 3
const activeDot = 1

interface NftRelatedProps {
  currentId: string
  query: string
}

export function NftRelated({ currentId, query }: NftRelatedProps) {
  const catalog = useCatalogQuery()
  const others = catalog.data?.filter((nft) => nft.id !== currentId) ?? []
  if (others.length === 0) return null
  const related = others.slice(-relatedCount)

  return (
    <section className="mt-16 desktop:mt-[88px]">
      <div className="border-b border-border">
        <h2 className="m-0 inline-block -mb-px border-b-2 border-primary pb-2.5 text-[16px] font-bold leading-none text-text-accent">
          Mais desta coleção
        </h2>
      </div>
      <ul className="m-0 mt-2.5 grid list-none auto-cols-[160px] grid-flow-col gap-4 overflow-x-auto p-0 desktop:grid-flow-row desktop:auto-cols-auto desktop:grid-cols-5 desktop:gap-x-8 desktop:overflow-visible">
        {related.map((nft) => (
          <li key={nft.id}>
            <RelatedCard nft={nft} query={query} />
          </li>
        ))}
      </ul>
      <Dots />
    </section>
  )
}

function RelatedCard({ nft, query }: { nft: Nft; query: string }) {
  return (
    <Link
      to="/nfts/$nftId"
      params={{ nftId: nft.id }}
      search={catalogSearchParams(query)}
      className="block text-inherit no-underline"
    >
      <div className="rounded-[15px] bg-surface-card px-1 pt-8 pb-4">
        <img
          src={nft.image}
          alt={nft.name}
          width={206}
          height={206}
          className="aspect-square w-full rounded-[15px] object-cover"
        />
      </div>
      <h3 className="m-0 mt-4 px-1 text-[14px] font-normal leading-none text-foreground">{nft.name}</h3>
      <p className="m-0 mt-3.5 px-1 text-[16px] font-bold leading-none text-primary">{nft.price} ETH</p>
    </Link>
  )
}

function Dots() {
  return (
    <div aria-hidden="true" className="mt-8 flex justify-center gap-3">
      {Array.from({ length: dotCount }, (_, index) => (
        <span
          key={index}
          className={`size-2.5 rounded-full border border-primary ${index === activeDot ? 'bg-primary' : 'bg-transparent'}`}
        />
      ))}
    </div>
  )
}
