export interface CatalogSearch {
  q?: string
}

export function normalizeCatalogQuery(value: unknown): string {
  if (typeof value === 'string') return value
  if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  return ''
}

export function catalogSearch(search: Record<string, unknown>): CatalogSearch {
  const q = normalizeCatalogQuery(search.q)
  if (q.length === 0) return {}
  return { q }
}

export function catalogSearchParams(query: string): CatalogSearch {
  if (query.length === 0) return {}
  return { q: query }
}

export function parseCatalogLocation(searchStr: string): Record<string, unknown> {
  const params = new URLSearchParams(searchStr.startsWith('?') ? searchStr.slice(1) : searchStr)
  const search: Record<string, string> = {}
  params.forEach((value, key) => {
    search[key] = value
  })
  return search
}

export function stringifyCatalogLocation(search: Record<string, unknown>): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(search)) {
    if (typeof value !== 'string' || value.length === 0) continue
    params.append(key, value)
  }
  const text = params.toString()
  return text.length === 0 ? '' : `?${text}`
}

export function readCatalogQuery(search: object): string {
  if (!('q' in search)) return ''
  return normalizeCatalogQuery(search.q)
}
