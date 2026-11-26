import { describe, expect, it } from 'vitest'
import { catalogSearch, normalizeCatalogQuery, parseCatalogLocation, stringifyCatalogLocation } from '@/features/catalog/catalog-search.ts'

describe('texto da busca no endereço', () => {
  it('guarda o texto e descarta a busca vazia', () => {
    expect(catalogSearch({ q: 'neon' })).toEqual({ q: 'neon' })
    expect(catalogSearch({ q: '' })).toEqual({})
    expect(catalogSearch({})).toEqual({})
  })

  it('lê um número do endereço como texto', () => {
    expect(catalogSearch({ q: 552 })).toEqual({ q: '552' })
    expect(normalizeCatalogQuery(552)).toBe('552')
    expect(parseCatalogLocation('?q=552')).toEqual({ q: '552' })
    expect(stringifyCatalogLocation({ q: '552' })).toBe('?q=552')
    expect(stringifyCatalogLocation({})).toBe('')
  })
})
