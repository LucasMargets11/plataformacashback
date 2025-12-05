import { useEffect, useState } from 'react'
import { env } from '../../../lib/env'

export type Cause = {
  id: number
  title: string
  slug: string
  category: string
  summary: string
  image_url: string
  cashback_percent?: number
  is_featured?: boolean
}

type State = { loading: boolean; error: string | null; data: Cause[] }

export function useFeaturedCauses(limit = 6) {
  const [state, setState] = useState<State>({ loading: true, error: null, data: [] })

  useEffect(() => {
    const ctrl = new AbortController()
    const url = `${env.apiUrl || 'http://localhost:8000'}/api/causes/?is_featured=true&limit=${limit}`
    async function load() {
      setState(s => ({ ...s, loading: true, error: null }))
      try {
        const res = await fetch(url, { signal: ctrl.signal })
        if (!res.ok) throw new Error(res.statusText)
        const data: Cause[] = await res.json()
        setState({ loading: false, error: null, data })
      } catch (e: any) {
        if (ctrl.signal.aborted) return
        // Fallback mock to avoid breaking layout
        const mock: Cause[] = [
          { id: 1, title: 'Becas Escolares', slug: 'becas-escolares', category: 'Educación', summary: 'Apoyá a estudiantes de bajos recursos', image_url: 'https://dummyimage.com/800x450/1f2937/ffffff&text=Becas' },
          { id: 2, title: 'Clínica Comunitaria', slug: 'clinica-comunitaria', category: 'Salud', summary: 'Atención médica gratuita', image_url: 'https://dummyimage.com/800x450/0f172a/ffffff&text=Clínica' },
          { id: 3, title: 'Reforestación Urbana', slug: 'reforestacion-urbana', category: 'Ambiente', summary: 'Más árboles en tu ciudad', image_url: 'https://dummyimage.com/800x450/111827/ffffff&text=Reforestación' },
          { id: 4, title: 'Refugio Animal', slug: 'refugio-animal', category: 'Ambiente', summary: 'Protección y adopción', image_url: 'https://dummyimage.com/800x450/334155/ffffff&text=Refugio' },
          { id: 5, title: 'Deporte para Todos', slug: 'deporte-para-todos', category: 'Deporte', summary: 'Acceso al deporte para niños', image_url: 'https://dummyimage.com/800x450/0b2447/ffffff&text=Deporte' },
          { id: 6, title: 'Aulas Digitales', slug: 'aulas-digitales', category: 'Educación', summary: 'Tecnología en escuelas', image_url: 'https://dummyimage.com/800x450/133b5c/ffffff&text=Aulas' },
        ]
        setState({ loading: false, error: e?.message || 'No se pudo cargar causas', data: mock })
      }
    }
    load()
    return () => ctrl.abort()
  }, [limit])

  return state
}
