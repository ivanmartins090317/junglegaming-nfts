import { useState } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { EyeIcon, EyeOffIcon } from '@/features/profile/account-icons.tsx'

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (next: string) => void
}) {
  const [visible, setVisible] = useState(false)

  return (
    <label className="block">
      <span className="mb-[20px] block font-normal text-foreground">{label}</span>
      <div className="relative">
        <Input
          aria-label={label}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[39px] bg-ink"
        />
        <button
          type="button"
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-transparent p-0 text-text-secondary"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      </div>
    </label>
  )
}

export function PasswordFields({
  currentPassword,
  nextPassword,
  confirmPassword,
  onCurrentPassword,
  onNextPassword,
  onConfirmPassword,
}: {
  currentPassword: string
  nextPassword: string
  confirmPassword: string
  onCurrentPassword: (value: string) => void
  onNextPassword: (value: string) => void
  onConfirmPassword: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-4">
      <PasswordField label="Senha atual" value={currentPassword} onChange={onCurrentPassword} />
      <PasswordField label="Nova senha" value={nextPassword} onChange={onNextPassword} />
      <PasswordField
        label="Confirmar nova senha"
        value={confirmPassword}
        onChange={onConfirmPassword}
      />
    </div>
  )
}