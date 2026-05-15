export const normalizeCep = (value) => value.replace(/\D/g, '').slice(0, 8)

export const formatCep = (value) => {
  const digits = normalizeCep(value)
  if (digits.length <= 5) {
    return digits
  }
  return `${digits.slice(0, 5)}-${digits.slice(5)}`
}

export const estimateCartWeight = (items) => {
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)
  const estimatedWeight = totalUnits * 0.35
  return Number(estimatedWeight.toFixed(2))
}

export const paymentMethods = [
  {
    id: 'pix',
    title: 'Pix',
    description: 'Aprovacao imediata e confirmacao rapida do pedido.',
  },
  {
    id: 'credit_card',
    title: 'Cartao de credito',
    description: 'Parcelamento em ate 6x sem juros.',
  },
  {
    id: 'boleto',
    title: 'Boleto bancario',
    description: 'Compensacao em ate 2 dias uteis.',
  },
]
