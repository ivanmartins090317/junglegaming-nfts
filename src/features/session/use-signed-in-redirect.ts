import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { pathWhenAlreadySignedIn } from '@/features/session/entry-location.ts'
import { useSessionQuery } from '@/lib/query/session.ts'

export function useHoldSignedInRedirect(retorno: string | undefined) {
  const session = useSessionQuery()
  const navigate = useNavigate()
  const openedAsVisitor = useRef(false)
  useEffect(() => {
    if (openedAsVisitor.current || session.isPending) return
    if (!session.data) {
      openedAsVisitor.current = true
      return
    }
    void navigate({ href: pathWhenAlreadySignedIn(retorno), replace: true })
  }, [navigate, retorno, session.data, session.isPending])
  return () => {
    openedAsVisitor.current = true
  }
}
