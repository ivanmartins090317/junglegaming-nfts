import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button.tsx'
import type { PrimaryWallet } from '@/lib/contracts/wallet.ts'
import { walletMessages, walletPlaceholders } from '@/lib/contracts/wallet.ts'
import { saveWallet } from '@/lib/api/wallet.ts'
import { walletQueryKey } from '@/lib/query/wallet.ts'
import {
  WalletChoice,
  WalletEnsField,
  WalletSecondaryAddressField,
  WalletTextField,
} from '@/features/wallet/wallet-fields.tsx'

export function WalletPrimaryForm({ userId, initial }: { userId: string; initial: PrimaryWallet }) {
  const queryClient = useQueryClient()
  const [displayName, setDisplayName] = useState(initial.displayName)
  const [nickname, setNickname] = useState(initial.nickname)
  const [profileName, setProfileName] = useState(initial.profileName)
  const [address, setAddress] = useState(initial.address)
  const [secondaryAddress, setSecondaryAddress] = useState(initial.secondaryAddress)
  const [referralCode, setReferralCode] = useState(initial.referralCode)
  const [email, setEmail] = useState(initial.email)
  const [ensName, setEnsName] = useState(initial.ensName)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setMessage(null)
    try {
      const saved = await saveWallet({
        displayName,
        nickname,
        network: '',
        profileName,
        address,
        secondaryAddress,
        walletType: '',
        referralCode,
        email,
        ensName,
      })
      queryClient.setQueryData(walletQueryKey(userId), saved)
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : walletMessages.saveFailed)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)}>
      <div className="mt-[25px] grid grid-cols-1 gap-y-[23px] desktop:grid-cols-2 desktop:gap-x-7">
        <WalletTextField label="Nome de exibição" value={displayName} onChange={setDisplayName} />
        <WalletTextField label="Apelido da carteira" value={nickname} onChange={setNickname} />
        <WalletChoice
          label="Rede "
          requiredMark
          placeholder={walletPlaceholders.network}
          ariaLabel="Rede"
        />
        <WalletTextField label="Nome do perfil" value={profileName} onChange={setProfileName} />
        <WalletTextField
          label="Endereço da carteira"
          value={address}
          onChange={setAddress}
          placeholder={walletPlaceholders.address}
        />
        <WalletSecondaryAddressField value={secondaryAddress} onChange={setSecondaryAddress} />
        <WalletChoice
          label="Tipo de carteira"
          requiredMark
          placeholder={walletPlaceholders.walletType}
          ariaLabel="Tipo de carteira"
        />
        <WalletTextField label="Código de indicação" value={referralCode} onChange={setReferralCode} />
        <WalletTextField label="E-mail" value={email} onChange={setEmail} />
        <WalletEnsField value={ensName} onChange={setEnsName} />
        <div className="desktop:col-start-1">
          {message ? <p className="m-0 text-text-coral">{message}</p> : null}
          <Button type="submit" className="mt-[34px] h-[39px] w-[132px] font-bold">
            Salvar carteira
          </Button>
        </div>
      </div>
    </form>
  )
}