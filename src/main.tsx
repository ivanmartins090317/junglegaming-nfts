import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App.tsx'
import { isMockEnabled } from './mocks/config.ts'

async function startMock() {
  if (!isMockEnabled()) return false

  const { worker } = await import('./mocks/browser.ts')
  await worker.start({ onUnhandledFrame: 'bypass' })
  return true
}

const root = document.getElementById('root')

if (!root) throw new Error('Elemento #root não encontrado')

startMock()
  .then((mockStarted) => {
    createRoot(root).render(
      <StrictMode>
        <App mockStarted={mockStarted} />
      </StrictMode>,
    )
  })
  .catch((error: unknown) => {
    const message = error instanceof Error ? error.message : 'Falha ao iniciar o mock'
    root.textContent = message
  })
