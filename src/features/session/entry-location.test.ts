import { describe, expect, it } from 'vitest'
import {
  entryHref,
  hrefWithoutEntry,
  pathAfterSuccess,
  pathWhenAlreadySignedIn,
  safeReturnPath,
} from '@/features/session/entry-location.ts'

describe('caminho de retorno', () => {
  it('aceita caminho interno e recusa entrar, cadastro e endereço de fora', () => {
    expect(safeReturnPath('/carrinho')).toBe('/carrinho')
    expect(safeReturnPath('/nfts/neon-vessel-552?q=neon')).toBe('/nfts/neon-vessel-552?q=neon')
    expect(safeReturnPath('/perfil')).toBe('/perfil')
    expect(safeReturnPath('https://fora.exemplo')).toBe('/')
    expect(safeReturnPath('//fora.exemplo')).toBe('/')
    expect(safeReturnPath('/entrar')).toBe('/')
    expect(safeReturnPath('/cadastro')).toBe('/')
    expect(safeReturnPath('/cadastro?retorno=/perfil')).toBe('/')
  })

  it('manda quem já entrou para o retorno válido ou para o início', () => {
    expect(pathWhenAlreadySignedIn(undefined)).toBe('/')
    expect(pathWhenAlreadySignedIn('/carrinho')).toBe('/carrinho')
    expect(pathWhenAlreadySignedIn('https://fora.exemplo')).toBe('/')
  })

  it('no desktop sem retorno fica na página e abaixo de 1440 vai para o início', () => {
    expect(
      pathAfterSuccess({
        retorno: undefined,
        desktop: true,
        pathname: '/carrinho',
        search: { conta: 'entrar', q: 'neon' },
      }),
    ).toBe('/carrinho?q=neon')
    expect(
      pathAfterSuccess({
        retorno: undefined,
        desktop: false,
        pathname: '/entrar',
        search: {},
      }),
    ).toBe('/')
    expect(
      pathAfterSuccess({
        retorno: '/entrar',
        desktop: true,
        pathname: '/',
        search: { conta: 'entrar' },
      }),
    ).toBe('/')
  })

  it('a guarda aponta para o painel ou para a tela cheia', () => {
    expect(entryHref('/perfil', true)).toBe('/?conta=entrar&retorno=%2Fperfil')
    expect(entryHref('/pedidos/ped-9', false)).toBe('/entrar?retorno=%2Fpedidos%2Fped-9')
    expect(hrefWithoutEntry('/carrinho', { conta: 'entrar', retorno: '/perfil', q: 'neon' })).toBe(
      '/carrinho?q=neon',
    )
  })
})
