import { Link } from '@tanstack/react-router'
import { categories } from '@/data/fixtures'
import { Logo } from './Header'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="max-w-xs text-sm text-muted">
            Discover independent brands, shop them all in one bag, and track every order in one place.
          </p>
        </div>
        <FooterCol title="Shop">
          {categories.slice(0, 5).map((c) => (
            <Link key={c.id} to="/search" search={{ category: c.id }} className="hover:text-ink">
              {c.name}
            </Link>
          ))}
        </FooterCol>
        <FooterCol title="Your CraftedThreads">
          <Link to="/orders" className="hover:text-ink">Orders</Link>
          <Link to="/saved" className="hover:text-ink">Saved items</Link>
          <Link to="/cart" className="hover:text-ink">Bag</Link>
          <Link to="/account" className="hover:text-ink">Account</Link>
        </FooterCol>
        <FooterCol title="Discover">
          <Link to="/brands" className="hover:text-ink">All brands</Link>
          <Link to="/" hash="collections" className="hover:text-ink">Collections</Link>
          <Link to="/" hash="posts" className="hover:text-ink">Shoppable posts</Link>
          <Link to="/search" search={{ q: 'on sale' }} className="hover:text-ink">Sale</Link>
        </FooterCol>
      </div>
      <p className="border-t border-line py-6 text-center text-xs text-muted">© 2026 CraftedThreads. Shop small, all in one place.</p>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sm font-bold">{title}</h2>
      <div className="mt-3 flex flex-col gap-2 text-sm text-muted">{children}</div>
    </div>
  )
}
