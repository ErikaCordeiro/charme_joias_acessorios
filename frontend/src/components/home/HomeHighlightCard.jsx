import { Link } from 'react-router-dom'

import { formatPrice } from '../../helpers/price'

function HomeHighlightCard({ product }) {
  const productUrl = `/products?search=${encodeURIComponent(product.name)}`

  return (
    <article className="group border border-[#0b6f78]/12 bg-white transition hover:-translate-y-1 hover:border-[#d8a84f]/60 hover:shadow-[0_22px_60px_rgba(6,47,53,0.10)]">
      <Link to={productUrl} className="block overflow-hidden bg-[#f7f1e8]">
        <img
          src={product.image_url || '/products/charme/conjunto-dourado-caixa.jpeg'}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="space-y-3 p-4 text-center">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#0b6f78]/70">
          {product.category || 'Colecao Charme'}
        </p>
        <h3 className="min-h-12 text-sm font-medium leading-6 text-[#111226]">{product.name}</h3>
        <p className="text-base font-bold text-[#062f35]">{formatPrice(product.price)}</p>
        <Link
          to={productUrl}
          className="inline-flex w-full items-center justify-center border border-[#d8a84f] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#062f35] transition hover:bg-[#d8a84f] hover:text-white"
        >
          Tenho interesse
        </Link>
      </div>
    </article>
  )
}

export default HomeHighlightCard
