import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen.ts'
import { isMockEnabled } from './mocks/config.ts'
import { parseCatalogLocation, stringifyCatalogLocation } from '@/features/catalog/catalog-search.ts'
import { getAppQueryClient } from '@/lib/query/session.ts'
import '@fontsource/roboto-mono/400.css'
import '@fontsource/roboto-mono/500.css'
import '@fontsource/roboto-mono/700.css'
import './styles/globals.css'

const router = createRouter({
  routeTree,
  parseSearch: parseCatalogLocation,
  stringifySearch: stringifyCatalogLocation,
})

const queryClient = getAppQueryClient()

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

async function startMock() {
  if (!isMockEnabled()) return

  const { worker } = await import('./mocks/browser.ts')
  await worker.start({ onUnhandledFrame: 'bypass' })
}

export async function startApp(root: HTMLElement): Promise<Root | null> {
  try {
    await startMock()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Falha ao iniciar o mock'
    root.textContent = message
    return null
  }

  const reactRoot = createRoot(root)
  reactRoot.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
  return reactRoot
}

const rootElement = document.getElementById('root')

if (rootElement) {
  void startApp(rootElement)
} else if (import.meta.env.MODE !== 'test') {
  throw new Error('Elemento #root não encontrado')
}
