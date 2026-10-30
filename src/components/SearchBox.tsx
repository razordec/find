import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { ArrowUpRight, Clock, Search, Sparkles, Store, Tag, X } from 'lucide-react'
import { popularSearches, search } from '@/lib/search'
import { brandOf, formatPrice, productsByIds } from '@/lib/catalog'
import { cdn } from '@/lib/img'
import { useShop } from '@/context/ShopContext'

type Option =
  | { kind: 'query'; label: string; value: string; icon: 'popular' | 'correct' }
  | { kind: 'product'; label: string; value: string; meta: string; image: string; price: number }
  | { kind: 'brand'; label: string; value: string }
  | { kind: 'category'; label: string; value: string }

export function SearchBox({ initial = '', autoFocus = false }: { initial?: string; autoFocus?: boolean }) {
  const [value, setValue] = useState(initial)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const deferred = useDeferredValue(value)
  const navigate = useNavigate()
  const { viewed } = useShop()
  const listId = useId()
  const wrapper = useRef<HTMLFormElement>(null)

  useEffect(() => setValue(initial), [initial])

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault()
        wrapper.current?.querySelector('input')?.focus()
      }
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const result = useMemo(() => search(deferred), [deferred])

  const options = useMemo<Array<Option>>(() => {
    if (!deferred.trim()) {
      return popularSearches.map((q) => ({ kind: 'query', label: q, value: q, icon: 'popular' }))
    }
    const out: Array<Option> = []
    if (result.didCorrect) {
      out.push({ kind: 'query', label: result.corrected, value: result.corrected, icon: 'correct' })
    }
    result.categories.forEach((c) => out.push({ kind: 'category', label: c.name, value: c.id }))
    result.brands.forEach((b) => out.push({ kind: 'brand', label: b.name, value: b.id }))
    result.products.slice(0, 5).forEach((p) =>
      out.push({
        kind: 'product',
        label: p.name,
        value: p.id,
        meta: brandOf(p).name,
        image: p.image,
        price: p.price,
      }),
    )
    return out
  }, [deferred, result])

  const recent = !deferred.trim() ? productsByIds(viewed.slice(0, 3)) : []

  const close = () => {
    setOpen(false)
    setActive(-1)
  }

  const submit = (q: string) => {
    if (!q.trim()) return
    close()
    navigate({ to: '/search', search: { q: q.trim() } })
  }

  const choose = (o: Option) => {
    close()
    if (o.kind === 'query') {
      setValue(o.value)
      submit(o.value)
    } else if (o.kind === 'product') {
      navigate({ to: '/products/$productId', params: { productId: o.value } })
    } else if (o.kind === 'brand') {
      navigate({ to: '/search', search: { brand: o.value } })
    } else {
      navigate({ to: '/search', search: { category: o.value } })
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setOpen(true)
      setActive((i) => Math.min(options.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(-1, i - 1))
    } else if (e.key === 'Escape') {
      close()
    } else if (e.key === 'Enter' && active >= 0 && options[active]) {
      e.preventDefault()
      choose(options[active])
    }
  }

  const optionId = (i: number) => `${listId}-opt-${i}`

  return (
    <form
      ref={wrapper}
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault()
        submit(value)
      }}
    >
      <label htmlFor={`${listId}-input`} className="sr-only">
        Search products, brands and categories
      </label>
      <div className="group flex items-center gap-2 rounded-full bg-surface-2 px-4 ring-1 ring-transparent transition focus-within:bg-surface focus-within:shadow-soft focus-within:ring-accent">
        <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          id={`${listId}-input`}
          type="search"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
          autoComplete="off"
          autoFocus={autoFocus}
          placeholder="Search “gifts under $100”, brands, or anything…"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="h-11 w-full min-w-0 bg-transparent text-[15px] outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button
            type="button"
            onClick={() => {
              setValue('')
              wrapper.current?.querySelector('input')?.focus()
            }}
            className="grid size-7 place-items-center rounded-full text-muted hover:bg-line hover:text-ink"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        ) : (
          <kbd className="hidden rounded-md border border-line px-1.5 text-xs text-muted sm:block">/</kbd>
        )}
      </div>

      {open && (
        <div className="animate-fade absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-3xl bg-surface p-2 shadow-lift ring-1 ring-line">
          {deferred.trim() && result.intentLabels.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 px-3 pt-2 pb-1 text-xs text-muted">
              <Sparkles className="size-3.5 text-accent" aria-hidden="true" />
              <span>Understood:</span>
              {result.intentLabels.map((l) => (
                <span key={l} className="rounded-full bg-accent-soft px-2 py-0.5 font-medium text-accent">
                  {l}
                </span>
              ))}
            </div>
          )}
          {!deferred.trim() && (
            <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-muted uppercase">Popular right now</p>
          )}
          <ul id={listId} role="listbox" aria-label="Search suggestions" className="max-h-[60vh] overflow-y-auto">
            {options.map((o, i) => (
              <li
                key={`${o.kind}-${o.value}`}
                id={optionId(i)}
                role="option"
                aria-selected={active === i}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(o)}
                onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2 text-sm transition ${
                  active === i ? 'bg-surface-2' : ''
                }`}
              >
                {o.kind === 'product' ? (
                  <>
                    <img src={cdn(o.image, 96)} alt="" className="size-10 rounded-xl bg-surface-2 object-cover" loading="lazy" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{o.label}</span>
                      <span className="block text-xs text-muted">{o.meta}</span>
                    </span>
                    <span className="font-semibold">{formatPrice(o.price)}</span>
                  </>
                ) : (
                  <>
                    <span className="grid size-10 place-items-center rounded-xl bg-surface-2 text-muted">
                      {o.kind === 'brand' ? (
                        <Store className="size-4" />
                      ) : o.kind === 'category' ? (
                        <Tag className="size-4" />
                      ) : o.icon === 'correct' ? (
                        <Sparkles className="size-4 text-accent" />
                      ) : (
                        <Search className="size-4" />
                      )}
                    </span>
                    <span className="flex-1">
                      {o.kind === 'query' && o.icon === 'correct' && <span className="text-muted">Did you mean </span>}
                      <span className="font-medium">{o.label}</span>
                      {o.kind === 'brand' && <span className="text-muted"> · Brand</span>}
                      {o.kind === 'category' && <span className="text-muted"> · Category</span>}
                    </span>
                    <ArrowUpRight className="size-4 text-muted" aria-hidden="true" />
                  </>
                )}
              </li>
            ))}
          </ul>
          {deferred.trim() && options.length === 0 && (
            <p className="px-3 py-4 text-sm text-muted">
              No matches for “{deferred}”. Try a brand, a category, or a phrase like “linen under $150”.
            </p>
          )}
          {recent.length > 0 && (
            <div className="mt-1 border-t border-line px-3 pt-3 pb-2">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wide text-muted uppercase">
                <Clock className="size-3.5" aria-hidden="true" /> Recently viewed
              </p>
              <div className="flex gap-2">
                {recent.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      close()
                      navigate({ to: '/products/$productId', params: { productId: p.id } })
                    }}
                    className="flex min-w-0 items-center gap-2 rounded-full bg-surface-2 py-1 pr-3 pl-1 text-xs hover:ring-1 hover:ring-line"
                  >
                    <img src={cdn(p.image, 64)} alt="" className="size-6 rounded-full object-cover" />
                    <span className="truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {deferred.trim() && (
            <button
              type="submit"
              className="mt-1 w-full rounded-2xl px-3 py-2.5 text-left text-sm font-semibold text-accent hover:bg-accent-soft"
            >
              See all results for “{result.didCorrect ? result.corrected : deferred}” →
            </button>
          )}
        </div>
      )}
    </form>
  )
}
