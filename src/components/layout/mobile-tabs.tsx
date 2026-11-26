import { Link, useRouterState } from '@tanstack/react-router'
import { CartIcon, HeartIcon, HomeIcon, UserIcon, WalletIcon } from '@/components/layout/chrome-icons.tsx'

const quietLink = {
  activeProps: {},
  inactiveProps: {},
}

export function MobileTabs() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const homeIsActive = pathname === '/'

  return (
    <nav
      aria-label="Atalhos"
      className="fixed inset-x-[28px] bottom-3 z-20 h-[64px] rounded-[15px] bg-surface-card md:hidden"
    >
      <ul className="flex h-full items-end justify-between px-4 pb-2">
        <li>
          <Link
            to="/"
            {...quietLink}
            aria-current={homeIsActive ? 'page' : undefined}
            className={`flex flex-col items-center gap-1 text-[10px] no-underline ${homeIsActive ? 'text-primary' : 'text-text-secondary'}`}
          >
            <HomeIcon className="size-5" />
            <span className="sr-only">Início</span>
          </Link>
        </li>
        <li>
          <button type="button" aria-label="Favoritos" className="bg-transparent p-0 text-text-secondary">
            <HeartIcon className="size-5" />
          </button>
        </li>
        <li className="relative -top-5">
          <button
            type="button"
            aria-label="Carteira"
            className="relative inline-flex size-14 items-center justify-center rounded-full bg-primary text-ink"
          >
            <span className="absolute -top-1 right-0 inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-ink">
              2
            </span>
            <WalletIcon className="size-6" />
          </button>
        </li>
        <li>
          <Link to="/carrinho" {...quietLink} aria-label="Carrinho" className="text-text-secondary no-underline">
            <CartIcon className="size-5" />
            <span className="sr-only">Carrinho</span>
          </Link>
        </li>
        <li>
          <Link to="/perfil" {...quietLink} aria-label="Perfil" className="text-text-secondary no-underline">
            <UserIcon className="size-5" />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
