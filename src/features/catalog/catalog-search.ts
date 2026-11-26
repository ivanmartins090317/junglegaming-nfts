export interface CatalogSearch {
  q?: string
}

export function catalogSearch(search: Record<string, unknown>): CatalogSearch {
  if (typeof search.q !== 'string' || search.q.length === 0) return {}
  return { q: search.q }
}

export function catalogSearchParams(query: string): CatalogSearch {
  if (query.length === 0) return {}
  return { q: query }
}

export function readCatalogQuery(search: object): string {
  if (!('q' in search)) return ''
  const value = search.q
  return typeof value === 'string' ? value : ''
}
