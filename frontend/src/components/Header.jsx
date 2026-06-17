import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { clearStoredToken, getStoredToken } from '../helpers/storage'
import api from '../services/api'

const productCategories = [
  { label: 'Joias', to: '/products' },
  { label: 'Brincos', to: '/products?category=brincos' },
  { label: 'Colares', to: '/products?category=colares' },
  { label: 'Pulseiras', to: '/products?category=pulseiras' },
  { label: 'Aneis', to: '/products?category=aneis' },
  { label: 'Pingentes', to: '/products?category=pingentes' },
  { label: 'Presentes', to: '/products?category=presentes' },
  { label: 'Sale', to: '/products?category=sale' },
]

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = getStoredToken()
  const [isAdmin, setIsAdmin] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const productsMenuRef = useRef(null)
  const accountPath = token ? '/profile' : '/login'

  const goTo = (to) => {
    setProductsOpen(false)
    navigate(to)
  }

  const handleLogout = () => {
    clearStoredToken()
    setIsAdmin(false)
    navigate('/login')
  }

  useEffect(() => {
    if (!token) {
      return
    }

    let mounted = true

    const loadUserRole = async () => {
      try {
        const response = await api.get('/auth/me')
        if (mounted) {
          setIsAdmin(Boolean(response.data?.is_admin))
        }
      } catch {
        if (mounted) {
          setIsAdmin(false)
        }
      }
    }

    loadUserRole()

    return () => {
      mounted = false
    }
  }, [token])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productsMenuRef.current && !productsMenuRef.current.contains(event.target)) {
        setProductsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (location.pathname === '/') {
    return null
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#0b6f78]/10 bg-[#fbf8f1]/98 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-3 px-4 py-3 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:px-8">
        <Link to="/" className="font-serif text-2xl font-semibold leading-tight tracking-tight text-[#0b6f78] sm:text-3xl">
          Charme
          <span className="block">Joias</span>
        </Link>

        <nav className="hide-scrollbar order-3 col-span-2 flex min-w-0 items-center gap-2 overflow-x-auto whitespace-nowrap text-sm text-[#111226]/72 lg:order-none lg:col-span-1 lg:justify-center lg:gap-3">
          <Link to="/" className="shrink-0 rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]">
            Inicio
          </Link>

          <div ref={productsMenuRef} className="shrink-0">
            <button
              type="button"
              onClick={() => setProductsOpen((open) => !open)}
              aria-expanded={productsOpen}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]"
            >
              Produtos
              <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 fill-none stroke-current stroke-[1.5] transition ${productsOpen ? 'rotate-180' : ''}`}>
                <path d="m3 4.5 3 3 3-3" />
              </svg>
            </button>
          </div>

          <Link to="/about" className="shrink-0 rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]">
            Sobre nos
          </Link>
          <Link to="/cart" className="shrink-0 rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]">
            Carrinho
          </Link>
          {isAdmin && (
            <Link to="/admin" className="shrink-0 rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]">
              Admin
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center justify-end gap-2 self-start lg:self-center">
          <Link to={accountPath} className="shrink-0 rounded-full border border-[#0b6f78]/25 px-4 py-2 text-sm text-[#111226]/72 transition hover:border-[#0b6f78] hover:text-[#0b6f78]">
            Minha Conta
          </Link>
          {token && (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-full bg-[#0b6f78] px-4 py-2 text-sm text-white transition hover:bg-[#095a62] sm:inline-flex"
            >
              Sair
            </button>
          )}
        </div>
      </div>

      {productsOpen && (
        <div className="border-t border-[#0b6f78]/10 bg-white shadow-[0_18px_50px_rgba(17,18,38,0.08)]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-2 px-4 py-3 sm:grid-cols-4 sm:px-6 lg:grid-cols-8 lg:px-8">
            {productCategories.map((category) => (
              <button
                key={category.label}
                type="button"
                onClick={() => goTo(category.to)}
                className="rounded-xl px-3 py-3 text-left text-sm font-medium text-[#111226]/72 transition hover:bg-[#0b6f78]/8 hover:text-[#0b6f78] sm:text-center"
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
