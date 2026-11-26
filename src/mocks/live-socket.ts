import { toSocketIo } from '@mswjs/socket.io-binding'
import { ws } from 'msw'
import type { OrderNotice, PriceNotice } from '@/lib/socket/events.ts'
import { joinEvent, leaveEvent, orderEvent, priceEvent } from '@/lib/socket/events.ts'

interface BoundIo {
  client: {
    on: (event: string, listener: (...args: unknown[]) => void) => void
    emit: (event: string, ...args: unknown[]) => void
    close?: () => void
  }
  rawClient?: { addEventListener?: (type: string, listener: () => void) => void }
}

interface LiveConnection {
  io: BoundIo
  userId?: string
}

const connections = new Set<LiveConnection>()

function findUserId(payload: unknown, fallback: unknown) {
  if (typeof payload === 'object' && payload !== null && 'userId' in payload) {
    const record = payload as Record<string, unknown>
    if (typeof record.userId === 'string') return record.userId
  }
  if (typeof fallback === 'object' && fallback !== null && 'userId' in fallback) {
    const record = fallback as Record<string, unknown>
    if (typeof record.userId === 'string') return record.userId
  }
  return undefined
}

function removeConnection(connection: LiveConnection) {
  connections.delete(connection)
}

function bindClose(connection: LiveConnection) {
  const raw = connection.io.rawClient
  if (raw?.addEventListener) {
    raw.addEventListener('close', () => removeConnection(connection))
    return
  }
  const client = connection.io.client
  if (client.close) {
    const original = client.close.bind(client)
    client.close = () => {
      removeConnection(connection)
      original()
    }
  }
}

export const liveSocketHandler = ws.link('*/socket.io/*').addEventListener('connection', (connection) => {
  const io = toSocketIo(connection) as BoundIo
  const live: LiveConnection = { io }
  connections.add(live)
  bindClose(live)

  io.client.on(joinEvent, (first, second) => {
    live.userId = findUserId(first, second)
  })

  io.client.on(leaveEvent, () => {
    live.userId = undefined
  })
})

export function emitPrice(notice: PriceNotice) {
  for (const connection of connections) {
    connection.io.client.emit(priceEvent, notice)
  }
}

export function emitOrder(userId: string, notice: OrderNotice) {
  for (const connection of connections) {
    if (connection.userId !== userId) continue
    connection.io.client.emit(orderEvent, notice)
  }
}