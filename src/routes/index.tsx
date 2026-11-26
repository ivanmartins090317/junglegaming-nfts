import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { catalogSearch } from '@/features/catalog/catalog-search.ts'
import { HomePage } from '@/features/home/home-page.tsx'

export const Route = createFileRoute('/')({
  validateSearch: catalogSearch,
  search: {
    middlewares: [stripSearchParams({ q: '' })],
  },
  component: HomeRoute,
})

function HomeRoute() {
  return <HomePage />
}
