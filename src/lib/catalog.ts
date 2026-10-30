import {
  brands,
  categories,
  collections,
  products,
} from '@/data/fixtures'
import type { Brand, Product } from '@/data/fixtures'

export const getProduct = (id: string) => products.find((p) => p.id === id)
export const getBrand = (id: string) => brands.find((b) => b.id === id)
export const getCategory = (id: string) => categories.find((c) => c.id === id)
export const getCollection = (id: string) => collections.find((c) => c.id === id)

export const brandOf = (product: Product): Brand => getBrand(product.brandId)!

export const productsByIds = (ids: Array<string>) =>
  ids.map(getProduct).filter((p): p is Product => !!p)

export const formatPrice = (value: number) =>
  value.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  })

/**
 * Personalized recommendations from browsing history. Scores unseen products
 * by shared brand, category and tags with recently viewed items (more recent
 * views weigh more). Placeholder for the AI-ranked version in PLAN.md.
 */
export function recommendFor(viewedIds: Array<string>, limit = 4) {
  const viewed = productsByIds(viewedIds)
  if (viewed.length === 0) {
    return {
      reason: null as Product | null,
      items: [...products].sort((a, b) => b.reviews - a.reviews).slice(0, limit),
    }
  }
  const seen = new Set(viewedIds)
  const scored = products
    .filter((p) => !seen.has(p.id))
    .map((p) => {
      let score = 0
      viewed.forEach((v, i) => {
        const weight = 1 / (i + 1)
        if (v.brandId === p.brandId) score += 3 * weight
        if (v.category === p.category) score += 2 * weight
        score += p.tags.filter((t) => v.tags.includes(t)).length * weight
      })
      return { p, score: score + p.rating / 10 }
    })
    .sort((a, b) => b.score - a.score)
  return { reason: viewed[0], items: scored.slice(0, limit).map((s) => s.p) }
}
