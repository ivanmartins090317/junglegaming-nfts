import type { CartLineRef } from '@/lib/contracts/cart.ts'

const storageKey = 'kurio.carrinho.rascunho'

function isPositiveInt(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 1
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function readGuestDraft(): CartLineRef[] {
  try {
    const raw = sessionStorage.getItem(storageKey)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    const lines: CartLineRef[] = []
    for (const item of parsed) {
      if (!isRecord(item) || typeof item.nftId !== 'string' || item.nftId.length === 0) continue
      if (!isPositiveInt(item.quantity)) continue
      const found = lines.find((line) => line.nftId === item.nftId)
      if (found) found.quantity += item.quantity
      else lines.push({ nftId: item.nftId, quantity: item.quantity })
    }
    return lines
  } catch {
    return []
  }
}

export function writeGuestDraft(lines: CartLineRef[]) {
  if (lines.length === 0) {
    sessionStorage.removeItem(storageKey)
    return
  }
  sessionStorage.setItem(storageKey, JSON.stringify(lines))
}

export function clearGuestDraft() {
  sessionStorage.removeItem(storageKey)
}

export function addGuestMany(nftId: string, amount: number) {
  if (!isPositiveInt(amount)) return
  const lines = readGuestDraft()
  const found = lines.find((line) => line.nftId === nftId)
  if (found) found.quantity += amount
  else lines.push({ nftId, quantity: amount })
  writeGuestDraft(lines)
}

export function addGuestOne(nftId: string) {
  addGuestMany(nftId, 1)
}

export function setGuestQuantity(nftId: string, quantity: number) {
  if (!isPositiveInt(quantity)) return
  const lines = readGuestDraft()
  const found = lines.find((line) => line.nftId === nftId)
  if (!found) return
  found.quantity = quantity
  writeGuestDraft(lines)
}

export function removeGuestLine(nftId: string) {
  writeGuestDraft(readGuestDraft().filter((line) => line.nftId !== nftId))
}
