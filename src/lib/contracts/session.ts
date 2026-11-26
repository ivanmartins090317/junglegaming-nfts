export interface SessionUser {
  id: string
  name: string
  email: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export const sessionMessages = {
  credential: 'E-mail ou senha não conferem.',
  emptySignUp: 'Informe nome, e-mail e senha.',
  passwordMismatch: 'As senhas não conferem.',
  emailTaken: 'Este e-mail já tem conta.',
  loadFailed: 'Não foi possível carregar a sessão.',
} as const
