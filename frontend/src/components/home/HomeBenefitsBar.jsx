const benefitItems = [
  { title: 'Entrega segura', subtitle: 'Frete calculado no checkout' },
  { title: 'Compra segura', subtitle: 'Seus dados protegidos' },
  { title: 'Qualidade premium', subtitle: 'Semijoias selecionadas' },
]

function HomeBenefitsBar() {
  return (
    <section className="border-y border-[#0b6f78]/10 bg-white">
      <div className="mx-auto grid max-w-7xl gap-0 divide-y divide-[#0b6f78]/10 px-4 py-3 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-5 lg:px-8">
        {benefitItems.map((item) => (
          <div key={item.title} className="flex min-w-0 items-center gap-3 py-3 sm:justify-center sm:px-4 lg:gap-4 lg:px-6">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8a84f]/45 text-[#0b6f78] lg:h-10 lg:w-10">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-[1.6] lg:h-5 lg:w-5">
                <path d="M12 3 14.4 9.6 21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#062f35] sm:text-[12px] lg:text-sm lg:tracking-[0.12em]">{item.title}</p>
              <p className="mt-1 text-xs leading-5 text-[#111226]/65 lg:text-sm">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HomeBenefitsBar
