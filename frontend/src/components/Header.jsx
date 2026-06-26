import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import SearchModal from './SearchModal'
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const productsMenuRef = useRef(null)
  const accountPath = token ? '/profile' : '/login'

  const handleLogout = () => {
    clearStoredToken()
    setIsAdmin(false)
    navigate('/login')
  }

  const handleCategoryNavigate = (to) => {
    setProductsOpen(false)
    navigate(to)
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
    <header ref={productsMenuRef} className="sticky top-0 z-50 border-b border-[#0b6f78]/10 bg-[#fbf8f1]/98 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] gap-x-3 gap-y-3 px-3 py-3 sm:px-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:px-8">
        <Link to="/" className="col-start-2 -col-end-1 justify-self-center font-serif text-2xl font-semibold leading-tight tracking-tight text-[#0b6f78] sm:text-3xl lg:col-start-1 lg:col-end-2 lg:justify-self-start">
          Charme
          <span className="block">Joias</span>
        </Link>

        <nav className="hide-scrollbar order-3 col-span-3 -mx-1 flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap px-1 text-sm text-[#111226]/72 sm:col-span-1 sm:col-start-2 sm:col-end-3 lg:order-none lg:col-span-1 lg:col-start-2 lg:col-end-3 lg:justify-center lg:gap-3">
          <Link to="/" className="shrink-0 rounded-full px-3 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78] lg:px-4">
            Inicio
          </Link>

          <div className="shrink-0">
            <button
              type="button"
              onClick={() => setProductsOpen((open) => !open)}
              aria-expanded={productsOpen}
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78] lg:px-4"
            >
              Produtos
              <svg aria-hidden="true" viewBox="0 0 12 12" className={`h-3 w-3 fill-none stroke-current stroke-[1.5] transition ${productsOpen ? 'rotate-180' : ''}`}>
                <path d="m3 4.5 3 3 3-3" />
              </svg>
            </button>
          </div>

          <Link to="/about" className="shrink-0 rounded-full px-3 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78] lg:px-4">
            Sobre nos
          </Link>
          <Link to="/cart" className="shrink-0 rounded-full px-3 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78] lg:px-4">
            Carrinho
          </Link>
          {isAdmin && (
            <Link to="/admin" className="shrink-0 rounded-full px-3 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78] lg:px-4">
              Admin
            </Link>
          )}
        </nav>

        <div className="ml-auto flex items-center justify-end gap-1 self-start sm:gap-2 lg:self-center">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Buscar"
            className="rounded-full px-2 py-2 text-[#111226]/72 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78] sm:px-3"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.6]">
              <circle cx="11" cy="11" r="7" />
              <path d="m16.5 16.5 4 4" />
            </svg>
          </button>
          {!isAdmin && (
            <Link to={accountPath} className="shrink-0 rounded-full border border-[#0b6f78]/25 px-3 py-2 text-sm text-[#111226]/72 transition hover:border-[#0b6f78] hover:text-[#0b6f78] sm:px-4">
              Minha Conta
            </Link>
          )}
          {isAdmin && (
            <Link to="/admin" className="shrink-0 rounded-full border border-[#0b6f78]/25 px-3 py-2 text-sm text-[#111226]/72 transition hover:border-[#0b6f78] hover:text-[#0b6f78] sm:px-4">
              Painel Admin
            </Link>
          )}
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
                onClick={() => handleCategoryNavigate(category.to)}
                className="rounded-xl px-3 py-3 text-left text-sm font-medium text-[#111226]/72 transition hover:bg-[#0b6f78]/8 hover:text-[#0b6f78] sm:text-center"
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  )
}

export default Header
