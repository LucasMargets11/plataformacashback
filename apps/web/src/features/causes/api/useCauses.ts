import { useEffect, useMemo, useState } from 'react'
import { env } from '../../../lib/env'

export type CauseItem = {
  id: number
  title: string
  slug: string
  category: string
  summary?: string
  image_url?: string
}

export type CausesQuery = {
  search?: string
  category?: string
  ordering?: string
  limit?: number
}

export function useCauses(params: CausesQuery) {
  const [data, setData] = useState<CauseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const query = useMemo(() => {
    const q = new URLSearchParams()
    if (params.search) q.set('search', params.search)
    if (params.category) q.set('category', params.category)
    if (params.ordering) q.set('ordering', params.ordering)
    if (params.limit) q.set('limit', String(params.limit))
    return q.toString()
  }, [params.search, params.category, params.ordering, params.limit])

  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const base = env.apiUrl || 'http://localhost:8000'
        const url = `${base}/api/causes/${query ? `?${query}` : ''}`
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`Error ${res.status}`)
        const json = await res.json()
        setData(json)
      } catch (e: any) {
        if (e.name === 'AbortError') return
        setError('No se pudieron cargar las causas. Intentá de nuevo más tarde.')
        // fallback mínima para no dejar vacío
        setData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    return () => controller.abort()
  }, [query])

  return { data, loading, error }
}
