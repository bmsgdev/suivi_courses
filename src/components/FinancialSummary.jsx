import { useMemo, useState } from 'react'

export default function FinancialSummary({ purchases }) {
  const [filter, setFilter] = useState('all')
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const { filteredPurchases, total, period } = useMemo(() => {
    const now = new Date()
    let filtered = []
    let periodLabel = ''

    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = purchases.filter(p => new Date(p.date) >= weekAgo)
      periodLabel = '7 derniers jours'
    } else if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = purchases.filter(p => new Date(p.date) >= monthAgo)
      periodLabel = '30 derniers jours'
    } else if (filter === 'custom' && customStart && customEnd) {
      const start = new Date(customStart)
      const end = new Date(customEnd)
      filtered = purchases.filter(p => {
        const date = new Date(p.date)
        return date >= start && date <= end
      })
      periodLabel = `${new Date(customStart).toLocaleDateString('fr-FR')} - ${new Date(customEnd).toLocaleDateString('fr-FR')}`
    } else {
      filtered = purchases
      periodLabel = 'Toutes les périodes'
    }

    const totalAmount = filtered.reduce((sum, p) => sum + Number(p.price), 0)

    return {
      filteredPurchases: filtered,
      total: totalAmount,
      period: periodLabel
    }
  }, [purchases, filter, customStart, customEnd])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Bilan Financier</h2>
        <p className="mt-1 text-sm text-slate-500">
          Montant total de vos dépenses avec filtres par période
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <label className="text-sm font-medium text-slate-700">Filtrer par période</label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              filter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tout
          </button>
          <button
            onClick={() => setFilter('week')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              filter === 'week'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            7 jours
          </button>
          <button
            onClick={() => setFilter('month')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              filter === 'month'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            30 jours
          </button>
          <button
            onClick={() => setFilter('custom')}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              filter === 'custom'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Personnalisé
          </button>
        </div>

        {filter === 'custom' && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600" htmlFor="start">
                Date début
              </label>
              <input
                id="start"
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600" htmlFor="end">
                Date fin
              </label>
              <input
                id="end"
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
              />
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90">{period}</p>
        <p className="mt-2 text-5xl font-bold">{total.toFixed(2)} F</p>
        <p className="mt-3 text-sm opacity-75">
          {filteredPurchases.length} achat{filteredPurchases.length > 1 ? 's' : ''}
        </p>
      </div>

      {filteredPurchases.length > 0 && (
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Répartition</h3>
          <div className="mt-4 space-y-2">
            {Object.entries(
              filteredPurchases.reduce((acc, p) => {
                acc[p.name] = (acc[p.name] || 0) + Number(p.price)
                return acc
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([name, amount]) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{name}</span>
                  <span className="font-semibold text-slate-900">{amount.toFixed(2)} F</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
