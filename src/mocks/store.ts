import type { SessionUser } from '@/lib/contracts/session.ts'
import { sessionMessages } from '@/lib/contracts/session.ts'
import type { Nft } from '@/lib/contracts/nft.ts'
import { catalogSeed } from '@/mocks/fixtures/catalog.ts'
import { usersSeed, type SeedUser } from '@/mocks/fixtures/users.ts'

export interface LiveStore {
  nfts: Nft[]
  users: SeedUser[]
  sessionUserId: string | null
  nextUserId: number
}

export type SessionFailure = {
  ok: false
  status: 400 | 401 | 409
  message: string
}

export type SessionSuccess = {
  ok: true
  user: SessionUser
}

export type SessionResult = SessionSuccess | SessionFailure

function cloneStore(store: LiveStore): LiveStore {
  return structuredClone(store)
}

const seed: LiveStore = {
  nfts: catalogSeed,
  users: usersSeed,
  sessionUserId: null,
  nextUserId: 3,
}

let liveStore = cloneStore(seed)

function publicUser(user: SeedUser): SessionUser {
  return { id: user.id, name: user.name, email: user.email }
}

function sameEmail(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase()
}

function text(value: unknown) {
  return typeof value === 'string' ? value : ''
}

export function readCatalog(): Nft[] {
  return cloneStore(liveStore).nfts
}

export function readNft(nftId: string): Nft | undefined {
  return readCatalog().find((nft) => nft.id === nftId)
}

export function readUsers(): SeedUser[] {
  return cloneStore(liveStore).users
}

export function readSessionUser(): SessionUser | null {
  if (!liveStore.sessionUserId) return null
  const user = liveStore.users.find((item) => item.id === liveStore.sessionUserId)
  if (!user) return null
  return publicUser(user)
}

export function signInUser(email: unknown, password: unknown): SessionResult {
  const normalizedEmail = text(email).trim()
  const secret = text(password)
  if (normalizedEmail.length === 0 || secret.length === 0) {
    return { ok: false, status: 401, message: sessionMessages.credential }
  }
  const user = liveStore.users.find((item) => sameEmail(item.email, normalizedEmail))
  if (!user || user.password !== secret) {
    return { ok: false, status: 401, message: sessionMessages.credential }
  }
  liveStore.sessionUserId = user.id
  return { ok: true, user: publicUser(user) }
}

export function signUpUser(input: {
  name: unknown
  email: unknown
  password: unknown
  confirmPassword: unknown
}): SessionResult {
  const name = text(input.name).trim()
  const email = text(input.email).trim()
  const password = text(input.password)
  const confirmPassword = text(input.confirmPassword)
  if (name.length === 0 || email.length === 0 || password.length === 0) {
    return { ok: false, status: 400, message: sessionMessages.emptySignUp }
  }
  if (confirmPassword !== password) {
    return { ok: false, status: 400, message: sessionMessages.passwordMismatch }
  }
  if (liveStore.users.some((user) => sameEmail(user.email, email))) {
    return { ok: false, status: 409, message: sessionMessages.emailTaken }
  }
  const id = `usr-${liveStore.nextUserId}`
  liveStore.nextUserId += 1
  const user: SeedUser = {
    id,
    name,
    email,
    password,
    favorites: [],
    cart: [],
    orders: [],
  }
  liveStore.users.push(user)
  liveStore.sessionUserId = user.id
  return { ok: true, user: publicUser(user) }
}

export function signOutUser() {
  liveStore.sessionUserId = null
}

export function updateLiveStore(change: (store: LiveStore) => void) {
  change(liveStore)
}

export function resetStore() {
  liveStore = cloneStore(seed)
}
