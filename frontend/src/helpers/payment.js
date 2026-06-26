const onlyDigits = (value) => (value || '').replace(/\D/g, '')

export const paymentMethods = [
  {
    id: 'pix',
    title: 'Pix',
    description: 'Pagamento registrado no ambiente de testes da Charme Joias.',
  },
  {
    id: 'boleto',
    title: 'Boleto bancario',
    description: 'Geracao de boleto em ambiente de testes.',
  },
]

export const defaultPaymentForm = {
}

export const validatePaymentForm = (paymentMethod, paymentForm) => {
  void paymentForm

  const enabledMethods = paymentMethods.map((method) => method.id)
  if (!enabledMethods.includes(paymentMethod)) {
    return 'Forma de pagamento indisponivel.'
  }

  return ''
}

export const buildPaymentPayload = (paymentMethod, paymentForm, shippingCep, shippingCarrier = '') => {
  void paymentForm

  const enabledMethods = paymentMethods.map((method) => method.id)
  if (!enabledMethods.includes(paymentMethod)) {
    throw new Error('Forma de pagamento indisponivel.')
  }

  return {
    payment: {
      method: paymentMethod,
    },
    shipping_cep: onlyDigits(shippingCep),
    shipping_carrier: shippingCarrier || null,
  }
}
