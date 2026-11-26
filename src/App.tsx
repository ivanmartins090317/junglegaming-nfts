interface AppProps {
  mockStarted: boolean
}

export function App({ mockStarted }: AppProps) {
  return (
    <main>
      <h1>Kurio</h1>
      <p>{mockStarted ? 'Mock ligado' : 'Mock desligado'}</p>
    </main>
  )
}
