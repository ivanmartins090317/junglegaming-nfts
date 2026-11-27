import type { ReactNode } from 'react'

const walletNames = ['METAMASK', 'WALLETCONNECT', 'COINBASE']

const socials: Array<{ name: string; glyph: ReactNode }> = [
  { name: 'Facebook', glyph: <FacebookGlyph /> },
  { name: 'Instagram', glyph: <InstagramGlyph /> },
  { name: 'Twitter', glyph: <TwitterGlyph /> },
  { name: 'LinkedIn', glyph: <LinkedinGlyph /> },
  { name: 'YouTube', glyph: <YoutubeGlyph /> },
]

export function FooterSocial() {
  return (
    <div>
      <h2 className="m-0 text-[16px] font-bold leading-none text-foreground">Redes sociais</h2>
      <div className="mt-3.5 flex gap-2">
        {socials.map(({ name, glyph }) => (
          <button
            key={name}
            type="button"
            aria-label={name}
            className="inline-flex size-7 cursor-pointer items-center justify-center rounded-[5px] border border-primary bg-transparent p-0 text-primary"
          >
            {glyph}
          </button>
        ))}
      </div>
      <h2 className="m-0 mt-6 text-[16px] font-bold leading-none text-foreground">Carteiras compatíveis</h2>
      <p className="m-0 mt-3.5 inline-flex items-center gap-2 rounded-[5px] border border-[color-mix(in_srgb,var(--primary-color)_45%,transparent)] bg-[color-mix(in_srgb,var(--primary-color)_10%,var(--ink))] px-2.5 py-1.5 text-[10px] font-bold leading-none whitespace-nowrap text-primary">
        {walletNames.map((name, index) => (
          <span key={name} className="inline-flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">•</span> : null}
            {name}
          </span>
        ))}
      </p>
    </div>
  )
}

function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="currentColor">
      {children}
    </svg>
  )
}

function FacebookGlyph() {
  return (
    <Glyph>
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.5c-.3 0-1.3-.1-2.4-.1-2.400 0-4 1.500-4 4.100v2.300H7.600V13h2.700v8h3.200z" />
    </Glyph>
  )
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TwitterGlyph() {
  return (
    <Glyph>
      <path d="M22 5.900c-.7.300-1.500.500-2.300.600.800-.500 1.400-1.300 1.700-2.200-.8.500-1.600.800-2.500 1-.7-.8-1.800-1.300-2.900-1.300-2.200 0-4 1.800-4 4 0 .300 0 .600.100.900C8.800 8.700 5.800 7.100 3.800 4.700c-.3.600-.5 1.300-.5 2 0 1.400.7 2.600 1.800 3.300-.7 0-1.300-.2-1.800-.5v.1c0 1.900 1.400 3.500 3.200 3.900-.3.100-.7.100-1 .1-.3 0-.5 0-.7-.1.500 1.600 2 2.700 3.700 2.700-1.400 1.100-3.100 1.700-5 1.700H2c1.800 1.100 3.900 1.800 6.100 1.800 7.300 0 11.300-6.100 11.300-11.300v-.5c.8-.6 1.400-1.300 2-2.100z" />
    </Glyph>
  )
}

function LinkedinGlyph() {
  return (
    <Glyph>
      <path d="M6.500 9.500h-3V20h3V9.500zM5 4.500a1.800 1.800 0 100 3.600 1.800 1.800 0 000-3.600zM20.500 20v-5.900c0-3.100-1.700-4.600-3.900-4.600-1.800 0-2.600 1-3 1.700V9.500h-3V20h3v-5.800c0-1.500.3-3 2.200-3 1.900 0 1.900 1.700 1.900 3.100V20h2.800z" />
    </Glyph>
  )
}

function YoutubeGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2.500" y="5.500" width="19" height="13" rx="4" />
      <path d="M10 9.500v5l4.500-2.500L10 9.500z" fill="currentColor" stroke="none" />
    </svg>
  )
}
