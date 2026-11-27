import type { NftDetailContent } from '@/features/detail/nft-detail-content.ts'

const tabBase =
  'm-0 border-0 border-b-2 bg-transparent px-0 pt-0 pb-2.5 font-mono text-[16px] leading-none'

export function NftDetailTabs({ content }: { content: NftDetailContent }) {
  return (
    <section className="mt-16 desktop:mt-[88px]">
      <div role="tablist" className="flex gap-x-9 overflow-x-auto whitespace-nowrap border-b border-border">
        <button
          type="button"
          role="tab"
          aria-selected="true"
          className={`${tabBase} border-primary font-bold text-text-accent`}
        >
          Detalhes do NFT
        </button>
        <button type="button" role="tab" aria-selected="false" className={`${tabBase} border-transparent font-normal text-foreground`}>
          Avaliações de colecionadores ({content.ratingCount})
        </button>
      </div>
      <div role="tabpanel" className="mt-3 text-[12px] leading-[26px] text-text-secondary">
        {content.paragraphs.map((paragraph, index) => (
          <p key={paragraph} className={index === 0 ? 'm-0' : 'm-0 mt-4'}>
            {paragraph}
          </p>
        ))}
        {content.sections.map((section) => (
          <div key={section.label} className="mt-2">
            <p className="m-0 font-bold text-foreground">{section.label}</p>
            <p className="m-0">{section.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
