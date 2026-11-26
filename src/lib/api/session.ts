import { isAxiosError } from 'axios'
import type { SessionUser, SignInRequest, SignUpRequest } from '@/lib/contracts/session.ts'
import { sessionMessages } from '@/lib/contracts/session.ts'
import { apiClient } from '@/lib/api/client.ts'

export class SessionActionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SessionActionError'
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function toSessionActionError(error: unknown) {
  if (isAxiosError(error) && isRecord(error.response?.data)) {
    const message = error.response.data.message
    if (typeof message === 'string' && message.length > 0) return new SessionActionError(message)
  }
  return new SessionActionError(sessionMessages.loadFailed)
}

export async function fetchSession(context?: { signal?: AbortSignal }): Promise<SessionUser | null> {
  try {
    const response = await apiClient.get<SessionUser>('/api/sessao', { signal: context?.signal })
    return response.data
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response?.status === 401) return null
    throw error
  }
}

export async function signIn(body: SignInRequest): Promise<SessionUser> {
  try {
    const response = await apiClient.post<SessionUser>('/api/sessao', body)
    return response.data
  } catch (error: unknown) {
    throw toSessionActionError(error)
  }
}

export async function signUp(body: SignUpRequest): Promise<SessionUser> {
  try {
    const response = await apiClient.post<SessionUser>('/api/cadastro', body)
    return response.data
  } catch (error: unknown) {
    throw toSessionActionError(error)
  }
}

export async function deleteSession() {
  await apiClient.delete('/api/sessao')
}
