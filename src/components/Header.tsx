import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Heart, LayoutGrid, Moon, Package, ShoppingBag, Store, Sun, User } from 'lucide-react'
import { categories } from '@/data/fixtures'
import { useShop } from '@/context/ShopContext'
import { SearchBox } from './SearchBox'

export function Logo() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="CraftedThreads home">
      <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-accent to-coral text-lg font-extrabold text-white shadow-soft">
        k
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight">craftedthreads</span>
    </Link>
  )
}

function CategoriesMenu() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        className={navItem}
      >
        <LayoutGrid className="size-4" aria-hidden="true" />
        Categories
        <ChevronDown className={`size-3.5 transition ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="animate-fade absolute top-full left-0 z-50 mt-2 grid w-[min(92vw,30rem)] grid-cols-2 gap-1 rounded-3xl bg-surface p-2 shadow-lift ring-1 ring-line">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/search"
              search={{ category: c.id }}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 transition hover:bg-surface-2"
            >
              <span className="block text-sm font-semibold">{c.name}</span>
              <span className="block text-xs text-muted">{c.blurb}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const navItem =
  'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink/80 transition hover:bg-surface-2 hover:text-ink'
const navActive = { className: 'bg-surface-2 text-ink' }

export function Header() {
  const { cartCount, saved, theme, toggleTheme, setCartOpen } = useShop()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 border-b bg-bg/85 backdrop-blur-xl transition-[border-color,box-shadow] ${
        scrolled ? 'border-line shadow-soft' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:flex-nowrap">
        <Logo />
        <div className="order-last w-full lg:order-none lg:max-w-xl lg:flex-1">
          <SearchBox />
        </div>
        <nav aria-label="Primary" className="ml-auto flex items-center gap-1">
          <div className="hidden items-center gap-1 lg:flex">
            <CategoriesMenu />
            <Link to="/brands" className={navItem} activeProps={navActive}>
              <Store className="size-4" aria-hidden="true" /> Brands
            </Link>
            <Link to="/orders" className={navItem} activeProps={navActive}>
              <Package className="size-4" aria-hidden="true" /> Orders
            </Link>
          </div>
          <Link
            to="/saved"
            className={`${navItem} relative`}
            activeProps={navActive}
            aria-label={`Saved items, ${saved.length}`}
          >
            <Heart className="size-4" aria-hidden="true" />
            <span className="hidden xl:inline">Saved</span>
            {saved.length > 0 && <CountDot n={saved.length} />}
          </Link>
          <Link to="/account" className={navItem} activeProps={navActive} aria-label="Account">
            <User className="size-4" aria-hidden="true" />
            <span className="hidden xl:inline">Account</span>
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className={navItem}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative ml-1 flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-bg transition hover:scale-[1.03] active:scale-95"
            aria-label={`Open bag, ${cartCount} items`}
          >
            <ShoppingBag className="size-4" aria-hidden="true" />
            <span className="tabular-nums">{cartCount}</span>
          </button>
        </nav>
      </div>
      {/* Compact nav for tablet and mobile */}
      <nav aria-label="Browse" className="no-scrollbar mx-auto flex max-w-7xl gap-1 overflow-x-auto px-3 pb-2 lg:hidden">
        <Link to="/search" className={navItem}>
          <LayoutGrid className="size-4" aria-hidden="true" /> Categories
        </Link>
        <Link to="/brands" className={navItem} activeProps={navActive}>
          <Store className="size-4" aria-hidden="true" /> Brands
        </Link>
        <Link to="/orders" className={navItem} activeProps={navActive}>
          <Package className="size-4" aria-hidden="true" /> Orders
        </Link>
        <Link to="/saved" className={navItem} activeProps={navActive}>
          <Heart className="size-4" aria-hidden="true" /> Saved
        </Link>
        <Link to="/account" className={navItem} activeProps={navActive}>
          <User className="size-4" aria-hidden="true" /> Account
        </Link>
      </nav>
    </header>
  )
}

function CountDot({ n }: { n: number }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 grid min-w-4 place-items-center rounded-full bg-coral px-1 text-[10px] leading-4 font-bold text-white">
      {n}
    </span>
  )
}
