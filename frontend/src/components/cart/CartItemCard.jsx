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
    <article className="rounded-3xl border border-[#0b6f78]/12 bg-white p-5 shadow-soft">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border border-[#0b6f78]/12 bg-[#fbf8f1]">
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
            <p className="text-xs uppercase tracking-[0.22em] text-[#0b6f78]/60">{itemCategory}</p>
            <h2 className="text-lg font-semibold text-[#062f35]">{itemTitle}</h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[#111226]/60">
              <span>Unitario: {formatPrice(item.unit_price)}</span>
              <span className="rounded-full bg-[#fbf8f1] px-3 py-1 text-[#111226]/70">
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
          <div className="rounded-2xl border border-[#0b6f78]/12 bg-[#fbf8f1] px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-[#0b6f78]/60">Subtotal</p>
            <p className="mt-1 text-lg font-semibold text-[#062f35]">{formatPrice(item.line_total)}</p>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={pending}
            className="rounded-full border border-[#0b6f78]/20 bg-white px-5 py-2 text-sm font-semibold text-[#111226]/75 transition hover:border-red-400 hover:text-[#062f35] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? 'Atualizando...' : 'Remover'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default CartItemCard
