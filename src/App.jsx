import { useMemo, useState } from 'react'
import { useProducts, usePurchases } from './hooks/useSupabase'
import AddPurchase from './components/AddPurchase'
import HistoryList from './components/HistoryList'

const DEFAULT_PRODUCTS = [
  'Lait', 'Pain', 'Oeufs', 'Tomates', 'Pâtes', 'Fromage', 'Poulet', 'Pommes',
]

function App() {
  const [view, setView] = useState('add')
  const { products, addProduct } = useProducts()
  const { purchases, addPurchase, loading } = usePurchases()

  const allProducts = useMemo(() => {
    const combined = [...DEFAULT_PRODUCTS, ...products]
    return [...new Set(combined)]
  }, [products])

  const handleAddPurchase = async ({ name, price, date, isNewProduct }) => {
    if (isNewProduct) {
      await addProduct(name)
    }
    return await addPurchase(name, price, date)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-5xl px-6 py-4">
          <p className="text-sm font-medium text-slate-500">Application de Suivi de Courses</p>
          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={() => setView('add')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === 'add'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Ajouter un achat
            </button>
            <button
              onClick={() => setView('history')}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                view === 'history'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Historique
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        {view === 'add' ? (
          <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <AddPurchase products={allProducts} onSubmit={handleAddPurchase} />

            <aside className="space-y-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-sm font-semibold text-slate-700">Produits connus</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Ces produits servent de base de suggestions pendant la saisie.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {allProducts.sort().map((product) => (
                    <span
                      key={product}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h3 className="text-sm font-semibold text-slate-700">Derniers achats</h3>
                {purchases.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">Aucun achat enregistré.</p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {purchases.slice(0, 4).map((purchase) => (
                      <li key={purchase.id} className="rounded-xl border border-slate-100 p-3">
                        <p className="text-sm font-semibold text-slate-800">{purchase.name}</p>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                          <span>{purchase.date}</span>
                          <span>{purchase.price.toFixed(2)} F</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </section>
        ) : (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">Historique des courses</h2>
              <p className="mt-1 text-sm text-slate-500">
                Liste de tous vos achats triés par date décroissante
              </p>
            </div>
            <HistoryList purchases={purchases} loading={loading} />
          </section>
        )}
      </main>
    </div>
  )
}

export default App
