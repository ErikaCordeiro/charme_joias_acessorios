function AdminCustomersTable({ customers }) {
  return (
    <section className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5">
      <h2 className="text-lg font-semibold text-zinc-100">Clientes cadastrados</h2>

      {customers.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">Nenhum cliente cadastrado.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="pb-2">Nome</th>
                <th className="pb-2">Email</th>
                <th className="pb-2">Telefone</th>
                <th className="pb-2">Cidade/UF</th>
                <th className="pb-2">Tipo</th>
              </tr>
            </thead>
            <tbody className="text-zinc-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t border-zinc-900">
                  <td className="py-3">{customer.full_name || '-'}</td>
                  <td className="py-3">{customer.email}</td>
                  <td className="py-3">{customer.phone || '-'}</td>
                  <td className="py-3">
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
