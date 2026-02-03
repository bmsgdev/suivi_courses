export const getTopProduct = (productNames) => {
  if (!productNames || productNames.length === 0) {
    return null
  }

  const counts = {}
  
  for (const name of productNames) {
    counts[name] = (counts[name] || 0) + 1
  }

  let maxCount = 0
  let topProduct = null

  for (const [name, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count
      topProduct = name
    }
  }

  return topProduct
}

export const filterPurchasesByPeriod = (purchases, days) => {
  if (!days) return purchases

  const now = new Date()
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)

  return purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.date)
    return purchaseDate >= cutoffDate
  })
}

export const filterPurchasesByCustomDates = (purchases, startDate, endDate) => {
  if (!startDate || !endDate) return purchases

  const start = new Date(startDate)
  const end = new Date(endDate)

  return purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.date)
    return purchaseDate >= start && purchaseDate <= end
  })
}
