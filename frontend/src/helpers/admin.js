export const emptyProductForm = {
  name: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  image_url: '',
}

export const mapProductToForm = (product) => ({
  name: product.name || '',
  description: product.description || '',
  category: product.category || '',
  price: String(product.price ?? ''),
  stock: String(product.stock ?? ''),
  image_url: product.image_url || '',
})

export const buildProductPayload = (form) => ({
  name: form.name.trim(),
  description: form.description.trim(),
  category: form.category.trim(),
  price: Number(form.price),
  stock: Number(form.stock),
  image_url: form.image_url.trim() || null,
})
