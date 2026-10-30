import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { LinkProps } from '@tanstack/react-router'

export function SectionHeading({
  id,
  kicker,
  title,
  description,
  link,
}: {
  id: string
  kicker?: string
  title: string
  description?: string
  link?: { label: string } & Pick<LinkProps, 'to' | 'search' | 'hash'>
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {kicker && <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">{kicker}</p>}
        <h2 id={id} className="mt-1 text-2xl font-extrabold sm:text-3xl">{title}</h2>
        {description && <p className="mt-1 max-w-xl text-muted">{description}</p>}
      </div>
      {link && (
        <Link
          to={link.to}
          search={link.search}
          hash={link.hash}
          className="group flex items-center gap-1 text-sm font-semibold text-ink/80 hover:text-accent"
        >
          {link.label}
          <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
