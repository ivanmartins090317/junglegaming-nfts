import { io, type Socket } from 'socket.io-client'
import { forgetOrderVersions } from '@/lib/socket/apply-notice.ts'
import { leaveEvent, orderEvent } from '@/lib/socket/events.ts'
import { isMockEnabled } from '@/mocks/config.ts'

let socket: Socket | undefined

export function connectLiveSocket() {
  if (!isMockEnabled()) return undefined
  if (import.meta.env.MODE === 'test') return undefined
  if (socket) return socket
  socket = io({
    transports: ['websocket'],
    upgrade: false,
  })
  return socket
}

export function leaveOrderListen(userId: string | undefined) {
  if (userId) forgetOrderVersions(userId)
  const live = connectLiveSocket()
  if (!live || !userId) return
  live.emit(leaveEvent, { userId })
  live.off(orderEvent)
}