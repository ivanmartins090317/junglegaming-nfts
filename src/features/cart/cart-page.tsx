import { useNavigate, useRouter } from '@tanstack/react-router'
import { cartMessages } from '@/lib/contracts/cart.ts'
import { CartFooter } from '@/features/cart/cart-footer.tsx'
import { CartLines } from '@/features/cart/cart-lines.tsx'
import { CartRecommendations } from '@/features/cart/cart-recommendations.tsx'
import { CartSummary } from '@/features/cart/cart-summary.tsx'
import { useCartScreen } from '@/features/cart/use-cart-screen.ts'

export function CartPage() {
  const screen = useCartScreen()
  const listMessage = listCopy(screen.waiting, screen.failed, screen.lines.length === 0)
  const notice = screen.mergeFailed ? cartMessages.mergeFailed : screen.mutations.message

  return (
    <div>
      <CartMobileBar />
      <p className="m-0 mb-3 hidden font-bold text-foreground desktop:block">Início / Mercado / Carrinho</p>
      <div className="desktop:grid desktop:grid-cols-[minmax(0,1fr)_330px] desktop:items-start desktop:gap-[85px]">
        <div className="pb-80 desktop:pb-0">
          {listMessage ? <p className="m-0 text-foreground">{listMessage}</p> : null}
          {!screen.failed && screen.lines.length > 0 ? (
            <CartLines
              lines={screen.lines}
              quote={screen.quote}
              busy={screen.mutations.busy}
              onIncrease={(nftId) => void screen.mutations.addOne(nftId)}
              onDecrease={(nftId) => {
                const line = screen.lines.find((item) => item.nftId === nftId)
                if (!line || line.quantity <= 1) return
                void screen.mutations.setQuantity(nftId, line.quantity - 1)
              }}
              onRemove={(nftId) => void screen.mutations.remove(nftId)}
            />
          ) : null}
          {notice ? <p className="m-0 mt-3 text-foreground">{notice}</p> : null}
        </div>
        <CartSummary
          variant="desktop"
          quote={screen.quote}
          quoteFailed={screen.quoteFailed}
          canCheckout={screen.canCheckout}
        />
      </div>
      <CartSummary
        variant="mobile"
        quote={screen.quote}
        quoteFailed={screen.quoteFailed}
        canCheckout={screen.canCheckout}
      />
      <CartRecommendations />
      <CartFooter />
    </div>
  )
}

function listCopy(waiting: boolean, failed: boolean, empty: boolean) {
  if (waiting) return cartMessages.loading
  if (failed) return cartMessages.loadFailed
  if (empty) return cartMessages.empty
  return null
}

function CartMobileBar() {
  const router = useRouter()
  const navigate = useNavigate()

  function goBack() {
    if (router.history.length > 1) {
      router.history.back()
      return
    }
    void navigate({ to: '/' })
  }

  return (
    <div className="relative mb-4 desktop:hidden">
      <button
        type="button"
        aria-label="Voltar"
        onClick={goBack}
        className="absolute top-1/2 left-0 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface-card font-mono text-text-accent"
      >
        {'<'}
      </button>
      <h1 className="m-0 text-center font-bold text-foreground">Carrinho de NFTs</h1>
    </div>
  )
}
