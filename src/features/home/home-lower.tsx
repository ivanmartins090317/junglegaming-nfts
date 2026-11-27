import type { FormEvent, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import { FooterSocial } from '@/components/layout/footer-social.tsx'
import { Input } from '@/components/ui/input.tsx'
import { homeArticles } from '@/features/home/home-data.ts'

export function HomeLower() {
  return (
    <div className="mt-24 hidden desktop:block">
      <PromoRow />
      <Journal />
      <footer className="mt-[104px]">
        <div className="overflow-hidden rounded-[15px] bg-surface-card">
          <InfoBand />
          <ContactStrip />
          <FooterColumns />
        </div>
        <p className="m-0 mt-5 mb-3 text-center text-[12px] leading-none text-foreground">
          © 2026 Kurio. Propriedade digital para todos.
        </p>
      </footer>
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

function InfoBand() {
  function keep(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <section className="grid grid-cols-[repeat(3,265px)_minmax(0,1fr)] px-8 pt-7 pb-5">
      <BandItem mark="W" title="Segurança da carteira">
        Proteja sua carteira e colecione arte digital verificada com confiança.
      </BandItem>
      <BandItem mark="C" title="Criadores em destaque">
        Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      </BandItem>
      <BandItem mark="D" title="Alertas de lançamentos">
        Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
      </BandItem>
      <div className="pl-4">
        <h2 className="m-0 text-[18px] font-bold leading-[18px] text-foreground">
          Antecipe-se ao próximo lançamento
        </h2>
        <form className="mt-3 flex" onSubmit={keep}>
          <Input
            type="email"
            aria-label="E-mail"
            placeholder="digite seu e-mail..."
            className="h-10 rounded-r-none border-0 bg-ink text-[14px] placeholder:text-text-secondary"
          />
          <Button type="submit" className="h-10 w-auto rounded-l-none px-4">
            Enviar
          </Button>
        </form>
        <p className="m-0 mt-3 text-[13px] leading-[22px] text-text-secondary">
          Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
        </p>
      </div>
    </section>
  )
}

function BandItem({ mark, title, children }: { mark: string; title: string; children: ReactNode }) {
  return (
    <div className="border-r border-primary px-4">
      <span className="inline-flex size-[75px] items-center justify-center rounded-full bg-primary text-[16px] font-bold text-ink">
        {mark}
      </span>
      <h2 className="m-0 mt-3 text-[16px] font-bold leading-none text-foreground">{title}</h2>
      <p className="m-0 mt-3 max-w-[200px] text-[14px] leading-[22px] text-text-secondary">{children}</p>
    </div>
  )
}

function ContactStrip() {
  return (
    <div className="grid h-[86px] grid-cols-[repeat(4,302px)] items-center bg-border pl-[30px] text-[14px] leading-6 text-foreground">
      <p className="m-0 text-[14px] font-bold tracking-[0.1em] text-foreground">KURIO</p>
      <p className="m-0 max-w-[240px]">Feito para colecionadores, criadores e cultura</p>
      <p className="m-0">contato@email.com</p>
      <p className="m-0">+55 11 4002 8922</p>
    </div>
  )
}

function FooterColumns() {
  return (
    <div className="grid grid-cols-[repeat(4,302px)] pt-7 pb-8 pl-[30px]">
      <FooterColumn title="Meu perfil">
        <Link to="/perfil" className="text-[14px] leading-4 text-foreground no-underline">
          Meu perfil
        </Link>
        <Quiet>Minha coleção</Quiet>
        <Quiet>Atividade</Quiet>
        <Quiet>Estúdio do criador</Quiet>
        <Quiet>Lista de interesse</Quiet>
      </FooterColumn>
      <FooterColumn title="Central de ajuda">
        <Quiet>Central de ajuda</Quiet>
        <Quiet>Como comprar NFTs</Quiet>
        <Quiet>Carteira e segurança</Quiet>
        <Quiet>Política do mercado</Quiet>
        <Quiet>Denunciar item</Quiet>
      </FooterColumn>
      <FooterColumn title="Coleções">
        <Quiet>Arte digital</Quiet>
        <Quiet>Fotografia</Quiet>
        <Quiet>Música</Quiet>
        <Quiet>Arte 3D</Quiet>
        <Quiet>Utilidade</Quiet>
      </FooterColumn>
      <FooterSocial />
    </div>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3.5">
      <h2 className="m-0 text-[16px] font-bold leading-none text-foreground">{title}</h2>
      {children}
    </div>
  )
}

function Quiet({ children }: { children: string }) {
  return (
    <button type="button" className="bg-transparent p-0 text-left font-mono text-[14px] leading-4 text-foreground">
      {children}
    </button>
  )
}
