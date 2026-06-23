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
    <section className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-white">Frete por CEP</h2>
      <p className="mt-2 text-sm text-zinc-400">Informe o CEP para calcular entrega e prazo estimado por regiao.</p>

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
          className="h-11 flex-1 rounded-full border border-zinc-800 bg-black/70 px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || loading}
          className="h-11 rounded-full bg-zinc-300 px-6 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
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
        <div className="mt-5 grid gap-3 rounded-2xl border border-zinc-800 bg-black/70 p-4 sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Destino</p>
            <p className="mt-1 text-sm text-zinc-200">{shippingQuote.cep} - {shippingQuote.uf}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Regiao</p>
            <p className="mt-1 text-sm text-zinc-200">{shippingQuote.region}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Transportadora</p>
            <p className="mt-1 text-sm text-zinc-200">{shippingQuote.carrier}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Prazo</p>
            <p className="mt-1 text-sm text-zinc-200">Ate {shippingQuote.estimated_days} dias uteis</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Base do frete</p>
            <p className="mt-1 text-sm text-zinc-200">{formatPrice(shippingQuote.base_freight)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Frete total</p>
            <p className="mt-1 text-lg font-semibold text-zinc-100">{formatPrice(shippingQuote.total_freight)}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default CheckoutShippingCard
