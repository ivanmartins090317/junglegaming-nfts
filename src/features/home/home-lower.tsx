import type { FormEvent, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { homeArticles } from '@/features/home/home-data.ts'

export function HomeLower() {
  return (
    <div className="mt-24 hidden desktop:block">
      <PromoRow />
      <Journal />
      <InfoBand />
      <SiteFooter />
    </div>
  )
}

function PromoRow() {
  return (
    <div className="grid grid-cols-2 items-stretch gap-6">
      <Promo
        image="/home/emerald.png"
        title="Lançamentos gênesis de edição limitada"
        body="Colecione edições escassas diretamente dos criadores antes da revelação pública."
      />
      <Promo
        image="/home/neon.png"
        title="Arte digital selecionada e muito mais"
        body="Explore novos artistas, coleções verificadas e obras digitais que definem a"
      />
    </div>
  )
}

function Promo({ image, title, body }: { image: string; title: string; body: string }) {
  return (
    <article className="grid h-[250px] grid-cols-[218px_minmax(0,1fr)] items-center gap-4 rounded-[15px] bg-surface-card p-4">
      <img src={image} alt="" width={218} height={218} className="h-[218px] w-[218px] rounded-[15px] object-cover" />
      <div>
        <h2 className="m-0 text-[20px] font-bold leading-[26px] text-foreground">{title}</h2>
        <p className="m-0 mt-3 text-[14px] leading-[22px] text-text-secondary">{body}</p>
        <Button type="button" className="mt-4 w-auto px-4 text-[14px]">
          Explorar →
        </Button>
      </div>
    </article>
  )
}

function Journal() {
  return (
    <section className="mt-24">
      <h2 className="m-0 text-center text-[28px] font-bold leading-none text-foreground">Diário da Cunhagem</h2>
      <p className="m-0 mt-3 text-center text-[14px] leading-[22px] text-text-secondary">
        Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
      </p>
      <ul className="mt-8 grid list-none grid-cols-4 gap-5 p-0">
        {homeArticles.map((article) => (
          <li key={article.title}>
            <article className="h-full rounded-[15px] bg-surface-card p-3">
              <img
                src={article.image}
                alt=""
                width={240}
                height={180}
                className="aspect-[4/3] w-full rounded-[15px] object-cover"
              />
              <p className="m-0 mt-3 text-[12px] leading-[16px] text-text-secondary">
                {article.date} | Leitura de {article.minutes} min
              </p>
              <h3 className="m-0 mt-2 text-[16px] font-bold leading-[22px] text-foreground">{article.title}</h3>
              <p className="m-0 mt-2 text-[13px] leading-[18px] text-text-secondary">{article.summary}</p>
              <button type="button" className="mt-3 bg-transparent p-0 font-mono text-[14px] font-bold text-primary">
                Ler mais →
              </button>
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
    <section className="mt-24 grid grid-cols-[1fr_1fr_1fr_280px] gap-6 rounded-[15px] bg-surface-card p-6">
      <BandItem mark="W" title="Segurança da carteira">
        Proteja sua carteira e colecione arte digital verificada com confiança.
      </BandItem>
      <BandItem mark="C" title="Criadores em destaque">
        Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
      </BandItem>
      <BandItem mark="D" title="Alertas de lançamentos">
        Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
      </BandItem>
      <div>
        <h2 className="m-0 text-[18px] font-bold leading-[24px] text-foreground">
          Antecipe-se ao próximo lançamento
        </h2>
        <form className="mt-4 flex gap-2" onSubmit={keep}>
          <Input
            type="email"
            aria-label="E-mail"
            placeholder="digite seu e-mail..."
            className="h-[35px] placeholder:text-text-secondary"
          />
          <Button type="submit" className="w-auto px-4">
            Enviar
          </Button>
        </form>
        <p className="m-0 mt-3 text-[13px] leading-[18px] text-text-secondary">
          Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
        </p>
      </div>
    </section>
  )
}

function BandItem({ mark, title, children }: { mark: string; title: string; children: ReactNode }) {
  return (
    <div className="border-r border-border pr-4">
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary text-[16px] font-bold text-ink">
        {mark}
      </span>
      <h2 className="m-0 mt-4 text-[16px] font-bold leading-none text-foreground">{title}</h2>
      <p className="m-0 mt-3 text-[13px] leading-[18px] text-text-secondary">{children}</p>
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-10">
      <div className="grid grid-cols-4 gap-6 border-y border-border py-6 text-[14px] leading-[22px] text-text-secondary">
        <p className="m-0 text-[14px] font-bold tracking-[0.1em] text-foreground">KURIO</p>
        <p className="m-0">Feito para colecionadores, criadores e cultura</p>
        <p className="m-0">contato@email.com</p>
        <p className="m-0">+55 11 4002 8922</p>
      </div>
      <div className="grid grid-cols-4 gap-6 py-8">
        <FooterColumn title="Meu perfil">
          <Link to="/perfil" className="text-text-secondary no-underline">
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
        <div>
          <h2 className="m-0 text-[16px] font-bold leading-none text-foreground">Redes sociais</h2>
          <div className="mt-4 flex gap-2">
            {['Facebook', 'Instagram', 'X', 'LinkedIn', 'YouTube'].map((name) => (
              <button
                key={name}
                type="button"
                aria-label={name}
                className="inline-flex size-8 items-center justify-center rounded-[5px] border border-border bg-transparent font-mono text-[12px] text-foreground"
              >
                {name.slice(0, 1)}
              </button>
            ))}
          </div>
          <h2 className="m-0 mt-6 text-[16px] font-bold leading-none text-foreground">Carteiras compatíveis</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {['METAMASK', 'WALLETCONNECT', 'COINBASE'].map((name) => (
              <span
                key={name}
                className="rounded-[5px] border border-border px-2 py-1 text-[10px] leading-none text-text-secondary"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="m-0 pb-6 text-center text-[12px] leading-none text-text-secondary">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <h2 className="m-0 text-[16px] font-bold leading-none text-foreground">{title}</h2>
      {children}
    </div>
  )
}

function Quiet({ children }: { children: string }) {
  return (
    <button type="button" className="bg-transparent p-0 text-left font-mono text-[14px] text-text-secondary">
      {children}
    </button>
  )
}
