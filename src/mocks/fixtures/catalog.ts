import type { Nft } from '@/lib/contracts/nft.ts'

export const catalogSeed: Nft[] = [
  { id: 'emerald-ape-042', name: 'Emerald Ape #042', price: '1.19', image: '/home/emerald.png' },
  { id: 'sage-nomad-009', name: 'Sage Nomad #009', price: '1.69', image: '/home/sage.png' },
  {
    id: 'neon-vessel-552',
    name: 'Neon Vessel #552',
    price: '1.99',
    compareAt: '2.29',
    image: '/home/neon.png',
    rare: true,
  },
  { id: 'cosmic-bloom-118', name: 'Cosmic Bloom #118', price: '1.29', image: '/home/cosmic.png' },
  { id: 'violet-nomad-314', name: 'Violet Nomad #314', price: '1.39', image: '/home/violet.png' },
  { id: 'ivory-baron-088', name: 'Ivory Baron #088', price: '1.79', image: '/home/ivory.png' },
  { id: 'golden-beat-207', name: 'Golden Beat #207', price: '0.99', image: '/home/golden.png' },
  { id: 'golden-signal-160', name: 'Golden Signal #160', price: '0.39', image: '/home/golden.png' },
]
