import { Link } from 'react-router-dom'

function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-[#0b6f78]/10 bg-[#063f46]">
      <div className="relative min-h-[430px] w-full sm:min-h-[520px] lg:min-h-[620px]">
        <img
          src="/hero/charme-joias-hero.png"
          alt="Colecao Charme Joias e Acessorios"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#063f46]/88 via-[#063f46]/42 to-[#063f46]/18" />

        <div className="relative z-10 mx-auto flex min-h-[430px] w-full max-w-7xl items-center px-4 py-12 sm:min-h-[520px] sm:px-6 lg:min-h-[620px] lg:px-8">
          <div className="max-w-[640px] text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/80 sm:text-sm">
              Joias | Semijoias | Acessorios
            </p>
            <p className="mt-4 inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.18em] text-white">
              Curadoria feminina Charme
            </p>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
              A beleza esta nos detalhes
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/82 sm:text-lg">
              Pecas delicadas, femininas e sofisticadas para valorizar todos os seus momentos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full bg-[#d8a84f] px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-[#062f35] transition hover:bg-[#efc66b]"
              >
                Ver novidades
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-full border border-white/35 px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-white/10"
              >
                Conheca a Charme
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHeroSection
