import type { Quote } from '@/lib/contracts/cart.ts'

export interface PricedLine {
  nftId: string
  unitPrice: string
  quantity: number
}

const networkFeeMilli = 16n
const emptyAmount = '0.00'
const feeWithLines = '0.016'

function parseMilli(value: string) {
  if (!/^\d+(\.\d{1,3})?$/.test(value)) throw new Error('decimal inválido')
  const [whole, fraction = ''] = value.split('.')
  const padded = `${fraction}000`.slice(0, 3)
  return BigInt(whole) * 1000n + BigInt(padded)
}

function formatMilli(milli: bigint, places: 2 | 3) {
  if (milli < 0n) throw new Error('decimal negativo')
  if (places === 2 && milli % 10n !== 0n) throw new Error('casa decimal perdida')
  const whole = milli / 1000n
  const fraction = (milli % 1000n).toString().padStart(3, '0')
  const digits = places === 2 ? fraction.slice(0, 2) : fraction
  return `${whole.toString()}.${digits}`
}

export function multiplyDecimal(unitPrice: string, quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity < 0) throw new Error('quantidade inválida')
  return formatMilli(parseMilli(unitPrice) * BigInt(quantity), 2)
}

export function buildQuote(lines: PricedLine[]): Quote {
  if (lines.length === 0) {
    return {
      lineTotals: [],
      subtotal: emptyAmount,
      discount: emptyAmount,
      networkFee: emptyAmount,
      total: emptyAmount,
    }
  }
  const lineTotals = lines.map((line) => ({
    nftId: line.nftId,
    total: multiplyDecimal(line.unitPrice, line.quantity),
  }))
  const subtotalMilli = lineTotals.reduce((sum, line) => sum + parseMilli(line.total), 0n)
  return {
    lineTotals,
    subtotal: formatMilli(subtotalMilli, 2),
    discount: emptyAmount,
    networkFee: feeWithLines,
    total: formatMilli(subtotalMilli + networkFeeMilli, 3),
  }
}
