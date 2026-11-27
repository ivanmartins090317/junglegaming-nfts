import type { ReactNode } from 'react'
import { MailIcon, StarIcon } from '@/components/layout/chrome-icons.tsx'
import { LinkedinGlyph, TwitterGlyph } from '@/components/layout/footer-social.tsx'
import { NftDetailBuy } from '@/features/detail/nft-detail-buy.tsx'
import type { NftDetailContent } from '@/features/detail/nft-detail-content.ts'
import type { Nft } from '@/lib/contracts/nft.ts'

const starCount = 5

const labelClass = 'm-0 text-[12px] font-bold leading-[18px] text-foreground'
const metaClass = 'm-0 text-[12px] leading-[26px] text-text-secondary'

export function NftDetailInfo({ nft, content }: { nft: Nft; content: NftDetailContent }) {
  return (
    <div className="mt-8 desktop:mt-0">
      <h1 className="m-0 text-[28px] font-bold leading-[34px] text-foreground">{nft.name}</h1>
      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="m-0 flex items-center gap-2 text-[22px] font-bold leading-7 text-text-accent">
          {nft.price} ETH
          {nft.compareAt ? (
            <span className="text-[14px] font-normal text-text-secondary line-through">{nft.compareAt} ETH</span>
          ) : null}
        </p>
        <p className="m-0 flex items-center gap-1.5 text-[14px] leading-none text-foreground">
          <span aria-hidden="true" className="flex text-primary">
            {Array.from({ length: starCount }, (_, index) => (
              <StarIcon key={index} className="size-[18px]" />
            ))}
          </span>
          {content.ratingCount} avaliações de colecionadores
        </p>
      </div>
      <h2 className={`${labelClass} mt-4`}>Sobre este NFT:</h2>
      <p className="m-0 mt-2.5 max-w-[520px] text-[12px] leading-[26px] text-text-secondary">{content.about}</p>
      <h2 className={`${labelClass} mt-1`}>Edição:</h2>
      <Editions content={content} />
      <NftDetailBuy nftId={nft.id} />
      <div className="mt-4">
        <p className={metaClass}>ID do token: {content.tokenId}</p>
        <p className={`${metaClass} mt-[7px]`}>Coleção: {content.collection}</p>
        <p className={`${metaClass} mt-[7px]`}>Atributos: {content.attributes}</p>
      </div>
      <Share />
    </div>
  )
}

function Editions({ content }: { content: NftDetailContent }) {
  return (
    <ul className="m-0 mt-3 flex list-none flex-wrap items-center gap-2 p-0 text-[12px] leading-none">
      {content.editions.map((edition) => {
        const selected = edition === content.selectedEdition
        return (
          <li
            key={edition}
            aria-current={selected ? 'true' : undefined}
            className={`inline-flex h-[26px] items-center rounded-[5px] border px-2 text-foreground ${selected ? 'border-primary' : 'border-border'}`}
          >
            {edition}
          </li>
        )
      })}
      <li className="px-2 text-text-secondary">{content.editionStatus}</li>
    </ul>
  )
}

function Share() {
  return (
    <div className="mt-1.5 flex items-center gap-2">
      <p className={labelClass}>Compartilhar este NFT:</p>
      <ShareButton label="LinkedIn">
        <LinkedinGlyph />
      </ShareButton>
      <ShareButton label="E-mail">
        <MailIcon className="size-4" />
      </ShareButton>
      <ShareButton label="Twitter">
        <TwitterGlyph />
      </ShareButton>
    </div>
  )
}

function ShareButton({ label, children }: { label: string; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex size-5 items-center justify-center bg-transparent p-0 text-foreground"
    >
      {children}
    </button>
  )
}
