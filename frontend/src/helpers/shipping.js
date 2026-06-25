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
