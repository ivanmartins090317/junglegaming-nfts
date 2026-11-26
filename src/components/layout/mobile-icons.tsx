import type { ReactNode } from 'react'

interface IconProps {
  className?: string
}

export function SlidersIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? 'size-[18px]'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="7" cy="7.5" r="2.4" />
      <path d="M13 7.5h6" />
      <path d="M5 16.5h6" />
      <circle cx="17" cy="16.5" r="2.4" />
    </svg>
  )
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? 'size-3.5'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12h17" />
      <path d="M14 5.5 20.5 12 14 18.5" />
    </svg>
  )
}

function SolidSvg({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? 'size-[18px]'}
      fill="currentColor"
    >
      {children}
    </svg>
  )
}

export function HomeSolidIcon({ className }: IconProps) {
  return (
    <SolidSvg className={className}>
      <path
        fillRule="evenodd"
        d="M11.1 3.3a1.4 1.4 0 0 1 1.8 0l7.2 6a1.4 1.4 0 0 1 .5 1.1V19a1.6 1.6 0 0 1-1.6 1.6H15v-5.1a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5.1H4.9A1.6 1.6 0 0 1 3.3 19v-8.6a1.4 1.4 0 0 1 .5-1.1l7.3-6Z"
      />
    </SolidSvg>
  )
}

export function HeartSolidIcon({ className }: IconProps) {
  return (
    <SolidSvg className={className}>
      <path d="M12 20.8c-.4 0-.8-.2-1.100-.5C6.300 16.500 2.800 13.300 2.800 9.300A5.100 5.100 0 0 1 8 4.200c1.600 0 3 .7 4 1.900 1-1.200 2.400-1.900 4-1.900a5.100 5.100 0 0 1 5.200 5.100c0 4-3.500 7.200-8.100 11.200-.3.300-.7.300-1.100.3Z" />
    </SolidSvg>
  )
}

export function CartSolidIcon({ className }: IconProps) {
  return (
    <SolidSvg className={className}>
      <path d="M2.500 3.500a1 1 0 0 1 1-1h1.700a1 1 0 0 1 1 .8L6.500 5H20a1 1 0 0 1 1 1.200l-1.300 7a1.500 1.500 0 0 1-1.500 1.200H8.300a1.500 1.500 0 0 1-1.500-1.200L4.500 4.500H3.500a1 1 0 0 1-1-1Z" />
      <circle cx="9" cy="19.300" r="1.400" />
      <circle cx="17" cy="19.300" r="1.400" />
    </SolidSvg>
  )
}

export function UserSolidIcon({ className }: IconProps) {
  return (
    <SolidSvg className={className}>
      <circle cx="12" cy="7.500" r="4" />
      <path d="M4 19.200C4 16.700 7.600 14.500 12 14.500s8 2.200 8 4.700c0 .9-.7 1.600-1.600 1.600H5.600c-.9 0-1.600-.7-1.600-1.600Z" />
    </SolidSvg>
  )
}

export function ScanIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className ?? 'size-6'}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.500 3.500H7a3.500 3.500 0 0 0-3.500 3.500v1.500" />
      <path d="M15.500 3.500H17a3.500 3.500 0 0 1 3.500 3.500v1.500" />
      <path d="M8.500 20.500H7A3.500 3.500 0 0 1 3.500 17v-1.500" />
      <path d="M15.500 20.500H17a3.500 3.500 0 0 0 3.500-3.500v-1.500" />
      <path d="M2.500 12h19" />
    </svg>
  )
}
