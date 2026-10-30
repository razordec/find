import { brands, categories, products } from '@/data/fixtures'
import type { Brand, Category, Product } from '@/data/fixtures'

/**
 * Client-side predictive search with lightweight intent parsing and typo
 * correction. Runs over the fixture catalog today; the same interface can be
 * backed by a search API later (see PLAN.md).
 */

export interface SearchIntent {
  maxPrice?: number
  minPrice?: number
  onSale?: boolean
  newArrivals?: boolean
  gift?: boolean
  category?: Category
  brand?: Brand
}

export interface SearchResult {
  query: string
  corrected: string
  didCorrect: boolean
  intent: SearchIntent
  intentLabels: Array<string>
  products: Array<Product>
  brands: Array<Brand>
  categories: Array<Category>
}

const STOPWORDS = new Set([
  'a', 'an', 'the', 'for', 'and', 'with', 'in', 'of', 'to', 'my', 'me', 'some',
  'under', 'below', 'less', 'than', 'over', 'above', 'more', 'cheap', 'budget',
  'sale', 'deal', 'deals', 'discount', 'new', 'gift', 'gifts', 'present', 'her',
  'him', 'mom', 'dad', 'show', 'find', 'i', 'want', 'need', 'something',
])

const CATEGORY_SYNONYMS: Record<string, string> = {
  cooking: 'kitchen', cook: 'kitchen', cookware: 'kitchen',
  decor: 'home', living: 'home', bedroom: 'home',
  clothes: 'fashion', clothing: 'fashion', style: 'fashion', outfit: 'fashion',
  skincare: 'beauty', skin: 'beauty', makeup: 'beauty',
  gadgets: 'tech', electronics: 'tech', audio: 'tech',
  hiking: 'outdoors', camping: 'outdoors', travel: 'outdoors',
  food: 'pantry', drinks: 'pantry', snacks: 'pantry',
}

const normalize = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')

const vocabulary = (() => {
  const words = new Set<string>()
  const add = (s: string) =>
    normalize(s)
      .split(/[^a-z0-9]+/)
      .filter((w) => w.length > 2)
      .forEach((w) => words.add(w))
  products.forEach((p) => {
    add(p.name)
    p.tags.forEach(add)
  })
  brands.forEach((b) => add(b.name))
  categories.forEach((c) => add(c.name))
  Object.keys(CATEGORY_SYNONYMS).forEach(add)
  return [...words]
})()

function distance(a: string, b: string) {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j]
      dp[j] = Math.min(
        dp[j] + 1,
        dp[j - 1] + 1,
        prev + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
      prev = tmp
    }
  }
  return dp[b.length]
}

function correctWord(word: string) {
  if (word.length < 4 || STOPWORDS.has(word) || /\d/.test(word)) return word
  if (vocabulary.includes(word)) return word
  // Prefix matches are "still typing", not typos.
  if (vocabulary.some((v) => v.startsWith(word))) return word
  const budget = word.length <= 5 ? 1 : 2
  let best = word
  let bestDist = budget + 1
  for (const v of vocabulary) {
    if (Math.abs(v.length - word.length) > budget) continue
    const d = distance(word, v)
    if (d < bestDist) {
      best = v
      bestDist = d
    }
  }
  return best
}

function parseIntent(q: string): SearchIntent {
  const intent: SearchIntent = {}
  const under = q.match(/(?:under|below|less than|<)\s*\$?(\d+)/)
  if (under) intent.maxPrice = Number(under[1])
  const over = q.match(/(?:over|above|more than|>)\s*\$?(\d+)/)
  if (over) intent.minPrice = Number(over[1])
  if (/\b(cheap|budget|affordable)\b/.test(q) && !intent.maxPrice) intent.maxPrice = 60
  if (/\b(sale|deals?|discount(ed)?|markdown)\b/.test(q)) intent.onSale = true
  if (/\b(new|latest|just in)\b/.test(q)) intent.newArrivals = true
  if (/\b(gifts?|present|for (her|him|mom|dad))\b/.test(q)) intent.gift = true

  const words = q.split(/\s+/)
  for (const w of words) {
    const cat = categories.find(
      (c) => normalize(c.name) === w || CATEGORY_SYNONYMS[w] === c.id,
    )
    if (cat) intent.category = cat
  }
  intent.brand = brands.find((b) => {
    const name = normalize(b.name)
    const first = name.split(' ')[0]
    return q.includes(name) || (first.length > 3 && words.includes(first))
  })
  return intent
}

export function search(raw: string): SearchResult {
  const query = raw.trim()
  const words = normalize(query).split(/\s+/).filter(Boolean)
  const correctedWords = words.map(correctWord)
  const corrected = correctedWords.join(' ')
  const didCorrect = corrected !== words.join(' ')
  const intent = parseIntent(corrected)

  const terms = correctedWords.filter(
    (w) =>
      !STOPWORDS.has(w) &&
      !/^\$?\d+$/.test(w) &&
      !CATEGORY_SYNONYMS[w] &&
      !categories.some((c) => normalize(c.name) === w),
  )

  const brandWords = new Set(
    intent.brand ? normalize(intent.brand.name).split(/[^a-z0-9]+/) : [],
  )
  const textTerms = terms.filter((t) => !brandWords.has(t))

  const scored = products
    .map((p) => {
      const brand = brands.find((b) => b.id === p.brandId)!
      const hay = {
        name: normalize(p.name),
        brand: normalize(brand.name),
        tags: p.tags.map(normalize).join(' '),
        desc: normalize(p.shortDescription + ' ' + p.description),
      }
      let score = 0
      for (const t of textTerms) {
        if (hay.name.includes(t)) score += 4
        if (hay.tags.includes(t)) score += 3
        if (hay.brand.includes(t)) score += 3
        if (hay.desc.includes(t)) score += 1
      }
      return { p, score }
    })
    .filter(({ p, score }) => {
      if (textTerms.length > 0 && score === 0) return false
      if (intent.maxPrice != null && p.price > intent.maxPrice) return false
      if (intent.minPrice != null && p.price < intent.minPrice) return false
      if (intent.onSale && p.badge !== 'On Sale') return false
      if (intent.newArrivals && p.badge !== 'New Arrival') return false
      if (intent.gift && !p.tags.includes('gift')) return false
      if (intent.category && p.category !== intent.category.id) return false
      if (intent.brand && p.brandId !== intent.brand.id) return false
      return true
    })
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)

  const intentLabels: Array<string> = []
  if (intent.category) intentLabels.push(intent.category.name)
  if (intent.brand) intentLabels.push(intent.brand.name)
  if (intent.maxPrice != null) intentLabels.push(`Under $${intent.maxPrice}`)
  if (intent.minPrice != null) intentLabels.push(`Over $${intent.minPrice}`)
  if (intent.onSale) intentLabels.push('On sale')
  if (intent.newArrivals) intentLabels.push('New arrivals')
  if (intent.gift) intentLabels.push('Giftable')

  const last = correctedWords[correctedWords.length - 1] ?? ''
  const matchesPrefix = (name: string) =>
    last.length > 0 &&
    normalize(name)
      .split(/[^a-z0-9]+/)
      .some((w) => w.startsWith(last))

  return {
    query,
    corrected,
    didCorrect,
    intent,
    intentLabels,
    products: query ? scored.map((s) => s.p) : [],
    brands: brands.filter((b) => matchesPrefix(b.name)).slice(0, 3),
    categories: categories.filter((c) => matchesPrefix(c.name)).slice(0, 2),
  }
}

export const popularSearches = [
  'gifts under $100',
  'cast iron',
  'linen',
  'wireless headphones',
  'on sale',
  'skincare',
]
