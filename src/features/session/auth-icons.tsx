import type { ReactNode } from 'react'

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  )
}

export function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M4 5l16 14" />
    </svg>
  )
}

export function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.7z" />
      <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z" />
      <path fill="#FBBC05" d="M5.4 14.4c-.2-.7-.4-1.4-.4-2.4s.1-1.7.4-2.4V6.5H1.4C.5 8.3 0 10.1 0 12s.5 3.7 1.4 5.5l4-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.8l3.4-3.4C17.9 1.1 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.5l4 3.1C6.3 6.8 8.9 4.8 12 4.8z" />
    </svg>
  )
}

export function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path fill="#1877F2" d="M14.5 8.5V6.8c0-.7.5-1 1.2-1H17V3h-2.2C11.9 3 11 4.6 11 6.6v1.9H9V11h2v10h3.1V11h2.3l.4-2.5h-2.7z" />
    </svg>
  )
}

export function SocialButtons({ layout }: { layout: 'panel' | 'screen' }) {
  return (
    <div className={layout === 'panel' ? 'flex flex-col gap-1.5' : 'flex flex-col gap-4'}>
      <SocialButton label="Continuar com Google" mark={<GoogleMark />} />
      <SocialButton label="Continuar com Facebook" mark={<FacebookMark />} />
    </div>
  )
}

function SocialButton({ label, mark }: { label: string; mark: ReactNode }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-field)] border border-border bg-transparent font-mono text-[0.875em] font-normal text-text-secondary"
    >
      {mark}
      {label}
    </button>
  )
}
