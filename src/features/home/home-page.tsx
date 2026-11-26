import { HomeHero } from '@/features/home/home-hero.tsx'
import { HomeLower } from '@/features/home/home-lower.tsx'
import { HomeMarket } from '@/features/home/home-market.tsx'

export function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeMarket />
      <HomeLower />
    </>
  )
}
