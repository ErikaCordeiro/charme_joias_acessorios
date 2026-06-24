import { formatPrice } from '../../helpers/price'

function CheckoutShippingCard({
  cep,
  onCepChange,
  onCepBlur,
  onCalculateShipping,
  loading = false,
  shippingQuote = null,
  shippingError = '',
  disabled = false,
}) {
  return (
    <section className="rounded-3xl border border-[#0b6f78]/12 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-[#062f35]">Frete por CEP</h2>
      <p className="mt-2 text-sm text-[#111226]/60">Informe o CEP para calcular entrega e prazo estimado por regiao.</p>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onCalculateShipping()
        }}
        className="mt-5 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={cep}
          onChange={(event) => onCepChange(event.target.value)}
          onBlur={onCepBlur}
          placeholder="00000-000"
          disabled={disabled || loading}
          className="h-11 flex-1 rounded-full border border-[#0b6f78]/12 bg-[#fbf8f1] px-4 text-sm text-[#062f35] outline-none transition placeholder:text-[#0b6f78]/60 focus:border-[#d8a84f] disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || loading}
          className="h-11 rounded-full bg-[#d8a84f] px-6 text-sm font-semibold text-[#062f35] transition hover:bg-[#efc66b] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Calculando...' : 'Calcular frete'}
        </button>
      </form>

      {shippingError && (
        <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-200">
          {shippingError}
        </div>
      )}

      {shippingQuote && (
        <div className="mt-5 grid gap-3 rounded-2xl border border-[#0b6f78]/12 bg-[#fbf8f1] p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#0b6f78]/60">Destino</p>
            <p className="mt-1 text-sm text-[#111226]/75">{shippingQuote.cep} - {shippingQuote.uf}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#0b6f78]/60">Regiao</p>
            <p className="mt-1 text-sm text-[#111226]/75">{shippingQuote.region}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#0b6f78]/60">Transportadora</p>
            <p className="mt-1 text-sm text-[#111226]/75">{shippingQuote.carrier}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#0b6f78]/60">Prazo</p>
            <p className="mt-1 text-sm text-[#111226]/75">Ate {shippingQuote.estimated_days} dias uteis</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#0b6f78]/60">Base do frete</p>
            <p className="mt-1 text-sm text-[#111226]/75">{formatPrice(shippingQuote.base_freight)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-[#0b6f78]/60">Frete total</p>
            <p className="mt-1 text-lg font-semibold text-[#062f35]">{formatPrice(shippingQuote.total_freight)}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default CheckoutShippingCard
