import { formatPrice } from '../../helpers/price'

function CheckoutSummaryCard({
  subtotal,
  freightTotal,
  total,
  placingOrder = false,
  canPlaceOrder = false,
  onPlaceOrder,
}) {
  return (
    <section className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-white">Resumo do pedido</h2>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between text-zinc-300">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-zinc-300">
          <span>Frete</span>
          <span>{freightTotal > 0 ? formatPrice(freightTotal) : '-'}</span>
        </div>
        <div className="border-t border-zinc-800 pt-3">
          <div className="flex items-center justify-between text-base font-semibold text-white">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!canPlaceOrder || placingOrder}
        onClick={onPlaceOrder}
        className="mt-6 w-full rounded-full bg-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {placingOrder ? 'Finalizando pedido...' : 'Confirmar pagamento e finalizar'}
      </button>

      {!canPlaceOrder && (
        <p className="mt-3 text-xs text-zinc-500">Calcule o frete para habilitar a finalizacao do pedido.</p>
      )}
    </section>
  )
}

export default CheckoutSummaryCard
