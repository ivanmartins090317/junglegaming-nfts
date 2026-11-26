import type { CartLine, CartLineRef, CartView, Quote } from '@/lib/contracts/cart.ts'
import type { Profile } from '@/lib/contracts/profile.ts'
import { profileMessages } from '@/lib/contracts/profile.ts'
import type { PrimaryWallet } from '@/lib/contracts/wallet.ts'
import { walletMessages } from '@/lib/contracts/wallet.ts'
import type { SessionUser } from '@/lib/contracts/session.ts'
import { sessionMessages } from '@/lib/contracts/session.ts'
import { blankProfile, blankWallet } from '@/mocks/fixtures/users.ts'
import type { Nft } from '@/lib/contracts/nft.ts'
import { buildQuote, type PricedLine } from '@/lib/money.ts'
import { catalogSeed } from '@/mocks/fixtures/catalog.ts'
import { usersSeed, type SeedUser } from '@/mocks/fixtures/users.ts'

export interface OrderClose {
  userId: string
  key: string
  signature: string
  orderId: string
}

export interface LiveStore {
  nfts: Nft[]
  users: SeedUser[]
  sessionUserId: string | null
  nextUserId: number
  nextOrderSeq: number
  orderCloses: OrderClose[]
  nftVersions: Record<string, number>
  orderVersions: Record<string, number>
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

function seedVersions(ids: string[]) {
  const versions: Record<string, number> = {}
  for (const id of ids) versions[id] = 1
  return versions
}

const seed: LiveStore = {
  nfts: catalogSeed,
  users: usersSeed,
  sessionUserId: null,
  nextUserId: 3,
  nextOrderSeq: 1,
  orderCloses: [],
  nftVersions: seedVersions(catalogSeed.map((nft) => nft.id)),
  orderVersions: { 'ped-ada-1': 1, 'ped-bruno-1': 1 },
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
    profile: blankProfile(),
    wallet: blankWallet(),
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

export function withStore<T>(read: (store: LiveStore) => T) {
  return read(liveStore)
}

export function resetStore() {
  liveStore = cloneStore(seed)
}

function isPositiveInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 1
}

function currentUser() {
  if (!liveStore.sessionUserId) return undefined
  return liveStore.users.find((user) => user.id === liveStore.sessionUserId)
}

export function parseCartLines(value: unknown): CartLineRef[] {
  if (!Array.isArray(value)) return []
  const lines: CartLineRef[] = []
  for (const item of value) {
    if (typeof item !== 'object' || item === null) continue
    const record = item as Record<string, unknown>
    if (typeof record.nftId !== 'string' || record.nftId.length === 0) continue
    if (!isPositiveInt(record.quantity)) continue
    lines.push({ nftId: record.nftId, quantity: record.quantity })
  }
  return normalizeRefs(lines)
}

function normalizeRefs(lines: CartLineRef[]) {
  const next: CartLineRef[] = []
  for (const line of lines) {
    if (!isPositiveInt(line.quantity) || line.nftId.length === 0) continue
    const found = next.find((item) => item.nftId === line.nftId)
    if (found) found.quantity += line.quantity
    else next.push({ nftId: line.nftId, quantity: line.quantity })
  }
  return next
}

function pricedLines(lines: CartLineRef[]): PricedLine[] {
  const priced: PricedLine[] = []
  for (const line of normalizeRefs(lines)) {
    const nft = liveStore.nfts.find((item) => item.id === line.nftId)
    if (!nft) continue
    priced.push({ nftId: nft.id, unitPrice: nft.price, quantity: line.quantity })
  }
  return priced
}

function toCartView(lines: CartLineRef[]): CartView {
  const view: CartLine[] = []
  for (const line of pricedLines(lines)) {
    const nft = liveStore.nfts.find((item) => item.id === line.nftId)
    if (!nft) continue
    view.push({
      nftId: nft.id,
      name: nft.name,
      image: nft.image,
      unitPrice: nft.price,
      quantity: line.quantity,
    })
  }
  return { lines: view }
}

export type CartWrite =
  | { ok: true; cart: CartView }
  | { ok: false; status: 400 | 401 | 404 }

function denied(): CartWrite {
  return { ok: false, status: 401 }
}

export function readSessionCart(): CartView | undefined {
  const user = currentUser()
  if (!user) return undefined
  return toCartView(user.cart)
}

export function resolveCart(lines: CartLineRef[]) {
  return toCartView(lines)
}

export function quoteSessionCart(): Quote | undefined {
  const user = currentUser()
  if (!user) return undefined
  return buildQuote(pricedLines(user.cart))
}

export function quoteCartLines(lines: CartLineRef[]) {
  return buildQuote(pricedLines(lines))
}

export function addSessionItem(nftId: unknown): CartWrite {
  const user = currentUser()
  if (!user) return denied()
  if (typeof nftId !== 'string' || !liveStore.nfts.some((nft) => nft.id === nftId)) {
    return { ok: false, status: 404 }
  }
  const found = user.cart.find((line) => line.nftId === nftId)
  if (found) found.quantity += 1
  else user.cart.push({ nftId, quantity: 1 })
  return { ok: true, cart: toCartView(user.cart) }
}

export function setSessionQuantity(nftId: string, quantity: unknown): CartWrite {
  const user = currentUser()
  if (!user) return denied()
  if (!isPositiveInt(quantity)) return { ok: false, status: 400 }
  const found = user.cart.find((line) => line.nftId === nftId)
  if (!found) return { ok: false, status: 404 }
  found.quantity = quantity
  return { ok: true, cart: toCartView(user.cart) }
}

export function removeSessionItem(nftId: string): CartWrite {
  const user = currentUser()
  if (!user) return denied()
  user.cart = user.cart.filter((line) => line.nftId !== nftId)
  return { ok: true, cart: toCartView(user.cart) }
}

export function mergeSessionCart(lines: CartLineRef[]): CartWrite {
  const user = currentUser()
  if (!user) return denied()
  for (const line of normalizeRefs(lines)) {
    if (!liveStore.nfts.some((nft) => nft.id === line.nftId)) continue
    const found = user.cart.find((item) => item.nftId === line.nftId)
    if (found) found.quantity += line.quantity
    else user.cart.push({ nftId: line.nftId, quantity: line.quantity })
  }
  return { ok: true, cart: toCartView(user.cart) }
}

function filled(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

export type ProfileResult =
  | { ok: true; profile: Profile }
  | { ok: false; status: 400 | 401 | 409; message: string }

export function readProfile(): ProfileResult {
  const user = currentUser()
  if (!user) return { ok: false, status: 401, message: 'Não autorizado.' }
  const profile: Profile = {
    displayName: user.name,
    email: user.email,
    username: user.profile.username,
    ensName: user.profile.ensName,
    walletNickname: user.profile.walletNickname,
  }
  return { ok: true, profile }
}

export function saveProfile(input: {
  displayName: unknown
  username: unknown
  email: unknown
  ensName: unknown
  walletNickname: unknown
  currentPassword: unknown
  nextPassword: unknown
  confirmPassword: unknown
}): ProfileResult {
  const user = currentUser()
  if (!user) return { ok: false, status: 401, message: 'Não autorizado.' }

  const displayName = filled(input.displayName)
  const username = filled(input.username)
  const email = filled(input.email)
  const ensName = filled(input.ensName)
  const walletNickname = filled(input.walletNickname)
  const currentPassword = filled(input.currentPassword)
  const nextPassword = filled(input.nextPassword)
  const confirmPassword = filled(input.confirmPassword)

  if (
    displayName === '' ||
    username === '' ||
    email === '' ||
    ensName === '' ||
    walletNickname === ''
  ) {
    return { ok: false, status: 400, message: profileMessages.required }
  }

  const taken = liveStore.users.some(
    (item) => item.id !== user.id && sameEmail(item.email, email),
  )
  if (taken) return { ok: false, status: 409, message: profileMessages.emailTaken }

  const passwordTouched =
    currentPassword !== '' || nextPassword !== '' || confirmPassword !== ''

  if (passwordTouched && currentPassword !== user.password) {
    return { ok: false, status: 400, message: profileMessages.currentPassword }
  }

  if (passwordTouched && (nextPassword === '' || nextPassword !== confirmPassword)) {
    return { ok: false, status: 400, message: profileMessages.passwordMismatch }
  }

  user.name = displayName
  user.email = email
  user.profile = { username, ensName, walletNickname }
  if (passwordTouched) user.password = nextPassword

  const profile: Profile = {
    displayName: user.name,
    email: user.email,
    username: user.profile.username,
    ensName: user.profile.ensName,
    walletNickname: user.profile.walletNickname,
  }
  return { ok: true, profile }
}

export type WalletResult =
  | { ok: true; wallet: PrimaryWallet }
  | { ok: false; status: 400 | 401; message: string }

export function readWallet(): WalletResult {
  const user = currentUser()
  if (!user) return { ok: false, status: 401, message: 'Não autorizado.' }
  return { ok: true, wallet: { ...user.wallet } }
}

export function saveWallet(input: {
  displayName: unknown
  nickname: unknown
  network: unknown
  profileName: unknown
  address: unknown
  secondaryAddress: unknown
  walletType: unknown
  referralCode: unknown
  email: unknown
  ensName: unknown
}): WalletResult {
  const user = currentUser()
  if (!user) return { ok: false, status: 401, message: 'Não autorizado.' }

  const displayName = filled(input.displayName)
  const nickname = filled(input.nickname)
  const profileName = filled(input.profileName)
  const address = filled(input.address)
  const referralCode = filled(input.referralCode)
  const email = filled(input.email)
  const ensName = filled(input.ensName)
  const secondaryAddress = filled(input.secondaryAddress)

  if (
    displayName === '' ||
    nickname === '' ||
    profileName === '' ||
    address === '' ||
    referralCode === '' ||
    email === '' ||
    ensName === ''
  ) {
    return { ok: false, status: 400, message: walletMessages.required }
  }

  user.wallet = {
    displayName,
    nickname,
    network: '',
    profileName,
    address,
    secondaryAddress,
    walletType: '',
    referralCode,
    email,
    ensName,
  }
  return { ok: true, wallet: { ...user.wallet } }
}
