import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { clearStoredToken, getStoredToken } from '../helpers/storage'
import api from '../services/api'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = getStoredToken()
  const [isAdmin, setIsAdmin] = useState(false)
  const accountPath = token ? '/profile' : '/login'

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

  if (location.pathname === '/') {
    return null
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#0b6f78]/10 bg-[#fbf8f1]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="font-serif text-2xl font-semibold tracking-tight text-[#0b6f78]">
          Charme Joias
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm text-[#111226]/70">
          <Link to="/" className="rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]">
            Inicio
          </Link>
          <Link to="/products" className="rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]">
            Produtos
          </Link>
          <Link to="/about" className="rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]">
            Sobre nos
          </Link>
          <Link to="/cart" className="rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]">
            Carrinho
          </Link>
          {token ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="rounded-full px-4 py-2 transition hover:bg-[#0b6f78]/10 hover:text-[#0b6f78]">
                Minha Conta
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-[#0b6f78] px-4 py-2 text-white transition hover:bg-[#095a62]"
              >
                Sair
              </button>
            </>
          ) : (
            <Link to={accountPath} className="rounded-full border border-[#0b6f78]/25 px-4 py-2 transition hover:border-[#0b6f78] hover:text-[#0b6f78]">
              Minha Conta
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
