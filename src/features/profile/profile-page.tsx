import type { ReactNode } from 'react'
import { profileMessages } from '@/lib/contracts/profile.ts'
import { useProfileQuery } from '@/lib/query/profile.ts'
import { useSessionQuery } from '@/lib/query/session.ts'
import { AccountFrame } from '@/features/profile/account-sidebar.tsx'
import { ProfileForm } from '@/features/profile/profile-form.tsx'

export function ProfilePage() {
  const session = useSessionQuery()
  const profile = useProfileQuery(session.data?.id)

  let column: ReactNode
  if (profile.isError) {
    column = <p className="m-0 text-text-coral">{profileMessages.loadFailed}</p>
  } else if (!session.data?.id || profile.isPending || !profile.data) {
    column = <p className="m-0 text-foreground">{profileMessages.loading}</p>
  } else {
    column = <ProfileForm userId={session.data.id} initial={profile.data} />
  }

  return <AccountFrame active="perfil">{column}</AccountFrame>
}