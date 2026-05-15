import { paymentMethods } from '../../helpers/payment'

function CheckoutPaymentCard({
  paymentMethod,
  paymentForm,
  onPaymentMethodChange,
  onPaymentFieldChange,
}) {
  return (
    <section className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-white">Pagamento</h2>
      <p className="mt-2 text-sm text-zinc-400">Escolha a forma de pagamento para concluir sua compra.</p>

      <div className="mt-5 space-y-3">
        {paymentMethods.map((method) => (
          <label
            key={method.id}
            className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
              paymentMethod === method.id
                ? 'border-zinc-300/60 bg-zinc-900/60'
                : 'border-zinc-800 bg-black/60 hover:border-zinc-600'
            }`}
          >
            <input
              type="radio"
              name="payment_method"
              value={method.id}
              checked={paymentMethod === method.id}
              onChange={() => onPaymentMethodChange(method.id)}
              className="mt-1 h-4 w-4 accent-zinc-300"
            />
            <span>
              <span className="block text-sm font-semibold text-zinc-100">{method.title}</span>
              <span className="mt-1 block text-sm text-zinc-400">{method.description}</span>
            </span>
          </label>
        ))}
      </div>

      {paymentMethod === 'credit_card' && (
        <div className="mt-5 space-y-3 rounded-2xl border border-zinc-800 bg-black/60 p-4">
          <input
            type="text"
            value={paymentForm.card_holder}
            onChange={(event) => onPaymentFieldChange('card_holder', event.target.value)}
            placeholder="Nome impresso no cartao"
            className="h-11 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500"
          />

          <input
            type="text"
            value={paymentForm.card_number}
            onChange={(event) => onPaymentFieldChange('card_number', event.target.value)}
            placeholder="Numero do cartao"
            className="h-11 w-full rounded-xl border border-zinc-800 bg-black/70 px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500"
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="text"
              value={paymentForm.card_expiry}
              onChange={(event) => onPaymentFieldChange('card_expiry', event.target.value)}
              placeholder="MM/AA"
              className="h-11 rounded-xl border border-zinc-800 bg-black/70 px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500"
            />

            <input
              type="text"
              value={paymentForm.card_cvv}
              onChange={(event) => onPaymentFieldChange('card_cvv', event.target.value)}
              placeholder="CVV"
              className="h-11 rounded-xl border border-zinc-800 bg-black/70 px-4 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-zinc-500"
            />

            <select
              value={paymentForm.installments}
              onChange={(event) => onPaymentFieldChange('installments', Number(event.target.value))}
              className="h-11 rounded-xl border border-zinc-800 bg-black/70 px-4 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
            >
              {[1, 2, 3, 4, 5, 6].map((installment) => (
                <option key={installment} value={installment} className="bg-zinc-900">
                  {installment}x sem juros
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-zinc-500">
            Sandbox: use <span className="text-zinc-300">4111 1111 1111 1111</span> para aprovar e
            <span className="text-zinc-300"> 4000 0000 0000 0002</span> para simular recusa.
          </p>
        </div>
      )}

      {paymentMethod === 'pix' && (
        <div className="mt-5 rounded-2xl border border-zinc-800 bg-black/60 p-4 text-sm text-zinc-300">
          O banco sandbox aprova o Pix automaticamente para facilitar testes de checkout.
        </div>
      )}

      {paymentMethod === 'boleto' && (
        <div className="mt-5 rounded-2xl border border-zinc-800 bg-black/60 p-4 text-sm text-zinc-300">
          O boleto sera gerado para simulacao e o pedido ficara com status pendente ate compensacao.
        </div>
      )}
    </section>
  )
}

export default CheckoutPaymentCard
