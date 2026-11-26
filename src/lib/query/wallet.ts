import { useQuery } from '@tanstack/react-query'
import { fetchWallet } from '@/lib/api/wallet.ts'

export function walletQueryKey(userId: string) {
  return ['usuario', userId, 'carteiras'] as const
}

export function useWalletQuery(userId: string | undefined) {
  return useQuery({
    queryKey: walletQueryKey(userId ?? 'sem-sessao'),
    queryFn: ({ signal }) => fetchWallet(signal),
    enabled: Boolean(userId),
    retry: false,
  })
}