import { Link } from '@tanstack/react-router'
import { brands } from '@/data/fixtures'

export function BrandChips() {
  return (
    <nav aria-label="Shop by brand" className="relative">
      <ul className="no-scrollbar -mx-4 flex snap-x gap-2 overflow-x-auto px-4 py-1 sm:-mx-6 sm:px-6">
        {brands.map((b) => (
          <li key={b.id} className="snap-start">
            <Link
              to="/search"
              search={{ brand: b.id }}
              className="group flex shrink-0 items-center gap-2 rounded-full bg-surface py-1.5 pr-4 pl-1.5 text-sm font-semibold whitespace-nowrap shadow-soft ring-1 ring-line/70 transition hover:-translate-y-0.5 hover:ring-accent"
            >
              <span
                className="grid size-8 place-items-center rounded-full font-display text-sm font-extrabold transition group-hover:scale-110"
                style={{ background: b.tint, color: b.inkTint }}
                aria-hidden="true"
              >
                {b.name[0]}
              </span>
              {b.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
