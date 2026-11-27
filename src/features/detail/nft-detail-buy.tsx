import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { HeartIcon, MinusIcon, PlusIcon } from '@/components/layout/chrome-icons.tsx'
import { Button } from '@/components/ui/button.tsx'
import { useCartMutations } from '@/features/cart/use-cart-mutations.ts'

const minQuantity = 1
const maxQuantity = 99

const stepClass =
  'inline-flex size-8 items-center justify-center rounded-full border border-primary bg-transparent p-0 text-primary disabled:opacity-40'

export function NftDetailBuy({ nftId }: { nftId: string }) {
  const navigate = useNavigate()
  const cart = useCartMutations()
  const [quantity, setQuantity] = useState(minQuantity)

  async function buy() {
    const added = await cart.addMany(nftId, quantity)
    if (added) void navigate({ to: '/carrinho' })
  }

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-3">
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Diminuir quantidade"
            disabled={quantity <= minQuantity}
            onClick={() => setQuantity((current) => Math.max(minQuantity, current - 1))}
            className={stepClass}
          >
            <MinusIcon className="size-4" />
          </button>
          <span aria-live="polite" className="w-8 text-center text-[14px] leading-none text-foreground">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Aumentar quantidade"
            disabled={quantity >= maxQuantity}
            onClick={() => setQuantity((current) => Math.min(maxQuantity, current + 1))}
            className={stepClass}
          >
            <PlusIcon className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            disabled={cart.busy}
            className="h-10 w-[130px] text-[14px] font-bold"
            onClick={() => void buy()}
          >
            COMPRAR
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-[128px] items-center justify-center gap-2 rounded-[var(--radius-page-button)] border border-secondary bg-transparent p-0 font-mono text-[14px] leading-none text-foreground"
          >
            <HeartIcon className="size-4" />
            Favoritar
          </button>
        </div>
      </div>
      {cart.message ? <p className="m-0 mt-2 text-[14px] text-foreground">{cart.message}</p> : null}
    </div>
  )
}
