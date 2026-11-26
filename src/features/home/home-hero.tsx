import { useState } from 'react'
import { Button } from '@/components/ui/button.tsx'
import { scrollToGrade } from '@/features/home/home-data.ts'

const slides = [0, 1, 2]

export function HomeHero() {
  const [slide, setSlide] = useState(0)

  return (
    <>
      <section className="hidden gap-8 md:grid md:grid-cols-1 lg:items-center lg:gap-12 lg:grid-cols-[minmax(0,1fr)_460px]">
        <div>
          <p className="m-0 text-[14px] leading-none text-text-secondary">Bem-vindo à Kurio</p>
          <h1 className="m-0 mt-4 text-[40px] font-bold leading-[46px] text-foreground">
            SEJA DONO DO FUTURO
            <br />
            DA ARTE DIGITAL
          </h1>
          <p className="m-0 mt-5 max-w-[460px] text-[14px] leading-[24px] text-text-secondary">
            Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital
            rara, apoie artistas e tenha uma parte da cultura da internet.
          </p>
          <Button type="button" className="mt-8 w-auto px-6" onClick={scrollToGrade}>
            EXPLORAR
          </Button>
        </div>
        <img
          src="/home/hero.png"
          alt=""
          width={450}
          height={450}
          className="aspect-square w-full max-w-[450px] rounded-[15px] object-cover lg:h-[450px] lg:max-w-none"
        />
        <HeroDots slide={slide} onSelect={setSlide} className="justify-center lg:col-span-2 lg:-mt-6" />
      </section>

      <section className="rounded-[15px] bg-surface-card p-4 md:hidden">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="m-0 text-[12px] leading-none text-text-secondary">Bem-vindo à Kurio</p>
            <h1 className="m-0 mt-3 text-[20px] font-bold leading-[26px] text-foreground">
              SEJA DONO DA CULTURA DIGITAL
            </h1>
            <p className="m-0 mt-3 text-[12px] leading-[16px] text-text-secondary">
              Descubra NFTs selecionados de criadores do mundo todo.
            </p>
            <button
              type="button"
              onClick={scrollToGrade}
              className="mt-3 bg-transparent p-0 text-left font-mono text-[14px] font-bold text-primary"
            >
              EXPLORAR →
            </button>
          </div>
          <div className="relative h-[128px] w-[104px] shrink-0">
            <img
              src="/home/hero.png"
              alt=""
              width={96}
              height={96}
              className="absolute top-0 right-0 h-24 w-24 rounded-[15px] object-cover"
            />
            <img
              src="/home/sage.png"
              alt=""
              width={56}
              height={56}
              className="absolute bottom-0 left-0 h-14 w-14 rounded-[15px] border-2 border-surface-card object-cover"
            />
          </div>
        </div>
        <HeroDots slide={slide} onSelect={setSlide} className="mt-4 justify-center" />
      </section>
    </>
  )
}

function HeroDots({
  slide,
  onSelect,
  className,
}: {
  slide: number
  onSelect: (index: number) => void
  className: string
}) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {slides.map((index) => (
        <button
          key={index}
          type="button"
          aria-label={`Destaque ${index + 1}`}
          aria-current={slide === index ? 'true' : undefined}
          onClick={() => onSelect(index)}
          className={`size-2 rounded-full p-0 ${slide === index ? 'bg-primary' : 'bg-secondary'}`}
        />
      ))}
    </div>
  )
}
