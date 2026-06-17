function AdminCustomersTable({ customers }) {
  return (
    <section className="rounded-[6px] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_45px_rgba(10,103,114,0.06)]">
      <h2 className="font-serif text-2xl text-[#12343A]">Clientes cadastrados</h2>

      {customers.length === 0 ? (
        <p className="mt-4 text-sm text-[#101827]/58">Nenhum cliente cadastrado.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-[#0A6772]">
              <tr>
                <th className="pb-3 pr-6">Nome</th>
                <th className="pb-3 pr-6">Email</th>
                <th className="pb-3 pr-6">Telefone</th>
                <th className="pb-3 pr-6">Cidade/UF</th>
                <th className="pb-3">Tipo</th>
              </tr>
            </thead>
            <tbody className="text-[#101827]/74">
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t border-[#0A6772]/10">
                  <td className="min-w-40 py-3 pr-6 font-medium text-[#101827]">{customer.full_name || '-'}</td>
                  <td className="min-w-48 py-3 pr-6">{customer.email}</td>
                  <td className="py-3 pr-6">{customer.phone || '-'}</td>
                  <td className="py-3 pr-6">
                    {customer.city || '-'}
                    {customer.state ? `/${customer.state}` : ''}
                  </td>
                  <td className="py-3">{customer.is_admin ? 'Admin' : 'Cliente'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default AdminCustomersTable
