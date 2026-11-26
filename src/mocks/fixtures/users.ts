import type { OrderReceipt } from '@/lib/contracts/order.ts'
import { orderDate, orderWallet } from '@/lib/contracts/order.ts'

export interface SeedUser {
  id: string
  name: string
  email: string
  password: string
  favorites: string[]
  cart: SeedCartLine[]
  orders: OrderReceipt[]
}

export interface SeedCartLine {
  nftId: string
  quantity: number
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
        lines: [
          {
            nftId: 'ivory-baron-088',
            name: 'Ivory Baron #088',
            image: '/home/ivory.png',
            quantity: 1,
            total: '1.79',
          },
        ],
        networkFee: '0.00',
        total: '1.79',
        wallet: orderWallet,
        date: orderDate,
        transactionId: '0xADA1000000000000000000000000A1E1',
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
        lines: [
          {
            nftId: 'golden-signal-160',
            name: 'Golden Signal #160',
            image: '/home/golden.png',
            quantity: 1,
            total: '0.39',
          },
        ],
        networkFee: '0.00',
        total: '0.39',
        wallet: orderWallet,
        date: orderDate,
        transactionId: '0xB200000000000000000000000000B2E2',
        status: 'confirmado',
      },
    ],
  },
]
