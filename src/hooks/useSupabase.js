import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const useLocalStorage = (key, fallback) => {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data))
  }, [key, data])

  return [data, setData]
}

export const useProducts = () => {
  const [local, setLocal] = useLocalStorage('products', [])
  const [products, setProducts] = useState(local)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return

    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')
      
      if (!error && data) {
        const names = data.map(p => p.name)
        setProducts(names)
        setLocal(names)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [])

  const addProduct = async (name) => {
    if (!supabase) {
      setProducts(prev => [...prev, name])
      setLocal(prev => [...prev, name])
      return { success: true }
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{ name }])
      .select()

    if (error) return { success: false, error }
    
    setProducts(prev => [...prev, name])
    setLocal(prev => [...prev, name])
    return { success: true, data }
  }

  return { products, addProduct, loading }
}

export const usePurchases = () => {
  const [local, setLocal] = useLocalStorage('purchases', [])
  const [purchases, setPurchases] = useState(local)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!supabase) return

    const fetchPurchases = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('purchases')
        .select('id, price, date, products(name)')
        .order('date', { ascending: false })
      
      if (!error && data) {
        const mapped = data.map(p => ({
          id: p.id,
          name: p.products.name,
          price: p.price,
          date: p.date
        }))
        setPurchases(mapped)
        setLocal(mapped)
      }
      setLoading(false)
    }

    fetchPurchases()
  }, [])

  const addPurchase = async (productName, price, date) => {
    if (!supabase) {
      const newPurchase = {
        id: crypto.randomUUID(),
        name: productName,
        price,
        date
      }
      setPurchases(prev => [newPurchase, ...prev])
      setLocal(prev => [newPurchase, ...prev])
      return { success: true }
    }

    const { data: product } = await supabase
      .from('products')
      .select('id')
      .eq('name', productName)
      .single()

    if (!product) return { success: false, error: 'Product not found' }

    const { data, error } = await supabase
      .from('purchases')
      .insert([{ product_id: product.id, price, date }])
      .select('id, price, date, products(name)')
      .single()

    if (error) return { success: false, error }

    const newPurchase = {
      id: data.id,
      name: data.products.name,
      price: data.price,
      date: data.date
    }
    
    setPurchases(prev => [newPurchase, ...prev])
    setLocal(prev => [newPurchase, ...prev])
    return { success: true, data: newPurchase }
  }

  return { purchases, addPurchase, loading }
}
