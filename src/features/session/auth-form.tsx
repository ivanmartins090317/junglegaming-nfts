import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { signIn, signUp } from '@/lib/api/session.ts'
import { sessionMessages } from '@/lib/contracts/session.ts'
import { sessionQueryKey, useSessionQuery } from '@/lib/query/session.ts'
import { cn } from '@/lib/utils.ts'
import { EyeIcon, EyeOffIcon } from '@/features/session/auth-icons.tsx'
import { isDesktopEntry, pathAfterSuccess } from '@/features/session/entry-location.ts'

export type AuthMode = 'entrar' | 'cadastro'
type AuthLayout = 'panel' | 'screen'

export function AuthForm({
  mode,
  layout,
  retorno,
  pathname,
  search,
  submitLabel,
  holdRedirect,
}: {
  mode: AuthMode
  layout: AuthLayout
  retorno: string | undefined
  pathname: string
  search: object
  submitLabel: string
  holdRedirect: () => void
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const session = useSessionQuery()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [actionMessage, setActionMessage] = useState<string | null>(null)
  const message = actionMessage ?? (session.isError ? sessionMessages.loadFailed : null)
  const nameCentered = layout === 'screen'

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setActionMessage(null)
    try {
      const user =
        mode === 'entrar'
          ? await signIn({ email, password })
          : await signUp({ name, email, password, confirmPassword })
      holdRedirect()
      await queryClient.cancelQueries({ queryKey: sessionQueryKey })
      queryClient.setQueryData(sessionQueryKey, user)
      await navigate({
        href: pathAfterSuccess({
          retorno,
          desktop: isDesktopEntry(),
          pathname,
          search,
        }),
        replace: true,
      })
    } catch (error: unknown) {
      const text = error instanceof Error ? error.message : sessionMessages.loadFailed
      setActionMessage(text)
    }
  }

  return (
    <form
      onSubmit={(event) => void onSubmit(event)}
      className={layout === 'panel' ? 'flex flex-col gap-1.5' : 'flex flex-col gap-3'}
    >
      {mode === 'cadastro' ? (
        <Input
          aria-label="Nome de usuário"
          value={name}
          placeholder="Nome de usuário"
          onChange={(event) => setName(event.target.value)}
          className={fieldClass(layout, false, nameCentered)}
        />
      ) : null}
      <Input
        aria-label="E-mail"
        value={email}
        placeholder={mode === 'entrar' ? 'contato@email.com' : 'Digite seu e-mail'}
        onChange={(event) => setEmail(event.target.value)}
        className={fieldClass(layout, false, false)}
      />
      <PasswordField
        label="Senha"
        placeholder={mode === 'cadastro' ? 'Senha' : undefined}
        value={password}
        onChange={setPassword}
        layout={layout}
        emphasized={mode === 'entrar'}
        showEye
      />
      {mode === 'entrar' ? (
        <div className="flex justify-end">
          <button type="button" className="bg-transparent p-0 font-mono text-[0.875em] font-normal text-text-accent">
            Esqueceu a senha?
          </button>
        </div>
      ) : (
        <PasswordField
          label="Confirmar senha"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={setConfirmPassword}
          layout={layout}
          emphasized={false}
          showEye={layout === 'screen'}
        />
      )}
      {message ? <p className="m-0 text-center text-[0.875em] text-text-coral">{message}</p> : null}
      <Button
        type="submit"
        className={
          layout === 'panel'
            ? 'mt-2 h-[45px] w-full rounded-[var(--radius-field)] font-medium'
            : 'mt-7 h-[60px] w-full font-bold'
        }
      >
        {submitLabel}
      </Button>
    </form>
  )
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  layout,
  emphasized,
  showEye,
}: {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  layout: AuthLayout
  emphasized: boolean
  showEye: boolean
}) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <Input
        aria-label={label}
        type={visible ? 'text' : 'password'}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(fieldClass(layout, emphasized, false), showEye ? 'pr-10' : undefined)}
      />
      {showEye ? (
        <button
          type="button"
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          onClick={() => setVisible((current) => !current)}
          className="absolute top-1/2 right-3 -translate-y-1/2 bg-transparent p-0 text-primary"
        >
          {visible ? <EyeIcon /> : <EyeOffIcon />}
        </button>
      ) : null}
    </div>
  )
}

function fieldClass(layout: AuthLayout, emphasized: boolean, centered: boolean) {
  return cn(
    'bg-ink placeholder:font-normal placeholder:text-secondary',
    layout === 'panel' ? 'h-10' : 'h-[50px]',
    emphasized ? 'border-primary' : 'border-border',
    centered ? 'text-center placeholder:text-center' : 'text-left',
  )
}
