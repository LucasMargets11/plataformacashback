import React, { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getCauseCategories, getCauses, getFeaturedCauses, type Cause, type CauseCategory } from '../../lib/api'
import CauseBanner from '../../components/causes/CauseBanner'
import CauseCard from '../../components/causes/CauseCard'

export default function HomePage() {
  const [params, setParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<CauseCategory[]>([])
  const [featured, setFeatured] = useState<Cause[]>([])
  const [causes, setCauses] = useState<Cause[]>([])

  const [search, setSearch] = useState(params.get('search') || '')
  const [category, setCategory] = useState(params.get('category') || '')
  const [ordering, setOrdering] = useState(params.get('ordering') || 'Destacadas')
  const [openFilters, setOpenFilters] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [cats, feats] = await Promise.all([
          getCauseCategories(),
          getFeaturedCauses(),
        ])
        if (!cancelled) {
          setCategories(cats)
          setFeatured(feats)
        }
        const q = new URLSearchParams()
        if (search) q.set('search', search)
        if (category) q.set('category', category)
        if (ordering) q.set('ordering', ordering)
        const list = await getCauses(q)
        if (!cancelled) setCauses(list)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error al cargar causas')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [search, category, ordering])

  useEffect(() => {
    const next = new URLSearchParams()
    if (search) next.set('search', search)
    if (category) next.set('category', category)
    if (ordering) next.set('ordering', ordering)
    setParams(next, { replace: true })
  }, [search, category, ordering, setParams])

  const hasData = useMemo(() => (!!featured.length || !!causes.length), [featured, causes])

  return (
    <div className="min-h-screen bg-white pt-6 pb-12">
      <div className="mx-auto max-w-screen-xl px-6 md:px-8 lg:px-10">
        {/* Heading simple */}
        <div className="mb-4">
        </div>

        {/* Floating Filters Button */}
        <button
          aria-label="Abrir filtros"
          onClick={() => setOpenFilters(true)}
          className="fixed bottom-6 right-6 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
            <path fillRule="evenodd" d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 .53 1.28l-5.28 5.22v6.8a.75.75 0 0 1-1.1.67l-3-1.5a.75.75 0 0 1-.4-.67v-5.3L3.22 5.78a.75.75 0 0 1 .53-1.28Z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Destacadas: 1 grande arriba, 2 por fila debajo */}
        {featured.length > 0 && (
          <div className="mb-8 space-y-4">
            {/* Primera portada grande */}
            <div>
              <CauseBanner cause={featured[0]} />
            </div>

            {/* Resto en filas de 2 */}
            {featured.slice(1).length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featured.slice(1).map(c => (
                  <div key={c.id}>
                    <CauseBanner cause={c} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Estados */}
        {loading && (
          <>
            {/* Featured skeletons: 1 grande + 2 */}
            <div className="mb-8 space-y-4">
              <div className="w-full rounded-lg bg-gray-100" style={{ aspectRatio: '21 / 9' }} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="w-full rounded-lg bg-gray-100" style={{ aspectRatio: '21 / 9' }} />
                <div className="w-full rounded-lg bg-gray-100" style={{ aspectRatio: '21 / 9' }} />
              </div>
            </div>
            {/* Grid skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
              {[...Array(8)].map((_,i)=>(<div key={i} className="h-40 rounded-lg bg-gray-100" />))}
            </div>
          </>
        )}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>
        )}
        {!loading && !error && !hasData && (
          <div className="text-gray-600">No se encontraron causas.</div>
        )}

        {/* Grid */}
        {!loading && causes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {causes.map(c => (
              <CauseCard key={c.id} cause={c} />
            ))}
          </div>
        )}
      </div>

      {/* Filters Drawer / Sheet */}
      {openFilters && (
        <div className="fixed inset-0 z-40">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            aria-hidden="true"
            onClick={() => setOpenFilters(false)}
          />
          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transition-transform md:rounded-l-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              <button onClick={() => setOpenFilters(false)} aria-label="Cerrar filtros" className="text-gray-600 hover:text-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" /></svg>
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Buscar</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nombre de causa"
                  aria-label="Buscar causa"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  aria-label="Filtrar por categoría"
                >
                  <option value="">Todas</option>
                  {categories.map((c) => (
                    <option key={c.id} value={String(c.slug)}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Ordenar</label>
                <select
                  value={ordering}
                  onChange={(e) => setOrdering(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  aria-label="Ordenar causas"
                >
                  <option value="Destacadas">Destacadas</option>
                  <option value="Más apoyo">Más apoyo</option>
                  <option value="A-Z">A-Z</option>
                </select>
              </div>
              <div className="pt-2">
                <button
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  onClick={() => setOpenFilters(false)}
                >
                  Aplicar filtros
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
