import { isAxiosError } from 'axios'
import type { PrimaryWallet } from '@/lib/contracts/wallet.ts'
import { walletMessages } from '@/lib/contracts/wallet.ts'
import { apiClient } from '@/lib/api/client.ts'

export class WalletActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'WalletActionError'
  }
}

const knownMessages = new Set<string>(Object.values(walletMessages))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toWalletError(error: unknown, fallback: string) {
  if (error instanceof WalletActionError) return error
  if (isAxiosError(error) && isRecord(error.response?.data)) {
    const message = error.response.data.message
    if (typeof message === 'string' && knownMessages.has(message)) return new WalletActionError(message)
  }
  return new WalletActionError(fallback)
}

export async function fetchWallet(signal?: AbortSignal) {
  try {
    const response = await apiClient.get<PrimaryWallet>('/api/carteiras', { signal })
    return response.data
  } catch (error: unknown) {
    throw toWalletError(error, walletMessages.loadFailed)
  }
}

export async function saveWallet(body: PrimaryWallet) {
  try {
    const response = await apiClient.put<PrimaryWallet>('/api/carteiras/principal', body)
    return response.data
  } catch (error: unknown) {
    throw toWalletError(error, walletMessages.saveFailed)
  }
}