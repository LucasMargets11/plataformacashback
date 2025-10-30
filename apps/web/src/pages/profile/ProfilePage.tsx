import React, { useEffect, useMemo, useState } from 'react'
import { getProfileSummary, getDonations } from '../../lib/api'
import { Card } from '../../components/ui/Card'

type Summary = {
  total_donado: number
  causas_count: number
  ordenes_count: number
  porcentaje_promedio: number
}

type Donation = {
  id: string
  fecha: string
  comercio: string
  causa: string
  monto_compra: number
  porcentaje: number
  donado: number
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])

  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [cause, setCause] = useState('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [s, d] = await Promise.all([
          getProfileSummary(),
          getDonations({ from, to, cause }),
        ])
        if (!cancelled) {
          setSummary(s)
          setDonations(d)
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'Error al cargar el perfil')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [from, to, cause])

  const topByCause = useMemo(() => {
    const agg: Record<string, number> = {}
    donations.forEach(d => { agg[d.causa] = (agg[d.causa] || 0) + d.donado })
    const entries = Object.entries(agg).sort((a,b) => b[1]-a[1])
    const top5 = entries.slice(0,5)
    const others = entries.slice(5)
    if (others.length) top5.push(['Otros', others.reduce((s, [,v]) => s+v, 0)])
    return top5
  }, [donations])

  return (
    <div className="min-h-screen bg-white pt-6 pb-12">
      <div className="mx-auto max-w-screen-xl px-6 md:px-8 lg:px-10">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen de tu impacto.</p>
        </div>

        {/* Filtros */}
        <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-end">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Desde</label>
            <input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Hasta</label>
            <input type="date" value={to} onChange={e=>setTo(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Causa</label>
            <input type="text" value={cause} onChange={e=>setCause(e.target.value)} placeholder="Nombre de causa" className="px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
            {[...Array(4)].map((_,i)=>(<div key={i} className="h-24 rounded-lg bg-gray-100" />))}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-red-800">{error}</div>
        )}

        {!loading && summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <div className="text-sm text-gray-600">Total donado (USD)</div>
              <div className="text-2xl font-semibold text-gray-900">${summary.total_donado.toFixed(2)}</div>
            </Card>
            <Card>
              <div className="text-sm text-gray-600">Causas apoyadas</div>
              <div className="text-2xl font-semibold text-gray-900">{summary.causas_count}</div>
            </Card>
            <Card>
              <div className="text-sm text-gray-600">Órdenes con cashback</div>
              <div className="text-2xl font-semibold text-gray-900">{summary.ordenes_count}</div>
            </Card>
            <Card>
              <div className="text-sm text-gray-600">% Promedio destinado</div>
              <div className="text-2xl font-semibold text-gray-900">{summary.porcentaje_promedio.toFixed(1)}%</div>
            </Card>
          </div>
        )}

        {/* "Gráfico" simple como tabla resumen por causa */}
        {!loading && !!topByCause.length && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Donaciones por causa</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-600">
                    <th className="py-2 pr-4">Causa</th>
                    <th className="py-2">Donado (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {topByCause.map(([c, v]) => (
                    <tr key={c} className="border-t border-gray-100">
                      <td className="py-2 pr-4">{c}</td>
                      <td className="py-2">${(v as number).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Actividad reciente */}
        {!loading && (
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Actividad reciente</h2>
            {donations.length === 0 ? (
              <div className="text-gray-600">Sin actividad en el período.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="py-2 pr-4">Fecha</th>
                      <th className="py-2 pr-4">Comercio</th>
                      <th className="py-2 pr-4">Causa</th>
                      <th className="py-2 pr-4">Monto</th>
                      <th className="py-2 pr-4">% Asignado</th>
                      <th className="py-2">Donado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map(d => (
                      <tr key={d.id} className="border-t border-gray-100">
                        <td className="py-2 pr-4">{new Date(d.fecha).toLocaleDateString()}</td>
                        <td className="py-2 pr-4">{d.comercio}</td>
                        <td className="py-2 pr-4">{d.causa}</td>
                        <td className="py-2 pr-4">${d.monto_compra.toFixed(2)}</td>
                        <td className="py-2 pr-4">{d.porcentaje}%</td>
                        <td className="py-2">${d.donado.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
