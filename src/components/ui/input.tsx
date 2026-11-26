import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils.ts'

function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cn(
        'h-[35px] w-full min-w-0 rounded-[var(--radius-field)] border border-solid border-border bg-transparent px-3 font-mono text-[16px] font-normal leading-none text-foreground outline-none',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
