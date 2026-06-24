import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import FeedbackToast from '../components/FeedbackToast'
import CartItemCard from '../components/cart/CartItemCard'
import { hydrateCartWithProducts } from '../helpers/cartHydration'
import { formatPrice } from '../helpers/price'
import { clearStoredToken, getStoredToken } from '../helpers/storage'
import api from '../services/api'

function Cart() {
  const token = getStoredToken()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [pendingItems, setPendingItems] = useState({})
  const navigate = useNavigate()

  const handleAuthError = useCallback(
    (statusCode) => {
      if (statusCode === 401 || statusCode === 403) {
        clearStoredToken()
        navigate('/login')
        return true
      }
      return false
    },
    [navigate]
  )

  const fetchCart = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await api.get('/cart')
      const hydratedCart = await hydrateCartWithProducts(response.data)
      setCart(hydratedCart)
    } catch (fetchError) {
      console.error('Erro ao buscar carrinho:', fetchError)
      const status = fetchError?.response?.status
      const serverMessage = fetchError?.response?.data?.detail
      if (handleAuthError(status)) {
        return
      }
      setError(serverMessage || 'Nao foi possivel carregar o carrinho no momento.')
    } finally {
      setLoading(false)
    }
  }, [handleAuthError])

  useEffect(() => {
    if (!token) {
      return
    }

    const timerId = window.setTimeout(() => {
      fetchCart()
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [fetchCart, token])

  useEffect(() => {
    if (!feedback) {
      return undefined
    }

    const timerId = setTimeout(() => {
      setFeedback(null)
    }, 2500)

    return () => clearTimeout(timerId)
  }, [feedback])

  const setItemPending = (itemId, isPending) => {
    setPendingItems((currentPending) => ({
      ...currentPending,
      [itemId]: isPending,
    }))
  }

  const updateItemQuantity = async (itemId, quantity) => {
    setError('')
    setItemPending(itemId, true)

    try {
      const response = await api.put(`/cart/items/${itemId}`, { quantity })
      const hydratedCart = await hydrateCartWithProducts(response.data)
      setCart(hydratedCart)
      setFeedback({
        type: 'success',
        title: 'Carrinho atualizado',
        message: 'Quantidade atualizada com sucesso.',
      })
    } catch (updateError) {
      console.error('Erro ao atualizar item do carrinho:', updateError)
      const status = updateError?.response?.status
      const serverMessage = updateError?.response?.data?.detail
      if (handleAuthError(status)) {
        return
      }

      const message = serverMessage || 'Nao foi possivel atualizar este item.'
      setError(message)
      setFeedback({
        type: 'error',
        title: 'Falha na atualizacao',
        message,
      })
    } finally {
      setItemPending(itemId, false)
    }
  }

  const removeItem = async (itemId) => {
    setError('')
    setItemPending(itemId, true)

    try {
      const response = await api.delete(`/cart/items/${itemId}`)
      const hydratedCart = await hydrateCartWithProducts(response.data)
      setCart(hydratedCart)
      setFeedback({
        type: 'success',
        title: 'Item removido',
        message: 'O produto foi removido do carrinho.',
      })
    } catch (removeError) {
      console.error('Erro ao remover item:', removeError)
      const status = removeError?.response?.status
      const serverMessage = removeError?.response?.data?.detail
      if (handleAuthError(status)) {
        return
      }

      const message = serverMessage || 'Erro ao remover o item do carrinho.'
      setError(message)
      setFeedback({
        type: 'error',
        title: 'Falha na remocao',
        message,
      })
    } finally {
      setItemPending(itemId, false)
    }
  }

  if (!token) {
    return (
      <div className="rounded-3xl border border-[#0b6f78]/12 bg-white p-8 text-center text-[#111226]/75 shadow-soft">
        <h1 className="text-2xl font-semibold text-[#062f35]">Faca login para ver o carrinho</h1>
        <p className="mt-3 text-[#111226]/60">Acesse sua conta para gerenciar itens e finalizar pedidos.</p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-6 rounded-full bg-[#d8a84f] px-6 py-3 text-sm font-semibold text-[#062f35] transition hover:bg-[#efc66b]"
        >
          Entrar na conta
        </button>
      </div>
    )
  }

  if (loading) {
    return <div className="rounded-3xl border border-[#0b6f78]/12 bg-white p-8 text-center text-[#111226]/70 shadow-soft">Carregando carrinho...</div>
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="rounded-3xl border border-[#0b6f78]/12 bg-white p-8 text-center text-[#111226]/75 shadow-soft">
        <h1 className="text-2xl font-semibold text-[#062f35]">Seu carrinho esta vazio</h1>
        <p className="mt-3 text-[#111226]/60">Adicione produtos na loja e eles aparecerao aqui.</p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mt-6 rounded-full bg-[#d8a84f] px-6 py-3 text-sm font-semibold text-[#062f35] transition hover:bg-[#efc66b]"
        >
          Ver Produtos
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-8">
      <div className="rounded-3xl border border-[#0b6f78]/12 bg-white p-6 shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[#062f35]">Carrinho</h1>
            <p className="mt-2 text-[#111226]/60">Edite quantidades, revise os itens e finalize seu pedido.</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-[0.24em] text-[#0b6f78]/60">Total</p>
            <p className="mt-1 text-2xl font-semibold text-[#062f35]">{formatPrice(cart.subtotal)}</p>
          </div>
        </div>
      </div>

      {error && <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">{error}</div>}

      <div className="space-y-4">
        {cart.items.map((item) => (
          <CartItemCard
            key={item.id}
            item={item}
            pending={Boolean(pendingItems[item.id])}
            onQuantityChange={(nextQuantity) => updateItemQuantity(item.id, nextQuantity)}
            onRemove={() => removeItem(item.id)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => navigate('/checkout')}
        className="rounded-full bg-[#d8a84f] px-6 py-3 text-sm font-semibold text-[#062f35] transition hover:bg-[#efc66b]"
      >
        Finalizar Pedido
      </button>

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

export default Cart
