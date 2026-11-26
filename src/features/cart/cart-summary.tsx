import type { FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import type { Quote } from '@/lib/contracts/cart.ts'
import { cartMessages } from '@/lib/contracts/cart.ts'

const launchDiscount = '(-) 00.00'

function eth(amount: string) {
  return `${amount} ETH`
}

function keep(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
}

export function CartSummary({
  variant,
  quote,
  quoteFailed,
  canCheckout,
}: {
  variant: 'desktop' | 'mobile'
  quote: Quote | undefined
  quoteFailed: boolean
  canCheckout: boolean
}) {
  const navigate = useNavigate()
  const desktop = variant === 'desktop'
  const subtotal = quote ? eth(quote.subtotal) : ''
  const fee = quote ? eth(quote.networkFee) : ''
  const total = quote ? eth(quote.total) : ''

  function finish() {
    if (!canCheckout) return
    void navigate({ to: '/pagamento' })
  }

  return (
    <aside
      data-cart={desktop ? 'summary-desktop' : 'summary-mobile'}
      className={
        desktop
          ? 'hidden desktop:block'
          : 'fixed inset-x-0 bottom-0 z-30 rounded-t-[15px] bg-surface-card px-7 pt-4 pb-4 desktop:hidden'
      }
    >
      {desktop ? (
        <>
          <h2 className="m-0 font-bold text-foreground">Resumo da carteira</h2>
          <div className="mt-2 h-px bg-border" />
          <p className="m-0 mt-4 text-[0.875em] font-bold text-foreground">Código promocional</p>
        </>
      ) : null}
      <form className={desktop ? 'mt-2 flex' : 'flex'} onSubmit={keep}>
        <Input
          aria-label="Código promocional"
          placeholder="Digite o código promocional..."
          className="rounded-r-none bg-ink placeholder:text-text-secondary"
        />
        <Button type="submit" className="h-[35px] w-auto rounded-l-none px-4 font-bold">
          Aplicar
        </Button>
      </form>
      <dl className="mt-4 mb-0">
        <SummaryRow label="Subtotal" value={subtotal} field="subtotal" />
        <SummaryRow label="Desconto do lançamento" value={quote ? launchDiscount : ''} field="discount" />
        <div>
          <SummaryRow label="Taxa de rede" value={fee} field="fee" />
          <p className="m-0 text-right text-[0.75em] text-text-accent">Taxa estimada</p>
        </div>
        <SummaryRow label="Total" value={total} field="total" emphasize />
      </dl>
      {quoteFailed ? <p className="m-0 mt-2 text-foreground">{cartMessages.quoteFailed}</p> : null}
      <Button
        type="button"
        aria-disabled={!canCheckout}
        onClick={finish}
        className={desktop ? 'mt-4 h-11 w-full font-bold' : 'mt-4 h-14 w-full font-bold'}
      >
        Conectar e finalizar
      </Button>
      {desktop ? (
        <div className="mt-3 text-center">
          <Link to="/" className="text-text-accent no-underline">
            Continuar explorando
          </Link>
        </div>
      ) : null}
    </aside>
  )
}

function SummaryRow({
  label,
  value,
  field,
  emphasize = false,
}: {
  label: string
  value: string
  field: string
  emphasize?: boolean
}) {
  return (
    <div className="mt-2 flex items-baseline justify-between gap-4">
      <dt className={emphasize ? 'font-bold text-foreground' : 'font-normal text-foreground'}>{label}</dt>
      <dd
        data-field={field}
        className={
          emphasize
            ? 'm-0 text-[1.125em] font-bold text-text-accent'
            : 'm-0 font-normal text-foreground'
        }
      >
        {value}
      </dd>
    </div>
  )
}
