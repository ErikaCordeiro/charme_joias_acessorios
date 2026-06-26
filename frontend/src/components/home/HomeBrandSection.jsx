import { Link } from 'react-router-dom'

import { defaultHomeContent } from '../../helpers/homeContent'

function HomeBrandSection({ content = defaultHomeContent }) {
  const homeContent = { ...defaultHomeContent, ...content }

  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
        <div className="space-y-5">
          {homeContent.eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8a84f]">{homeContent.eyebrow}</p>
          )}
          <h2 className="font-serif text-3xl font-semibold leading-tight text-[#062f35] sm:text-4xl">
            {homeContent.title}
          </h2>
          <div className="space-y-4 text-sm leading-7 text-[#111226]/70 sm:text-base">
            {homeContent.body_primary && <p>{homeContent.body_primary}</p>}
            {homeContent.body_secondary && <p>{homeContent.body_secondary}</p>}
          </div>
          {homeContent.cta_label && homeContent.cta_url && (
            <Link
              to={homeContent.cta_url}
              className="inline-flex border-b border-[#d8a84f] pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#062f35] transition hover:text-[#0b6f78]"
            >
              {homeContent.cta_label}
            </Link>
          )}
        </div>

        <div className="overflow-hidden bg-[#fbf8f1]">
          <img
            src={homeContent.image_url}
            alt={homeContent.image_alt || homeContent.title}
            className="h-[320px] w-full object-cover sm:h-[420px]"
          />
        </div>
      </div>
    </section>
  )
}

export default HomeBrandSection
