import { formatPrice } from '../../helpers/price'

function AdminOrdersTable({ orders }) {
  return (
    <section className="rounded-[6px] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_45px_rgba(10,103,114,0.06)]">
      <h2 className="font-serif text-2xl text-[#12343A]">Pedidos</h2>

      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-[#101827]/58">Nenhum pedido encontrado.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-[#0A6772]">
              <tr>
                <th className="pb-3 pr-6">Pedido</th>
                <th className="pb-3 pr-6">Cliente</th>
                <th className="pb-3 pr-6">Status</th>
                <th className="pb-3 pr-6">Itens</th>
                <th className="pb-3 pr-6">Frete</th>
                <th className="pb-3 pr-6">Total</th>
                <th className="pb-3">Data</th>
              </tr>
            </thead>
            <tbody className="text-[#101827]/74">
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-[#0A6772]/10">
                  <td className="py-3 pr-6 font-medium text-[#101827]">#{order.id}</td>
                  <td className="min-w-48 py-3 pr-6">{order.user_email}</td>
                  <td className="py-3 pr-6">{order.status}</td>
                  <td className="py-3 pr-6">{order.items_count}</td>
                  <td className="py-3 pr-6">{order.shipping_carrier || '-'}</td>
                  <td className="py-3 pr-6 font-medium text-[#101827]">{formatPrice(order.total)}</td>
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
