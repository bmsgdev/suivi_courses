import { useMemo, useState } from 'react'

export default function AddPurchase({ products, onSubmit }) {
  const [form, setForm] = useState({ name: '', price: '', date: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [note, setNote] = useState('')

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.localeCompare(b)),
    [products],
  )

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
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

    console.log('🔍 Product check:', { trimmedName, existingProduct, allProducts: products })

    const result = await onSubmit({
      name: existingProduct ?? trimmedName,
      price: priceValue,
      date: dateValue,
      isNewProduct: !existingProduct
    })

    if (result.success) {
      if (!existingProduct) {
        setNote('Produit créé et ajouté au catalogue.')
      } else {
        setNote('Produit reconnu dans le catalogue existant.')
      }
      setSuccess('Achat enregistré avec succès.')
      setForm({ name: '', price: '', date: '' })
    } else {
      setError("Erreur lors de l'enregistrement.")
    }
  }

  return (
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
              Prix d'achat (F)
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
  )
}
