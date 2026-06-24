import { formatPrice } from '../../helpers/price'

const placeholderImage = (title) => {
  const text = encodeURIComponent(title || 'Produto')
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 360'%3E%3Crect width='480' height='360' fill='%2309090b'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23f4f4f5' font-family='Arial,Helvetica,sans-serif' font-size='24'%3E${text}%3C/text%3E%3C/svg%3E`
}

function CheckoutItemRow({ item }) {
  const itemTitle = item.product?.name || `Produto #${item.product_id}`
  const imageUrl = item.product?.image_url || placeholderImage(itemTitle)

  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border border-[#0b6f78]/12 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="h-16 w-16 overflow-hidden rounded-xl border border-[#0b6f78]/12 bg-[#fbf8f1]">
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
        <div>
          <p className="text-sm font-semibold text-[#062f35]">{itemTitle}</p>
          <p className="text-xs text-[#111226]/60">Qtd: {item.quantity} x {formatPrice(item.unit_price)}</p>
        </div>
      </div>
      <p className="text-sm font-semibold text-[#111226]/75">{formatPrice(item.line_total)}</p>
    </article>
  )
}

export default CheckoutItemRow
