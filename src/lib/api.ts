import { env } from './env'
import { getAccessToken } from './auth'

const baseURL = env.apiUrl || 'http://localhost:8000'

function extractErrorMessage(data: any, fallback: string): string {
  if (!data) return fallback
  if (typeof data === 'string') return data
  if (data.detail) return String(data.detail)
  if (data.message) return String(data.message)
  // Collapse DRF field errors: {field: ["msg1", "msg2"], non_field_errors: ["..."]}
  const parts: string[] = []
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) {
      parts.push(`${k}: ${v.join(', ')}`)
    } else if (v) {
      parts.push(`${k}: ${String(v)}`)
    }
  }
  return parts.join(' | ') || fallback
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken()
  const res = await fetch(`${baseURL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message = extractErrorMessage(data, res.statusText)
    throw new Error(message || 'Request failed')
  }
  return data as T
}

export function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' })
}

export function post<T>(path: string, body?: any): Promise<T> {
  return request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined })
}

// Catalog helpers (map to existing backend endpoints)
export type ApiCategory = { id: number; name: string; slug: string; participates_in_cashback: boolean }
export type ApiStore = {
  id: number
  display_name: string
  address?: string
  qrcode_slug: string
  description?: string
  logo_url?: string
  website_url?: string
  instagram_url?: string
  active: boolean
  categories: ApiCategory[]
  has_excluded_categories: boolean
  excluded_categories: string[]
}

export async function fetchCategories(): Promise<ApiCategory[]> {
  return get<ApiCategory[]>(`/api/commerce/categories/`)
}

export async function fetchStores(params?: URLSearchParams): Promise<ApiStore[]> {
  const qs = params && params.toString() ? `?${params.toString()}` : ''
  return get<ApiStore[]>(`/api/commerce/stores/${qs}`)
}

// Profile helpers (mocked until real API is available)
export type ProfileSummary = {
  total_donado: number
  causas_count: number
  ordenes_count: number
  porcentaje_promedio: number
}

export async function getProfileSummary(): Promise<ProfileSummary> {
  // TODO: wire real API: GET /api/v1/profile/summary
  // Mock predictable values
  return Promise.resolve({
    total_donado: 123.45,
    causas_count: 4,
    ordenes_count: 17,
    porcentaje_promedio: 6.2,
  })
}

export type DonationItem = {
  id: string
  fecha: string
  comercio: string
  causa: string
  monto_compra: number
  porcentaje: number
  donado: number
}

export async function getDonations(filters: { from?: string; to?: string; cause?: string }): Promise<DonationItem[]> {
  // TODO: wire real API: GET /api/v1/profile/donations?from&to&cause
  // Mock a small recent set
  const sample: DonationItem[] = [
    { id: '1', fecha: new Date().toISOString(), comercio: 'Sucursal Centro', causa: 'Educación', monto_compra: 120, porcentaje: 5, donado: 6 },
    { id: '2', fecha: new Date(Date.now()-86400000).toISOString(), comercio: 'Sucursal Norte', causa: 'Salud', monto_compra: 80, porcentaje: 4, donado: 3.2 },
    { id: '3', fecha: new Date(Date.now()-2*86400000).toISOString(), comercio: 'Sucursal Centro', causa: 'Ambiente', monto_compra: 200, porcentaje: 5, donado: 10 },
  ]
  return Promise.resolve(sample)
}

// Causes catalog
export type CauseCategory = { id: number; name: string; slug: string }
export type Cause = {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
  featured?: boolean
  goal_amount?: number
  donated_amount?: number
}

export async function getCauseCategories(): Promise<CauseCategory[]> {
  // TODO: wire real API: GET /api/v1/cause-categories/
  return Promise.resolve([
    { id: 1, name: 'Educación', slug: 'educacion' },
    { id: 2, name: 'Salud', slug: 'salud' },
    { id: 3, name: 'Ambiente', slug: 'ambiente' },
  ])
}

export async function getCauses(params?: URLSearchParams): Promise<Cause[]> {
  // TODO: wire real API: GET /api/v1/causes/?search=&category=&ordering=
  // Simulate filters locally for now
  const data: Cause[] = [
    { id: 1, name: 'Becas Escolares', slug: 'becas-escolares', description: 'Apoya a estudiantes de bajos recursos', image_url: 'https://dummyimage.com/800x450/1f2937/ffffff&text=Becas', featured: true, goal_amount: 5000, donated_amount: 1200 },
    { id: 2, name: 'Clínica Comunitaria', slug: 'clinica-comunitaria', description: 'Atención médica gratuita', image_url: 'https://dummyimage.com/800x450/0f172a/ffffff&text=Clínica', featured: true, goal_amount: 10000, donated_amount: 4300 },
    { id: 3, name: 'Reforestación Urbana', slug: 'reforestacion-urbana', description: 'Más árboles en tu ciudad', image_url: 'https://dummyimage.com/800x450/111827/ffffff&text=Reforestación', featured: false, goal_amount: 8000, donated_amount: 2100 },
    { id: 4, name: 'Refugio Animal', slug: 'refugio-animal', description: 'Protección y adopción', image_url: 'https://dummyimage.com/800x450/334155/ffffff&text=Refugio', featured: false, goal_amount: 6000, donated_amount: 1500 },
  ]
  if (!params) return Promise.resolve(data)
  const q = new URLSearchParams(params)
  let out = data
  const search = q.get('search')?.toLowerCase()
  if (search) out = out.filter(c => c.name.toLowerCase().includes(search) || c.description?.toLowerCase().includes(search))
  const category = q.get('category')
  if (category) {
    // Mock: filter by name includes category keyword
    out = out.filter(c => c.description?.toLowerCase().includes(category) || c.name.toLowerCase().includes(category))
  }
  const ordering = q.get('ordering')
  if (ordering === 'A-Z') out = [...out].sort((a,b)=>a.name.localeCompare(b.name))
  if (ordering === 'Más apoyo') out = [...out].sort((a,b)=>(b.donated_amount||0)-(a.donated_amount||0))
  if (ordering === 'Destacadas') out = [...out].sort((a,b)=>Number(b.featured)-Number(a.featured))
  return Promise.resolve(out)
}

export async function getFeaturedCauses(): Promise<Cause[]> {
  // TODO: wire real API: GET /api/v1/causes/featured/
  const all = await getCauses()
  return all.filter(c => c.featured)
}
