import { useState } from 'react'
import { ArrowRightIcon } from '@/components/layout/mobile-icons.tsx'
import { scrollToGrade } from '@/features/home/home-data.ts'

const slides = [0, 1, 2]

export function HomeHeroMobile() {
  const [slide, setSlide] = useState(0)

  return (
    <section className="relative overflow-hidden rounded-[30px] bg-primary/12 pb-[30px] desktop:hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/55 to-primary/20 [clip-path:circle(358px_at_-67px_179px)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-[76px] size-[200px] rounded-full bg-linear-to-r from-primary/25 to-transparent"
      />
      <div className="relative flex items-start gap-2 px-4 pt-[7px]">
        <div className="min-w-0 flex-1">
          <p className="m-0 text-[12px] leading-[14px] text-foreground">Bem-vindo à Kurio</p>
          <h1 className="m-0 mt-[7px] text-[18px] font-bold leading-[29px] text-foreground">
            SEJA DONO DA CULTURA DIGITAL
          </h1>
          <p className="m-0 mt-1.5 text-[12px] leading-[18px] text-text-secondary">
            Descubra NFTs selecionados de criadores do mundo todo.
          </p>
          <button
            type="button"
            onClick={scrollToGrade}
            className="m-0 flex w-fit items-center gap-2 bg-transparent p-0 text-left font-mono text-[12px] font-bold leading-[14px] text-text-accent"
          >
            EXPLORAR
            <ArrowRightIcon className="size-3" />
          </button>
        </div>
        <div className="relative mt-[3px] aspect-square w-[min(138px,33.3vw)] shrink-0">
          <img
            src="/home/hero.png"
            alt=""
            width={138}
            height={138}
            className="size-full rounded-[15px] object-cover"
          />
          <img
            src="/home/sage.png"
            alt=""
            width={58}
            height={58}
            className="absolute -bottom-2 left-[14px] size-[58px] rounded-[15px] object-cover"
          />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-[6px] flex justify-center gap-[7px]">
        {slides.map((index) => (
          <button
            key={index}
            type="button"
            aria-label={`Destaque ${index + 1}`}
            aria-current={slide === index ? 'true' : undefined}
            onClick={() => setSlide(index)}
            className="size-1.5 rounded-full bg-primary p-0"
          />
        ))}
      </div>
    </section>
  )
}
