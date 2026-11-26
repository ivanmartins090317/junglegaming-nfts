import type { CartLine, Quote } from '@/lib/contracts/cart.ts'

const lineGrid = 'grid grid-cols-[minmax(0,1fr)_7.5rem_8.5rem_7rem_2.5rem] items-center gap-3'

export function CartLines({
  lines,
  quote,
  busy,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  lines: CartLine[]
  quote: Quote | undefined
  busy: boolean
  onIncrease: (nftId: string) => void
  onDecrease: (nftId: string) => void
  onRemove: (nftId: string) => void
}) {
  return (
    <>
      <div data-cart="lines-desktop" className="hidden flex-col gap-2 desktop:flex">
        <div className={`${lineGrid} border-b border-border pb-2 font-medium text-foreground`}>
          <span>NFTs</span>
          <span>Preço</span>
          <span>Edições</span>
          <span>Total</span>
          <span />
        </div>
        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {lines.map((line) => (
            <li key={line.nftId} className={`${lineGrid} min-h-[68px] rounded-[15px] bg-surface-card px-3`}>
              <div className="flex min-w-0 items-center gap-3">
                <img
                  src={line.image}
                  alt={line.name}
                  width={52}
                  height={52}
                  className="size-[52px] rounded-[15px] object-cover"
                />
                <div className="min-w-0">
                  <p className="m-0 font-bold text-foreground">{line.name}</p>
                  <p className="m-0 text-[0.875em] text-text-secondary">ID do token: {line.nftId}</p>
                </div>
              </div>
              <p className="m-0 font-bold text-text-accent">{line.unitPrice} ETH</p>
              <QuantityControl
                line={line}
                busy={busy}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
              />
              <p className="m-0 font-bold text-text-accent">{totalLabel(quote, line.nftId)}</p>
              <button
                type="button"
                aria-label={`Remover ${line.name}`}
                disabled={busy}
                onClick={() => onRemove(line.nftId)}
                className="inline-flex size-7 items-center justify-center bg-transparent p-0 text-text-secondary disabled:opacity-40"
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <ul data-cart="lines-mobile" className="m-0 flex list-none flex-col gap-3 p-0 desktop:hidden">
        {lines.map((line) => (
          <li key={line.nftId} className="flex overflow-hidden rounded-[15px] bg-surface-card">
            <img
              src={line.image}
              alt=""
              width={100}
              height={96}
              className="h-auto w-[100px] self-stretch rounded-l-[15px] object-cover"
            />
            <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="m-0 font-bold text-foreground">{line.name}</p>
                <p className="m-0 text-[0.875em] text-text-secondary">{line.nftId}</p>
                <p className="m-0 text-[1.125em] font-bold text-text-accent">{totalLabel(quote, line.nftId)}</p>
              </div>
              <QuantityControl line={line} busy={busy} onIncrease={onIncrease} onDecrease={onDecrease} />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

function totalLabel(quote: Quote | undefined, nftId: string) {
  const total = quote?.lineTotals.find((line) => line.nftId === nftId)?.total
  if (!total) return ''
  return `${total} ETH`
}

function QuantityControl({
  line,
  busy,
  onIncrease,
  onDecrease,
}: {
  line: CartLine
  busy: boolean
  onIncrease: (nftId: string) => void
  onDecrease: (nftId: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`Diminuir ${line.name}`}
        disabled={busy || line.quantity <= 1}
        onClick={() => onDecrease(line.nftId)}
        className="inline-flex size-7 items-center justify-center rounded-full bg-primary font-mono text-ink disabled:opacity-40"
      >
        −
      </button>
      <span className="min-w-4 text-center text-foreground">{line.quantity}</span>
      <button
        type="button"
        aria-label={`Aumentar ${line.name}`}
        disabled={busy}
        onClick={() => onIncrease(line.nftId)}
        className="inline-flex size-7 items-center justify-center rounded-full bg-primary font-mono text-ink disabled:opacity-40"
      >
        +
      </button>
    </div>
  )
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16" />
      <path d="M9 7V5h6v2" />
      <path d="M7 7l1 12h8l1-12" />
    </svg>
  )
}
