export interface HomeArticle {
  date: string
  minutes: string
  title: string
  summary: string
  image: string
}

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
