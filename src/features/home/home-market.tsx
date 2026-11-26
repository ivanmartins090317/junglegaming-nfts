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
    <section id="grade" className="scroll-mt-8 mt-10 lg:mt-16">
      <div className="lg:grid lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start lg:gap-10">
        <aside className="hidden lg:block">
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
          <div className="mt-8">
            <h2 className="m-0 text-[16px] font-bold leading-none text-foreground">Faixa de preço</h2>
            <div className="relative mt-5 h-4">
              <div className="absolute top-1/2 right-0 left-0 h-px -translate-y-1/2 bg-secondary" />
              <span className="absolute top-1/2 left-0 size-3 -translate-y-1/2 rounded-full bg-primary" />
              <span className="absolute top-1/2 right-8 size-3 -translate-y-1/2 rounded-full bg-primary" />
            </div>
            <p className="m-0 mt-3 text-[14px] leading-none text-text-secondary">
              Preço: 0,02 - 12,30 ETH
            </p>
            <Button type="button" className="mt-4 w-auto px-4 text-[14px]">
              Aplicar
            </Button>
          </div>
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
          <div className="mt-10">
            <p className="m-0 text-[14px] font-bold leading-none text-primary">NFT EM DESTAQUE</p>
            <p className="m-0 mt-3 text-[18px] font-bold leading-none text-foreground">OFERTA LIMITADA</p>
            <img
              src="/home/featured.png"
              alt=""
              width={300}
              height={300}
              className="mt-4 w-full rounded-[15px] object-cover"
            />
          </div>
        </aside>
        <div>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-6" role="tablist" aria-label="Recorte do catálogo">
              {homeTabs.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={tab === item}
                  onClick={() => setTab(item)}
                  className={
                    tab === item
                      ? 'border-b-[3px] border-primary bg-transparent p-0 pb-1 font-mono text-[16px] font-bold text-text-accent'
                      : 'border-b-[3px] border-transparent bg-transparent p-0 pb-1 font-mono text-[16px] font-normal text-foreground'
                  }
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="m-0 hidden text-[14px] leading-none text-text-secondary lg:block">
              Ordenar por: <span className="text-foreground">Listados recentemente</span>
            </p>
          </div>
          <ul className="mt-6 grid list-none grid-cols-2 gap-4 p-0 md:max-w-[440px] md:grid-cols-1 lg:max-w-none lg:grid-cols-3 lg:gap-6">
            {homeNfts.map((nft) => (
              <li key={nft.id}>
                <NftCard nft={nft} />
              </li>
            ))}
          </ul>
          <div className="mt-8 hidden justify-end gap-2 lg:flex">
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
    <div className="mt-8 first:mt-0">
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
      className={`flex w-full items-center justify-between bg-transparent p-0 text-left font-mono text-[14px] leading-none ${active ? 'font-bold text-text-accent' : 'font-normal text-foreground'}`}
    >
      <span>{label}</span>
      <span className="text-text-secondary">({count})</span>
    </button>
  )
}

function NftCard({ nft }: { nft: HomeNft }) {
  const [saved, setSaved] = useState(false)

  return (
    <article className="rounded-[15px] bg-surface-card p-3">
      <div className="relative">
        <img
          src={nft.image}
          alt={nft.name}
          width={250}
          height={250}
          className="aspect-square w-full rounded-[15px] object-cover"
        />
        {nft.rare ? (
          <span className="absolute top-3 left-3 rounded-[5px] bg-primary px-2 py-1 text-[12px] font-bold leading-none text-ink md:hidden">
            RARO
          </span>
        ) : null}
        <button
          type="button"
          aria-pressed={saved}
          aria-label={saved ? `Remover ${nft.name} dos favoritos` : `Salvar ${nft.name}`}
          onClick={() => setSaved((current) => !current)}
          className="absolute top-3 right-3 inline-flex size-8 items-center justify-center rounded-full border border-primary bg-ink text-primary md:hidden"
        >
          <HeartIcon filled={saved} />
        </button>
      </div>
      <h3 className="m-0 mt-3 text-[14px] font-normal leading-none text-foreground">{nft.name}</h3>
      <p className="m-0 mt-2 flex items-center gap-2 text-[16px] font-bold leading-none text-primary">
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
