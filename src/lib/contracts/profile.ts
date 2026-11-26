export interface ProfileDetails {
  username: string
  ensName: string
  walletNickname: string
}

export interface Profile {
  displayName: string
  username: string
  email: string
  ensName: string
  walletNickname: string
}

export interface ProfileUpdate {
  displayName: string
  username: string
  email: string
  ensName: string
  walletNickname: string
  currentPassword: string
  nextPassword: string
  confirmPassword: string
}

export const profileMessages = {
  required: 'Informe os campos obrigatórios do perfil.',
  emailTaken: 'Este e-mail já tem conta.',
  currentPassword: 'A senha atual não confere.',
  passwordMismatch: 'As senhas não conferem.',
  loadFailed: 'Não foi possível carregar o perfil.',
  saveFailed: 'Não foi possível salvar o perfil.',
  loading: 'Carregando',
} as const