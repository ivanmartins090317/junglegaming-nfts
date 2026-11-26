import { http, HttpResponse } from 'msw'
import { readCatalog, readNft, readSessionUser, resetStore, signInUser, signOutUser, signUpUser } from '@/mocks/store.ts'

const missingNft = { message: 'NFT não encontrado.' }

function nftIdFrom(value: string | readonly string[] | undefined) {
  if (typeof value !== 'string' || value.length === 0) return undefined
  return value
}

function missingNftResponse() {
  return HttpResponse.json(missingNft, { status: 404 })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function readBody(request: Request) {
  try {
    const body: unknown = await request.json()
    if (!isRecord(body)) return {}
    return body
  } catch {
    return {}
  }
}

function sessionResponse(result: ReturnType<typeof signInUser>) {
  if (!result.ok) return HttpResponse.json({ message: result.message }, { status: result.status })
  return HttpResponse.json(result.user)
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
  http.get('/api/sessao', () => {
    const user = readSessionUser()
    if (!user) return HttpResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    return HttpResponse.json(user)
  }),
  http.post('/api/sessao', async ({ request }) => {
    const body = await readBody(request)
    return sessionResponse(signInUser(body.email, body.password))
  }),
  http.delete('/api/sessao', () => {
    signOutUser()
    return new HttpResponse(null, { status: 204 })
  }),
  http.post('/api/cadastro', async ({ request }) => {
    const body = await readBody(request)
    return sessionResponse(
      signUpUser({
        name: body.name,
        email: body.email,
        password: body.password,
        confirmPassword: body.confirmPassword,
      }),
    )
  }),
  http.post('/api/dev/reset', () => {
    resetStore()
    return new HttpResponse(null, { status: 204 })
  }),
]
