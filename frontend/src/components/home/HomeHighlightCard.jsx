import { Link } from 'react-router-dom'

import { formatPrice } from '../../helpers/price'

const installmentCount = 6

function HomeHighlightCard({ product }) {
  const installmentValue = product.price / installmentCount

  return (
    <article className="overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/80 transition hover:-translate-y-1 hover:border-zinc-700">
      <div className="relative h-64 overflow-hidden bg-black/80">
        <img
          src={product.image_url || '/hero/home-reference.png'}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="space-y-2 p-4">
        <p className="text-xs uppercase tracking-[0.08em] text-zinc-500">{product.category || 'Coleção Charme'}</p>
        <h3 className="text-lg font-semibold text-zinc-100">{product.name}</h3>
        <p className="text-2xl font-bold text-zinc-100">{formatPrice(product.price)}</p>
        <p className="text-sm text-zinc-400">{installmentCount}x de {formatPrice(installmentValue)}</p>
      </div>
      <div className="px-4 pb-4">
        <Link
          to="/products"
          className="inline-flex w-full items-center justify-center rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-200 transition hover:border-zinc-500 hover:text-white"
        >
          Ver produto
        </Link>
      </div>
    </article>
  )
}

export default HomeHighlightCard
