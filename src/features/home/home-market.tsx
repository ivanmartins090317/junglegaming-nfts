import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { HeartIcon } from '@/components/layout/chrome-icons.tsx'
import {
  homeCollections,
  homeNetworks,
  homeNfts,
  homeTabs,
  type HomeNft,
} from '@/features/home/home-data.ts'

export function HomeMarket() {
  const [collection, setCollection] = useState('Arte digital')
  const [network, setNetwork] = useState<string | null>(null)
  const [tab, setTab] = useState<(typeof homeTabs)[number]>('Todos os NFTs')
  const [page, setPage] = useState(1)

  return (
    <section id="grade" className="mt-4 scroll-mt-8 desktop:mt-24">
      <div className="desktop:grid desktop:grid-cols-[310px_minmax(0,1fr)] desktop:items-start desktop:gap-12">
        <aside className="hidden desktop:block">
          <div className="rounded-[15px] bg-surface-card p-5 pb-7">
            <FilterGroup title="Coleções">
              {homeCollections.map(([name, count]) => (
                <FilterRow
                  key={name}
                  label={name}
                  count={count}
                  active={collection === name}
                  onSelect={() => setCollection(name)}
                />
              ))}
            </FilterGroup>
            <div className="mt-11">
              <h2 className="m-0 text-[16px] font-bold leading-none text-foreground">Faixa de preço</h2>
              <div className="relative mt-3.5 h-4">
                <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-secondary" />
                <span className="absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-full bg-primary" />
                <span className="absolute top-1/2 right-8 size-3 -translate-y-1/2 rounded-full bg-primary" />
              </div>
              <p className="m-0 mt-4 text-[14px] leading-none text-text-secondary">
                Preço: 0,02 - 12,30 ETH
              </p>
              <Button type="button" className="mt-5 w-auto px-4 text-[14px]">
                Aplicar
              </Button>
            </div>
            <div className="mt-10">
              <FilterGroup title="Rede">
                {homeNetworks.map(([name, count]) => (
                  <FilterRow
                    key={name}
                    label={name}
                    count={count}
                    active={network === name}
                    onSelect={() => setNetwork(name)}
                  />
                ))}
              </FilterGroup>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-[15px]">
            <div className="bg-surface-card p-5">
              <p className="m-0 text-[20px] font-bold leading-none text-primary">NFT EM DESTAQUE</p>
              <p className="m-0 mt-4 text-center text-[22px] font-bold leading-none text-foreground">
                OFERTA LIMITADA
              </p>
            </div>
            <img
              src="/home/featured.png"
              alt=""
              width={310}
              height={376}
              className="block h-[376px] w-full object-cover"
            />
          </div>
        </aside>
        <div>
          <div className="flex flex-col gap-4 desktop:flex-row desktop:items-end desktop:justify-between">
            <div className="flex flex-nowrap gap-1 desktop:gap-6" role="tablist" aria-label="Recorte do catálogo">
              {homeTabs.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={tab === item}
                  onClick={() => setTab(item)}
                  className={
                    (tab === item
                      ? 'border-b-2 border-primary bg-transparent p-0 pb-0 font-mono text-[14px] font-bold whitespace-nowrap text-text-accent leading-[18px] desktop:border-b-[3px] desktop:pb-1 desktop:text-[16px] desktop:leading-[inherit]'
                      : 'border-b-2 border-transparent bg-transparent p-0 pb-0 font-mono text-[14px] font-normal whitespace-nowrap text-foreground leading-[18px] desktop:border-b-[3px] desktop:pb-1 desktop:text-[16px] desktop:leading-[inherit]') +
                    (index === 2 ? ' ml-3 desktop:ml-0' : '')
                  }
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="m-0 hidden text-[14px] leading-none text-text-secondary desktop:block">
              Ordenar por: <span className="text-foreground">Listados recentemente</span>
            </p>
          </div>
          <ul className="mt-4 grid list-none grid-cols-2 gap-x-4 gap-y-[21px] p-0 pb-8 desktop:mt-5 desktop:grid-cols-3 desktop:gap-x-8 desktop:gap-y-[60px] desktop:pb-0">
            {homeNfts.map((nft, index) => (
              <li key={nft.id} className="even:translate-y-8 desktop:even:translate-y-0">
                <NftCard nft={nft} lowered={index % 2 === 1} />
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden justify-end gap-2 desktop:mt-[93px] desktop:flex">
            {[1, 2, 3, 4].map((number) => (
              <button
                key={number}
                type="button"
                aria-current={page === number ? 'page' : undefined}
                onClick={() => setPage(number)}
                className={
                  page === number
                    ? 'inline-flex size-8 items-center justify-center rounded-[5px] border-0 bg-primary font-mono text-[14px] text-ink'
                    : 'inline-flex size-8 items-center justify-center rounded-[5px] border border-border bg-transparent font-mono text-[14px] text-foreground'
                }
              >
                {number}
              </button>
            ))}
            <button
              type="button"
              aria-label="Próxima página"
              onClick={() => setPage((current) => Math.min(4, current + 1))}
              className="inline-flex size-8 items-center justify-center rounded-[5px] border border-border bg-transparent font-mono text-[14px] text-foreground"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="m-0 text-[16px] font-bold leading-none text-foreground">{title}</h2>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </div>
  )
}

function FilterRow({
  label,
  count,
  active,
  onSelect,
}: {
  label: string
  count: number
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex h-7 w-full items-center justify-between bg-transparent px-2 py-0 text-left font-mono text-[14px] leading-none ${active ? 'font-bold text-text-accent' : 'font-normal text-foreground'}`}
    >
      <span>{label}</span>
      <span className="text-text-secondary">({count})</span>
    </button>
  )
}

function mobileCardPadding(nft: HomeNft, lowered: boolean) {
  if (nft.rare) return 'pt-4 pb-4'
  return lowered ? 'pt-5 pb-3' : 'pt-3 pb-5'
}

function NftCard({ nft, lowered = false }: { nft: HomeNft; lowered?: boolean }) {
  const [saved, setSaved] = useState(false)

  return (
    <article>
      <div
        className={`rounded-[20px] bg-surface-card px-1 ${mobileCardPadding(nft, lowered)} desktop:rounded-[15px] desktop:bg-surface-card desktop:px-1 desktop:pt-8 desktop:pb-4`}
      >
        <div className="relative">
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
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? `Remover ${nft.name} dos favoritos` : `Salvar ${nft.name}`}
            onClick={() => setSaved((current) => !current)}
            className="absolute top-0 right-[7px] inline-flex size-7 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--primary-color)_14%,var(--ink))] text-primary desktop:hidden"
          >
            <HeartIcon filled={saved} className="size-6" />
          </button>
        </div>
      </div>
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
    </article>
  )
}
