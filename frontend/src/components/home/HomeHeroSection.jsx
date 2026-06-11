import { Link } from 'react-router-dom'

import HomeLandingHeader from './HomeLandingHeader'

function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-900 bg-black">
      <div className="relative min-h-[620px] w-full lg:min-h-[680px]">
        <img
          src="/hero/home-reference.png"
          alt="Coleção Charme Joias Acessórios"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.14),transparent_40%)]" />

        <div className="relative z-20 border-b border-zinc-800/70 bg-black/75 text-xs uppercase tracking-[0.08em] text-zinc-300">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-2 px-4 py-2 lg:px-10">
            <p>Atendimento pelo WhatsApp para Palhoça e região</p>
            <p className="hidden sm:block">Novidades em ouro, prata e acessórios exclusivos</p>
          </div>
        </div>

        <HomeLandingHeader />

        <div className="relative z-10 mx-auto flex w-full max-w-[1600px] px-4 py-12 lg:px-10 lg:py-20">
          <div className="max-w-[760px]">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-300">Joias | Semijoias | Acessórios</p>
            <p className="mt-4 inline-flex rounded-full border border-zinc-600 bg-black/55 px-4 py-1 text-xs uppercase tracking-[0.18em] text-zinc-100">
              Curadoria feminina Charme
            </p>
            <h1 className="mt-5 text-5xl font-black leading-[0.9] text-zinc-100 sm:text-6xl lg:text-8xl">
              Transforme seu
              <br />
              look
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-200">
              Peças delicadas em ouro, prata e acessórios exclusivos para realçar sua beleza.
            </p>
            <div className="mt-8">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-full border border-zinc-400 bg-zinc-200 px-8 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-900 transition hover:bg-white"
              >
                Ver novidades
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHeroSection
