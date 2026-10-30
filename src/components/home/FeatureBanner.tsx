import { Link } from '@tanstack/react-router'
import { ArrowRight, RefreshCw } from 'lucide-react'
import { featuredBrand } from '@/data/fixtures'
import { formatPrice, getBrand, productsByIds } from '@/lib/catalog'
import { cdn, cdnSrcSet } from '@/lib/img'

export function FeatureBanner() {
  const brand = getBrand(featuredBrand.brandId)!
  const picks = productsByIds(featuredBrand.productIds)

  return (
    <section aria-labelledby="feature-title" className="animate-rise relative isolate overflow-hidden rounded-[2rem] bg-surface-2 shadow-soft">
      <img
        src={cdn(featuredBrand.image, 1600)}
        srcSet={cdnSrcSet(featuredBrand.image, [800, 1200, 1600, 2000])}
        sizes="(min-width: 1280px) 1240px, 100vw"
        alt="A sage green dutch oven and stoneware on a sunlit kitchen counter"
        fetchPriority="high"
        className="absolute inset-0 -z-10 size-full object-cover object-[70%_center]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#f4efe6] via-[#f4efe6]/85 to-transparent dark:from-black/80 dark:via-black/55" />
      <div className="flex min-h-[26rem] flex-col justify-between gap-8 p-6 sm:p-10 lg:min-h-[30rem] lg:p-14">
        <div className="max-w-lg text-[#17140f] dark:text-white">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide uppercase backdrop-blur dark:bg-white/15">
            <span className="size-1.5 rounded-full bg-coral" aria-hidden="true" />
            {featuredBrand.kicker} · {brand.name}
          </p>
          <h1 id="feature-title" className="mt-4 text-4xl leading-[1.02] font-extrabold sm:text-6xl">
            {featuredBrand.title}
          </h1>
          <p className="mt-4 max-w-md text-base text-[#3d372f] sm:text-lg dark:text-white/80">{featuredBrand.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/search"
              search={{ brand: brand.id }}
              className="group flex items-center gap-2 rounded-full bg-[#17140f] px-6 py-3 font-semibold text-white shadow-lift transition hover:gap-3 dark:bg-white dark:text-[#17140f]"
            >
              Shop {brand.name} <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <span className="flex items-center gap-1.5 text-xs text-[#3d372f] dark:text-white/70">
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Synced from {brand.storeUrl} {brand.syncedMinutesAgo} min ago
            </span>
          </div>
        </div>

        <ul className="flex flex-wrap gap-3">
          {picks.map((p) => (
            <li key={p.id}>
              <Link
                to="/products/$productId"
                params={{ productId: p.id }}
                className="flex items-center gap-3 rounded-2xl bg-white/80 p-2 pr-4 text-[#17140f] shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:bg-black/50 dark:text-white"
              >
                <img src={cdn(p.image, 120)} alt="" className="size-12 rounded-xl object-cover" />
                <span>
                  <span className="block text-sm font-semibold">{p.name}</span>
                  <span className="text-sm">
                    {formatPrice(p.price)}
                    {p.compareAt && <span className="ml-1.5 text-xs opacity-60 line-through">{formatPrice(p.compareAt)}</span>}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
