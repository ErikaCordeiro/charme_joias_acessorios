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
    <section className="rounded-3xl border border-[#0b6f78]/12 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-[#062f35]">Resumo do pedido</h2>

      <div className="mt-5 space-y-3 text-sm">
        <div className="flex items-center justify-between text-[#111226]/70">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-[#111226]/70">
          <span>Frete</span>
          <span>{freightTotal > 0 ? formatPrice(freightTotal) : '-'}</span>
        </div>
        <div className="border-t border-[#0b6f78]/12 pt-3">
          <div className="flex items-center justify-between text-base font-semibold text-[#062f35]">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!canPlaceOrder || placingOrder}
        onClick={onPlaceOrder}
        className="mt-6 w-full rounded-full bg-[#d8a84f] px-6 py-3 text-sm font-semibold text-[#062f35] transition hover:bg-[#efc66b] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {placingOrder ? 'Finalizando pedido...' : 'Confirmar pagamento e finalizar'}
      </button>

      {!canPlaceOrder && (
        <p className="mt-3 text-xs text-[#0b6f78]/60">Calcule o frete para habilitar a finalizacao do pedido.</p>
      )}
    </section>
  )
}

export default CheckoutSummaryCard
