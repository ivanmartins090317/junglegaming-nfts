import { Button } from '@/components/ui/button.tsx'
import { SiteFooter } from '@/components/layout/site-footer.tsx'
import { homeArticles } from '@/features/home/home-data.ts'

export function HomeLower() {
  return (
    <div className="mt-24 hidden desktop:block">
      <PromoRow />
      <Journal />
      <SiteFooter />
    </div>
  )
}

function PromoRow() {
  return (
    <div className="grid grid-cols-2 items-stretch gap-6">
      <Promo
        image="/home/emerald.png"
        titleLines={['Lançamentos gênesis', 'de edição limitada']}
        body="Colecione edições escassas diretamente dos criadores antes da revelação pública."
      />
      <Promo
        image="/home/neon.png"
        titleLines={['Arte digital selecionada', 'e muito mais']}
        body="Explore novos artistas, coleções verificadas e obras digitais que definem a"
      />
    </div>
  )
}

function Promo({ image, titleLines, body }: { image: string; titleLines: string[]; body: string }) {
  return (
    <article className="grid h-[250px] grid-cols-[288px_minmax(0,1fr)] items-center rounded-[15px] bg-surface-card">
      <img src={image} alt="" width={288} height={250} className="h-[250px] w-[288px] rounded-[15px] object-cover" />
      <div className="flex flex-col items-end pr-8 pl-4 text-right">
        <h2 className="m-0 flex flex-col items-end text-[18px] font-bold leading-[22px] text-foreground">
          {titleLines.map((line) => (
            <span key={line} className="whitespace-nowrap">
              {line}
            </span>
          ))}
        </h2>
        <p className="m-0 mt-3 w-[226px] text-[12px] leading-6 text-text-secondary">{body}</p>
        <Button type="button" className="mt-2 w-auto px-4 text-[14px]">
          Explorar →
        </Button>
      </div>
    </article>
  )
}

function Journal() {
  return (
    <section className="mt-[101px]">
      <h2 className="m-0 text-center text-[28px] font-bold leading-none text-foreground">Diário da Cunhagem</h2>
      <p className="m-0 mt-4 text-center text-[14px] leading-[22px] text-text-secondary">
        Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      </p>
      <ul className="mt-8 grid max-w-[1144px] list-none grid-cols-4 gap-6 p-0">
        {homeArticles.map((article) => (
          <li key={article.title}>
            <article className="h-full overflow-hidden rounded-[15px] bg-surface-card">
              <img
                src={article.image}
                alt=""
                width={268}
                height={195}
                className="block h-[195px] w-full object-cover"
              />
              <div className="px-4 pt-3 pb-2">
                <p className="m-0 text-[12px] leading-[16px] text-text-secondary">
                  {article.date} | Leitura de {article.minutes} min
                </p>
                <h3 className="m-0 mt-3 text-[16px] font-bold leading-5 text-foreground">{article.title}</h3>
                <p className="m-0 mt-1 text-[12px] leading-5 text-text-secondary">{article.summary}</p>
                <button
                  type="button"
                  className="mt-0.5 bg-transparent p-0 font-mono text-[12px] font-bold text-primary"
                >
                  Ler mais →
                </button>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}
