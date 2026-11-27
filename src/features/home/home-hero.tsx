import { Button } from '@/components/ui/button.tsx'
import { scrollToGrade } from '@/features/home/home-data.ts'
import { HomeHeroMobile } from '@/features/home/home-hero-mobile.tsx'

export function HomeHero() {
  return (
    <>
      <section className="hidden h-[450px] items-center pl-10 desktop:grid desktop:grid-cols-[minmax(0,1fr)_450px]">
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
        <div className="relative">
          <img
            src="/home/hero.png"
            alt=""
            width={450}
            height={450}
            fetchPriority="high"
            decoding="async"
            className="h-[450px] w-[450px] rounded-[15px] object-cover"
          />
          <div className="absolute right-[calc(100%+110px)] bottom-8 flex justify-center gap-2" aria-hidden="true">
            <span className="size-2 rounded-full bg-primary" />
            <span className="size-2 rounded-full bg-secondary" />
            <span className="size-2 rounded-full bg-secondary" />
          </div>
        </div>
      </section>

      <HomeHeroMobile />
    </>
  )
}
