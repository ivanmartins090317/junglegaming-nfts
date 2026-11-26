import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { CartIcon, EnterIcon, FilterIcon, SearchIcon } from '@/components/layout/chrome-icons.tsx'

const navItemClass =
  'border-b-[3px] border-solid border-transparent bg-transparent p-0 text-left font-mono text-[16px] font-normal leading-none text-foreground no-underline'

const navItemActiveClass =
  'border-b-[3px] border-solid border-primary bg-transparent p-0 text-left font-mono text-[16px] font-bold leading-none text-text-accent no-underline'

const quietLink = {
  activeProps: {},
  inactiveProps: {},
}

export function SiteHeader() {
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const homeIsActive = pathname === '/'

  function openHome(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    void navigate({ to: '/' })
  }

  return (
    <header className="w-full">
      <div className="hidden min-h-[68px] flex-wrap items-center gap-6 border-b border-border pb-4 md:flex min-[1440px]:flex-nowrap min-[1440px]:gap-10">
        <span className="text-[14px] font-bold leading-none tracking-[0.1em] text-foreground">
          KURIO
        </span>
        <nav className="flex flex-wrap items-center gap-10" aria-label="Principal">
          <Link to="/" {...quietLink} className={homeIsActive ? navItemActiveClass : navItemClass}>
            Início
          </Link>
          <a href="/" className={navItemClass} onClick={openHome}>
            Mercado
          </a>
          <button type="button" className={navItemClass}>
            Criadores
          </button>
          <button type="button" className={navItemClass}>
            Aprenda
          </button>
        </nav>
        <div className="ml-auto flex items-center gap-6">
          <button type="button" aria-label="Busca" className="bg-transparent p-0 text-foreground">
            <SearchIcon />
          </button>
          <Link
            to="/carrinho"
            {...quietLink}
            aria-label="Carrinho"
            className="relative inline-flex items-center text-foreground no-underline"
          >
            <span className="absolute -right-2 -top-2 inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-primary text-[10px] font-bold leading-none text-ink">
              5
            </span>
            <CartIcon />
            <span className="sr-only">Carrinho</span>
          </Link>
          <Button asChild className="w-auto gap-2 px-4">
            <Link to="/entrar" {...quietLink}>
              <EnterIcon className="size-4" />
              Entrar
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-4 md:hidden">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-secondary" />
          <Input
            readOnly
            aria-label="Busca"
            placeholder="Explorar coleções"
            className="h-12 bg-surface-card pr-3 pl-10 text-[14px] text-text-secondary placeholder:text-text-secondary"
          />
        </div>
        <button
          type="button"
          aria-label="Filtros"
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-page-button)] bg-primary text-ink"
        >
          <FilterIcon />
        </button>
      </div>
    </header>
  )
}
