import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { CatalogGrade } from '@/features/catalog/catalog-grade.tsx'
import { homeCollections, homeNetworks, homeTabs } from '@/features/home/home-data.ts'

export function HomeMarket() {
  const [collection, setCollection] = useState('Arte digital')
  const [network, setNetwork] = useState<string | null>(null)
  const [tab, setTab] = useState<(typeof homeTabs)[number]>('Todos os NFTs')
  const [page, setPage] = useState(1)
  const [priceApplied, setPriceApplied] = useState(false)
  const [sortHighlighted, setSortHighlighted] = useState(false)

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
              <Button
                type="button"
                aria-pressed={priceApplied}
                className="mt-5 w-auto px-4 text-[14px]"
                onClick={() => setPriceApplied(true)}
              >
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
              Ordenar por:{' '}
              <button
                type="button"
                aria-pressed={sortHighlighted}
                onClick={() => setSortHighlighted((current) => !current)}
                className={`bg-transparent p-0 font-mono text-[14px] leading-none ${sortHighlighted ? 'font-bold text-text-accent' : 'font-normal text-foreground'}`}
              >
                Listados recentemente
              </button>
            </p>
          </div>
          <CatalogGrade />
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
