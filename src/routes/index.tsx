import { createFileRoute, stripSearchParams } from '@tanstack/react-router'
import { catalogSearch } from '@/features/catalog/catalog-search.ts'
import { entrySearch } from '@/features/session/entry-location.ts'
import { HomePage } from '@/features/home/home-page.tsx'

function homeSearch(search: Record<string, unknown>) {
  return {
    ...catalogSearch(search),
    ...entrySearch(search),
  }
}

export const Route = createFileRoute('/')({
  validateSearch: homeSearch,
  search: {
    middlewares: [stripSearchParams({ q: '' })],
  },
  component: HomeRoute,
})

function HomeRoute() {
  return <HomePage />
}
