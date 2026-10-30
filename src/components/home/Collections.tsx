import { Link } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import type { Collection } from '@/data/fixtures'
import { productsByIds } from '@/lib/catalog'
import { cdn, cdnSrcSet } from '@/lib/img'

export function CollectionCard({ collection, large = false }: { collection: Collection; large?: boolean }) {
  const items = productsByIds(collection.productIds)
  return (
    <Link
      to="/collections/$collectionId"
      params={{ collectionId: collection.id }}
      className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-[2rem] p-6 text-white shadow-soft transition duration-500 hover:shadow-lift ${
        large ? 'min-h-[22rem] lg:row-span-2 lg:min-h-full' : 'min-h-[16rem]'
      }`}
    >
      <img
        src={cdn(collection.image, large ? 1200 : 800)}
        srcSet={cdnSrcSet(collection.image, [600, 900, 1200])}
        sizes={large ? '(min-width: 1024px) 60vw, 100vw' : '(min-width: 1024px) 40vw, 100vw'}
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 size-full object-cover transition duration-700 group-hover:scale-105"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <p className="text-xs font-semibold tracking-[0.14em] uppercase opacity-80">{collection.kicker}</p>
      <h3 className={`mt-1 font-extrabold ${large ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{collection.title}</h3>
      <p className="mt-1 max-w-sm text-sm opacity-85">{collection.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex -space-x-2">
          {items.slice(0, 4).map((p) => (
            <img key={p.id} src={cdn(p.image, 80)} alt="" className="size-9 rounded-full object-cover ring-2 ring-white/80" />
          ))}
          <span className="grid h-9 place-items-center pl-4 text-xs font-semibold">{items.length} pieces</span>
        </div>
        <span className="grid size-10 place-items-center rounded-full bg-white text-[#17140f] transition group-hover:rotate-45">
          <ArrowUpRight className="size-5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
