import type { Nft } from '@/lib/contracts/nft.ts'
import { catalogSeed } from '@/mocks/fixtures/catalog.ts'
import { usersSeed, type SeedUser } from '@/mocks/fixtures/users.ts'

export interface LiveStore {
  nfts: Nft[]
  users: SeedUser[]
}

function cloneStore(store: LiveStore): LiveStore {
  return structuredClone(store)
}

const seed: LiveStore = {
  nfts: catalogSeed,
  users: usersSeed,
}

let liveStore = cloneStore(seed)

export function readCatalog(): Nft[] {
  return cloneStore(liveStore).nfts
}

export function readNft(nftId: string): Nft | undefined {
  return readCatalog().find((nft) => nft.id === nftId)
}

export function readUsers(): SeedUser[] {
  return cloneStore(liveStore).users
}

export function updateLiveStore(change: (store: LiveStore) => void) {
  change(liveStore)
}

export function resetStore() {
  liveStore = cloneStore(seed)
}
