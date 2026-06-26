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

export const defaultAboutContent = {
  eyebrow: 'Sobre a marca',
  title: 'Charme Joias e Acessorios',
  body_primary:
    'A Charme nasceu para valorizar a beleza de cada mulher atraves de pecas delicadas, modernas e cheias de personalidade.',
  body_secondary:
    'Nosso atendimento combina curadoria feminina, cuidado em cada detalhe e semijoias selecionadas para momentos especiais e para o dia a dia.',
  cta_label: 'Ver produtos',
  cta_url: '/products',
  image_url: '/products/charme/conjunto-coracao-dourado.jpeg',
  image_alt: 'Selecao de joias douradas Charme',
}

export const mapSiteContentToForm = (content = {}, fallback = defaultHomeContent) => ({
  eyebrow: content.eyebrow || fallback.eyebrow,
  title: content.title || fallback.title,
  body_primary: content.body_primary || fallback.body_primary,
  body_secondary: content.body_secondary || fallback.body_secondary,
  cta_label: content.cta_label || fallback.cta_label,
  cta_url: content.cta_url || fallback.cta_url,
  image_url: content.image_url || fallback.image_url,
  image_alt: content.image_alt || fallback.image_alt,
})

export const mapHomeContentToForm = (content = {}) => mapSiteContentToForm(content, defaultHomeContent)
export const mapAboutContentToForm = (content = {}) => mapSiteContentToForm(content, defaultAboutContent)

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
