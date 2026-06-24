import { useNavigate } from 'react-router-dom'

const collections = [
  {
    id: 'ouro',
    label: 'Colecao Ouro',
    description: 'Classicos que nunca saem de moda.',
    category: 'colares',
    image: '/mockup/collection-gold.png',
  },
  {
    id: 'prata',
    label: 'Colecao Prata',
    description: 'Brilho e sofisticacao em cada detalhe.',
    category: 'brincos',
    image: '/mockup/collection-silver.png',
  },
  {
    id: 'exclusiva',
    label: 'Colecao Exclusiva',
    description: 'Pecas unicas para momentos especiais.',
    category: 'presentes',
    image: '/mockup/collection-exclusive.png',
  },
]

function CollectionsSection() {
  const navigate = useNavigate()

  return (
    <section id="colecoes" className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d8a84f]">Curadoria Charme</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-[#062f35] sm:text-4xl">
            Nossas colecoes
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {collections.map((collection) => (
            <button
              key={collection.id}
              type="button"
              onClick={() => navigate(`/products?category=${collection.category}`)}
              className="group border border-[#0b6f78]/12 bg-[#fbf8f1] text-left transition hover:-translate-y-1 hover:border-[#d8a84f]/60 hover:shadow-[0_22px_60px_rgba(6,47,53,0.10)]"
            >
              <img
                src={collection.image}
                alt={collection.label}
                className="h-48 w-full object-cover"
              />
              <div className="p-5 text-center">
                <h3 className="font-serif text-xl font-semibold text-[#062f35]">{collection.label}</h3>
                <p className="mt-2 text-sm text-[#111226]/65">{collection.description}</p>
                <span className="mt-4 inline-flex border-b border-[#d8a84f] pb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#062f35]">
                  Ver colecao
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
