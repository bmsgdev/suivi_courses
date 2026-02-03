export default function HistoryList({ purchases, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"></div>
      </div>
    )
  }

  if (purchases.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
        <p className="text-slate-500">Aucun achat enregistré</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {purchases.map((purchase) => (
        <div
          key={purchase.id}
          className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition hover:shadow"
        >
          <div className="flex-1">
            <p className="font-semibold text-slate-900">{purchase.name}</p>
            <p className="mt-1 text-sm text-slate-500">
              {new Date(purchase.date).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-slate-900">{purchase.price.toFixed(2)} F</p>
          </div>
        </div>
      ))}
    </div>
  )
}
