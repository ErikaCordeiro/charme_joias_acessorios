function AdminPaymentSettings({ form, loading, onChange, onSubmit }) {
  const inputClass =
    'h-11 rounded-full border border-[#0A6772]/14 bg-[#FAFAF8] px-4 text-sm text-[#101827] outline-none transition focus:border-[#0A6772] focus:bg-white focus:ring-4 focus:ring-[#0A6772]/10'
  const textareaClass =
    'rounded-[6px] border border-[#0A6772]/14 bg-[#FAFAF8] px-4 py-3 text-sm text-[#101827] outline-none transition focus:border-[#0A6772] focus:bg-white focus:ring-4 focus:ring-[#0A6772]/10'

  return (
    <section className="rounded-[6px] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_45px_rgba(10,103,114,0.06)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B98D3A]">Pagamento</p>
        <h2 className="mt-1 font-serif text-2xl text-[#12343A]">Recebimento e formas de pagamento</h2>
        <p className="mt-2 text-sm leading-6 text-[#101827]/58">
          Configure o que aparece no checkout. Chaves secretas de gateways ficam no Render, fora do painel.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
        className="mt-5 grid gap-3 lg:grid-cols-2"
      >
        <select value={form.provider} onChange={(event) => onChange('provider', event.target.value)} className={inputClass}>
          <option value="manual">Manual / teste</option>
          <option value="mercado_pago">Mercado Pago</option>
          <option value="asaas">Asaas</option>
          <option value="pagarme">Pagar.me</option>
        </select>
        <input value={form.recipient_name} onChange={(event) => onChange('recipient_name', event.target.value)} placeholder="Nome do recebedor" className={inputClass} />
        <input value={form.pix_key} onChange={(event) => onChange('pix_key', event.target.value)} placeholder="Chave Pix da loja" className={inputClass} />
        <input value={form.bank_name} onChange={(event) => onChange('bank_name', event.target.value)} placeholder="Banco/conta de referencia" className={inputClass} />
        <label className="flex h-11 items-center gap-2 rounded-full border border-[#0A6772]/14 bg-[#FAFAF8] px-4 text-sm text-[#101827]/70">
          <input type="checkbox" checked={form.pix_enabled} onChange={(event) => onChange('pix_enabled', event.target.checked)} />
          Pix ativo
        </label>
        <label className="flex h-11 items-center gap-2 rounded-full border border-[#0A6772]/14 bg-[#FAFAF8] px-4 text-sm text-[#101827]/70">
          <input type="checkbox" checked={form.boleto_enabled} onChange={(event) => onChange('boleto_enabled', event.target.checked)} />
          Boleto ativo
        </label>
        <textarea
          value={form.instructions}
          onChange={(event) => onChange('instructions', event.target.value)}
          placeholder="Instrucoes exibidas para conferencia interna ou checkout"
          rows={4}
          className={`${textareaClass} lg:col-span-2`}
        />
        <button disabled={loading} type="submit" className="h-11 rounded-full bg-[#0A6772] px-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#095c65] disabled:opacity-60 lg:col-span-2">
          {loading ? 'Salvando...' : 'Salvar pagamento'}
        </button>
      </form>
    </section>
  )
}

export default AdminPaymentSettings
