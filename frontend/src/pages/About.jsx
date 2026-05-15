import { Link } from 'react-router-dom'

function About() {
  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Sobre a marca</p>
        <h1 className="mt-3 text-4xl font-semibold text-zinc-100">Lua Active</h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          Somos uma marca de moda fitness geek com foco em conforto, estilo e identidade. Criamos colecoes para quem quer se destacar com uma estetica forte e autentica.
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-3xl border border-zinc-900 bg-black/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Email comercial</p>
          <a
            href="mailto:erikagcordeiro25@gmail.com"
            className="mt-3 block text-lg font-semibold text-zinc-100 transition hover:text-zinc-300"
          >
            erikagcordeiro25@gmail.com
          </a>
        </article>

        <article className="rounded-3xl border border-zinc-900 bg-black/70 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">WhatsApp</p>
          <a
            href="https://wa.me/5548988006788"
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-lg font-semibold text-zinc-100 transition hover:text-zinc-300"
          >
            (48) 98800-6788
          </a>
        </article>
      </div>

      <footer className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-6">
        <p className="text-zinc-300">Atendimento de segunda a sexta, das 9h as 18h.</p>
        <Link
          to="/products"
          className="mt-4 inline-flex rounded-full bg-zinc-300 px-5 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-zinc-900 transition hover:bg-zinc-200"
        >
          Ver produtos
        </Link>
      </footer>
    </section>
  )
}

export default About
