// Mesmo valor de --breakpoint-desktop em src/styles/globals.css (80rem).
const desktopMinWidth = 1280

export interface EntrySearch {
  conta?: 'entrar' | 'cadastro'
  retorno?: string
}

export function isDesktopEntry() {
  return window.innerWidth >= desktopMinWidth
}

export function readEntry(search: object): EntrySearch {
  const record = search as Record<string, unknown>
  const entry: EntrySearch = {}
  if (record.conta === 'entrar' || record.conta === 'cadastro') entry.conta = record.conta
  if (typeof record.retorno === 'string' && record.retorno.length > 0) entry.retorno = record.retorno
  return entry
}

export function entrySearch(search: Record<string, unknown>): EntrySearch {
  return readEntry(search)
}

export function authRouteSearch(search: Record<string, unknown>) {
  const retorno = readEntry(search).retorno
  if (!retorno) return {}
  return { retorno }
}

export function safeReturnPath(value: string): string {
  const trimmed = value.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return '/'
  if (trimmed.includes('\\') || trimmed.includes('://')) return '/'
  let url: URL
  try {
    url = new URL(trimmed, 'http://kurio.local')
  } catch {
    return '/'
  }
  if (url.origin !== 'http://kurio.local') return '/'
  if (url.username.length > 0 || url.password.length > 0) return '/'
  if (!url.pathname.startsWith('/') || url.pathname.startsWith('//')) return '/'
  if (url.pathname === '/entrar' || url.pathname === '/cadastro') return '/'
  return `${url.pathname}${url.search}`
}

export function pathWhenAlreadySignedIn(retorno: string | undefined) {
  if (!retorno) return '/'
  return safeReturnPath(retorno)
}

export function hrefWithConta(pathname: string, search: object, conta: 'entrar' | 'cadastro') {
  const params = new URLSearchParams()
  const record = search as Record<string, unknown>
  for (const [key, value] of Object.entries(record)) {
    if (key === 'conta' || typeof value !== 'string' || value.length === 0) continue
    params.append(key, value)
  }
  params.set('conta', conta)
  return `${pathname}?${params.toString()}`
}

export function hrefWithoutEntry(pathname: string, search: object) {
  const params = new URLSearchParams()
  const record = search as Record<string, unknown>
  for (const [key, value] of Object.entries(record)) {
    if (key === 'conta' || key === 'retorno') continue
    if (typeof value !== 'string' || value.length === 0) continue
    params.append(key, value)
  }
  const text = params.toString()
  return text.length === 0 ? pathname : `${pathname}?${text}`
}

export function pathAfterSuccess(input: {
  retorno: string | undefined
  desktop: boolean
  pathname: string
  search: object
}) {
  if (input.retorno) return safeReturnPath(input.retorno)
  if (!input.desktop) return '/'
  return hrefWithoutEntry(input.pathname, input.search)
}

export function entryHref(returnTo: string, desktop: boolean) {
  const params = new URLSearchParams()
  if (desktop) params.set('conta', 'entrar')
  params.set('retorno', returnTo)
  return desktop ? `/?${params.toString()}` : `/entrar?${params.toString()}`
}

export function isPrivatePath(pathname: string) {
  return (
    pathname === '/perfil' ||
    pathname === '/carteiras' ||
    pathname === '/pagamento' ||
    pathname.startsWith('/pedidos/')
  )
}

export function returnToFrom(location: { pathname: string; searchStr?: string }) {
  return `${location.pathname}${location.searchStr ?? ''}`
}
