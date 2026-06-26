import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { INSTAGRAM_URL, WHATSAPP_NUMBER } from '../helpers/contact'
import { defaultAboutContent, mapAboutContentToForm } from '../helpers/homeContent'
import api from '../services/api'

function About() {
  const [content, setContent] = useState(defaultAboutContent)

  useEffect(() => {
    let mounted = true

    const loadContent = async () => {
      try {
        const response = await api.get('/site/about-content')
        if (mounted) {
          setContent(mapAboutContentToForm(response.data))
        }
      } catch (error) {
        console.error('Erro ao carregar conteudo sobre nos:', error)
      }
    }

    void loadContent()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="mx-auto max-w-6xl space-y-6 px-1 sm:px-0">
      <header className="grid overflow-hidden rounded-[1.5rem] border border-[#0b6f78]/15 bg-white shadow-[0_24px_70px_rgba(17,18,38,0.08)] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="p-6 sm:p-8 lg:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#B98D3A]">{content.eyebrow}</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#111226] sm:text-5xl">{content.title}</h1>
          {content.body_primary && (
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[#111226]/70 sm:text-base">
              {content.body_primary}
            </p>
          )}
          {content.body_secondary && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#111226]/70 sm:text-base">
              {content.body_secondary}
            </p>
          )}
          {content.cta_label && content.cta_url && (
            <Link
              to={content.cta_url}
              className="mt-6 inline-flex rounded-full bg-[#0b6f78] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#095a62]"
            >
              {content.cta_label}
            </Link>
          )}
        </div>
        <div className="min-h-64 bg-[#062f35] lg:min-h-full">
          <img
            src={content.image_url}
            alt={content.image_alt}
            className="h-full max-h-[520px] min-h-64 w-full object-cover"
          />
        </div>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="rounded-[1.25rem] border border-[#0b6f78]/15 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b6f78]">Instagram</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-lg font-semibold text-[#111226] transition hover:text-[#0b6f78]"
          >
            @charmejoiass
          </a>
        </article>

        <article className="rounded-[1.25rem] border border-[#0b6f78]/15 bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0b6f78]">WhatsApp</p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block text-lg font-semibold text-[#111226] transition hover:text-[#0b6f78]"
          >
            (48) 98800-6788
          </a>
        </article>
      </div>
    </section>
  )
}

export default About
