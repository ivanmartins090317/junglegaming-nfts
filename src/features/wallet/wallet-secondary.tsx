import { walletMessages } from '@/lib/contracts/wallet.ts'

export function WalletSecondary() {
  return (
    <section className="mt-[41px]">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <h2 className="mr-auto font-bold text-foreground">Carteira secundária</h2>
        <button
          type="button"
          aria-label="Igual à carteira principal"
          className="inline-flex items-center gap-1.5 bg-transparent p-0 font-normal text-foreground"
        >
          <span className="size-2.5 rounded-full border border-primary bg-transparent" />
          Igual à carteira principal
        </button>
        <button type="button" className="bg-transparent p-0 font-normal text-text-accent">
          Adicionar
        </button>
      </div>
      <p className="m-0 mt-[27px] font-normal text-text-secondary">{walletMessages.emptySecondary}</p>
    </section>
  )
}