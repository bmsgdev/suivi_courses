import { useEffect, useMemo, useState } from 'react'

const DEFAULT_PRODUCTS = [
  'Lait',
  'Pain',
  'Oeufs',
  'Tomates',
  'Pâtes',
  'Fromage',
  'Poulet',
  'Pommes',
]

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const saveToStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

function App() {
  const [products, setProducts] = useState(() =>
    loadFromStorage('products', DEFAULT_PRODUCTS),
  )
  const [purchases, setPurchases] = useState(() =>
    loadFromStorage('purchases', []),
  )
  const [form, setForm] = useState({ name: '', price: '', date: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    saveToStorage('products', products)
  }, [products])

  useEffect(() => {
    saveToStorage('purchases', purchases)
  }, [purchases])

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.localeCompare(b)),
    [products],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')
    setNote('')

    const trimmedName = form.name.trim()
    const priceValue = Number.parseFloat(form.price)
    const dateValue = form.date

    const missingFields = []
    if (!trimmedName) missingFields.push('nom du produit')
    if (!form.price) missingFields.push("prix d'achat")
    if (!dateValue) missingFields.push("date d'achat")

    if (missingFields.length > 0) {
      setError(`Champs obligatoires manquants : ${missingFields.join(', ')}`)
      return
    }

    if (Number.isNaN(priceValue) || priceValue <= 0) {
      setError("Le prix d'achat doit être un nombre positif.")
      return
    }

    const existingProduct = products.find(
      (product) => product.toLowerCase() === trimmedName.toLowerCase(),
    )

    const normalizedName = existingProduct ?? trimmedName
    const newPurchase = {
      id: crypto.randomUUID(),
      name: normalizedName,
      price: priceValue,
      date: dateValue,
    }

    setPurchases((prev) => [newPurchase, ...prev])

    if (!existingProduct) {
      setProducts((prev) => [...prev, trimmedName])
      setNote('Produit créé et ajouté au catalogue.')
    } else {
      setNote('Produit reconnu dans le catalogue existant.')
    }

    setSuccess('Achat enregistré avec succès.')
    setForm({ name: '', price: '', date: '' })
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Application de Suivi de Courses</p>
            <h1 className="text-2xl font-semibold">Ajout d'achat</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold">Nouvel achat</h2>
            <p className="mt-1 text-sm text-slate-500">
              Saisissez les informations de votre achat. Les produits déjà connus sont suggérés
              automatiquement.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700" htmlFor="name">
                  Nom du produit
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  list="product-suggestions"
                  placeholder="Ex: Lait demi-écrémé"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                />
                <datalist id="product-suggestions">
                  {sortedProducts.map((product) => (
                    <option value={product} key={product} />
                  ))}
                </datalist>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="price">
                    Prix d'achat (€)
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0,00"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700" htmlFor="date">
                    Date d'achat
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    value={form.date}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400"
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {success}
                  {note && <p className="mt-1 text-xs text-emerald-600">{note}</p>}
                </div>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Ajouter un achat
              </button>
            </form>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h3 className="text-sm font-semibold text-slate-700">Produits connus</h3>
              <p className="mt-1 text-xs text-slate-500">
                Ces produits servent de base de suggestions pendant la saisie.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sortedProducts.map((product) => (
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
              {purchases.length === 0 ?
                <p className="mt-3 text-sm text-slate-500">Aucun achat enregistré.</p>
              :
                <ul className="mt-4 space-y-3">
                  {purchases.slice(0, 4).map((purchase) => (
                    <li key={purchase.id} className="rounded-xl border border-slate-100 p-3">
                      <p className="text-sm font-semibold text-slate-800">{purchase.name}</p>
                      <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                        <span>{purchase.date}</span>
                        <span>{purchase.price.toFixed(2)} €</span>
                      </div>
                    </li>
                  ))}
                </ul>
              }
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}

export default App
