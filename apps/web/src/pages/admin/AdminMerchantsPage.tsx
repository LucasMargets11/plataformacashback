import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchMerchants, fetchUsers, type ApiMerchant, type ApiUser } from '../../lib/api'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export default function AdminMerchantsPage() {
    const [merchants, setMerchants] = useState<ApiMerchant[]>([])
    const [users, setUsers] = useState<Map<number, ApiUser>>(new Map())
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        Promise.all([fetchMerchants(), fetchUsers('MERCHANT')])
            .then(([merch, usrs]) => {
                setMerchants(merch)
                const map = new Map<number, ApiUser>()
                usrs.forEach(u => map.set(u.id, u))
                setUsers(map)
            })
            .catch(e => setError(e.message))
            .finally(() => setLoading(false))
    }, [])

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
                <h2 className="text-lg font-semibold text-gray-900">Merchants</h2>
                <Link to="/app/admin/merchants/new">
                    <Button className="h-9 px-4 text-sm">+ Nuevo Merchant</Button>
                </Link>
            </div>

            {merchants.length === 0 ? (
                <Card className="text-center py-8 text-gray-500">No hay merchants creados.</Card>
            ) : (
                <div className="space-y-3">
                    {merchants.map(m => {
                        const owner = users.get(m.owner)
                        return (
                            <Card key={m.id} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">{m.name}</p>
                                    <p className="text-sm text-gray-500">
                                        CUIT: {m.cuit} · Estado: {m.status}
                                        {owner ? ` · Owner: ${owner.email}` : ''}
                                    </p>
                                </div>
                                <Link to={`/app/admin/stores?merchant=${m.id}`} className="text-sm text-blue-600 hover:underline">
                                    Ver tiendas →
                                </Link>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
