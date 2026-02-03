import { describe, it, expect } from 'vitest'
import { getTopProduct } from './topProduct.js'

describe('getTopProduct', () => {
  it('devrait retourner "pomme" pour la liste [pomme, poire, pomme]', () => {
    const products = ['pomme', 'poire', 'pomme']
    
    const result = getTopProduct(products)
    
    expect(result).toBe('pomme')
  })
})
