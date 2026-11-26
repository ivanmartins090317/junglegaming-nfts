import type { ReactNode } from 'react'

interface IconProps {
  className?: string
}

function Svg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? 'size-5'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export function SearchIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16.5L20 20.5" />
    </Svg>
  )
}

export function CartIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M5 7h15l-1.4 8.2a2 2 0 0 1-2 1.6H8.2a2 2 0 0 1-2-1.6L5 7Z" />
      <path d="M8 7l1-3h6l1 3" />
    </Svg>
  )
}

export function EnterIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M10 7V5H5v14h5v-2" />
      <path d="M10 12h9" />
      <path d="M16 8.5L19.5 12 16 15.5" />
    </Svg>
  )
}

export function FilterIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 8h16" />
      <path d="M4 16h16" />
      <circle cx="9" cy="8" r="2" fill="currentColor" stroke="none" />
      <circle cx="15" cy="16" r="2" fill="currentColor" stroke="none" />
    </Svg>
  )
}

export function HeartIcon({ className, filled = false }: IconProps & { filled?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? 'size-4'}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M12 19s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9Z" />
    </svg>
  )
}

export function HomeIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M7 10.5V19h10v-8.5" />
    </Svg>
  )
}

export function UserIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <circle cx="12" cy="9" r="3" />
      <path d="M6 19c1.2-2.5 3.2-3.5 6-3.5S16.8 16.5 18 19" />
    </Svg>
  )
}

export function WalletIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <rect x="4" y="7" width="16" height="12" rx="2" />
      <path d="M4 11h16" />
      <circle cx="16" cy="15" r="0.8" fill="currentColor" stroke="none" />
    </Svg>
  )
}
