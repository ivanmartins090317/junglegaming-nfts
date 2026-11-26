import { Input } from '@/components/ui/input.tsx'
import { walletPlaceholders } from '@/lib/contracts/wallet.ts'
import { ChevronIcon } from '@/features/profile/account-icons.tsx'

export function WalletTextField({
  label,
  value,
  onChange,
  placeholder,
  showAsterisk = true,
}: {
  label: string
  value: string
  onChange: (next: string) => void
  placeholder?: string
  showAsterisk?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-[11px] block font-normal text-foreground">
        {label}
        {showAsterisk ? <span className="text-text-coral">*</span> : null}
      </span>
      <Input
        aria-label={label}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-[39px] bg-ink placeholder:text-text-secondary"
      />
    </label>
  )
}

export function WalletChoice({
  label,
  placeholder,
  ariaLabel,
  requiredMark = false,
}: {
  label: string
  placeholder: string
  ariaLabel: string
  requiredMark?: boolean
}) {
  return (
    <h2 className="m-0 font-normal">
      <span className="mb-[11px] block font-normal text-foreground">
        {label}
        {requiredMark ? <span className="text-text-coral">*</span> : null}
      </span>
      <button
        type="button"
        aria-label={ariaLabel}
        className="inline-flex h-[39px] w-full items-center justify-between rounded-[var(--radius-field)] border border-border bg-ink px-3 font-mono font-normal text-text-secondary"
      >
        <span>{placeholder}</span>
        <ChevronIcon />
      </button>
    </h2>
  )
}

export function WalletEnsField({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <label className="block">
      <span className="mb-[11px] block font-normal text-foreground">
        Nome ENS <span className="text-text-coral">*</span>
      </span>
      <div className="flex flex-nowrap items-center gap-[11px]">
        <button
          type="button"
          aria-label="Sufixo ENS"
          className="inline-flex h-[39px] w-[77px] shrink-0 items-center justify-center gap-1 rounded-[var(--radius-field)] border border-border bg-ink font-mono text-foreground"
        >
          .eth
          <span className="text-text-secondary">
            <ChevronIcon />
          </span>
        </button>
        <Input
          aria-label="Nome ENS"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[39px] bg-ink"
        />
      </div>
    </label>
  )
}

export function WalletSecondaryAddressField({
  value,
  onChange,
}: {
  value: string
  onChange: (next: string) => void
}) {
  return (
    <Input
      aria-label={walletPlaceholders.secondaryAddress}
      placeholder={walletPlaceholders.secondaryAddress}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-[39px] bg-ink placeholder:text-text-secondary"
    />
  )
}