import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import {
  AlertIcon,
  ChartIcon,
  DownloadIcon,
  ExitIcon,
  HeartIcon,
  PersonIcon,
  PinIcon,
  SidebarCartIcon,
} from '@/features/profile/account-icons.tsx'
import { useEndSession } from '@/features/session/use-end-session.ts'

export function AccountFrame({
  active,
  children,
}: {
  active: 'perfil' | 'carteiras'
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-6 desktop:flex-row desktop:items-start desktop:gap-[27px]">
      <AccountSidebar active={active} />
      <div className="min-w-0 w-full desktop:flex-1">{children}</div>
    </div>
  )
}

const idleItem =
  'relative flex h-[45px] w-full items-center gap-2 bg-transparent p-0 px-2 font-normal text-text-accent'

function SidebarRow({
  active,
  children,
}: {
  active: boolean
  children: ReactNode
}) {
  return (
    <div className="relative flex h-[45px] items-center gap-2 px-2">
      {active ? <span className="absolute inset-y-0 left-0 w-1 bg-primary" aria-hidden /> : null}
      {children}
    </div>
  )
}

export function AccountSidebar({ active }: { active: 'perfil' | 'carteiras' }) {
  const endSession = useEndSession()

  return (
    <nav className="w-full bg-surface-card desktop:w-[311px] desktop:shrink-0">
      <p className="m-0 px-2 pt-2 font-bold text-foreground">Meu perfil</p>
      <SidebarRow active={active === 'perfil'}>
        <Link to="/perfil" className={`${idleItem} no-underline`}>
          <span className="text-text-secondary">
            <PersonIcon />
          </span>
          Dados do perfil
        </Link>
      </SidebarRow>
      <SidebarRow active={active === 'carteiras'}>
        <Link to="/carteiras" className={`${idleItem} no-underline`}>
          <span className="text-text-secondary">
            <PinIcon />
          </span>
          Carteiras
        </Link>
      </SidebarRow>
      <SidebarRow active={false}>
        <button type="button" className={idleItem}>
          <span className="text-text-secondary">
            <SidebarCartIcon />
          </span>
          Atividade
        </button>
      </SidebarRow>
      <SidebarRow active={false}>
        <button type="button" className={idleItem}>
          <span className="text-text-secondary">
            <HeartIcon />
          </span>
          Lista de interesse
        </button>
      </SidebarRow>
      <SidebarRow active={false}>
        <button type="button" className={idleItem}>
          <span className="text-text-secondary">
            <ChartIcon />
          </span>
          Ofertas
        </button>
      </SidebarRow>
      <SidebarRow active={false}>
        <button type="button" className={idleItem}>
          <span className="text-text-secondary">
            <DownloadIcon />
          </span>
          Arquivos baixados
        </button>
      </SidebarRow>
      <SidebarRow active={false}>
        <button type="button" className={idleItem}>
          <span className="text-text-secondary">
            <AlertIcon />
          </span>
          Suporte
        </button>
      </SidebarRow>
      <div className="h-px w-full bg-border" aria-hidden />
      <SidebarRow active={false}>
        <button
          type="button"
          className={`${idleItem} font-bold`}
          onClick={() => void endSession()}
        >
          <span className="text-text-secondary">
            <ExitIcon />
          </span>
          Sair
        </button>
      </SidebarRow>
    </nav>
  )
}