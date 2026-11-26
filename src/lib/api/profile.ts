import { isAxiosError } from 'axios'
import type { Profile, ProfileUpdate } from '@/lib/contracts/profile.ts'
import { profileMessages } from '@/lib/contracts/profile.ts'
import { apiClient } from '@/lib/api/client.ts'

export class ProfileActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ProfileActionError'
  }
}

const knownMessages = new Set<string>(Object.values(profileMessages))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toProfileError(error: unknown, fallback: string) {
  if (error instanceof ProfileActionError) return error
  if (isAxiosError(error) && isRecord(error.response?.data)) {
    const message = error.response.data.message
    if (typeof message === 'string' && knownMessages.has(message)) return new ProfileActionError(message)
  }
  return new ProfileActionError(fallback)
}

export async function fetchProfile(signal?: AbortSignal) {
  try {
    const response = await apiClient.get<Profile>('/api/perfil', { signal })
    return response.data
  } catch (error: unknown) {
    throw toProfileError(error, profileMessages.loadFailed)
  }
}

export async function saveProfile(body: ProfileUpdate) {
  try {
    const response = await apiClient.put<Profile>('/api/perfil', body)
    return response.data
  } catch (error: unknown) {
    throw toProfileError(error, profileMessages.saveFailed)
  }
}