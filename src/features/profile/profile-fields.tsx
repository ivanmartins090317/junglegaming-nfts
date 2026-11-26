import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { ChevronIcon, ImageIcon } from '@/features/profile/account-icons.tsx'

export function ProfileTextField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (next: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-[25px] block font-normal text-foreground">
        {label}
        <span className="text-text-coral">*</span>
      </span>
      <Input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[39px] bg-ink"
      />
    </label>
  )
}

export function EnsField({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  return (
    <label className="block">
      <span className="mb-[25px] block font-normal text-foreground">
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

export function AvatarRow() {
  return (
    <div>
      <span className="mb-[25px] block font-normal text-foreground">Avatar</span>
      <div className="flex flex-wrap items-center">
        <span className="inline-flex size-[51px] shrink-0 items-center justify-center rounded-full bg-surface-card text-text-accent">
          <ImageIcon />
        </span>
        <Button type="button" className="ml-6 h-[39px] w-[97px] font-bold">
          Alterar
        </Button>
        <button type="button" className="ml-[21px] bg-transparent p-0 font-normal text-foreground">
          Remover
        </button>
      </div>
    </div>
  )
}