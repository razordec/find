import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getProduct } from '@/lib/catalog'

/**
 * Cart, saved items, browsing history and theme. Persisted to localStorage for
 * now; a later milestone syncs these to the signed-in user's account.
 */

export interface CartLine {
  productId: string
  quantity: number
}

export interface Toast {
  id: number
  message: string
  image?: string
}

type Theme = 'light' | 'dark'

interface ShopState {
  cart: Array<CartLine>
  saved: Array<string>
  viewed: Array<string>
  theme: Theme
  toasts: Array<Toast>
  cartOpen: boolean
  cartCount: number
  cartSubtotal: number
  addToCart: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  toggleSaved: (productId: string) => void
  isSaved: (productId: string) => boolean
  recordView: (productId: string) => void
  toggleTheme: () => void
  setCartOpen: (open: boolean) => void
  notify: (message: string, image?: string) => void
}

const ShopContext = createContext<ShopState | null>(null)

const STORAGE_KEY = 'craftedthreads:v1'
export const MAX_QTY = 10

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Array<CartLine>>([])
  const [saved, setSaved] = useState<Array<string>>([])
  const [viewed, setViewed] = useState<Array<string>>([])
  const [theme, setTheme] = useState<Theme>('light')
  const [toasts, setToasts] = useState<Array<Toast>>([])
  const [cartOpen, setCartOpen] = useState(false)
  const hydrated = useRef(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
      if (Array.isArray(stored.cart)) setCart(stored.cart.filter((l: CartLine) => getProduct(l.productId)))
      if (Array.isArray(stored.saved)) setSaved(stored.saved)
      if (Array.isArray(stored.viewed)) setViewed(stored.viewed)
    } catch {
      // Ignore malformed storage.
    }
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light')
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cart, saved, viewed }))
  }, [cart, saved, viewed])

  const notify = useCallback((message: string, image?: string) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, image }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      const product = getProduct(productId)
      if (!product) return
      setCart((lines) => {
        const existing = lines.find((l) => l.productId === productId)
        if (existing) {
          return lines.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + quantity) }
              : l,
          )
        }
        return [...lines, { productId, quantity: Math.min(MAX_QTY, quantity) }]
      })
      notify(`Added ${product.name} to your bag`, product.image)
    },
    [notify],
  )

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setCart((lines) =>
      quantity <= 0
        ? lines.filter((l) => l.productId !== productId)
        : lines.map((l) =>
            l.productId === productId
              ? { ...l, quantity: Math.min(MAX_QTY, quantity) }
              : l,
          ),
    )
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((lines) => lines.filter((l) => l.productId !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleSaved = useCallback(
    (productId: string) => {
      const product = getProduct(productId)
      const has = saved.includes(productId)
      if (product) notify(has ? 'Removed from Saved' : `Saved ${product.name}`, product.image)
      setSaved((ids) =>
        has ? ids.filter((id) => id !== productId) : [productId, ...ids.filter((id) => id !== productId)],
      )
    },
    [notify, saved],
  )

  const recordView = useCallback((productId: string) => {
    setViewed((ids) => [productId, ...ids.filter((id) => id !== productId)].slice(0, 12))
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark'
      document.documentElement.classList.toggle('dark', next === 'dark')
      localStorage.setItem('craftedthreads:theme', next)
      return next
    })
  }, [])

  const value = useMemo<ShopState>(() => {
    const cartCount = cart.reduce((n, l) => n + l.quantity, 0)
    const cartSubtotal = cart.reduce(
      (sum, l) => sum + (getProduct(l.productId)?.price ?? 0) * l.quantity,
      0,
    )
    return {
      cart,
      saved,
      viewed,
      theme,
      toasts,
      cartOpen,
      cartCount,
      cartSubtotal,
      addToCart,
      setQuantity,
      removeFromCart,
      clearCart,
      toggleSaved,
      isSaved: (id) => saved.includes(id),
      recordView,
      toggleTheme,
      setCartOpen,
      notify,
    }
  }, [cart, saved, viewed, theme, toasts, cartOpen, addToCart, setQuantity, removeFromCart, clearCart, toggleSaved, recordView, toggleTheme, notify])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used inside <ShopProvider>')
  return ctx
}

/** Inline script that applies the saved theme before first paint. */
export const themeBootScript = `try{var t=localStorage.getItem('craftedthreads:theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`
