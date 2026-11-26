import { describe, expect, it } from 'vitest'
import { buildQuote } from '@/lib/money.ts'

describe('cotação decimal', () => {
  it('soma o preço pela quantidade e acrescenta a taxa com três casas', () => {
    expect(buildQuote([{ nftId: 'sage-nomad-009', unitPrice: '1.69', quantity: 1 }])).toEqual({
      lineTotals: [{ nftId: 'sage-nomad-009', total: '1.69' }],
      subtotal: '1.69',
      discount: '0.00',
      networkFee: '0.016',
      total: '1.706',
    })
    expect(buildQuote([{ nftId: 'emerald-ape-042', unitPrice: '1.19', quantity: 2 }])).toMatchObject({
      lineTotals: [{ nftId: 'emerald-ape-042', total: '2.38' }],
      subtotal: '2.38',
      total: '2.396',
    })
    expect(
      buildQuote([
        { nftId: 'sage-nomad-009', unitPrice: '1.69', quantity: 3 },
        { nftId: 'emerald-ape-042', unitPrice: '1.19', quantity: 1 },
      ]),
    ).toMatchObject({ subtotal: '6.26', total: '6.276' })
    expect(buildQuote([{ nftId: 'cosmic-bloom-118', unitPrice: '1.29', quantity: 2 }])).toMatchObject({
      lineTotals: [{ total: '2.58' }],
      subtotal: '2.58',
      total: '2.596',
    })
    expect(
      buildQuote([
        { nftId: 'sage-nomad-009', unitPrice: '1.69', quantity: 1 },
        { nftId: 'golden-signal-160', unitPrice: '0.39', quantity: 1 },
      ]),
    ).toMatchObject({ subtotal: '2.08', total: '2.096' })
    expect(buildQuote([{ nftId: 'violet-nomad-314', unitPrice: '1.39', quantity: 1 }])).toMatchObject({
      subtotal: '1.39',
      total: '1.406',
    })
    expect(buildQuote([{ nftId: 'emerald-ape-042', unitPrice: '1.19', quantity: 1 }])).toMatchObject({
      subtotal: '1.19',
      total: '1.206',
    })
  })

  it('sem linha a taxa e o total ficam em zero', () => {
    expect(buildQuote([])).toEqual({
      lineTotals: [],
      subtotal: '0.00',
      discount: '0.00',
      networkFee: '0.00',
      total: '0.00',
    })
  })
})
