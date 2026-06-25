import { Link } from 'react-router-dom'

import HomeHighlightCard from './HomeHighlightCard'

function HomeHighlightsSection({ products = [], loading = false, error = '' }) {
  const highlightProducts = Array.isArray(products) ? products : []

  return (
    <section className="bg-[#fbf8f1] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d8a84f]">Charme Joias</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[#062f35] sm:text-4xl">
              Mais vendidos
            </h2>
          </div>
          <Link to="/products" className="text-sm font-semibold uppercase tracking-[0.08em] text-[#062f35] transition hover:text-[#0b6f78]">
            Ver todos
          </Link>
        </div>

        {loading && (
          <div className="border border-[#0b6f78]/10 bg-white p-6 text-[#111226]/65">
            Carregando destaques...
          </div>
        )}

        {error && (
          <div className="border border-red-500/25 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && highlightProducts.length === 0 && (
          <div className="border border-[#0b6f78]/10 bg-white p-6 text-[#111226]/65">
            Cadastre produtos no painel admin para exibir esta vitrine.
          </div>
        )}

        {!loading && !error && highlightProducts.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {highlightProducts.map((product) => (
              <HomeHighlightCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default HomeHighlightsSection
