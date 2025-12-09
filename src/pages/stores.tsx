import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { get } from '../lib/api'
import { isAuthenticated } from '../lib/auth'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

type Category = {
  id: number
  name: string
  slug: string
  participates_in_cashback: boolean
}

type Store = {
  id: number
  display_name: string
  address: string
  qrcode_slug: string
  description: string
  logo_url: string
  website_url: string
  instagram_url: string
  active: boolean
  categories: Category[]
  has_excluded_categories: boolean
  excluded_categories: string[]
}

export default function StoresPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [stores, setStores] = useState<Store[]>([])

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const [onlyCashback, setOnlyCashback] = useState(false)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { replace: true })
      return
    }
  }, [navigate])

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const cats = await get<Category[]>('/api/commerce/categories/')
        if (!cancelled) setCategories(cats)

        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (category) params.set('category', category)
        if (onlyCashback) params.set('participates', 'true')
        const list = await get<Store[]>(`/api/commerce/stores/?${params.toString()}`)
        if (!cancelled) setStores(list)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error al cargar tiendas')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [search, category, onlyCashback])

  const showGlobalNotice = useMemo(() => stores.some(s => s.has_excluded_categories), [stores])

  return (
    <div className="min-h-screen bg-white pt-20 pb-16">
      <div className="mx-auto max-w-screen-xl px-6 md:px-8 lg:px-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tiendas</h1>
          <p className="text-gray-600 mt-1">Busca y filtra tiendas participantes.</p>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Buscar por nombre o descripción"
              aria-label="Buscar tiendas"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white"
              aria-label="Filtrar por categoría"
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.slug)}>
                  {c.name} {c.participates_in_cashback ? '' : '(sin cashback)'}
                </option>
              ))}
            </select>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={onlyCashback} onChange={(e) => setOnlyCashback(e.target.checked)} />
              Solo con cashback
            </label>
          </div>
        </div>

        {/* Aviso global */}
        {showGlobalNotice && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
            Algunas tiendas tienen categorías excluidas del cashback. Revisa los avisos en cada tarjeta.
          </div>
        )}

        {/* Estados */}
        {loading && (
          <div className="text-gray-600">Cargando tiendas...</div>
        )}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>
        )}
        {!loading && !error && stores.length === 0 && (
          <div className="text-gray-600">No se encontraron tiendas.</div>
        )}

        {/* Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((s) => (
            <Card key={s.id} className="flex flex-col">
              <div className="flex items-center gap-3">
                {/* Logo */}
                {s.logo_url ? (
                  <img src={s.logo_url} alt={`Logo de ${s.display_name}`} className="h-12 w-12 rounded object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                    {s.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{s.display_name}</h3>
                  <div className="text-xs text-gray-600">
                    {s.categories.map((c) => (
                      <span key={c.id} className={`mr-2 inline-block rounded-full px-2 py-0.5 border ${c.participates_in_cashback ? 'border-gray-200 text-gray-700' : 'border-amber-300 text-amber-800'}`}>
                        {c.name}{!c.participates_in_cashback ? ' • sin cashback' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {s.description && <p className="mt-3 text-sm text-gray-700">{s.description}</p>}

              {/* Aviso local */}
              {s.has_excluded_categories && (
                <div className="mt-3 rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                  Categorías excluidas: {s.excluded_categories.join(', ')}
                </div>
              )}

              {/* Actions */}
              <div className="mt-4 flex gap-2">
                {s.website_url && (
                  <a href={s.website_url} target="_blank" rel="noopener noreferrer">
                    <Button className="h-9 px-3 text-sm">Sitio</Button>
                  </a>
                )}
                {s.instagram_url && (
                  <a href={s.instagram_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" className="h-9 px-3 text-sm">Instagram</Button>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
