import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getStoredToken } from '../../helpers/storage'

function HomeLandingHeader() {
  const token = getStoredToken()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const accountPath = token ? '/profile' : '/login'

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const trimmedSearch = search.trim()

    if (!trimmedSearch) {
      navigate('/products')
      return
    }

    navigate(`/products?search=${encodeURIComponent(trimmedSearch)}`)
  }

  return (
    <div className="relative z-20 border-b border-zinc-800/80 bg-black/55 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <Link to="/" className="shrink-0 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl">
          Charme
          <span className="block text-[0.34em] font-sans font-bold uppercase tracking-[0.24em] text-white/75">
            Joias Acessórios
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-200">
          <Link to="/" className="border-b-2 border-zinc-200 pb-1 text-white">Inicio</Link>
          <Link to="/products" className="pb-1 transition hover:text-white">Produtos</Link>
          <Link to="/products?category=semijoias" className="pb-1 transition hover:text-white">Categorias</Link>
          <Link to="/products" className="pb-1 transition hover:text-white">Lançamentos</Link>
          <Link to="/products" className="pb-1 transition hover:text-white">Colecoes</Link>
          <Link to="/about" className="pb-1 transition hover:text-white">Sobre nos</Link>
        </nav>

        <div className="flex flex-1 flex-col gap-3 lg:max-w-[560px] lg:flex-row lg:items-center lg:justify-end">
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <label htmlFor="home-search" className="sr-only">Buscar produtos</label>
            <input
              id="home-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar produtos..."
              className="h-11 w-full rounded-full border border-zinc-700 bg-black/70 px-5 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500"
            />
          </form>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.08em] text-zinc-300">
            <Link to={accountPath} className="rounded-full border border-zinc-700 px-3 py-2 transition hover:border-zinc-500 hover:text-white">
              Minha conta
            </Link>
            <Link to="/cart" className="rounded-full bg-zinc-300 px-3 py-2 font-semibold text-zinc-900 transition hover:bg-zinc-200">
              Carrinho
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeLandingHeader
