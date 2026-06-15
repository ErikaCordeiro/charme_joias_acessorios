import { useEffect, useState } from 'react'

const whatsappHref =
  'https://wa.me/5548988006788?text=Ola!%20Vi%20a%20Charme%20Joias%20Acessorios%20e%20quero%20conhecer%20as%20colecoes.'

const instagramHref = 'https://www.instagram.com/charmejoiass/'
const logoImage = '/brand/charme-logo.jpeg'
const productImages = {
  hero: '/products/charme/conjunto-dourado-caixa.jpeg',
  gold: '/products/charme/corrente-e-brincos-dourados.jpeg',
  earrings: '/products/charme/brincos-organicos-dourados.jpeg',
  silver: '/products/charme/conjunto-prata-ponto-luz.jpeg',
  exclusive: '/products/charme/conjunto-coracao-dourado.jpeg',
  red: '/products/charme/conjunto-vermelho-dourado.jpeg',
  necklace: '/products/charme/colares-escapulario.jpeg',
  laminated: '/products/charme/corrente-laminada-dourada.jpeg',
}
const heroImage = productImages.hero

const menuItems = [
  ['JOIAS', '#colecoes'],
  ['BRINCOS', '#colecoes'],
  ['COLARES', '#colecoes'],
  ['PULSEIRAS', '#colecoes'],
  ['ANÉIS', '#colecoes'],
  ['PRESENTES', '#contato'],
  ['SALE', '#colecoes'],
]

const pillars = [
  ['Curadoria Exclusiva', 'Peças cuidadosamente selecionadas.'],
  ['Atendimento Personalizado', 'Experiência próxima e humanizada.'],
  ['Elegância para Todos os Momentos', 'Do dia a dia às ocasiões especiais.'],
  ['Detalhes que Encantam', 'Porque a sofisticação mora nos pequenos detalhes.'],
]

function EditorialImage({ className = '', position = 'center', src = heroImage }) {
  return (
    <div className={`relative overflow-hidden bg-[#101827] ${className}`}>
      <img
        src={src}
        alt="Semijoias douradas e prateadas da Charme em uma composição editorial"
        className="h-full w-full object-cover transition duration-700 ease-out hover:scale-[1.025]"
        style={{ objectPosition: position }}
      />
      <div className="absolute inset-0 bg-[#101827]/[0.03]" />
    </div>
  )
}

function SearchForm({ id, mobile = false }) {
  return (
    <form className={`${mobile ? 'mx-4 my-3 sm:mx-6' : 'w-full max-w-[310px]'} flex items-center bg-[#F4F4F2] px-3 transition focus-within:bg-white focus-within:ring-1 focus-within:ring-[#101827]/18`}>
      <label htmlFor={id} className="sr-only">Buscar peças</label>
      <input
        id={id}
        type="search"
        placeholder="Buscar por peça ou coleção"
        className="h-10 min-w-0 flex-1 bg-transparent text-sm text-[#101827] outline-none placeholder:text-[#101827]/35"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="flex h-10 w-8 items-center justify-center text-[#101827]/58 transition hover:text-[#0A6772]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.5]">
          <circle cx="11" cy="11" r="7" />
          <path d="m16.5 16.5 4 4" />
        </svg>
      </button>
    </form>
  )
}

function TextLink({ children, href = whatsappHref, variant = 'dark' }) {
  const colorClass =
    variant === 'light'
      ? 'border-white/40 text-white hover:border-white hover:bg-white hover:text-[#101827]'
      : 'border-[#101827]/18 text-[#101827] hover:border-[#0A6772] hover:text-[#0A6772]'

  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
      className={`inline-flex min-h-10 items-center justify-center rounded-full border px-5 text-[0.68rem] font-semibold uppercase tracking-[0.2em] transition duration-500 ${colorClass}`}
    >
      {children}
    </a>
  )
}

function HeaderIcon({ type }) {
  if (type === 'bag') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.35]">
        <path d="M6.5 8.5h11l.8 11H5.7l.8-11Z" />
        <path d="M9 8.5a3 3 0 0 1 6 0" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-none stroke-current stroke-[1.35]">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20a7 7 0 0 1 14 0" />
    </svg>
  )
}

function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#101827]">
      <header className={`sticky top-0 z-50 bg-white text-[#101827] transition duration-500 ${scrolled ? 'shadow-[0_12px_34px_rgba(16,24,39,0.05)]' : ''}`}>
        <div className="bg-[#FAFAF8] lg:bg-[#F3C39E]">
          <div className="mx-auto grid h-7 max-w-7xl grid-cols-1 items-center px-4 text-[0.68rem] text-[#101827]/70 sm:grid-cols-3 sm:px-6 lg:h-8 lg:px-8 lg:text-[0.72rem] lg:text-[#101827]/78">
            <p className="hidden sm:block">Atendimento ao cliente</p>
            <p className="text-center font-medium">Frete grátis acima de R$ 699</p>
            <p className="hidden text-right sm:block">Acessibilidade</p>
          </div>
        </div>

        <div className="hidden border-b border-[#101827]/8 bg-white lg:block">
          <div className="mx-auto grid h-20 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-8 px-4 sm:px-6 lg:px-8">
            <a href="#contato" className="text-sm text-[#101827]/62 underline-offset-4 transition hover:text-[#0A6772] hover:underline">
              Informar meu CEP
            </a>

            <a href="#inicio" className="text-center">
              <img
                src={logoImage}
                alt="Charme Joias e Acessórios"
                className="mx-auto h-16 w-16 object-cover"
              />
            </a>

            <div className="flex items-center justify-end gap-4">
              <SearchForm id="home-search" />
              <a href="#contato" aria-label="Minha conta" className="text-[#101827]/62 transition hover:text-[#0A6772]">
                <HeaderIcon type="user" />
              </a>
              <a href="#contato" aria-label="Sacola" className="text-[#101827]/62 transition hover:text-[#0A6772]">
                <HeaderIcon type="bag" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-b border-[#101827]/8 bg-white lg:hidden">
          <div className="grid h-16 grid-cols-[48px_minmax(0,1fr)_48px] items-center px-4 sm:px-6">
            <button type="button" aria-label="Abrir menu" className="flex h-8 w-8 items-center justify-start text-[#101827]/70">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.5]">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>
            <a href="#inicio" className="min-w-0 text-center">
              <img
                src={logoImage}
                alt="Charme Joias e Acessórios"
                className="mx-auto h-11 w-11 object-cover"
              />
            </a>
            <div className="flex items-center justify-end text-[#101827]/68">
              <button type="button" onClick={() => setSearchOpen(true)} aria-label="Buscar" className="transition hover:text-[#0A6772]">
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-none stroke-current stroke-[1.5]">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m16.5 16.5 4 4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <nav className="hidden border-b border-[#101827]/8 bg-white lg:block">
          <div className="mx-auto flex h-12 max-w-7xl items-center justify-center gap-12 px-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[#101827]/82 sm:px-6 lg:px-8">
            {menuItems.map(([label, href], index) => (
              <a key={label} href={href} className="group inline-flex items-center gap-1.5 transition duration-300 hover:text-[#0A6772]">
                {label}
                {index < 5 && (
                  <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3 fill-none stroke-current stroke-[1.4] opacity-40 transition group-hover:opacity-80">
                    <path d="m3 4.5 3 3 3-3" />
                  </svg>
                )}
              </a>
            ))}
          </div>
        </nav>

        <div className="hidden border-b border-[#101827]/8 bg-[#FAFAF8] lg:block">
          <div className="mx-auto grid max-w-7xl items-center gap-4 px-4 py-4 text-center sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
            <div className="hidden h-16 overflow-hidden lg:block">
              <img src={productImages.earrings} alt="" className="h-full w-full object-cover opacity-75" style={{ objectPosition: 'center' }} />
            </div>
            <div className="px-4">
              <p className="font-serif text-xl uppercase tracking-[0.28em] text-[#101827]/80 sm:text-2xl">Entrega Garantida</p>
              <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#101827]/48">
                Seu presente, a tempo de celebrar
              </p>
            </div>
            <div className="hidden h-16 overflow-hidden lg:block">
              <img src={productImages.silver} alt="" className="h-full w-full object-cover opacity-75" style={{ objectPosition: 'center' }} />
            </div>
          </div>
        </div>

        <div className="border-b border-[#101827]/6 bg-white lg:hidden">
          <nav className="hide-scrollbar flex h-10 gap-6 overflow-x-auto whitespace-nowrap px-4 text-[12px] font-medium uppercase tracking-[2px] text-[#101827]/64 sm:px-6">
            {menuItems.map(([label, href]) => (
              <a key={label} href={href} className="flex shrink-0 items-center transition hover:text-[#0A6772]">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-[#101827]/35 backdrop-blur-sm lg:hidden">
          <div className="mx-4 mt-10 bg-white p-4 shadow-[0_24px_70px_rgba(16,24,39,0.16)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#101827]/58">Buscar</p>
              <button type="button" onClick={() => setSearchOpen(false)} className="text-sm text-[#101827]/58 transition hover:text-[#0A6772]">
                Fechar
              </button>
            </div>
            <SearchForm id="mobile-home-search" />
          </div>
        </div>
      )}

      <main>
        <section id="inicio" className="relative mt-3 min-h-[64vh] overflow-hidden bg-[#FAFAF8] text-white lg:mt-0 lg:min-h-[68vh]">
          <img
            src={heroImage}
            alt="Joias e acessórios femininos Charme em composição sofisticada"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: '58% center' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#101827]/58 via-[#101827]/18 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#101827]/20 to-transparent" />

          <div className="relative mx-auto flex min-h-[64vh] max-w-7xl items-center px-4 py-14 sm:px-6 lg:min-h-[68vh] lg:px-8">
            <div className="luxury-reveal max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.38em] text-white/72">Charme Joias Acessórios</p>
              <h1 className="mt-6 font-serif text-4xl uppercase leading-[0.94] tracking-[0.06em] text-white sm:text-6xl lg:text-7xl">
                Elegância que transforma
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/78 sm:text-lg">
                Peças selecionadas para mulheres que valorizam os detalhes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#colecoes"
                  className="inline-flex min-h-10 items-center justify-center rounded-full bg-[#FAFAF8] px-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#101827] transition duration-500 hover:bg-[#C7A46A] hover:text-white"
                >
                  Conhecer Coleções
                </a>
                <TextLink variant="light">Falar no WhatsApp</TextLink>
              </div>
            </div>
          </div>

          <a
            href="#manifesto"
            className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-white/64"
          >
            Scroll
            <span className="h-12 w-px overflow-hidden bg-white/25">
              <span className="block h-5 w-px animate-[scrollLine_1.8s_ease-in-out_infinite] bg-white" />
            </span>
          </a>
        </section>

        <section id="manifesto" className="bg-[#FAFAF8] px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="luxury-reveal mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#0A6772]">Manifesto</p>
            <h2 className="mt-6 font-serif text-4xl leading-tight text-[#101827] sm:text-5xl lg:text-6xl">
              A beleza está nos detalhes.
            </h2>
            <div className="mx-auto mt-8 max-w-2xl space-y-4 text-base leading-8 text-[#101827]/68 sm:text-lg">
              <p>Na Charme, acreditamos que um acessório não é apenas um complemento.</p>
              <p>Ele revela personalidade, confiança e elegância.</p>
              <p>Cada peça é escolhida para valorizar a mulher em todos os momentos.</p>
            </div>
          </div>
        </section>

        <section id="colecoes" className="bg-[#FAFAF8]">
          <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
            <div className="mb-14 flex flex-col justify-between gap-6 border-t border-[#101827]/10 pt-10 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#0A6772]">Coleções</p>
                <h2 className="mt-4 font-serif text-4xl sm:text-6xl">Seleções Charme</h2>
              </div>
              <p className="max-w-md text-base leading-7 text-[#101827]/62">
                Uma curadoria pensada para atravessar o cotidiano e os momentos especiais com luxo discreto.
              </p>
            </div>

            <article className="luxury-reveal grid items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <EditorialImage className="min-h-[420px] lg:min-h-[500px]" position="center" src={productImages.gold} />
              <div className="max-w-lg">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#C7A46A]">Coleção Ouro</p>
                <h3 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">Luz quente, presença delicada.</h3>
                <p className="mt-6 text-lg leading-8 text-[#101827]/65">
                  Peças douradas que iluminam a pele com sofisticação, criadas para composições femininas e memoráveis.
                </p>
                <div className="mt-8">
                  <TextLink>Explorar</TextLink>
                </div>
              </div>
            </article>

            <article className="luxury-reveal grid items-center gap-10 border-y border-[#101827]/10 py-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
              <div className="max-w-lg lg:order-1">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#0A6772]">Coleção Prata</p>
                <h3 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">Brilho frio, elegância serena.</h3>
                <p className="mt-6 text-lg leading-8 text-[#101827]/65">
                  Uma seleção de prata para mulheres que preferem beleza precisa, moderna e silenciosamente marcante.
                </p>
                <div className="mt-8">
                  <TextLink>Explorar</TextLink>
                </div>
              </div>
              <EditorialImage className="min-h-[420px] lg:order-2 lg:min-h-[500px]" position="center" src={productImages.silver} />
            </article>

            <article className="luxury-reveal relative mt-16 min-h-[560px] overflow-hidden bg-[#101827] text-white">
              <img
                src={productImages.exclusive}
                alt="Coleção exclusiva Charme em fotografia editorial"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectPosition: 'center 54%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#101827]/70 via-[#101827]/20 to-transparent" />
              <div className="relative flex min-h-[560px] max-w-xl flex-col justify-end px-6 py-10 sm:px-10 lg:px-14">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#C7A46A]">Coleção Exclusiva</p>
                <h3 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">Uma peça para ser lembrada.</h3>
                <p className="mt-6 text-lg leading-8 text-white/72">
                  Acessórios escolhidos para revelar personalidade com acabamento delicado e alto valor percebido.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="bg-[#FAFAF8] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="luxury-reveal grid items-center gap-12 border-y border-[#101827]/10 py-14 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#0A6772]">Essência</p>
                <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
                  O acessório certo não completa um look.
                  <span className="mt-3 block text-[#C7A46A]">Ele revela quem você é.</span>
                </h2>
              </div>
              <EditorialImage className="min-h-[460px]" position="center" src={productImages.necklace} />
            </div>
          </div>
        </section>

        <section id="marca" className="bg-[#FAFAF8] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#0A6772]">Experiência Charme</p>
                <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">Luxo discreto, atendimento próximo.</h2>
              </div>
              <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                {pillars.map(([title, description]) => (
                  <article key={title} className="border-t border-[#101827]/14 pt-6">
                    <h3 className="font-serif text-2xl">{title}</h3>
                    <p className="mt-3 leading-7 text-[#101827]/62">{description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="instagram" className="bg-white px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#0A6772]">Instagram</p>
                <h2 className="mt-5 font-serif text-4xl sm:text-6xl">Acompanhe a Charme</h2>
                <p className="mt-4 text-lg text-[#101827]/62">Inspiração, tendências e novidades.</p>
              </div>
              <TextLink href={instagramHref}>@charmejoiass</TextLink>
            </div>

            <div className="grid min-h-[560px] gap-4 md:grid-cols-[1.25fr_0.75fr]">
              <EditorialImage className="min-h-[420px]" position="center" src={productImages.red} />
              <div className="grid gap-4">
                <EditorialImage className="min-h-[300px]" position="center" src={productImages.laminated} />
                <EditorialImage className="min-h-[300px]" position="center" src={productImages.earrings} />
              </div>
            </div>
          </div>
        </section>

        <section id="contato" className="bg-[#0A6772] px-4 py-20 text-white sm:px-6 lg:px-8">
          <div className="luxury-reveal mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/62">Contato</p>
            <h2 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">
              Descubra sua próxima peça favorita.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/74">
              Entre em contato e encontre acessórios que traduzem sua personalidade.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-[#C7A46A] px-9 text-xs font-semibold uppercase tracking-[0.22em] text-white transition duration-500 hover:bg-[#FAFAF8] hover:text-[#101827]"
            >
              Falar no WhatsApp
            </a>
          </div>
        </section>
      </main>

      <footer className="bg-white px-4 py-20 text-[#101827] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.85fr_0.85fr_0.85fr]">
            <div>
              <img
                src={logoImage}
                alt="Charme Joias e Acessórios"
                className="h-20 w-20 object-cover"
              />
              <p className="mt-7 max-w-sm text-sm leading-7 text-[#101827]/60">
                Elegância em cada detalhe. Peças selecionadas para mulheres que valorizam estilo e sofisticação.
              </p>
            </div>

            <div>
              <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0A6772]">Institucional</h3>
              <div className="mt-6 flex flex-col gap-3 text-sm text-[#101827]/62">
                <a href="#marca" className="transition hover:text-[#0A6772]">Sobre a Marca</a>
                <a href="#colecoes" className="transition hover:text-[#0A6772]">Coleções</a>
                <a href="#instagram" className="transition hover:text-[#0A6772]">Instagram</a>
                <a href="#contato" className="transition hover:text-[#0A6772]">Contato</a>
              </div>
            </div>

            <div>
              <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0A6772]">Atendimento</h3>
              <div className="mt-6 flex flex-col gap-3 text-sm text-[#101827]/62">
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="transition hover:text-[#0A6772]">WhatsApp</a>
                <p>Palhoça - SC</p>
                <p>Segunda a Sexta</p>
                <p>09h às 18h</p>
              </div>
            </div>

            <div>
              <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#0A6772]">Redes Sociais</h3>
              <div className="mt-6 flex flex-col gap-3 text-sm text-[#101827]/62">
                <a href={instagramHref} target="_blank" rel="noreferrer" className="transition hover:text-[#0A6772]">Instagram</a>
                <a href={whatsappHref} target="_blank" rel="noreferrer" className="transition hover:text-[#0A6772]">WhatsApp</a>
                <a href={instagramHref} target="_blank" rel="noreferrer" className="transition hover:text-[#0A6772]">Facebook</a>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col justify-between gap-3 border-t border-[#101827]/10 pt-8 text-xs text-[#101827]/45 sm:flex-row">
            <p>© 2026 Charme Joias Acessórios</p>
            <p>Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com a Charme pelo WhatsApp"
        className="fixed bottom-5 right-4 z-50 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-[0_12px_34px_rgba(16,24,39,0.18)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#1fb85a] sm:bottom-7 sm:right-7 sm:px-5"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
          <path d="M12.04 2a9.86 9.86 0 0 0-8.48 14.9L2.5 22l5.22-1.02A9.86 9.86 0 1 0 12.04 2Zm0 1.8a8.06 8.06 0 1 1 0 16.12 8 8 0 0 1-3.93-1.02l-.29-.16-3.06.6.62-2.98-.18-.3A8.06 8.06 0 0 1 12.04 3.8Zm-3.2 4.32c-.18 0-.47.07-.72.34-.25.27-.94.92-.94 2.25s.96 2.61 1.1 2.79c.13.18 1.87 2.98 4.62 4.06 2.29.9 2.76.72 3.25.68.5-.05 1.6-.65 1.82-1.28.23-.63.23-1.17.16-1.28-.07-.12-.25-.18-.53-.32-.27-.13-1.6-.79-1.85-.88-.25-.09-.43-.13-.62.14-.18.27-.71.88-.87 1.06-.16.18-.32.2-.6.07-.27-.14-1.15-.43-2.2-1.36-.81-.72-1.36-1.62-1.52-1.89-.16-.27-.02-.42.12-.55.12-.12.27-.32.4-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.13-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.47h-.53Z" />
        </svg>
        <span className="hidden sm:inline">Fale Conosco</span>
      </a>
    </div>
  )
}

export default Home
