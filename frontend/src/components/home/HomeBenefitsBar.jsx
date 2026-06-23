const benefitItems = [
  { title: 'Peças exclusivas', subtitle: 'Curadoria delicada e moderna' },
  { title: 'Semijoias premium', subtitle: 'Brilho para todos os momentos' },
  { title: 'Compra segura', subtitle: 'Dados e pagamento protegidos' },
  { title: 'Atendimento', subtitle: 'Pelo WhatsApp com carinho' },
  { title: 'Presente perfeito', subtitle: 'Escolhas para encantar' },
]

function HomeBenefitsBar() {
  return (
    <section className="border-y border-zinc-900 bg-black">
      <div className="mx-auto grid w-full max-w-[1600px] gap-px bg-zinc-900 px-4 py-8 lg:grid-cols-5 lg:px-10 lg:py-12">
        {benefitItems.map((item) => (
          <div key={item.title} className="bg-black px-4 py-6 sm:py-8">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-100 sm:text-base">{item.title}</p>
            <p className="mt-2 text-sm text-zinc-400 sm:mt-3 sm:text-base">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HomeBenefitsBar
