const regions = ['Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul']

function AdminShippingSettings({
  carriers,
  form,
  editingId,
  loading,
  onChange,
  onSubmit,
  onEdit,
  onDelete,
  onCancel,
}) {
  const inputClass =
    'h-11 rounded-full border border-[#0A6772]/14 bg-[#FAFAF8] px-4 text-sm text-[#101827] outline-none transition focus:border-[#0A6772] focus:bg-white focus:ring-4 focus:ring-[#0A6772]/10'

  return (
    <section className="rounded-[6px] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_45px_rgba(10,103,114,0.06)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B98D3A]">Frete</p>
        <h2 className="mt-1 font-serif text-2xl text-[#12343A]">Transportadoras e regras por regiao</h2>
        <p className="mt-2 text-sm leading-6 text-[#101827]/58">
          Cadastre transportadoras, prazo e formula de frete usada no checkout por CEP.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
        className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4"
      >
        <input value={form.name} onChange={(event) => onChange('name', event.target.value)} placeholder="Transportadora" required className={inputClass} />
        <select value={form.region} onChange={(event) => onChange('region', event.target.value)} className={inputClass}>
          {regions.map((region) => <option key={region} value={region}>{region}</option>)}
        </select>
        <input type="number" min="0" step="0.01" value={form.base_freight} onChange={(event) => onChange('base_freight', event.target.value)} placeholder="Frete base" className={inputClass} />
        <input type="number" min="0" step="0.01" value={form.price_per_kg} onChange={(event) => onChange('price_per_kg', event.target.value)} placeholder="Preco por kg" className={inputClass} />
        <input type="number" min="0" max="1" step="0.001" value={form.value_rate} onChange={(event) => onChange('value_rate', event.target.value)} placeholder="% sobre valor. Ex: 0.012" className={inputClass} />
        <input type="number" min="1" value={form.estimated_days} onChange={(event) => onChange('estimated_days', event.target.value)} placeholder="Prazo dias" className={inputClass} />
        <label className="flex h-11 items-center gap-2 rounded-full border border-[#0A6772]/14 bg-[#FAFAF8] px-4 text-sm text-[#101827]/70">
          <input type="checkbox" checked={form.active} onChange={(event) => onChange('active', event.target.checked)} />
          Ativa
        </label>
        <div className="flex gap-2">
          <button disabled={loading} type="submit" className="h-11 flex-1 rounded-full bg-[#0A6772] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-60">
            {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Adicionar'}
          </button>
          {editingId && (
            <button type="button" onClick={onCancel} className="h-11 rounded-full border border-[#0A6772]/20 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6772]">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.14em] text-[#0A6772]">
            <tr>
              <th className="pb-3 pr-6">Transportadora</th>
              <th className="pb-3 pr-6">Regiao</th>
              <th className="pb-3 pr-6">Base</th>
              <th className="pb-3 pr-6">Kg</th>
              <th className="pb-3 pr-6">Valor</th>
              <th className="pb-3 pr-6">Prazo</th>
              <th className="pb-3">Acoes</th>
            </tr>
          </thead>
          <tbody className="text-[#101827]/74">
            {carriers.map((carrier) => (
              <tr key={`${carrier.id}-${carrier.region}-${carrier.name}`} className="border-t border-[#0A6772]/10">
                <td className="py-3 pr-6 font-medium text-[#101827]">{carrier.name}</td>
                <td className="py-3 pr-6">{carrier.region}</td>
                <td className="py-3 pr-6">R$ {Number(carrier.base_freight).toFixed(2)}</td>
                <td className="py-3 pr-6">R$ {Number(carrier.price_per_kg).toFixed(2)}</td>
                <td className="py-3 pr-6">{Number(carrier.value_rate).toFixed(3)}</td>
                <td className="py-3 pr-6">{carrier.estimated_days} dias</td>
                <td className="py-3">
                  {carrier.id > 0 ? (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => onEdit(carrier)} className="rounded-full border border-[#0A6772]/20 px-3 py-1 text-xs font-semibold text-[#0A6772]">Editar</button>
                      <button type="button" onClick={() => onDelete(carrier)} className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700">Excluir</button>
                    </div>
                  ) : (
                    <span className="text-xs text-[#101827]/45">Padrao</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default AdminShippingSettings
