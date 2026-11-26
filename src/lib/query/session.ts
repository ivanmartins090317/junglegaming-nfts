import { QueryClient, useQuery } from '@tanstack/react-query'
import { fetchSession } from '@/lib/api/session.ts'

export const sessionQueryKey = ['sessao'] as const

export function privateQueryKey(userId: string) {
  return ['usuario', userId] as const
}

export function createAppQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  })
}

let appQueryClient: QueryClient | undefined

export function setAppQueryClient(client: QueryClient) {
  appQueryClient = client
}

export function getAppQueryClient() {
  if (!appQueryClient) appQueryClient = createAppQueryClient()
  return appQueryClient
}

export function clearSessionCache(queryClient: QueryClient, userId: string | undefined) {
  queryClient.removeQueries({ queryKey: sessionQueryKey })
  if (!userId) return
  queryClient.removeQueries({
    predicate: (query) => query.queryKey.includes(userId),
  })
}

export function useSessionQuery() {
  return useQuery({
    queryKey: sessionQueryKey,
    queryFn: fetchSession,
    retry: false,
  })
}
