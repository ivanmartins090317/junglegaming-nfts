import { Fragment, useState } from 'react'
import { Link, useSearch } from '@tanstack/react-router'
import { HeartIcon } from '@/components/layout/chrome-icons.tsx'
import { catalogSearchParams, normalizeCatalogQuery } from '@/features/catalog/catalog-search.ts'
import { nftsByNamePrefix } from '@/features/catalog/nfts-by-name-prefix.ts'
import { useCatalogQuery } from '@/lib/query/nfts.ts'
import type { Nft } from '@/lib/contracts/nft.ts'

const gradeClass =
  'mt-4 grid list-none grid-cols-2 gap-x-4 gap-y-[21px] p-0 pb-8 desktop:mt-5 desktop:grid-cols-3 desktop:gap-x-8 desktop:gap-y-[60px] desktop:pb-0'

export function CatalogGrade() {
  const { q } = useSearch({ from: '/' })
  const query = normalizeCatalogQuery(q)
  const catalog = useCatalogQuery()

  if (catalog.isPending) return <CatalogNote>Carregando</CatalogNote>
  if (catalog.isError) return <CatalogNote>Não foi possível carregar o catálogo.</CatalogNote>

  const visible = nftsByNamePrefix(catalog.data, query)
  if (query.length > 0 && visible.length === 0) {
    return <CatalogNote>Nenhuma peça com esse nome.</CatalogNote>
  }

  const fillerIndex = fillerPosition(visible.length, query)

  return (
    <ul className={gradeClass}>
      {visible.map((nft, index) => (
        <Fragment key={nft.id}>
          {index === fillerIndex ? <FillerCard image={nft.image} /> : null}
          <li className={index % 2 === 1 ? 'translate-y-8 desktop:translate-y-0' : undefined}>
            <NftCard nft={nft} lowered={index % 2 === 1} query={query} />
          </li>
        </Fragment>
      ))}
    </ul>
  )
}

// Desktop tem 3 colunas: quando a última fileira sobraria com 2 peças, o card
// de preenchimento (só imagem) entra entre elas para fechar a fileira em 3.
function fillerPosition(total: number, query: string) {
  if (query.length > 0 || total < 3 || total % 3 !== 2) return -1
  return total - 1
}

function FillerCard({ image }: { image: string }) {
  return (
    <li aria-hidden="true" className="hidden desktop:block">
      <div className="rounded-[15px] bg-surface-card px-1 pt-8 pb-4">
        <img
          src={image}
          alt=""
          width={250}
          height={250}
          className="aspect-square w-full rounded-[15px] object-cover"
        />
      </div>
    </li>
  )
}

function CatalogNote({ children }: { children: string }) {
  return <p className="m-0 mt-4 text-[14px] font-normal leading-[16px] text-foreground">{children}</p>
}

function mobileCardPadding(nft: Nft, lowered: boolean) {
  if (nft.rare) return 'pt-4 pb-4'
  return lowered ? 'pt-5 pb-3' : 'pt-3 pb-5'
}

function NftCard({ nft, lowered, query }: { nft: Nft; lowered: boolean; query: string }) {
  const [saved, setSaved] = useState(false)
  const search = catalogSearchParams(query)

  return (
    <article>
      <div
        className={`rounded-[20px] bg-surface-card px-1 ${mobileCardPadding(nft, lowered)} desktop:rounded-[15px] desktop:bg-surface-card desktop:px-1 desktop:pt-8 desktop:pb-4`}
      >
        <div className="relative">
          <Link
            to="/nfts/$nftId"
            params={{ nftId: nft.id }}
            search={search}
            className="block text-inherit no-underline"
          >
            <img
              src={nft.image}
              alt={nft.name}
              width={250}
              height={250}
              className="aspect-square w-full rounded-[15px] object-cover"
            />
            {nft.rare ? (
              <span className="absolute top-0 -left-1 inline-flex h-8 w-[68px] items-center bg-primary pl-2 text-[13px] font-medium leading-none text-ink desktop:hidden">
                RARO
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? `Remover ${nft.name} dos favoritos` : `Salvar ${nft.name}`}
            onClick={() => setSaved((current) => !current)}
            className="absolute top-0 right-[7px] z-10 inline-flex size-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary-color)_14%,var(--ink))] text-primary desktop:hidden"
          >
            <HeartIcon filled={saved} className="size-6" />
          </button>
        </div>
      </div>
      <Link
        to="/nfts/$nftId"
        params={{ nftId: nft.id }}
        search={search}
        className="block text-inherit no-underline"
      >
        <h3 className="m-0 mt-2.5 px-2 text-[15px] font-normal leading-[18px] text-foreground desktop:mt-4 desktop:px-1 desktop:text-[14px] desktop:leading-none">
          {nft.name}
        </h3>
        <p className="m-0 flex items-center gap-2 px-2 text-[16px] font-bold leading-5 text-primary desktop:mt-3.5 desktop:px-1 desktop:leading-none">
          {nft.price} ETH
          {nft.compareAt ? (
            <span className="text-[14px] font-normal text-text-secondary line-through">
              {nft.compareAt} ETH
            </span>
          ) : null}
        </p>
      </Link>
    </article>
  )
}
