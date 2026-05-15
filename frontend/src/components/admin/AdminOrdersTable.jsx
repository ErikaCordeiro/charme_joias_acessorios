import { formatPrice } from '../../helpers/price'

function AdminOrdersTable({ orders }) {
  return (
    <section className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5">
      <h2 className="text-lg font-semibold text-zinc-100">Pedidos</h2>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">Nenhum pedido encontrado.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="pb-2">Pedido</th>
                <th className="pb-2">Cliente</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Itens</th>
                <th className="pb-2">Total</th>
                <th className="pb-2">Data</th>
              </tr>
            </thead>
            <tbody className="text-zinc-200">
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-zinc-900">
                  <td className="py-3">#{order.id}</td>
                  <td className="py-3">{order.user_email}</td>
                  <td className="py-3">{order.status}</td>
                  <td className="py-3">{order.items_count}</td>
                  <td className="py-3">{formatPrice(order.total)}</td>
                  <td className="py-3">{new Date(order.created_at).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default AdminOrdersTable
