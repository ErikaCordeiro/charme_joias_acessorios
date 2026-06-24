import { Link } from 'react-router-dom'

function HomeBrandSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8a84f]">Charme Joias</p>
          <h2 className="font-serif text-3xl font-semibold leading-tight text-[#062f35] sm:text-4xl">
            Elegancia em cada detalhe.
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111226]/70 sm:text-base">
            <p>
              A Charme seleciona semijoias e acessorios femininos para mulheres que valorizam
              delicadeza, brilho e personalidade no dia a dia.
            </p>
            <p>
              Cada peca e escolhida com olhar cuidadoso para presentear, celebrar e transformar
              momentos simples em lembrancas especiais.
            </p>
          </div>
          <Link
            to="/about"
            className="inline-flex border-b border-[#d8a84f] pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#062f35] transition hover:text-[#0b6f78]"
          >
            Conheca a Charme
          </Link>
        </div>

        <div className="overflow-hidden bg-[#fbf8f1]">
          <img
            src="/mockup/about.png"
            alt="Mulher usando joias delicadas da Charme"
            className="h-[320px] w-full object-cover sm:h-[420px]"
          />
        </div>
      </div>
    </section>
  )
}

export default HomeBrandSection
