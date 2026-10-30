import { Check } from 'lucide-react'
import { useShop } from '@/context/ShopContext'
import { cdn } from '@/lib/img'

export function Toasts() {
  const { toasts } = useShop()
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div key={t.id} className="animate-rise pointer-events-auto flex max-w-sm items-center gap-3 rounded-full bg-ink py-2 pr-5 pl-2 text-sm text-bg shadow-lift">
          {t.image ? (
            <img src={cdn(t.image, 64)} alt="" className="size-8 rounded-full object-cover" />
          ) : (
            <span className="grid size-8 place-items-center rounded-full bg-mint">
              <Check className="size-4" />
            </span>
          )}
          <span className="font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  )
}
