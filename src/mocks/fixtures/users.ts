export interface SeedCartLine {
  nftId: string
  quantity: number
}

export interface SeedOrderItem {
  nftId: string
  quantity: number
}

export interface SeedOrder {
  id: string
  item: SeedOrderItem
  total: string
  status: 'confirmado'
}

export interface SeedUser {
  id: string
  name: string
  email: string
  password: string
  favorites: string[]
  cart: SeedCartLine[]
  orders: SeedOrder[]
}

export const usersSeed: SeedUser[] = [
  {
    id: 'usr-ada',
    name: 'Ada',
    email: 'ada@kurio.test',
    password: 'kurio',
    favorites: ['emerald-ape-042', 'neon-vessel-552'],
    cart: [{ nftId: 'sage-nomad-009', quantity: 1 }],
    orders: [
      {
        id: 'ped-ada-1',
        item: { nftId: 'ivory-baron-088', quantity: 1 },
        total: '1.79',
        status: 'confirmado',
      },
    ],
  },
  {
    id: 'usr-bruno',
    name: 'Bruno',
    email: 'bruno@kurio.test',
    password: 'kurio',
    favorites: ['golden-beat-207'],
    cart: [{ nftId: 'cosmic-bloom-118', quantity: 2 }],
    orders: [
      {
        id: 'ped-bruno-1',
        item: { nftId: 'golden-signal-160', quantity: 1 },
        total: '0.39',
        status: 'confirmado',
      },
    ],
  },
]
