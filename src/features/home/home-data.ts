export interface HomeNft {
  id: string
  name: string
  price: string
  compareAt?: string
  image: string
  rare?: boolean
}

export interface HomeArticle {
  date: string
  minutes: string
  title: string
  summary: string
  image: string
}

export const homeNfts: HomeNft[] = [
  { id: 'emerald-ape-042', name: 'Emerald Ape #042', price: '1.19', image: '/home/emerald.png' },
  { id: 'sage-nomad-009', name: 'Sage Nomad #009', price: '1.69', image: '/home/sage.png' },
  { id: 'neon-vessel-552', name: 'Neon Vessel #552', price: '1.99', compareAt: '2.29', image: '/home/neon.png', rare: true },
  { id: 'cosmic-bloom-118', name: 'Cosmic Bloom #118', price: '1.29', image: '/home/cosmic.png' },
  { id: 'violet-nomad-314', name: 'Violet Nomad #314', price: '1.39', image: '/home/violet.png' },
  { id: 'ivory-baron-088', name: 'Ivory Baron #088', price: '1.79', image: '/home/ivory.png' },
  { id: 'golden-beat-207', name: 'Golden Beat #207', price: '0.99', image: '/home/golden.png' },
  { id: 'golden-signal-160', name: 'Golden Signal #160', price: '0.39', image: '/home/golden.png' },
]

export const homeCollections: Array<[string, number]> = [
  ['Arte digital', 33],
  ['Fotografia', 12],
  ['Música', 65],
  ['Arte 3D', 39],
  ['Colecionáveis', 23],
  ['Generativa', 17],
  ['Jogos', 19],
  ['Assinaturas', 13],
  ['Utilidade', 18],
]

export const homeNetworks: Array<[string, number]> = [
  ['Ethereum', 119],
  ['Polygon', 78],
  ['Solana', 86],
]

export const homeTabs = ['Todos os NFTs', 'Novos lançamentos', 'Em alta'] as const

export const homeArticles: HomeArticle[] = [
  {
    date: '12 de setembro',
    minutes: '6',
    title: 'Como funciona a propriedade de NFTs',
    summary: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    image: '/home/neon.png',
  },
  {
    date: '13 de setembro',
    minutes: '2',
    title: '10 artistas digitais para acompanhar',
    summary: 'Conheça criadores que moldam a cultura digital.',
    image: '/home/emerald.png',
  },
  {
    date: '15 de setembro',
    minutes: '3',
    title: 'Raridade, atributos e procedência',
    summary: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    image: '/home/sage.png',
  },
  {
    date: '15 de setembro',
    minutes: '2',
    title: 'Como proteger sua carteira',
    summary: 'Proteja sua carteira, seus ativos e sua identidade.',
    image: '/home/golden.png',
  },
]

export function scrollToGrade() {
  document.getElementById('grade')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
