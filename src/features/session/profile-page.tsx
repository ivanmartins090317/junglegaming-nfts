import { Button } from '@/components/ui/button.tsx'
import { useSessionQuery } from '@/lib/query/session.ts'
import { useEndSession } from '@/features/session/use-end-session.ts'

export function ProfilePage() {
  const session = useSessionQuery()
  const endSession = useEndSession()
  return (
    <div className="flex flex-col items-start gap-6">
      <p className="m-0 text-foreground">{session.data?.email}</p>
      <Button type="button" onClick={() => void endSession()}>
        Sair
      </Button>
    </div>
  )
}
