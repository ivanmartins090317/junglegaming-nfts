import { useState } from 'react'
import type { FormEvent } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button.tsx'
import type { Profile } from '@/lib/contracts/profile.ts'
import { profileMessages } from '@/lib/contracts/profile.ts'
import { saveProfile } from '@/lib/api/profile.ts'
import { profileQueryKey } from '@/lib/query/profile.ts'
import type { SessionUser } from '@/lib/contracts/session.ts'
import { sessionQueryKey } from '@/lib/query/session.ts'
import { AvatarRow, EnsField, ProfileTextField } from '@/features/profile/profile-fields.tsx'
import { PasswordFields } from '@/features/profile/password-fields.tsx'

export function ProfileForm({ userId, initial }: { userId: string; initial: Profile }) {
  const queryClient = useQueryClient()
  const [displayName, setDisplayName] = useState(initial.displayName)
  const [username, setUsername] = useState(initial.username)
  const [email, setEmail] = useState(initial.email)
  const [ensName, setEnsName] = useState(initial.ensName)
  const [walletNickname, setWalletNickname] = useState(initial.walletNickname)
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setMessage(null)
    try {
      const saved = await saveProfile({
        displayName,
        username,
        email,
        ensName,
        walletNickname,
        currentPassword,
        nextPassword,
        confirmPassword,
      })
      queryClient.setQueryData(profileQueryKey(userId), saved)
      const current = queryClient.getQueryData<SessionUser>(sessionQueryKey)
      if (current) {
        queryClient.setQueryData(sessionQueryKey, {
          id: current.id,
          name: saved.displayName,
          email: saved.email,
        })
      }
      setCurrentPassword('')
      setNextPassword('')
      setConfirmPassword('')
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : profileMessages.saveFailed)
    } finally {
      setPending(false)
    }
  }

  return (
    <form onSubmit={(event) => void onSubmit(event)}>
      <h1 className="m-0 font-bold text-foreground">Perfil do colecionador</h1>
      <div className="mt-6 grid grid-cols-1 gap-y-[23px] desktop:grid-cols-2 desktop:gap-x-7">
        <ProfileTextField label="Nome de exibição" value={displayName} onChange={setDisplayName} />
        <ProfileTextField label="Nome de usuário" value={username} onChange={setUsername} />
        <ProfileTextField label="E-mail" value={email} onChange={setEmail} />
        <EnsField value={ensName} onChange={setEnsName} />
        <ProfileTextField label="Apelido da carteira" value={walletNickname} onChange={setWalletNickname} />
        <AvatarRow />
        <div className="desktop:col-start-1">
          <h2 className="mt-[18px] font-bold text-foreground">Alterar senha</h2>
          <div className="mt-4">
            <PasswordFields
              currentPassword={currentPassword}
              nextPassword={nextPassword}
              confirmPassword={confirmPassword}
              onCurrentPassword={setCurrentPassword}
              onNextPassword={setNextPassword}
              onConfirmPassword={setConfirmPassword}
            />
          </div>
          {message ? <p className="m-0 mt-4 text-text-coral">{message}</p> : null}
          <Button type="submit" className="mt-8 h-[39px] w-[132px] font-bold">
            Salvar
          </Button>
        </div>
      </div>
    </form>
  )
}