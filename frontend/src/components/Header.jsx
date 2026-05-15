import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import api from '../services/api'

function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')
  const [isAdmin, setIsAdmin] = useState(false)
  const accountPath = token ? '/profile' : '/login'

  const handleLogout = () => {
    localStorage.removeItem('token')
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
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-semibold tracking-tight text-white">
          Lua Active
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-300">
          <Link to="/" className="rounded-full px-4 py-2 transition hover:bg-zinc-900/80 hover:text-white">
            Inicio
          </Link>
          <Link to="/products" className="rounded-full px-4 py-2 transition hover:bg-zinc-900/80 hover:text-white">
            Produtos
          </Link>
          <Link to="/about" className="rounded-full px-4 py-2 transition hover:bg-zinc-900/80 hover:text-white">
            Sobre nos
          </Link>
          <Link to="/cart" className="rounded-full px-4 py-2 transition hover:bg-zinc-900/80 hover:text-white">
            Carrinho
          </Link>
          {token ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="rounded-full px-4 py-2 transition hover:bg-zinc-900/80 hover:text-white">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="rounded-full px-4 py-2 transition hover:bg-zinc-900/80 hover:text-white">
                Minha Conta
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full bg-zinc-300 px-4 py-2 text-zinc-900 transition hover:bg-zinc-200"
              >
                Sair
              </button>
            </>
          ) : (
            <Link to={accountPath} className="rounded-full border border-zinc-700 px-4 py-2 transition hover:border-zinc-500 hover:text-white">
              Minha Conta
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
