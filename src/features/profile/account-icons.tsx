import type { ReactNode } from 'react'

function icon(children: ReactNode) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  )
}

export function PersonIcon() {
  return icon(
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c.7-4 4.2-6 7-6s6.3 2 7 6" />
    </>,
  )
}

export function PinIcon() {
  return icon(
    <>
      <path d="M12 21s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </>,
  )
}

export function SidebarCartIcon() {
  return icon(
    <>
      <path d="M6 6h15l-1.5 9H8L6 6Z" />
      <path d="M6 6 5 3H2" />
      <circle cx="9.5" cy="19" r="1.5" />
      <circle cx="17.5" cy="19" r="1.5" />
    </>,
  )
}

export function HeartIcon() {
  return icon(<path d="M12 20s-6.5-4.5-8.5-8.5C1.5 8 4 5 7 5c2 0 3.3 1 5 3 1.7-2 3-3 5-3 3 0 5.5 3 3.5 6.5C18.5 15.5 12 20 12 20Z" />)
}

export function ChartIcon() {
  return icon(
    <>
      <rect x="4" y="4" width="16" height="16" rx="1" />
      <path d="M8 16V11M12 16V8M16 16V13" />
    </>,
  )
}

export function DownloadIcon() {
  return icon(
    <>
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 20h14" />
    </>,
  )
}

export function AlertIcon() {
  return icon(
    <>
      <path d="M12 3 2 21h20L12 3Z" />
      <path d="M12 10v4" />
      <path d="M12 17h.01" />
    </>,
  )
}

export function ExitIcon() {
  return icon(
    <>
      <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
      <path d="M14 12H4" />
      <path d="m17 9 3 3-3 3" />
    </>,
  )
}

export function ChevronIcon() {
  return icon(<path d="m6 9 6 6 6-6" />)
}

export function ImageIcon() {
  return icon(
    <>
      <rect x="4" y="5" width="16" height="14" rx="1" />
      <circle cx="9" cy="10" r="1.5" />
      <path d="m4 16 5-5 4 4 3-3 4 4" />
    </>,
  )
}

export function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

export function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    >
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M4 5l16 14" />
    </svg>
  )
}