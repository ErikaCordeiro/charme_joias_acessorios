const benefitItems = [
  { title: 'Frete gratis', subtitle: 'Acima de R$299 para todo Brasil' },
  { title: 'Produtos premium', subtitle: 'Qualidade que voce sente' },
  { title: 'Compra segura', subtitle: 'Dados e pagamento protegidos' },
  { title: 'Atendimento', subtitle: 'Suporte rapido e humanizado' },
  { title: 'Parcele em 6x', subtitle: 'Sem juros no cartao' },
]

function HomeBenefitsBar() {
  return (
    <section className="border-y border-zinc-900 bg-black">
      <div className="mx-auto grid w-full max-w-[1600px] gap-px bg-zinc-900 px-4 lg:grid-cols-5 lg:px-10">
        {benefitItems.map((item) => (
          <div key={item.title} className="bg-black px-4 py-5">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-100">{item.title}</p>
            <p className="mt-1 text-sm text-zinc-400">{item.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HomeBenefitsBar
