import { Link } from '@tanstack/react-router'

const alsoSeen = [
  { id: 'cosmic-bloom-118', name: 'Cosmic Bloom #118', price: '1.29 ETH', image: '/home/cosmic.png' },
  { id: 'violet-nomad-314', name: 'Violet Nomad #314', price: '1.39 ETH', image: '/home/violet.png' },
  { id: 'ivory-baron-088', name: 'Ivory Baron #088', price: '1.79 ETH', image: '/home/ivory.png' },
  { id: 'golden-beat-207', name: 'Golden Beat #207', price: '0.99 ETH', image: '/home/golden.png' },
  { id: 'golden-signal-160', name: 'Golden Signal #160', price: '0.39 ETH', image: '/home/golden.png' },
]

export function CartRecommendations() {
  return (
    <section data-cart="recommendations" className="mt-16 hidden desktop:block">
      <h2 className="m-0 font-bold text-text-accent">Colecionadores também viram</h2>
      <div className="mt-2 h-px bg-border" />
      <ul className="mt-4 grid list-none grid-cols-5 gap-3 p-0">
        {alsoSeen.map((item) => (
          <li key={item.id}>
            <Link
              to="/nfts/$nftId"
              params={{ nftId: item.id }}
              search={{}}
              className="block text-inherit no-underline"
            >
              <div className="rounded-[15px] bg-surface-card p-3">
                <img
                  src={item.image}
                  alt={item.name}
                  width={180}
                  height={180}
                  className="aspect-square w-full rounded-[15px] object-cover"
                />
              </div>
              <p className="m-0 mt-2 text-foreground">{item.name}</p>
              <p className="m-0 font-bold text-text-accent">{item.price}</p>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-center gap-2">
        <CarouselDot label="Página 1" active={false} />
        <CarouselDot label="Página 2" active />
        <CarouselDot label="Página 3" active={false} />
      </div>
    </section>
  )
}

function CarouselDot({ label, active }: { label: string; active: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'true' : undefined}
      className={
        active
          ? 'size-2 rounded-full border-0 bg-primary p-0'
          : 'size-2 rounded-full border border-text-accent bg-transparent p-0'
      }
    />
  )
}
