import { SearchIcon } from '@/components/layout/chrome-icons.tsx'
import type { Nft } from '@/lib/contracts/nft.ts'

const thumbCount = 4

export function NftDetailGallery({ nft }: { nft: Nft }) {
  return (
    <div className="grid gap-4 desktop:grid-cols-[100px_minmax(0,1fr)] desktop:gap-x-7">
      <ul className="order-2 m-0 flex list-none gap-3 p-0 desktop:order-1 desktop:flex-col desktop:gap-4">
        {Array.from({ length: thumbCount }, (_, index) => (
          <li key={index} className="w-[72px] shrink-0 rounded-[6px] bg-surface-card p-[5px] desktop:w-[100px]">
            <img
              src={nft.image}
              alt=""
              width={90}
              height={90}
              className="aspect-square w-full rounded-[5px] object-cover"
            />
          </li>
        ))}
      </ul>
      <div className="relative order-1 rounded-[15px] bg-surface-card px-[18px] py-[22px] desktop:order-2">
        <img
          src={nft.image}
          alt={nft.name}
          width={406}
          height={406}
          className="aspect-square w-full rounded-[15px] object-cover"
        />
        {nft.rare ? (
          <span className="absolute top-[22px] left-[18px] inline-flex h-8 items-center bg-primary px-2 text-[13px] font-medium leading-none text-ink">
            RARO
          </span>
        ) : null}
        <button
          type="button"
          aria-label="Ampliar imagem"
          className="absolute top-[34px] right-[30px] inline-flex size-7 items-center justify-center rounded-full bg-ink/80 p-0 text-foreground"
        >
          <SearchIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
