import { useNavigate } from 'react-router-dom'

const collections = [
  {
    id: 'ouro',
    label: 'Coleção Ouro',
    description: 'Clássicos que nunca saem de moda',
    color: 'from-yellow-400/20 to-yellow-500/30',
    border: 'border-yellow-400/40',
    tag: 'bg-yellow-100 text-yellow-700',
    icon: '✨',
  },
  {
    id: 'prata',
    label: 'Coleção Prata',
    description: 'Brilho e sofisticação em cada detalhe',
    color: 'from-gray-300/20 to-gray-400/30',
    border: 'border-gray-400/40',
    tag: 'bg-gray-100 text-gray-700',
    icon: '💎',
  },
  {
    id: 'exclusiva',
    label: 'Coleção Exclusiva',
    description: 'Peças únicas para momentos especiais',
    color: 'from-rose-300/20 to-rose-400/30',
    border: 'border-rose-400/40',
    tag: 'bg-rose-100 text-rose-700',
    icon: '👑',
  },
]

function CollectionsSection() {
  const navigate = useNavigate()

  const handleCollectionClick = (collectionId) => {
    // Map collection to product categories
    const categoryMap = {
      ouro: 'presentes', // Products with gold color
      prata: 'brincos', // Silver products
      exclusiva: 'sale', // Exclusive products
    }
    const category = categoryMap[collectionId]
    navigate(`/products?category=${category}`)
  }

  return (
    <section className="bg-[#fbf8f1] py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-serif text-3xl font-semibold text-[#111226] sm:text-4xl">
            Nossas Coleções
          </h2>
          <p className="mt-3 text-[#111226]/65">Descubra as linhas exclusivas da Charme</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => handleCollectionClick(collection.id)}
              type="button"
              className={`group relative overflow-hidden rounded-2xl border-2 p-8 transition-all hover:scale-105 hover:shadow-lg ${collection.border}`}
            >
              <div
                className={`absolute inset-0 -z-10 bg-gradient-to-br ${collection.color} transition-all group-hover:to-current`}
              />

              <div className="text-4xl mb-4">{collection.icon}</div>

              <h3 className="text-left font-serif text-2xl font-semibold text-[#111226]">
                {collection.label}
              </h3>
              <p className="mt-2 text-left text-sm text-[#111226]/70">{collection.description}</p>

              <div className="mt-6 inline-flex">
                <span className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${collection.tag}`}>
                  Ver Coleção →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CollectionsSection
