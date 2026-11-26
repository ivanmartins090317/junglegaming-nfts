import { Link, useNavigate, useRouter, useRouterState, useSearch } from '@tanstack/react-router'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { CartIcon, EnterIcon, SearchIcon } from '@/components/layout/chrome-icons.tsx'
import { SlidersIcon } from '@/components/layout/mobile-icons.tsx'
import { catalogSearchParams, readCatalogQuery } from '@/features/catalog/catalog-search.ts'
import { entrySearch, hrefWithConta, isDesktopEntry } from '@/features/session/entry-location.ts'
import { useSessionQuery } from '@/lib/query/session.ts'
import { useEndSession } from '@/features/session/use-end-session.ts'

const navItemClass =
  'relative inline-flex h-full items-center bg-transparent p-0 text-left font-mono text-[16px] font-normal leading-none text-foreground no-underline'

const navItemActiveClass =
  'relative inline-flex h-full items-center bg-transparent p-0 text-left font-mono text-[16px] font-bold leading-none text-text-accent no-underline after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:bg-primary after:content-[""]'

const quietLink = {
  activeProps: {},
  inactiveProps: {},
}

export function SiteHeader() {
  const navigate = useNavigate()
  const router = useRouter()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const q = readCatalogQuery(useSearch({ strict: false }))
  const session = useSessionQuery()
  const endSession = useEndSession()
  const homeIsActive = pathname === '/'
  const [desktopSearchOpen, setDesktopSearchOpen] = useState(false)
  const replaceRef = useRef(pathname === '/')

  useEffect(() => {
    replaceRef.current = pathname === '/'
  }, [pathname])

  function openHome(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault()
    void navigate({ to: '/' })
  }

  function commitSearch(next: string) {
    const replace = replaceRef.current
    replaceRef.current = true
    const entry = entrySearch(router.state.location.search as Record<string, unknown>)
    void navigate({
      to: '/',
      search: {
        ...entry,
        ...catalogSearchParams(next),
      },
      replace,
    })
  }

  function openEntry() {
    if (!isDesktopEntry()) {
      void navigate({ to: '/entrar' })
      return
    }
    void navigate({
      href: hrefWithConta(pathname, router.state.location.search, 'entrar'),
    })
  }

  function onAccount() {
    if (session.data) {
      void endSession()
      return
    }
    openEntry()
  }

  const desktopFieldVisible = desktopSearchOpen || q.length > 0

  return (
    <header className="w-full">
      <div className="relative hidden h-[45px] items-center justify-between border-b border-border desktop:flex">
        <span className="text-[14px] font-bold leading-none tracking-[0.1em] text-foreground">
          KURIO
        </span>
        <nav className="absolute top-0 left-[377px] flex h-full items-center gap-10" aria-label="Principal">
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
        <div className="flex items-center gap-7">
          {desktopFieldVisible ? (
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-secondary" />
              <Input
                aria-label="Busca"
                value={q}
                placeholder="Explorar coleções"
                onChange={(event) => commitSearch(event.target.value)}
                className="h-[35px] w-[220px] bg-transparent pl-8 text-[14px]"
              />
            </div>
          ) : (
            <button
              type="button"
              aria-label="Busca"
              onClick={() => setDesktopSearchOpen(true)}
              className="bg-transparent p-0 text-foreground"
            >
              <SearchIcon />
            </button>
          )}
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
          <Button type="button" className="w-auto gap-2 px-4" onClick={onAccount}>
            {session.data ? (
              'Sair'
            ) : (
              <>
                <EnterIcon className="size-4" />
                Entrar
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="flex items-center gap-2 desktop:hidden">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-[9px] size-7 -translate-y-1/2 text-secondary" />
          <Input
            aria-label="Busca"
            value={q}
            placeholder="Explorar coleções"
            onChange={(event) => commitSearch(event.target.value)}
            className="h-[45px] border-surface-card bg-surface-card pr-3 pl-[42px] text-[14px] font-medium text-secondary placeholder:text-secondary"
          />
        </div>
        <button
          type="button"
          aria-label="Filtros"
          className="inline-flex size-[45px] shrink-0 items-center justify-center rounded-[var(--radius-page-button)] bg-linear-to-br from-primary/70 to-primary/90 text-ink"
        >
          <SlidersIcon />
        </button>
      </div>
    </header>
  )
}
