import { createFileRoute } from '@tanstack/react-router'
import { CartPage } from '@/features/cart/cart-page.tsx'

export const Route = createFileRoute('/carrinho')({
  component: CartRoute,
})

function CartRoute() {
  return <CartPage />
}
