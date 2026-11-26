import { http, HttpResponse } from 'msw'
import { readCatalog, readNft, resetStore } from '@/mocks/store.ts'

const missingNft = { message: 'NFT não encontrado.' }

function nftIdFrom(value: string | readonly string[] | undefined) {
  if (typeof value !== 'string' || value.length === 0) return undefined
  return value
}

function missingNftResponse() {
  return HttpResponse.json(missingNft, { status: 404 })
}

export const handlers = [
  http.get('/api/nfts', () => HttpResponse.json(readCatalog())),
  http.get('/api/nfts/:nftId', ({ params }) => {
    const nftId = nftIdFrom(params.nftId)
    if (!nftId) return missingNftResponse()
    const nft = readNft(nftId)
    if (!nft) return missingNftResponse()
    return HttpResponse.json(nft)
  }),
  http.post('/api/dev/reset', () => {
    resetStore()
    return new HttpResponse(null, { status: 204 })
  }),
]
