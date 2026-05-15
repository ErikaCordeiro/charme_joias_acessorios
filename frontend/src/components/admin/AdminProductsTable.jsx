import { formatPrice } from '../../helpers/price'

function AdminProductsTable({
  products,
  loading = false,
  onEdit,
  onDelete,
}) {
  return (
    <section className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5">
      <h2 className="text-lg font-semibold text-zinc-100">Produtos cadastrados</h2>

      {loading ? (
        <p className="mt-4 text-sm text-zinc-400">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="mt-4 text-sm text-zinc-400">Nenhum produto cadastrado.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-zinc-500">
              <tr>
                <th className="pb-2">Produto</th>
                <th className="pb-2">Categoria</th>
                <th className="pb-2">Preco</th>
                <th className="pb-2">Estoque</th>
                <th className="pb-2">Acoes</th>
              </tr>
            </thead>
            <tbody className="text-zinc-200">
              {products.map((product) => (
                <tr key={product.id} className="border-t border-zinc-900">
                  <td className="py-3">
                    <p className="font-medium text-zinc-100">{product.name}</p>
                    <p className="line-clamp-1 text-xs text-zinc-400">{product.description}</p>
                  </td>
                  <td className="py-3">{product.category || '-'}</td>
                  <td className="py-3">{formatPrice(product.price)}</td>
                  <td className="py-3">{product.stock}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-semibold transition hover:border-zinc-500"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="rounded-full border border-red-400/50 px-3 py-1 text-xs font-semibold text-red-200 transition hover:border-red-300"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default AdminProductsTable
