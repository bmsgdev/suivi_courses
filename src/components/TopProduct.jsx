import { useMemo, useState } from 'react'
import { getTopProduct, filterPurchasesByPeriod, filterPurchasesByCustomDates } from '../utils/topProduct'

const PRESETS = [
  { label: '7 jours', days: 7 },
  { label: '30 jours', days: 30 },
  { label: '3 mois', days: 90 },
]

export default function TopProduct({ purchases }) {
  const [preset, setPreset] = useState(30)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  const { topProduct, count, filteredPurchases, period } = useMemo(() => {
    let filtered = []
    let periodLabel = ''

    if (useCustom && customStart && customEnd) {
      filtered = filterPurchasesByCustomDates(purchases, customStart, customEnd)
      periodLabel = `${new Date(customStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - ${new Date(customEnd).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}`
    } else {
      filtered = filterPurchasesByPeriod(purchases, preset)
      const presetObj = PRESETS.find(p => p.days === preset)
      periodLabel = presetObj ? presetObj.label : `${preset} jours`
    }

    // Extraire les noms de produits pour getTopProduct
    const productNames = filtered.map(p => p.name)
    const top = getTopProduct(productNames)
    const topCount = filtered.filter(p => p.name === top).length

    return {
      topProduct: top,
      count: topCount,
      filteredPurchases: filtered,
      period: periodLabel
    }
  }, [purchases, preset, customStart, customEnd, useCustom])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Top Produit</h2>
        <p className="mt-1 text-sm text-slate-500">
          Produit le plus acheté sur la période sélectionnée
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <label className="text-sm font-medium text-slate-700">Choisir une période</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map(({ label, days }) => (
            <button
              key={days}
              onClick={() => {
                setPreset(days)
                setUseCustom(false)
              }}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                !useCustom && preset === days
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => setUseCustom(true)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              useCustom
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Personnalisé
          </button>
        </div>

        {useCustom && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-slate-600" htmlFor="top-start">
                Date début
              </label>
              <input
                id="top-start"
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600" htmlFor="top-end">
                Date fin
              </label>
              <input
                id="top-end"
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
              />
            </div>
          </div>
        )}
      </div>

      {filteredPurchases.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-slate-500">Aucun achat dans cette période</p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-500 p-8 text-white shadow-lg">
            <p className="text-sm font-medium opacity-90">{period}</p>
            <p className="mt-3 text-4xl font-bold">{topProduct}</p>
            <p className="mt-3 text-lg opacity-90">
              {count} achat{count > 1 ? 's' : ''}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Classement</h3>
            <div className="mt-4 space-y-2">
              {Object.entries(
                filteredPurchases.reduce((acc, p) => {
                  acc[p.name] = (acc[p.name] || 0) + 1
                  return acc
                }, {})
              )
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([name, count], index) => (
                  <div key={name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {index + 1}
                      </span>
                      <span className="text-slate-700">{name}</span>
                    </div>
                    <span className="font-semibold text-slate-900">
                      {count} achat{count > 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
