import { useQuery } from '@tanstack/react-query'
import { fetchProfile } from '@/lib/api/profile.ts'

export function profileQueryKey(userId: string) {
  return ['usuario', userId, 'perfil'] as const
}

export function useProfileQuery(userId: string | undefined) {
  return useQuery({
    queryKey: profileQueryKey(userId ?? 'sem-sessao'),
    queryFn: ({ signal }) => fetchProfile(signal),
    enabled: Boolean(userId),
    retry: false,
  })
}