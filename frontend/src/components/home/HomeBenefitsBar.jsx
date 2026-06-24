const benefitItems = [
  { title: 'Frete gratis', subtitle: 'Acima de R$ 699' },
  { title: 'Compra segura', subtitle: 'Seus dados protegidos' },
  { title: 'Qualidade premium', subtitle: 'Semijoias selecionadas' },
]

function HomeBenefitsBar() {
  return (
    <section className="border-y border-[#0b6f78]/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-0 divide-y divide-[#0b6f78]/10 px-4 py-5 sm:px-6 md:grid-cols-3 md:divide-x md:divide-y-0 lg:px-8">
        {benefitItems.map((item) => (
          <div key={item.title} className="flex items-center gap-4 py-4 md:justify-center md:px-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d8a84f]/45 text-[#0b6f78]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.6]">
                <path d="M12 3 14.4 9.6 21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#062f35]">{item.title}</p>
              <p className="mt-1 text-sm text-[#111226]/65">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HomeBenefitsBar
