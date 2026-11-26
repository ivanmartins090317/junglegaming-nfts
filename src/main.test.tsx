import { act } from 'react'
import type { Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

const mockState = vi.hoisted(() => ({
  enabled: true,
  start: vi.fn(() => Promise.resolve()),
}))

vi.mock('./mocks/config.ts', () => ({
  isMockEnabled: () => mockState.enabled,
}))

vi.mock('./mocks/browser.ts', () => ({
  worker: {
    start: () => mockState.start(),
  },
}))

describe('simulação antes da pintura', () => {
  const roots: Root[] = []

  afterEach(async () => {
    await act(async () => {
      for (const root of roots) root.unmount()
    })
    roots.length = 0
    document.body.replaceChildren()
    mockState.enabled = true
    mockState.start.mockReset()
    mockState.start.mockResolvedValue(undefined)
    vi.resetModules()
  })

  async function boot() {
    const { startApp } = await import('./main.tsx')
    const container = document.createElement('div')
    document.body.append(container)
    let reactRoot: Root | null = null
    await act(async () => {
      reactRoot = await startApp(container)
    })
    if (reactRoot) roots.push(reactRoot)
    return container
  }

  async function bootShell() {
    const container = await boot()
    await vi.waitFor(() => {
      expect(container.textContent).toContain('KURIO')
    })
    return container
  }

  it('pinta a casca depois que a simulação sobe, sem contar o estado', async () => {
    const container = await bootShell()
    expect(mockState.start).toHaveBeenCalledOnce()
    expect(container.textContent).toContain('KURIO')
    expect(container.textContent).not.toContain('Mock ligado')
    expect(container.querySelector('header')).not.toBeNull()
  })

  it('pinta a mesma casca quando a simulação está desligada', async () => {
    mockState.enabled = false
    const container = await bootShell()
    expect(mockState.start).not.toHaveBeenCalled()
    expect(container.textContent).toContain('KURIO')
    expect(container.textContent).not.toContain('Mock desligado')
    expect(container.textContent).not.toContain('Mock ligado')
  })

  it('mostra a frase da falha e não pinta a casca', async () => {
    mockState.start.mockRejectedValue(new Error('worker indisponível'))
    const container = await boot()
    expect(container.textContent).toBe('worker indisponível')
    expect(container.querySelector('header')).toBeNull()
    expect(container.textContent).not.toContain('KURIO')
  })
})
