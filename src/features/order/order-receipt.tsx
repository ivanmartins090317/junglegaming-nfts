import { useNavigate } from '@tanstack/react-router'
import type { OrderReceipt } from '@/lib/contracts/order.ts'
import { shortenTransactionId } from '@/features/order/shorten-transaction-id.ts'

export function OrderReceiptView({ order }: { order: OrderReceipt }) {
  const navigate = useNavigate()

  return (
    <article className="mx-auto w-full max-w-[358px] overflow-hidden rounded-[5px] bg-surface-card">
      <div className="relative border-b border-primary px-4 pt-3 pb-4 text-center">
        <button
          type="button"
          aria-label="Fechar"
          className="absolute top-2 right-3 border-0 bg-transparent p-1 text-[16px] leading-none font-normal text-primary"
          onClick={() => void navigate({ to: '/' })}
        >
          ×
        </button>
        <ThankYouMark />
        <p className="m-0 px-3 text-[12px] leading-[16px] font-medium whitespace-nowrap text-text-secondary">
          Seus NFTs agora estão na sua carteira
        </p>
      </div>
      <div className="flex divide-x divide-primary border-b border-primary">
        <Meta label="ID da transação" value={shortenTransactionId(order.transactionId)} strong />
        <Meta label="Data" value={order.date} />
        <Meta label="Total" value={eth(order.total)} />
        <Meta label="Carteira" value={order.wallet} strong />
      </div>
      <div className="px-[27px] pt-4 pb-7">
        <p className="m-0 text-[14px] leading-[16px] font-bold text-foreground">Detalhes da transação</p>
        <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 border-b border-border pb-1 text-[14px] font-bold text-foreground">
          <span>NFTs</span>
          <span className="text-center">Edições</span>
          <span className="text-right">Subtotal</span>
        </div>
        <ul className="m-0 list-none p-0">
          {order.lines.map((line) => (
            <li
              key={line.nftId}
              className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 py-2"
            >
              <div className="flex min-w-0 items-center gap-[7px]">
                <img
                  src={line.image}
                  alt=""
                  width={43}
                  height={43}
                  className="size-[43px] shrink-0 rounded-[15px] object-cover"
                />
                <div className="min-w-0">
                  <p className="m-0 text-[14px] leading-[16px] font-bold text-foreground">{line.name}</p>
                  <p className="m-0 text-[12px] leading-[16px] font-normal text-secondary">
                    ID do token: {line.nftId}
                  </p>
                </div>
              </div>
              <p className="m-0 text-center text-[14px] leading-[16px] font-normal text-text-secondary">
                (x {line.quantity})
              </p>
              <p className="m-0 text-right text-[16px] leading-[16px] font-bold text-text-accent">{eth(line.total)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-2 border-b border-border pb-2 text-right">
          <p className="m-0 text-[14px] leading-[18px] font-normal text-foreground">
            Taxa de rede <span className="text-[16px]">{eth(order.networkFee)}</span>
          </p>
          <p className="m-0 text-[14px] leading-[18px] font-bold text-foreground">
            Total <span className="text-[16px] text-text-accent">{eth(order.total)}</span>
          </p>
        </div>
        <p className="m-0 mt-4 text-center text-[12px] leading-[18px] font-normal text-text-secondary">
          Transação confirmada na Ethereum. A propriedade foi transferida para sua carteira conectada e registrada na
          rede.
        </p>
        <button
          type="button"
          className="mx-auto mt-5 block rounded-[var(--radius-page-button)] border-0 bg-primary px-2.5 py-1.5 text-[14px] leading-none font-bold text-ink"
          onClick={(event) => event.preventDefault()}
        >
          Ver no Etherscan
        </button>
      </div>
      <div className="h-[6px] bg-primary" />
    </article>
  )
}

function Meta({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="px-1.5 py-2">
      <p
        className={`m-0 text-[10px] leading-[14px] whitespace-nowrap text-text-secondary ${strong ? 'font-bold' : 'font-normal'}`}
      >
        {label}
      </p>
      <p className="m-0 text-[10px] leading-[14px] font-normal whitespace-nowrap text-text-secondary">{value}</p>
    </div>
  )
}

function ThankYouMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 50"
      className="mx-auto mb-2 h-[50px] w-10 text-primary"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
    >
      <path d="M6 16h28v20H6z" />
      <path d="M6 16l14 12L34 16" />
      <text
        x="20"
        y="30"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontSize="4.2"
        fontFamily="Roboto Mono, monospace"
      >
        THANK
      </text>
      <text
        x="20"
        y="35"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontSize="4.2"
        fontFamily="Roboto Mono, monospace"
      >
        YOU
      </text>
    </svg>
  )
}

function eth(amount: string) {
  return `${amount} ETH`
}
