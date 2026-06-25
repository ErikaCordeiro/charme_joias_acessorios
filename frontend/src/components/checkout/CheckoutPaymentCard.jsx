import { paymentMethods } from '../../helpers/payment'

function CheckoutPaymentCard({
  paymentMethod,
  onPaymentMethodChange,
}) {
  return (
    <section className="rounded-3xl border border-[#0b6f78]/12 bg-white p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-[#062f35]">Pagamento</h2>
      <p className="mt-2 text-sm text-[#111226]/60">Escolha a forma de pagamento para concluir sua compra.</p>

      <div className="mt-5 space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
              paymentMethod === method.id
                ? 'border-[#d8a84f]/70 bg-[#fbf8f1]'
                : 'border-[#0b6f78]/12 bg-[#fbf8f1] hover:border-[#d8a84f]/60'
            }`}
          >
            <input
              type="radio"
              name="payment_method"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={() => onPaymentMethodChange(method.id)}
              className="mt-1 h-4 w-4 accent-[#0b6f78]"
            />
            <span>
              <span className="block text-sm font-semibold text-[#062f35]">{method.title}</span>
              <span className="mt-1 block text-sm text-[#111226]/60">{method.description}</span>
            </span>
          </label>
        ))}
      </div>

      {paymentMethod === 'pix' && (
        <div className="mt-5 rounded-2xl border border-[#0b6f78]/12 bg-[#fbf8f1] p-4 text-sm text-[#111226]/70">
          O Pix esta em modo de testes. Para vender de verdade, integre Mercado Pago, Pagar.me, Stripe ou outro gateway.
        </div>
      )}

      {paymentMethod === 'boleto' && (
        <div className="mt-5 rounded-2xl border border-[#0b6f78]/12 bg-[#fbf8f1] p-4 text-sm text-[#111226]/70">
          O boleto esta em modo de testes e o pedido ficara pendente ate existir integracao bancaria real.
        </div>
      )}
    </section>
  )
}

export default CheckoutPaymentCard
