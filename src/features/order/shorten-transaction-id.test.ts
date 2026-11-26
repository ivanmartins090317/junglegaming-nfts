import { describe, expect, it } from 'vitest'
import { shortenTransactionId } from '@/features/order/shorten-transaction-id.ts'

describe('identificador da transação', () => {
  it('mostra o começo, a reticência e o fim', () => {
    expect(shortenTransactionId('0xADA1000000000000000000000000A1E1')).toBe('0xADA1…A1E1')
    expect(shortenTransactionId('0xB200000000000000000000000000B2E2')).toBe('0xB200…B2E2')
    expect(shortenTransactionId('0xA91F0000E82C')).toBe('0xA91F…E82C')
  })
})
