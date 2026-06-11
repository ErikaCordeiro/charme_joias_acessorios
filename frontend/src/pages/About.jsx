import { Link } from 'react-router-dom'

function About() {
  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-3xl border border-[#0b6f78]/15 bg-white p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#0b6f78]">Sobre a marca</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-[#111226]">Charme Joias Acessórios</h1>
        <p className="mt-4 max-w-3xl text-[#111226]/70">
          A Charme nasceu para valorizar a beleza de cada mulher através de peças delicadas, modernas e cheias de personalidade.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-3xl border border-[#0b6f78]/15 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#0b6f78]">Instagram</p>
          <a
            href="https://www.instagram.com/charmejoiass/"
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-lg font-semibold text-[#111226] transition hover:text-[#0b6f78]"
          >
            @charmejoiass
          </a>
        </article>

        <article className="rounded-3xl border border-[#0b6f78]/15 bg-white p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#0b6f78]">WhatsApp</p>
          <a
            href="https://wa.me/5548988006788"
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-lg font-semibold text-[#111226] transition hover:text-[#0b6f78]"
          >
            (48) 98800-6788
          </a>
        </article>
      </div>

      <footer className="rounded-3xl border border-[#0b6f78]/15 bg-white p-6">
        <p className="text-[#111226]/70">Atendimento pelo WhatsApp para escolher a peca ideal com calma e carinho.</p>
        <Link
          to="/products"
          className="mt-4 inline-flex rounded-full bg-[#0b6f78] px-5 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#095a62]"
        >
          Ver produtos
        </Link>
      </footer>
    </section>
  )
}

export default About
