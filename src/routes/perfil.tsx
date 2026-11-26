import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/features/profile/profile-page.tsx'
import { returnToFrom } from '@/features/session/entry-location.ts'
import { requireSession } from '@/features/session/guard.ts'

export const Route = createFileRoute('/perfil')({
  beforeLoad: ({ location }) => requireSession(returnToFrom(location)),
  component: ProfileRoute,
})

function ProfileRoute() {
  return <ProfilePage />
}