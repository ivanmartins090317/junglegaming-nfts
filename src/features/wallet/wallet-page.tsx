import type { ReactNode } from 'react'
import { walletMessages } from '@/lib/contracts/wallet.ts'
import { useWalletQuery } from '@/lib/query/wallet.ts'
import { useSessionQuery } from '@/lib/query/session.ts'
import { AccountFrame } from '@/features/profile/account-sidebar.tsx'
import { WalletPrimaryForm } from '@/features/wallet/wallet-primary-form.tsx'
import { WalletSecondary } from '@/features/wallet/wallet-secondary.tsx'

export function WalletPage() {
  const session = useSessionQuery()
  const wallet = useWalletQuery(session.data?.id)

  let column: ReactNode
  if (wallet.isError) {
    column = <p className="m-0 text-text-coral">{walletMessages.loadFailed}</p>
  } else if (!session.data?.id || wallet.isPending || !wallet.data) {
    column = <p className="m-0 text-foreground">{walletMessages.loading}</p>
  } else {
    column = (
      <>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="m-0 mr-auto font-bold text-foreground">Carteira principal</h1>
          <button type="button" className="bg-transparent p-0 font-normal text-text-accent">
            Adicionar
          </button>
        </div>
        <p className="m-0 mt-[25px] font-normal text-text-secondary">{walletMessages.paymentCopy}</p>
        <WalletPrimaryForm userId={session.data.id} initial={wallet.data} />
        <WalletSecondary />
      </>
    )
  }

  return <AccountFrame active="carteiras">{column}</AccountFrame>
}