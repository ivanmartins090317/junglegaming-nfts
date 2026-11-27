import type { Nft } from '@/lib/contracts/nft.ts'

export interface NftDetailSection {
  label: string
  text: string
}

export interface NftDetailContent {
  about: string
  editions: readonly string[]
  selectedEdition: string
  editionStatus: string
  ratingCount: number
  tokenId: string
  collection: string
  attributes: string
  paragraphs: readonly string[]
  sections: readonly NftDetailSection[]
}

interface NftDetailOverride {
  collection: string
  attributes: string
}

// Texto do detalhe é conteúdo de apresentação: o contrato Nft só carrega
// nome, preço, imagem e marca rara. O que a tela desenha além disso nasce aqui.
const overrides: Record<string, NftDetailOverride> = {
  'emerald-ape-042': { collection: 'Kurio Apes', attributes: 'Óculos, Esmeralda, Raro' },
}

const editions = ['1/1', '1/10', '1/50'] as const

function tokenIdOf(name: string) {
  const digits = /#(\d+)/.exec(name)?.[1]
  return digits ? `#${digits.padStart(4, '0')}` : 'Sem número'
}

export function nftDetailContent(nft: Nft): NftDetailContent {
  const override = overrides[nft.id]
  return {
    about:
      'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.',
    editions,
    selectedEdition: '1/50',
    editionStatus: 'ABERTA',
    ratingCount: 19,
    tokenId: tokenIdOf(nft.name),
    collection: override?.collection ?? 'Kurio Editions',
    attributes: override?.attributes ?? (nft.rare ? 'Raro' : 'Comum'),
    paragraphs: [
      `${nft.name} é uma obra digital 1/50 finalizada à mão da coleção Kurio Editions. Cada atributo fica armazenado nos metadados do token e verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.`,
      'A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores e um registro permanente de procedência registrada na rede. Nova Soto recebe 5% de direitos autorais nas vendas secundárias, apoiando novos trabalhos e lançamentos da comunidade.',
    ],
    sections: [
      { label: 'Rede:', text: 'Cunhado na Ethereum com procedência imutável e metadados armazenados no IPFS.' },
      {
        label: 'Contrato:',
        text: 'Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelos mercados compatíveis.',
      },
      { label: 'Direitos autorais:', text: '0x7A42...19E8 • Contrato inteligente ERC-721 verificado.' },
    ],
  }
}
