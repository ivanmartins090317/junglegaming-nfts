import { describe, expect, it } from 'vitest'
import { addGuestOne, clearGuestDraft, readGuestDraft, writeGuestDraft } from '@/features/cart/guest-draft.ts'

describe('rascunho do visitante', () => {
  it('fica nesta aba e some quando a aba esquece', () => {
    sessionStorage.clear()
    localStorage.clear()
    writeGuestDraft([
      { nftId: 'emerald-ape-042', quantity: 1 },
      { nftId: 'emerald-ape-042', quantity: 1 },
    ])
    expect(readGuestDraft()).toEqual([{ nftId: 'emerald-ape-042', quantity: 2 }])
    expect(localStorage.getItem('kurio.carrinho.rascunho')).toBeNull()
    expect(sessionStorage.getItem('kurio.carrinho.rascunho')).not.toBeNull()

    addGuestOne('sage-nomad-009')
    expect(readGuestDraft()).toEqual([
      { nftId: 'emerald-ape-042', quantity: 2 },
      { nftId: 'sage-nomad-009', quantity: 1 },
    ])

    clearGuestDraft()
    expect(readGuestDraft()).toEqual([])
    expect(sessionStorage.getItem('kurio.carrinho.rascunho')).toBeNull()
  })

  it('ignora conteúdo que não é linha', () => {
    sessionStorage.setItem('kurio.carrinho.rascunho', '{')
    expect(readGuestDraft()).toEqual([])
    sessionStorage.setItem('kurio.carrinho.rascunho', JSON.stringify([{ nftId: '', quantity: 2 }, { quantity: 1 }]))
    expect(readGuestDraft()).toEqual([])
  })
})
