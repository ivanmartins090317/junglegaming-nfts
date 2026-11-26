export interface PrimaryWallet {
  displayName: string
  nickname: string
  network: string
  profileName: string
  address: string
  secondaryAddress: string
  walletType: string
  referralCode: string
  email: string
  ensName: string
}

export const walletMessages = {
  required: 'Informe os campos obrigatórios da carteira.',
  loadFailed: 'Não foi possível carregar as carteiras.',
  saveFailed: 'Não foi possível salvar a carteira.',
  loading: 'Carregando',
  emptySecondary: 'Você ainda não adicionou uma carteira secundária.',
  paymentCopy: 'Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.',
} as const

export const walletPlaceholders = {
  network: 'Selecione uma rede',
  walletType: 'Selecione uma carteira',
  address: 'Endereço 0x da carteira',
  secondaryAddress: 'ENS ou carteira secundária (opcional)',
  ensSuffix: '.eth',
} as const