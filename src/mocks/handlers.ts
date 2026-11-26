import { http, HttpResponse } from 'msw'
import { liveSocketHandler } from '@/mocks/live-socket.ts'
import { orderMessages } from '@/lib/contracts/order.ts'
import { closeSessionOrder, readSessionOrder, type OrderWrite } from '@/mocks/order-store.ts'
import {
  addSessionItem,
  mergeSessionCart,
  parseCartLines,
  quoteCartLines,
  quoteSessionCart,
  readCatalog,
  readNft,
  readProfile,
  readSessionCart,
  readSessionUser,
  readWallet,
  removeSessionItem,
  resetStore,
  resolveCart,
  saveProfile,
  saveWallet,
  setSessionQuantity,
  signInUser,
  signOutUser,
  signUpUser,
  type CartWrite,
  type ProfileResult,
  type WalletResult,
} from '@/mocks/store.ts'

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

function cartResponse(result: CartWrite) {
  if (!result.ok) return HttpResponse.json({ message: 'Não foi possível atualizar o carrinho.' }, { status: result.status })
  return HttpResponse.json(result.cart)
}

function orderResponse(result: OrderWrite) {
  if (!result.ok) return HttpResponse.json({ message: result.message }, { status: result.status })
  return HttpResponse.json(result.order)
}

function profileResponse(result: ProfileResult) {
  if (!result.ok) return HttpResponse.json({ message: result.message }, { status: result.status })
  return HttpResponse.json(result.profile)
}

function walletResponse(result: WalletResult) {
  if (!result.ok) return HttpResponse.json({ message: result.message }, { status: result.status })
  return HttpResponse.json(result.wallet)
}

function routeId(value: string | readonly string[] | undefined) {
  return typeof value === 'string' && value.length > 0 ? value : ''
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
  http.get('/api/perfil', () => profileResponse(readProfile())),
  http.put('/api/perfil', async ({ request }) => {
    const body = await readBody(request)
    return profileResponse(
      saveProfile({
        displayName: body.displayName,
        username: body.username,
        email: body.email,
        ensName: body.ensName,
        walletNickname: body.walletNickname,
        currentPassword: body.currentPassword,
        nextPassword: body.nextPassword,
        confirmPassword: body.confirmPassword,
      }),
    )
  }),
  http.get('/api/carteiras', () => walletResponse(readWallet())),
  http.put('/api/carteiras/principal', async ({ request }) => {
    const body = await readBody(request)
    return walletResponse(
      saveWallet({
        displayName: body.displayName,
        nickname: body.nickname,
        network: body.network,
        profileName: body.profileName,
        address: body.address,
        secondaryAddress: body.secondaryAddress,
        walletType: body.walletType,
        referralCode: body.referralCode,
        email: body.email,
        ensName: body.ensName,
      }),
    )
  }),
  http.post('/api/dev/reset', () => {
    resetStore()
    return new HttpResponse(null, { status: 204 })
  }),
  http.get('/api/carrinho', () => {
    const cart = readSessionCart()
    if (!cart) return HttpResponse.json({ message: 'Não autorizado.' }, { status: 401 })
    return HttpResponse.json(cart)
  }),
  http.post('/api/carrinho/leitura', async ({ request }) => {
    const body = await readBody(request)
    return HttpResponse.json(resolveCart(parseCartLines(body.lines)))
  }),
  http.post('/api/carrinho/itens', async ({ request }) => {
    const body = await readBody(request)
    return cartResponse(addSessionItem(body.nftId))
  }),
  http.put('/api/carrinho/itens/:nftId', async ({ params, request }) => {
    const body = await readBody(request)
    return cartResponse(setSessionQuantity(routeId(params.nftId), body.quantity))
  }),
  http.delete('/api/carrinho/itens/:nftId', ({ params }) => {
    return cartResponse(removeSessionItem(routeId(params.nftId)))
  }),
  http.post('/api/carrinho/fusao', async ({ request }) => {
    const body = await readBody(request)
    return cartResponse(mergeSessionCart(parseCartLines(body.lines)))
  }),
  http.post('/api/cotacao', async ({ request }) => {
    if (readSessionUser()) {
      const quote = quoteSessionCart()
      if (!quote) return HttpResponse.json({ message: 'Não autorizado.' }, { status: 401 })
      return HttpResponse.json(quote)
    }
    const body = await readBody(request)
    return HttpResponse.json(quoteCartLines(parseCartLines(body.lines)))
  }),
  http.get('/api/pedidos/:pedidoId', ({ params }) => {
    if (!readSessionUser()) {
      return HttpResponse.json({ message: orderMessages.loadFailed }, { status: 401 })
    }
    const order = readSessionOrder(routeId(params.pedidoId))
    if (!order) return HttpResponse.json({ message: orderMessages.missing }, { status: 404 })
    return HttpResponse.json(order)
  }),
  http.post('/api/pedidos', async ({ request }) => {
    const body = await readBody(request)
    return orderResponse(closeSessionOrder(body.key, body.lines))
  }),
  liveSocketHandler,
]
