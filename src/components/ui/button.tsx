import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'

const buttonVariants = cva(
  'inline-flex h-[35px] w-[100px] shrink-0 items-center justify-center rounded-[var(--radius-page-button)] border-0 bg-primary p-0 font-mono text-[16px] font-medium leading-none text-ink outline-none',
)

interface ButtonProps extends ComponentProps<'button'> {
  asChild?: boolean
}

function Button({ className, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants(), className)} {...props} />
}

export { Button }
