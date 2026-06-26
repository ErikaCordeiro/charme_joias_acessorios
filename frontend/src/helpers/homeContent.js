export const defaultHomeContent = {
  eyebrow: 'Charme Joias',
  title: 'Elegancia em cada detalhe.',
  body_primary:
    'A Charme seleciona semijoias e acessorios femininos para mulheres que valorizam delicadeza, brilho e personalidade no dia a dia.',
  body_secondary:
    'Cada peca e escolhida com olhar cuidadoso para presentear, celebrar e transformar momentos simples em lembrancas especiais.',
  cta_label: 'Conheca a Charme',
  cta_url: '/about',
  image_url: '/mockup/about.png',
  image_alt: 'Mulher usando joias delicadas da Charme',
}

export const mapHomeContentToForm = (content = {}) => ({
  eyebrow: content.eyebrow || defaultHomeContent.eyebrow,
  title: content.title || defaultHomeContent.title,
  body_primary: content.body_primary || defaultHomeContent.body_primary,
  body_secondary: content.body_secondary || defaultHomeContent.body_secondary,
  cta_label: content.cta_label || defaultHomeContent.cta_label,
  cta_url: content.cta_url || defaultHomeContent.cta_url,
  image_url: content.image_url || defaultHomeContent.image_url,
  image_alt: content.image_alt || defaultHomeContent.image_alt,
})

export const buildHomeContentPayload = (form) => ({
  eyebrow: form.eyebrow.trim() || null,
  title: form.title.trim(),
  body_primary: form.body_primary.trim() || null,
  body_secondary: form.body_secondary.trim() || null,
  cta_label: form.cta_label.trim() || null,
  cta_url: form.cta_url.trim() || null,
  image_url: form.image_url.trim() || null,
  image_alt: form.image_alt.trim() || null,
})
