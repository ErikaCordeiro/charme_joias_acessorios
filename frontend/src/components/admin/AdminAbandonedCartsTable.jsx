import { formatPrice } from '../../helpers/price'

function AdminAbandonedCartsTable({ carts }) {
  return (
    <section className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5">
      <h2 className="text-lg font-semibold text-zinc-100">Carrinhos abandonados</h2>

      {carts.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">Nenhum carrinho abandonado.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="pb-2">Carrinho</th>
                <th className="pb-2">Cliente</th>
                <th className="pb-2">Itens</th>
                <th className="pb-2">Valor estimado</th>
                <th className="pb-2">Criado em</th>
              </tr>
            </thead>
            <tbody className="text-zinc-200">
              {carts.map((cart) => (
                <tr key={cart.cart_id} className="border-t border-zinc-900">
                  <td className="py-3">#{cart.cart_id}</td>
                  <td className="py-3">{cart.user_name || cart.user_email}</td>
                  <td className="py-3">{cart.items_count}</td>
                  <td className="py-3">{formatPrice(cart.estimated_total)}</td>
                  <td className="py-3">{new Date(cart.created_at).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default AdminAbandonedCartsTable
