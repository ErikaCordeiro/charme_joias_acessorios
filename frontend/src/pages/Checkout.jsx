import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import CheckoutItemRow from '../components/checkout/CheckoutItemRow'
import CheckoutPaymentCard from '../components/checkout/CheckoutPaymentCard'
import CheckoutShippingCard from '../components/checkout/CheckoutShippingCard'
import CheckoutSummaryCard from '../components/checkout/CheckoutSummaryCard'
import FeedbackToast from '../components/FeedbackToast'
import { useViaCep } from '../hooks/useViaCep'
import { hydrateCartWithProducts } from '../helpers/cartHydration'
import {
  buildPaymentPayload,
  defaultPaymentForm,
  formatCardCvv,
  formatCardExpiry,
  formatCardNumber,
  paymentMethods,
  validatePaymentForm,
} from '../helpers/payment'
import { formatPrice } from '../helpers/price'
import { estimateCartWeight, formatCep, normalizeCep } from '../helpers/shipping'
import { clearStoredToken, getStoredToken } from '../helpers/storage'
import { formatFullAddress } from '../helpers/userProfile'
import api from '../services/api'

const getPaymentMethodTitle = (paymentMethodId) =>
  paymentMethods.find((method) => method.id === paymentMethodId)?.title || paymentMethodId

const getPaymentStatusTitle = (paymentStatus) => {
  if (paymentStatus === 'approved') {
    return 'Aprovado'
  }
  if (paymentStatus === 'pending') {
    return 'Pendente'
  }
  return 'Recusado'
}

function Checkout() {
  const token = getStoredToken()
  const navigate = useNavigate()
  const { searchCep: searchViaCep } = useViaCep()

  const [cart, setCart] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState(null)

  const [cep, setCep] = useState('')
  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState('')
  const [shippingQuote, setShippingQuote] = useState(null)

  const [paymentMethod, setPaymentMethod] = useState('pix')
  const [paymentForm, setPaymentForm] = useState({ ...defaultPaymentForm })
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  const subtotal = cart?.subtotal ?? 0
  const freightTotal = shippingQuote?.total_freight ?? 0
  const total = subtotal + freightTotal

  const canPlaceOrder = Boolean(
    cart?.items?.length && shippingQuote && !placingOrder && !shippingLoading
  )

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

  const fetchCheckoutData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [cartResponse, userResponse] = await Promise.all([
        api.get('/cart'),
        api.get('/auth/me'),
      ])

      const hydratedCart = await hydrateCartWithProducts(cartResponse.data)
      setCart(hydratedCart)
      setUser(userResponse.data)
      setPaymentForm((currentForm) => ({
        ...currentForm,
        card_holder: currentForm.card_holder || userResponse.data?.full_name || '',
      }))

      const userCep = userResponse.data?.zip_code
      if (userCep) {
        setCep(formatCep(userCep))
      }
    } catch (fetchError) {
      console.error('Erro ao carregar checkout:', fetchError)
      const status = fetchError?.response?.status
      const serverMessage = fetchError?.response?.data?.detail
      if (handleAuthError(status)) {
        return
      }
      setError(serverMessage || 'Nao foi possivel carregar os dados para finalizar o pedido.')
    } finally {
      setLoading(false)
    }
  }, [handleAuthError])

  useEffect(() => {
    if (!token) {
      return
    }

    const timerId = window.setTimeout(() => {
      fetchCheckoutData()
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [fetchCheckoutData, token])

  useEffect(() => {
    if (!feedback) {
      return undefined
    }

    const timerId = setTimeout(() => {
      setFeedback(null)
    }, 2600)

    return () => clearTimeout(timerId)
  }, [feedback])

  const handlePaymentMethodChange = (nextMethod) => {
    setPaymentMethod(nextMethod)
    setError('')
  }

  const handlePaymentFieldChange = (field, value) => {
    setPaymentForm((currentForm) => {
      if (field === 'card_number') {
        return { ...currentForm, card_number: formatCardNumber(value) }
      }
      if (field === 'card_expiry') {
        return { ...currentForm, card_expiry: formatCardExpiry(value) }
      }
      if (field === 'card_cvv') {
        return { ...currentForm, card_cvv: formatCardCvv(value) }
      }
      if (field === 'installments') {
        return { ...currentForm, installments: Number(value) || 1 }
      }
      return { ...currentForm, [field]: value }
    })
  }

  const handleCepBlur = useCallback(async () => {
    const normalizedCep = normalizeCep(cep)
    if (normalizedCep.length !== 8) {
      return
    }

    const addressData = await searchViaCep(normalizedCep)
    if (addressData) {
      // CEP address lookup was successful
      // The address info can be used if needed, but the actual address filling
      // is done by the backend when the order is placed
      setFeedback({
        type: 'success',
        title: 'CEP validado',
        message: `CEP válido - ${addressData.city}/${addressData.state}`,
      })
    }
  }, [cep, searchViaCep])

  const handleCalculateShipping = async () => {
    if (!cart?.items?.length) {
      setShippingError('Seu carrinho esta vazio.')
      return
    }

    const normalizedCep = normalizeCep(cep)
    if (normalizedCep.length !== 8) {
      setShippingError('Informe um CEP valido com 8 digitos.')
      return
    }

    setShippingLoading(true)
    setShippingError('')
    setShippingQuote(null)

    try {
      const weight = estimateCartWeight(cart.items)
      const response = await api.post('/frete/calcular', {
        cep: normalizedCep,
        weight,
        value: subtotal,
      })

      setShippingQuote(response.data)
      setCep(formatCep(normalizedCep))
      setFeedback({
        type: 'success',
        title: 'Frete calculado',
        message: 'Frete atualizado com sucesso para este CEP.',
      })
    } catch (shippingFetchError) {
      console.error('Erro ao calcular frete:', shippingFetchError)
      const serverMessage = shippingFetchError?.response?.data?.detail
      setShippingError(serverMessage || 'Nao foi possivel calcular o frete para este CEP.')
    } finally {
      setShippingLoading(false)
    }
  }

  const handlePlaceOrder = async () => {
    if (!canPlaceOrder) {
      return
    }

    const paymentValidationError = validatePaymentForm(paymentMethod, paymentForm)
    if (paymentValidationError) {
      setError(paymentValidationError)
      setFeedback({
        type: 'error',
        title: 'Pagamento invalido',
        message: paymentValidationError,
      })
      return
    }

    setPlacingOrder(true)
    setError('')

    try {
      const payload = buildPaymentPayload(paymentMethod, paymentForm, cep)
      const response = await api.post('/orders/', payload)
      const createdOrder = response.data.order
      const paymentResult = response.data.payment

      setOrderSuccess({
        orderId: createdOrder.id,
        paymentMethodTitle: getPaymentMethodTitle(paymentMethod),
        paymentStatusTitle: getPaymentStatusTitle(paymentResult.status),
        paymentProvider: paymentResult.provider,
        transactionId: paymentResult.transaction_id,
        paymentMessage: paymentResult.message,
        pixCode: paymentResult.pix_copy_paste || '',
        boletoCode: paymentResult.boleto_code || '',
        maskedCard: paymentResult.masked_card || '',
        settlementDays: paymentResult.estimated_settlement_days,
        shippingTotal: createdOrder.freight_total,
        total: createdOrder.total,
      })

      setCart((currentCart) => ({
        ...currentCart,
        items: [],
        subtotal: 0,
      }))
      setShippingQuote(null)
      setShippingError('')

      setFeedback({
        type: 'success',
        title: 'Pagamento processado',
        message: `Pedido #${createdOrder.id} criado com status ${getPaymentStatusTitle(paymentResult.status)}.`,
      })
    } catch (orderError) {
      console.error('Erro ao finalizar pedido:', orderError)
      const status = orderError?.response?.status
      const serverMessage = orderError?.response?.data?.detail
      if (handleAuthError(status)) {
        return
      }

      setError(serverMessage || 'Nao foi possivel finalizar o pedido. Tente novamente.')
      setFeedback({
        type: 'error',
        title: 'Falha no pedido',
        message: serverMessage || 'Nao foi possivel finalizar o pedido.',
      })
    } finally {
      setPlacingOrder(false)
    }
  }

  const hasEmptyCart = useMemo(
    () => !loading && (!cart || cart.items.length === 0) && !orderSuccess,
    [cart, loading, orderSuccess]
  )

  if (!token) {
    return (
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-8 text-center text-zinc-200 shadow-soft">
        <h1 className="text-2xl font-semibold text-white">Entre na sua conta para finalizar o pedido</h1>
        <p className="mt-3 text-zinc-400">O checkout precisa da autenticacao para concluir pagamento e entrega.</p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-6 rounded-full bg-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
        >
          Entrar
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-8 text-center text-zinc-300 shadow-soft">
        Carregando checkout...
      </div>
    )
  }

  if (orderSuccess) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-zinc-900 bg-zinc-950/70 p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Pedido confirmado</h1>
        <p className="mt-3 text-zinc-300">
          Pedido <span className="font-semibold text-white">#{orderSuccess.orderId}</span> gerado com sucesso.
        </p>
        <div className="mt-6 grid gap-3 rounded-2xl border border-zinc-800 bg-black/70 p-5 text-sm text-zinc-300 sm:grid-cols-2">
          <p>Pagamento: <span className="font-semibold text-zinc-100">{orderSuccess.paymentMethodTitle}</span></p>
          <p>Status: <span className="font-semibold text-zinc-100">{orderSuccess.paymentStatusTitle}</span></p>
          <p>Banco: <span className="font-semibold text-zinc-100">{orderSuccess.paymentProvider}</span></p>
          <p>Transacao: <span className="font-semibold text-zinc-100">{orderSuccess.transactionId}</span></p>
          {orderSuccess.maskedCard && (
            <p>Cartao: <span className="font-semibold text-zinc-100">{orderSuccess.maskedCard}</span></p>
          )}
          {orderSuccess.settlementDays > 0 && (
            <p>Compensacao: <span className="font-semibold text-zinc-100">ate {orderSuccess.settlementDays} dias uteis</span></p>
          )}
          <p>Frete: <span className="font-semibold text-zinc-100">{formatPrice(orderSuccess.shippingTotal)}</span></p>
          <p className="sm:col-span-2">Total pago: <span className="font-semibold text-zinc-100">{formatPrice(orderSuccess.total)}</span></p>
          <p className="sm:col-span-2 text-zinc-400">{orderSuccess.paymentMessage}</p>
          {orderSuccess.pixCode && (
            <p className="sm:col-span-2 break-all text-zinc-300">PIX copia e cola: {orderSuccess.pixCode}</p>
          )}
          {orderSuccess.boletoCode && (
            <p className="sm:col-span-2 break-all text-zinc-300">Codigo do boleto: {orderSuccess.boletoCode}</p>
          )}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/profile"
            className="rounded-full bg-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
          >
            Ver meus pedidos
          </Link>
          <Link
            to="/products"
            className="rounded-full border border-zinc-700 bg-zinc-900 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
          >
            Continuar comprando
          </Link>
        </div>
      </section>
    )
  }

  if (hasEmptyCart) {
    return (
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-8 text-center text-zinc-200 shadow-soft">
        <h1 className="text-2xl font-semibold text-white">Seu carrinho esta vazio</h1>
        <p className="mt-3 text-zinc-400">Adicione produtos antes de iniciar o checkout.</p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mt-6 rounded-full bg-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
        >
          Ver produtos
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-6 shadow-soft">
        <h1 className="text-3xl font-semibold text-white">Finalizar pedido</h1>
        <p className="mt-2 text-zinc-400">Revise itens, calcule frete por CEP e escolha o pagamento.</p>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Itens do pedido</h2>
            <div className="mt-5 space-y-3">
              {cart.items.map((item) => (
                <CheckoutItemRow key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-900 bg-zinc-950/70 p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-white">Endereco de entrega</h2>
            <p className="mt-3 text-sm text-zinc-300">
              {formatFullAddress(user) || 'Complete seu endereco em Minha Conta para facilitar as proximas compras.'}
            </p>
            {!formatFullAddress(user) && (
              <Link
                to="/profile"
                className="mt-4 inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-5 py-2 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:text-white"
              >
                Atualizar endereco
              </Link>
            )}
          </section>

          <CheckoutShippingCard
            cep={cep}
            onCepChange={(value) => setCep(formatCep(value))}
            onCepBlur={handleCepBlur}
            onCalculateShipping={handleCalculateShipping}
            loading={shippingLoading}
            shippingQuote={shippingQuote}
            shippingError={shippingError}
            disabled={placingOrder}
          />
        </div>

        <div className="space-y-6">
          <CheckoutPaymentCard
            paymentMethod={paymentMethod}
            paymentForm={paymentForm}
            onPaymentMethodChange={handlePaymentMethodChange}
            onPaymentFieldChange={handlePaymentFieldChange}
          />

          <CheckoutSummaryCard
            subtotal={subtotal}
            freightTotal={freightTotal}
            total={total}
            placingOrder={placingOrder}
            canPlaceOrder={canPlaceOrder}
            onPlaceOrder={handlePlaceOrder}
          />
        </div>
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

export default Checkout
