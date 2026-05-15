import CartQuantityControl from './CartQuantityControl'
import { formatPrice } from '../../helpers/price'

const placeholderImage = (title) => {
  const text = encodeURIComponent(title || 'Produto')
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 360'%3E%3Crect width='480' height='360' fill='%2309090b'/%3E%3Ctext x='50%25' y='45%25' dominant-baseline='middle' text-anchor='middle' fill='%23f4f4f5' font-family='Arial,Helvetica,sans-serif' font-size='26'%3E${text}%3C/text%3E%3C/svg%3E`
}

const getItemTitle = (item) => item.product?.name || `Produto #${item.product_id}`
const getItemCategory = (item) => item.product?.category || 'Categoria nao informada'

function CartItemCard({
  item,
  pending = false,
  onRemove,
  onQuantityChange,
}) {
  const itemTitle = getItemTitle(item)
  const itemCategory = getItemCategory(item)
  const imageUrl = item.product?.image_url || placeholderImage(itemTitle)

  return (
    <article className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-5 shadow-soft">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border border-zinc-800 bg-black/80">
            <img
              src={imageUrl}
              alt={itemTitle}
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = placeholderImage(itemTitle)
              }}
              className="h-full w-full object-contain p-1"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{itemCategory}</p>
            <h2 className="text-lg font-semibold text-white">{itemTitle}</h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-400">
              <span>Unitario: {formatPrice(item.unit_price)}</span>
              <span className="rounded-full bg-zinc-900 px-3 py-1 text-zinc-300">
                Estoque {item.product?.stock ?? 0}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-flow-col sm:auto-cols-max sm:items-center">
          <CartQuantityControl
            quantity={item.quantity}
            min={1}
            max={item.product?.stock}
            disabled={pending}
            onCommit={onQuantityChange}
          />
          <div className="rounded-2xl border border-zinc-800 bg-black/70 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Subtotal</p>
            <p className="mt-1 text-lg font-semibold text-white">{formatPrice(item.line_total)}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={pending}
            className="rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-200 transition hover:border-red-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Atualizando...' : 'Remover'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default CartItemCard
