import type { FormEvent, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'

export function CartFooter() {
  return (
    <footer data-cart="footer" className="mt-16 hidden desktop:block">
      <div className="overflow-hidden rounded-[15px] bg-surface-card">
        <InfoBand />
        <ContactStrip />
        <FooterColumns />
      </div>
      <p className="m-0 mt-5 mb-3 text-center text-text-secondary">© 2026 Kurio. Propriedade digital para todos.</p>
    </footer>
  )
}

function keep(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
}

function InfoBand() {
  return (
    <section className="grid grid-cols-4 gap-4 px-6 pt-7 pb-5">
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
        <h2 className="m-0 font-bold text-foreground">
          Antecipe-se ao próximo
          <br />
          lançamento
        </h2>
        <form className="mt-3 flex" onSubmit={keep}>
          <Input
            type="email"
            aria-label="E-mail do lançamento"
            placeholder="digite seu e-mail..."
            className="h-10 rounded-r-none border-0 bg-ink placeholder:text-text-secondary"
          />
          <Button type="submit" className="h-10 w-auto rounded-l-none px-4 font-bold">
            Enviar
          </Button>
        </form>
        <p className="m-0 mt-3 text-text-secondary">
          Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
        </p>
      </div>
    </section>
  )
}

function BandItem({ mark, title, children }: { mark: string; title: string; children: ReactNode }) {
  return (
    <div className="border-r border-primary pr-4">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary font-bold text-ink">
        {mark}
      </span>
      <h2 className="m-0 mt-3 font-bold text-foreground">{title}</h2>
      <p className="m-0 mt-3 text-text-secondary">{children}</p>
    </div>
  )
}

function ContactStrip() {
  return (
    <div className="grid grid-cols-4 items-center gap-4 bg-border px-6 py-4 text-foreground">
      <p className="m-0 font-bold tracking-[0.1em]">KURIO</p>
      <p className="m-0">
        Feito para colecionadores,
        <br />
        criadores e cultura
      </p>
      <p className="m-0">contato@email.com</p>
      <p className="m-0">+55 11 4002 8922</p>
    </div>
  )
}

function FooterColumns() {
  return (
    <div className="grid grid-cols-4 gap-6 px-8 pt-7 pb-8">
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
        <h2 className="m-0 font-bold text-foreground">Redes sociais</h2>
        <div className="mt-3 flex gap-2">
          <Social name="Facebook" mark="f" />
          <Social name="Instagram" mark="◎" />
          <Social name="Twitter" mark="x" />
          <Social name="LinkedIn" mark="in" />
          <Social name="YouTube" mark="▷" />
        </div>
        <h2 className="m-0 mt-6 font-bold text-foreground">Carteiras compatíveis</h2>
        <p className="m-0 mt-3 inline-flex rounded-[5px] border border-primary px-2 py-1 text-[0.75em] tracking-wide text-primary uppercase">
          METAMASK · WALLETCONNECT · COINBASE
        </p>
      </div>
    </div>
  )
}

function Social({ name, mark }: { name: string; mark: string }) {
  return (
    <button
      type="button"
      aria-label={name}
      className="inline-flex size-8 items-center justify-center rounded-[5px] border border-primary bg-transparent font-mono text-primary"
    >
      {mark}
    </button>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <h2 className="m-0 font-bold text-foreground">{title}</h2>
      {children}
    </div>
  )
}

function Quiet({ children }: { children: string }) {
  return (
    <button type="button" className="bg-transparent p-0 text-left font-mono text-text-secondary">
      {children}
    </button>
  )
}
