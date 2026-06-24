import { Link } from 'react-router-dom'

import { getWhatsAppLink, INSTAGRAM_URL } from '../../helpers/contact'

const footerLinks = [
  { label: 'Joias', to: '/products' },
  { label: 'Brincos', to: '/products?category=brincos' },
  { label: 'Colares', to: '/products?category=colares' },
  { label: 'Pulseiras', to: '/products?category=pulseiras' },
  { label: 'Pingentes', to: '/products?category=pingentes' },
]

const trustItems = [
  'Curadoria exclusiva',
  'Atendimento personalizado',
  'Pecas selecionadas',
  'Elegancia para todos os momentos',
]

function HomeFooter() {
  return (
    <footer className="bg-[#062f35] text-white">
      <section className="border-b border-white/12 bg-[#073f46]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
          {trustItems.map((item) => (
            <div key={item} className="text-center md:border-r md:border-white/12 md:last:border-r-0">
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[#d8a84f]/55 text-[#d8a84f]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.5]">
                  <path d="M12 3 14.4 9.6 21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z" />
                </svg>
              </span>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/92">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white text-[#062f35]">
        <div className="mx-auto max-w-7xl px-4 py-9 text-center sm:px-6 lg:px-8">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em]">Siga nosso Instagram</h2>
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {[
              '/mockup/product-ring.png',
              '/mockup/product-necklace.png',
              '/mockup/product-earrings.png',
              '/products/charme/conjunto-coracao-dourado.jpeg',
              '/products/charme/corrente-laminada-dourada.jpeg',
              '/mockup/collection-gold.png',
            ].map((image) => (
              <a key={image} href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="block overflow-hidden bg-[#fbf8f1]">
                <img src={image} alt="Instagram Charme Joias" className="h-24 w-full object-cover transition hover:scale-105" />
              </a>
            ))}
          </div>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center justify-center bg-[#062f35] px-8 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#0b6f78]"
          >
            Seguir @charmejoiass
          </a>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/10 bg-[#073f46]">
        <img
          src="/hero/charme-joias-hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 py-9 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">
              Descubra sua proxima peca favorita.
            </h2>
            <p className="mt-2 text-sm text-white/78">
              Entre em contato e encontre acessorios que traduzem sua personalidade.
            </p>
          </div>
          <a
            href={getWhatsAppLink('Ola! Quero ajuda para escolher minha proxima peca Charme.')}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center bg-[#d8a84f] px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#062f35] transition hover:bg-[#efc66b]"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
        <div>
          <Link to="/" className="font-serif text-4xl font-semibold leading-none text-white">
            Charme
            <span className="mt-2 block font-sans text-xs font-bold uppercase tracking-[0.38em] text-white/72">
              Joias Acessorios
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/68">
            Semijoias e acessorios femininos selecionados com cuidado para iluminar todos os momentos.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8a84f]">Institucional</h3>
          <div className="mt-4 space-y-3 text-sm text-white/72">
            <Link to="/about" className="block transition hover:text-white">Sobre a Charme</Link>
            <Link to="/products" className="block transition hover:text-white">Colecoes</Link>
            <Link to="/products?category=sale" className="block transition hover:text-white">Sale</Link>
            <a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" className="block transition hover:text-white">Instagram</a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8a84f]">Categorias</h3>
          <div className="mt-4 space-y-3 text-sm text-white/72">
            {footerLinks.map((link) => (
              <Link key={link.label} to={link.to} className="block transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-[#d8a84f]">Atendimento</h3>
          <div className="mt-4 space-y-3 text-sm text-white/72">
            <a href={getWhatsAppLink()} target="_blank" rel="noreferrer" className="block transition hover:text-white">WhatsApp</a>
            <p>Segunda a sexta</p>
            <p>09h as 18h</p>
            <p>Palhoca - SC</p>
          </div>
        </div>
      </section>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/52">
        © 2026 Charme Joias e Acessorios. Todos os direitos reservados.
      </div>
    </footer>
  )
}

export default HomeFooter
