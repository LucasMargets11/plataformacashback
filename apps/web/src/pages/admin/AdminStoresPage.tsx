import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchStores, fetchMerchants, type ApiStore, type ApiMerchant } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export default function AdminStoresPage() {
    const [params] = useSearchParams()
    const merchantFilter = params.get('merchant')
    const [stores, setStores] = useState<ApiStore[]>([])
    const [merchants, setMerchants] = useState<Map<number, string>>(new Map())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([fetchStores(), fetchMerchants()])
            .then(([strs, merch]) => {
                const mid = merchantFilter ? Number(merchantFilter) : null
                setStores(mid ? strs.filter(s => s.merchant === mid) : strs)
                const map = new Map<number, string>()
                merch.forEach(m => map.set(m.id, m.name))
                setMerchants(map)
            })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [merchantFilter])

    if (loading) {
        return (
            <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-lg bg-gray-100" />)}
            </div>
        )
    }

    if (error) return <Card className="text-red-600">{error}</Card>

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                    Tiendas{merchantFilter ? ` (Merchant #${merchantFilter})` : ''}
                </h2>
                <Link to="/app/admin/stores/new">
                    <Button className="h-9 px-4 text-sm">+ Nueva Tienda</Button>
                </Link>
            </div>

            {merchantFilter && (
                <Link to="/app/admin/stores" className="inline-block mb-3 text-sm text-blue-600 hover:underline">
                    ← Ver todas las tiendas
                </Link>
            )}

            {stores.length === 0 ? (
                <Card className="text-center py-8 text-gray-500">No hay tiendas.</Card>
            ) : (
                <div className="space-y-3">
                    {stores.map(s => (
                        <Card key={s.id} className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900">
                                    {s.display_name}
                                    {!s.active && (
                                        <span className="ml-2 inline-block rounded-full bg-gray-100 border border-gray-200 px-2 py-0.5 text-xs text-gray-500">
                                            Inactiva
                                        </span>
                                    )}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {merchants.get(s.merchant) || `Merchant #${s.merchant}`}
                                    {s.address ? ` · ${s.address}` : ''}
                                    {` · ${s.supported_causes.length} causa(s)`}
                                </p>
                            </div>
                            <Link to={`/app/admin/stores/${s.id}/causes`} className="text-sm text-blue-600 hover:underline">
                                Gestionar causas →
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
