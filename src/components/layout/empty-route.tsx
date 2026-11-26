import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button.tsx'

interface EmptyRouteProps {
  title: string
  extra?: string
}

export function EmptyRoute({ title, extra }: EmptyRouteProps) {
  return (
    <p className="m-0 text-foreground">
      {title}
      {extra ? ` ${extra}` : null}
    </p>
  )
}

export function UnknownRoute() {
  return (
    <div className="flex flex-col items-start gap-10">
      <p className="m-0 text-[14px] font-normal leading-[16px] text-text-coral">
        Esta página não existe.
      </p>
      <Button asChild>
        <Link to="/">Início</Link>
      </Button>
    </div>
  )
}
