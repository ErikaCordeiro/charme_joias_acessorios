import { formatPrice } from '../../helpers/price'

function AdminProductsTable({
  products,
  loading = false,
  onEdit,
  onDelete,
}) {
  return (
    <section className="rounded-[6px] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_45px_rgba(10,103,114,0.06)]">
      <h2 className="font-serif text-2xl text-[#12343A]">Produtos cadastrados</h2>

      {loading ? (
        <p className="mt-4 text-sm text-[#101827]/58">Carregando produtos...</p>
      ) : products.length === 0 ? (
        <p className="mt-4 text-sm text-[#101827]/58">Nenhum produto cadastrado.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.14em] text-[#0A6772]">
              <tr>
                <th className="pb-3 pr-6">Produto</th>
                <th className="pb-3 pr-6">Categoria</th>
                <th className="pb-3 pr-6">Preco</th>
                <th className="pb-3 pr-6">Estoque</th>
                <th className="pb-3">Acoes</th>
              </tr>
            </thead>
            <tbody className="text-[#101827]/74">
              {products.map((product) => (
                <tr key={product.id} className="border-t border-[#0A6772]/10">
                  <td className="min-w-56 py-3 pr-6">
                    <p className="font-medium text-[#101827]">{product.name}</p>
                    <p className="line-clamp-1 text-xs text-[#101827]/50">{product.description}</p>
                  </td>
                  <td className="py-3 pr-6">{product.category || '-'}</td>
                  <td className="py-3 pr-6">{formatPrice(product.price)}</td>
                  <td className="py-3 pr-6">{product.stock}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        className="rounded-full border border-[#0A6772]/20 px-3 py-1 text-xs font-semibold text-[#0A6772] transition hover:border-[#0A6772]"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-700 transition hover:border-red-500"
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
