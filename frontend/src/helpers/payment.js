const onlyDigits = (value) => (value || '').replace(/\D/g, '')

export const paymentMethods = [
  {
    id: 'pix',
    title: 'Pix',
    description: 'Confirmacao imediata no ambiente de testes do Banco Lua Active.',
  },
  {
    id: 'credit_card',
    title: 'Cartao de credito',
    description: 'Aprovacao simulada pelo banco sandbox com cartao de teste.',
  },
  {
    id: 'boleto',
    title: 'Boleto bancario',
    description: 'Geracao automatica de boleto com compensacao simulada.',
  },
]

export const defaultPaymentForm = {
  card_holder: '',
  card_number: '',
  card_expiry: '',
  card_cvv: '',
  installments: 1,
}

export const formatCardNumber = (value) => {
  const digits = onlyDigits(value).slice(0, 19)
  return digits.replace(/(.{4})/g, '$1 ').trim()
}

export const formatCardExpiry = (value) => {
  const digits = onlyDigits(value).slice(0, 4)
  if (digits.length <= 2) {
    return digits
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export const formatCardCvv = (value) => onlyDigits(value).slice(0, 4)

export const validatePaymentForm = (paymentMethod, paymentForm) => {
  if (paymentMethod !== 'credit_card') {
    return ''
  }

  if (!paymentForm.card_holder.trim()) {
    return 'Informe o nome no cartao.'
  }

  const cardNumber = onlyDigits(paymentForm.card_number)
  if (cardNumber.length < 13 || cardNumber.length > 19) {
    return 'Informe um numero de cartao valido.'
  }

  const expiryDigits = onlyDigits(paymentForm.card_expiry)
  const month = Number(expiryDigits.slice(0, 2))
  if (expiryDigits.length !== 4 || Number.isNaN(month) || month < 1 || month > 12) {
    return 'Informe a validade no formato MM/AA.'
  }

  const cvvDigits = onlyDigits(paymentForm.card_cvv)
  if (cvvDigits.length < 3 || cvvDigits.length > 4) {
    return 'Informe um CVV valido.'
  }

  return ''
}

export const buildPaymentPayload = (paymentMethod, paymentForm, freightTotal) => {
  if (paymentMethod === 'credit_card') {
    return {
      payment: {
        method: paymentMethod,
        card_holder: paymentForm.card_holder.trim(),
        card_number: onlyDigits(paymentForm.card_number),
        card_expiry: formatCardExpiry(paymentForm.card_expiry),
        card_cvv: onlyDigits(paymentForm.card_cvv),
        installments: Number(paymentForm.installments) || 1,
      },
      freight_total: freightTotal,
    }
  }

  return {
    payment: {
      method: paymentMethod,
    },
    freight_total: freightTotal,
  }
}
