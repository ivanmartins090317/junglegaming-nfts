import { Link, useRouterState } from '@tanstack/react-router'
import {
  CartSolidIcon,
  HeartSolidIcon,
  HomeSolidIcon,
  ScanIcon,
  UserSolidIcon,
} from '@/components/layout/mobile-icons.tsx'
import { useCartBadgeCount } from '@/features/cart/use-cart-badge.ts'

const quietLink = {
  activeProps: {},
  inactiveProps: {},
}

const itemClass = 'mt-7 inline-flex size-11 items-center justify-center bg-transparent p-0 no-underline'

export function MobileTabs() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const homeIsActive = pathname === '/'
  const cartCount = useCartBadgeCount()

  return (
    <nav aria-label="Atalhos" className="fixed inset-x-0 bottom-0 z-20 h-[95px] desktop:hidden">
      <div aria-hidden="true" className="absolute inset-0 rounded-t-[28px] bg-surface-card" />
      <div
        aria-hidden="true"
        className="absolute -top-[31px] left-1/2 size-20 -translate-x-1/2 rounded-full bg-ink"
      />
      <ul className="relative m-0 grid h-full list-none grid-cols-[1fr_1fr_80px_1fr_1fr] items-start justify-items-center p-0">
        <li className="translate-x-[3px]">
          <Link
            to="/"
            {...quietLink}
            aria-current={homeIsActive ? 'page' : undefined}
            className={`${itemClass} ${homeIsActive ? 'text-text-accent' : 'text-text-secondary'}`}
          >
            <HomeSolidIcon />
            <span className="sr-only">Início</span>
          </Link>
        </li>
        <li className="-translate-x-2">
          <button type="button" aria-label="Favoritos" className={`${itemClass} text-text-secondary`}>
            <HeartSolidIcon />
          </button>
        </li>
        <li className="relative size-full">
          <button
            type="button"
            aria-label="Carteira"
            className="absolute -top-[30px] left-1/2 inline-flex size-16 -translate-x-1/2 items-center justify-center rounded-full bg-linear-to-b from-primary/50 to-primary/90 p-0 text-foreground"
          >
            <span className="absolute top-0 right-0 inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-ink">
              2
            </span>
            <ScanIcon />
          </button>
        </li>
        <li className="translate-x-3">
          <Link
            to="/carrinho"
            {...quietLink}
            aria-label="Carrinho"
            className={`${itemClass} relative text-text-secondary`}
          >
            <span className="absolute top-1 right-0 inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-primary text-[10px] font-bold leading-none text-ink">
              {cartCount}
            </span>
            <CartSolidIcon />
            <span className="sr-only">Carrinho</span>
          </Link>
        </li>
        <li className="-translate-x-[9px]">
          <Link to="/perfil" {...quietLink} aria-label="Perfil" className={`${itemClass} text-text-secondary`}>
            <UserSolidIcon />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
