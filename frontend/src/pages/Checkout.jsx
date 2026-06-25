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
        message: `CEP vÃ¡lido - ${addressData.city}/${addressData.state}`,
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
      <div className="rounded-3xl border border-[#0b6f78]/12 bg-white p-8 text-center text-[#111226]/75 shadow-soft">
        <h1 className="text-2xl font-semibold text-[#062f35]">Entre na sua conta para finalizar o pedido</h1>
        <p className="mt-3 text-[#111226]/60">O checkout precisa da autenticacao para concluir pagamento e entrega.</p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-6 rounded-full bg-[#d8a84f] px-6 py-3 text-sm font-semibold text-[#062f35] transition hover:bg-[#efc66b]"
        >
          Entrar
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-[#0b6f78]/12 bg-white p-8 text-center text-[#111226]/70 shadow-soft">
        Carregando checkout...
      </div>
    )
  }

  if (orderSuccess) {
    return (
      <section className="mx-auto max-w-3xl rounded-3xl border border-[#0b6f78]/12 bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-semibold text-[#062f35]">Pedido confirmado</h1>
        <p className="mt-3 text-[#111226]/70">
          Pedido <span className="font-semibold text-[#062f35]">#{orderSuccess.orderId}</span> gerado com sucesso.
        </p>
        <div className="mt-6 grid gap-3 rounded-2xl border border-[#0b6f78]/12 bg-[#fbf8f1] p-5 text-sm text-[#111226]/70 sm:grid-cols-2">
          <p>Pagamento: <span className="font-semibold text-[#062f35]">{orderSuccess.paymentMethodTitle}</span></p>
          <p>Status: <span className="font-semibold text-[#062f35]">{orderSuccess.paymentStatusTitle}</span></p>
          <p>Banco: <span className="font-semibold text-[#062f35]">{orderSuccess.paymentProvider}</span></p>
          <p>Transacao: <span className="font-semibold text-[#062f35]">{orderSuccess.transactionId}</span></p>
          {orderSuccess.maskedCard && (
            <p>Cartao: <span className="font-semibold text-[#062f35]">{orderSuccess.maskedCard}</span></p>
          )}
          {orderSuccess.settlementDays > 0 && (
            <p>Compensacao: <span className="font-semibold text-[#062f35]">ate {orderSuccess.settlementDays} dias uteis</span></p>
          )}
          <p>Frete: <span className="font-semibold text-[#062f35]">{formatPrice(orderSuccess.shippingTotal)}</span></p>
          <p className="sm:col-span-2">Total pago: <span className="font-semibold text-[#062f35]">{formatPrice(orderSuccess.total)}</span></p>
          <p className="sm:col-span-2 text-[#111226]/60">{orderSuccess.paymentMessage}</p>
          {orderSuccess.pixCode && (
            <p className="sm:col-span-2 break-all text-[#111226]/70">PIX copia e cola: {orderSuccess.pixCode}</p>
          )}
          {orderSuccess.boletoCode && (
            <p className="sm:col-span-2 break-all text-[#111226]/70">Codigo do boleto: {orderSuccess.boletoCode}</p>
          )}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/profile"
            className="rounded-full bg-[#d8a84f] px-6 py-3 text-sm font-semibold text-[#062f35] transition hover:bg-[#efc66b]"
          >
            Ver meus pedidos
          </Link>
          <Link
            to="/products"
            className="rounded-full border border-[#0b6f78]/20 bg-white px-6 py-3 text-sm font-semibold text-[#111226]/75 transition hover:border-[#d8a84f] hover:text-[#062f35]"
          >
            Continuar comprando
          </Link>
        </div>
      </section>
    )
  }

  if (hasEmptyCart) {
    return (
      <div className="rounded-3xl border border-[#0b6f78]/12 bg-white p-8 text-center text-[#111226]/75 shadow-soft">
        <h1 className="text-2xl font-semibold text-[#062f35]">Seu carrinho esta vazio</h1>
        <p className="mt-3 text-[#111226]/60">Adicione produtos antes de iniciar o checkout.</p>
        <button
          type="button"
          onClick={() => navigate('/products')}
          className="mt-6 rounded-full bg-[#d8a84f] px-6 py-3 text-sm font-semibold text-[#062f35] transition hover:bg-[#efc66b]"
        >
          Ver produtos
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-[#0b6f78]/12 bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-semibold text-[#062f35]">Finalizar pedido</h1>
        <p className="mt-2 text-[#111226]/60">Revise itens, calcule frete por CEP e escolha o pagamento.</p>
      </div>

      {error && (
        <div className="rounded-3xl border border-red-500/30 bg-red-950/40 p-4 text-sm text-red-200">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <section className="rounded-3xl border border-[#0b6f78]/12 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-[#062f35]">Itens do pedido</h2>
            <div className="mt-5 space-y-3">
              {cart.items.map((item) => (
                <CheckoutItemRow key={item.id} item={item} />
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-[#0b6f78]/12 bg-white p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-[#062f35]">Endereco de entrega</h2>
            <p className="mt-3 text-sm text-[#111226]/70">
              {formatFullAddress(user) || 'Complete seu endereco em Minha Conta para facilitar as proximas compras.'}
            </p>
            {!formatFullAddress(user) && (
              <Link
                to="/profile"
                className="mt-4 inline-flex rounded-full border border-[#0b6f78]/20 bg-white px-5 py-2 text-sm font-semibold text-[#111226]/75 transition hover:border-[#d8a84f] hover:text-[#062f35]"
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
            onPaymentMethodChange={handlePaymentMethodChange}
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
