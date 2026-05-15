import api from '../services/api'

export const hydrateCartWithProducts = async (cartData) => {
  if (!cartData?.items?.length) {
    return cartData
  }

  const missingProductIds = [
    ...new Set(
      cartData.items
        .filter((item) => !item.product)
        .map((item) => item.product_id)
    ),
  ]

  if (missingProductIds.length === 0) {
    return cartData
  }

  const products = await Promise.all(
    missingProductIds.map(async (productId) => {
      try {
        const response = await api.get(`/products/${productId}`)
        return response.data
      } catch (productError) {
        console.error(`Erro ao buscar produto ${productId} para o carrinho:`, productError)
        return null
      }
    })
  )

  const productMap = products
    .filter(Boolean)
    .reduce((accumulator, product) => {
      accumulator[product.id] = product
      return accumulator
    }, {})

  return {
    ...cartData,
    items: cartData.items.map((item) => {
      const product = item.product || productMap[item.product_id] || null
      const unitPrice = item.unit_price ?? product?.price ?? 0
      const lineTotal = item.line_total ?? unitPrice * item.quantity

      return {
        ...item,
        unit_price: unitPrice,
        line_total: lineTotal,
        product,
      }
    }),
  }
}
