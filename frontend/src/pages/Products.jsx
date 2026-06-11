import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import FeedbackToast from '../components/FeedbackToast'
import { formatPrice } from '../helpers/price'
import { clearStoredToken, getStoredToken } from '../helpers/storage'
import api from '../services/api'

const placeholderImage = (title) => {
  const text = encodeURIComponent(title)
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 480'%3E%3Crect width='640' height='480' fill='%23fbf8f1'/%3E%3Ccircle cx='320' cy='190' r='96' fill='none' stroke='%230b6f78' stroke-width='3'/%3E%3Ctext x='50%25' y='54%25' dominant-baseline='middle' text-anchor='middle' fill='%23111226' font-family='Arial,Helvetica,sans-serif' font-size='32'%3E${text}%3C/text%3E%3Ctext x='50%25' y='68%25' dominant-baseline='middle' text-anchor='middle' fill='%230b6f78' font-family='Arial,Helvetica,sans-serif' font-size='20'%3ECharme Joias%3C/text%3E%3C/svg%3E`
}

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const searchTerm = searchParams.get('search')?.trim() || ''

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError('')

      try {
        const params = { size: 24 }
        if (searchTerm) {
          params.search = searchTerm
        }

        const response = await api.get('/products', { params })
        setProducts(response.data.products || [])
      } catch (fetchError) {
        console.error('Erro ao buscar produtos:', fetchError)
        setError('Nao foi possivel carregar os produtos. Tente novamente mais tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchTerm])

  useEffect(() => {
    if (!feedback) {
      return undefined
    }

    const timerId = setTimeout(() => {
      setFeedback(null)
    }, 2600)

    return () => clearTimeout(timerId)
  }, [feedback])

  const addToCart = async (productId) => {
    const token = getStoredToken()
    if (!token) {
      navigate('/login')
      return
    }

    try {
      await api.post('/cart/items', { product_id: productId, quantity: 1 })
      setFeedback({
        type: 'success',
        title: 'Tudo certo',
        message: 'Produto adicionado ao carrinho com sucesso.',
      })
    } catch (postError) {
      console.error('Erro ao adicionar ao carrinho:', postError)
      const status = postError?.response?.status
      const serverMessage = postError?.response?.data?.detail

      if (status === 401 || status === 403) {
        clearStoredToken()
        navigate('/login')
        return
      }

      setFeedback({
        type: 'error',
        title: 'Nao foi possivel adicionar',
        message: serverMessage || 'Erro ao adicionar produto ao carrinho.',
      })
    }
  }

  if (loading) {
    return <div className="rounded-3xl border border-[#0b6f78]/15 bg-white p-8 text-center text-[#111226]/70 shadow-soft">Carregando produtos...</div>
  }

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold text-[#111226]">Produtos</h1>
          <p className="mt-2 text-[#111226]/65">Selecione seus itens favoritos da Charme Joias Acessórios.</p>
          {searchTerm && (
            <p className="mt-1 text-sm text-zinc-500">Busca: "{searchTerm}"</p>
          )}
        </div>
      </div>

      {error && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">{error}</div>}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <article key={product.id} className="rounded-3xl border border-[#0b6f78]/15 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-[#0b6f78]/50">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-black/80">
                <img
                  src={product.image_url || placeholderImage(product.name)}
                  alt={product.name}
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = placeholderImage(product.name)
                  }}
                  className="h-56 w-full object-contain bg-black p-2"
                />
              </div>
              <div className="flex items-center justify-between gap-3 text-zinc-400">
                <span className="rounded-full bg-[#0b6f78]/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#0b6f78]">Estoque {product.stock}</span>
                <span className="text-sm font-semibold text-[#111226]">{formatPrice(product.price)}</span>
              </div>
              <h2 className="text-xl font-semibold text-[#111226]">{product.name}</h2>
              <p className="text-sm leading-6 text-[#111226]/65">{product.description}</p>
              <button
                type="button"
                onClick={() => addToCart(product.id)}
                className="w-full rounded-full bg-[#0b6f78] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#095a62]"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </article>
        ))}
      </div>

      {feedback && (
        <FeedbackToast
          type={feedback.type}
          title={feedback.title}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}
    </section>
  )
}

export default Products
