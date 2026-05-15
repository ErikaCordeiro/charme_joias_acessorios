import { Link } from 'react-router-dom'

import HomeHighlightCard from './HomeHighlightCard'

function HomeHighlightsSection({ products, loading, error }) {
  return (
    <section className="bg-black pb-14 pt-10">
      <div className="mx-auto w-full max-w-[1600px] px-4 lg:px-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-black uppercase italic tracking-tight text-zinc-100">Destaques</h2>
          <Link to="/products" className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-200 transition hover:text-white">
            Ver todos
          </Link>
        </div>

        {loading && (
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/70 p-6 text-zinc-300">
            Carregando destaques...
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-6 text-red-200">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {products.map((product) => (
              <HomeHighlightCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-zinc-900 pt-8">
          <p className="text-4xl font-black uppercase italic tracking-tight text-zinc-100 sm:text-5xl">
            Seu estilo. Sua forca. Sua historia.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-full bg-zinc-300 px-7 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-900 transition hover:bg-zinc-200"
          >
            Confira agora
          </Link>
        </div>
      </div>
    </section>
  )
}

export default HomeHighlightsSection
