import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useEffect } from 'react'
import { CloseIcon, SocialButtons } from '@/features/session/auth-icons.tsx'
import { AuthForm, type AuthMode } from '@/features/session/auth-form.tsx'
import { useHoldSignedInRedirect } from '@/features/session/use-signed-in-redirect.ts'
import { hrefWithConta, hrefWithoutEntry, isDesktopEntry, readEntry } from '@/features/session/entry-location.ts'
import { cn } from '@/lib/utils.ts'

export function AuthPanel() {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const search = useRouterState({ select: (state) => state.location.search })
  const entry = readEntry(search)
  if (!isDesktopEntry()) return null
  if (entry.conta !== 'entrar' && entry.conta !== 'cadastro') return null
  return <AuthDialog mode={entry.conta} retorno={entry.retorno} pathname={pathname} search={search} />
}

export function AuthScreen({ mode }: { mode: AuthMode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const search = useRouterState({ select: (state) => state.location.search })
  const { retorno } = readEntry(search)
  const title = mode === 'entrar' ? 'Entrar' : 'Criar perfil de colecionador'
  const submitLabel = mode === 'entrar' ? 'Entrar' : 'Criar perfil'
  return (
    <div className="mx-auto flex min-h-screen w-full flex-col bg-ink px-7 pt-[148px] pb-8 text-foreground">
      <p className="m-0 text-center text-[2em] font-bold tracking-[0.1em]">KURIO</p>
      <h1 className="m-0 mt-24 text-center text-[1.35em] leading-normal font-bold">{title}</h1>
      <div className="mt-12">
        <AuthForm
          mode={mode}
          layout="screen"
          retorno={retorno}
          pathname={pathname}
          search={search}
          submitLabel={submitLabel}
          holdRedirect={() => undefined}
        />
      </div>
      <ScreenDivider />
      <div className="mt-4">
        <SocialButtons layout="screen" />
      </div>
      <div className="mt-8 flex justify-center">
        <ScreenFooter mode={mode} retorno={retorno} />
      </div>
    </div>
  )
}

function AuthDialog({
  mode,
  retorno,
  pathname,
  search,
}: {
  mode: AuthMode
  retorno: string | undefined
  pathname: string
  search: object
}) {
  const navigate = useNavigate()
  const hold = useHoldSignedInRedirect(retorno)
  const submitLabel = mode === 'entrar' ? 'Entrar' : 'Criar conta'

  function close() {
    void navigate({ href: hrefWithoutEntry(pathname, search), replace: true })
  }

  function select(next: AuthMode) {
    void navigate({ href: hrefWithConta(pathname, search, next), replace: true })
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      void navigate({ href: hrefWithoutEntry(pathname, search), replace: true })
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [navigate, pathname, search])

  return (
    <div
      role="dialog"
      aria-label={mode === 'entrar' ? 'Entrar' : 'Criar conta'}
      className="fixed top-[161px] left-1/2 z-30 w-[500px] -translate-x-1/2 rounded-[var(--radius-field)] bg-surface-card text-foreground"
    >
      <button
        type="button"
        aria-label="Fechar"
        onClick={close}
        className="absolute top-4 right-4 bg-transparent p-0 text-primary"
      >
        <CloseIcon />
      </button>
      <div className="px-20 pt-10">
        <AuthTabs mode={mode} onSelect={select} />
        <p className="mt-4 mb-0 text-center text-[0.875em] leading-snug text-foreground">{supportCopy(mode)}</p>
        <div className="mt-4">
          <AuthForm
            key={mode}
            mode={mode}
            layout="panel"
            retorno={retorno}
            pathname={pathname}
            search={search}
            submitLabel={submitLabel}
            holdRedirect={hold}
          />
        </div>
      </div>
      <div className="mt-4 border-t border-border" />
      <p className="mt-2 mb-0 text-center text-[0.875em] text-foreground">Ou continue com</p>
      <div className="mt-3 px-20">
        <SocialButtons layout="panel" />
      </div>
      <div className={mode === 'entrar' ? 'h-16' : 'h-8'} />
      <div className="h-2.5 bg-primary" />
    </div>
  )
}

function AuthTabs({ mode, onSelect }: { mode: AuthMode; onSelect: (mode: AuthMode) => void }) {
  return (
    <div className="flex items-center justify-center">
      <TabButton active={mode === 'entrar'} onClick={() => onSelect('entrar')}>
        Entrar
      </TabButton>
      <span className="mx-3 h-4 w-px bg-primary" aria-hidden="true" />
      <TabButton active={mode === 'cadastro'} onClick={() => onSelect('cadastro')}>
        Criar conta
      </TabButton>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'bg-transparent p-0 font-mono text-[1.25em] font-medium',
        active ? 'text-text-accent' : 'text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function supportCopy(mode: AuthMode) {
  if (mode === 'entrar') {
    return (
      <>
        Entre para gerenciar sua carteira, coleção e perfil de
        <br />
        criador.
      </>
    )
  }
  return (
    <>
      Crie seu perfil de colecionador e conecte uma
      <br />
      carteira quando quiser.
    </>
  )
}

function ScreenDivider() {
  return (
    <div className="mt-8 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <p className="m-0 text-[0.875em] text-foreground">Ou continue com</p>
      <span className="h-px flex-1 bg-border" />
    </div>
  )
}

function ScreenFooter({ mode, retorno }: { mode: AuthMode; retorno: string | undefined }) {
  const navigate = useNavigate()
  const next = mode === 'entrar' ? '/cadastro' : '/entrar'
  const label = mode === 'entrar' ? 'Novo na Kurio? Crie uma conta' : 'Já tem uma conta? Entre'
  return (
    <button
      type="button"
      className="bg-transparent p-0 text-center font-mono text-[0.875em] font-normal text-text-secondary"
      onClick={() => {
        void navigate({ to: next, search: retorno ? { retorno } : {} })
      }}
    >
      {label}
    </button>
  )
}
