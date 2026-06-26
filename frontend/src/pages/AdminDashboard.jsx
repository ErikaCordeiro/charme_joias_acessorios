import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminAbandonedCartsTable from '../components/admin/AdminAbandonedCartsTable'
import AdminCustomersTable from '../components/admin/AdminCustomersTable'
import AdminHomeContentForm from '../components/admin/AdminHomeContentForm'
import AdminMetricCard from '../components/admin/AdminMetricCard'
import AdminOrdersTable from '../components/admin/AdminOrdersTable'
import AdminPaymentSettings from '../components/admin/AdminPaymentSettings'
import AdminProductForm from '../components/admin/AdminProductForm'
import AdminProductsTable from '../components/admin/AdminProductsTable'
import AdminShippingSettings from '../components/admin/AdminShippingSettings'
import { buildProductPayload, emptyProductForm, mapProductToForm } from '../helpers/admin'
import {
  buildHomeContentPayload,
  defaultAboutContent,
  defaultHomeContent,
  mapAboutContentToForm,
  mapHomeContentToForm,
} from '../helpers/homeContent'
import { formatPrice } from '../helpers/price'
import { clearStoredToken, getStoredToken } from '../helpers/storage'
import api from '../services/api'

const adminSections = ['Dashboard', 'Conteudo Home', 'Sobre Nos', 'Produtos', 'Frete', 'Pagamento', 'Pedidos', 'Clientes', 'Carrinhos', 'Relatorios']
const adminSectionIds = {
  Dashboard: 'dashboard',
  'Conteudo Home': 'conteudo-home',
  'Sobre Nos': 'sobre-nos',
  Produtos: 'produtos',
  Frete: 'frete',
  Pagamento: 'pagamento',
  Pedidos: 'pedidos',
  Clientes: 'clientes',
  Carrinhos: 'carrinhos',
  Relatorios: 'relatorios',
}

const emptyCarrier = {
  name: '',
  region: 'Sudeste',
  base_freight: '0',
  price_per_kg: '0',
  value_rate: '0',
  estimated_days: '5',
  active: true,
}

const defaultPaymentSettings = {
  provider: 'manual',
  pix_enabled: true,
  boleto_enabled: false,
  pix_key: '',
  recipient_name: 'Charme Joias e Acessorios',
  bank_name: '',
  instructions: '',
}

function AdminDashboard() {
  const token = getStoredToken()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(Boolean(token))
  const [savingProduct, setSavingProduct] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [savingHomeContent, setSavingHomeContent] = useState(false)
  const [savingAboutContent, setSavingAboutContent] = useState(false)
  const [savingCarrier, setSavingCarrier] = useState(false)
  const [savingPayment, setSavingPayment] = useState(false)
  const [uploadingHomeImage, setUploadingHomeImage] = useState(false)
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [metrics, setMetrics] = useState(null)
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [abandonedCarts, setAbandonedCarts] = useState([])
  const [products, setProducts] = useState([])
  const [shippingCarriers, setShippingCarriers] = useState([])

  const [productForm, setProductForm] = useState({ ...emptyProductForm })
  const [editingProductId, setEditingProductId] = useState(null)
  const [shippingCarrierForm, setShippingCarrierForm] = useState({ ...emptyCarrier })
  const [editingCarrierId, setEditingCarrierId] = useState(null)
  const [paymentSettingsForm, setPaymentSettingsForm] = useState({ ...defaultPaymentSettings })
  const [homeContentForm, setHomeContentForm] = useState({ ...defaultHomeContent })
  const [aboutContentForm, setAboutContentForm] = useState({ ...defaultAboutContent })

  const loadAdminData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [
        dashboardRes,
        customersRes,
        ordersRes,
        abandonedRes,
        productsRes,
        homeContentRes,
        aboutContentRes,
        shippingRes,
        paymentRes,
      ] = await Promise.allSettled([
        api.get('/admin/dashboard'),
        api.get('/admin/customers', { params: { limit: 300 } }),
        api.get('/admin/orders', { params: { limit: 300 } }),
        api.get('/admin/abandoned-carts', { params: { limit: 300 } }),
        api.get('/products', { params: { page: 1, size: 100 } }),
        api.get('/admin/home-content'),
        api.get('/admin/about-content'),
        api.get('/admin/shipping-carriers'),
        api.get('/admin/payment-settings'),
      ])

      const failedRequests = [
        dashboardRes,
        customersRes,
        ordersRes,
        abandonedRes,
        productsRes,
        homeContentRes,
        aboutContentRes,
        shippingRes,
        paymentRes,
      ]
        .filter((result) => result.status === 'rejected')
      const authError = failedRequests.find((result) => [401, 403].includes(result.reason?.response?.status))

      if (authError?.reason?.response?.status === 401) {
        clearStoredToken()
        navigate('/login')
        return
      }

      if (authError?.reason?.response?.status === 403) {
        setError('Sua conta nao tem permissao para acessar a dashboard admin.')
        return
      }

      if (dashboardRes.status === 'fulfilled') {
        setMetrics(dashboardRes.value.data.metrics)
      }
      if (customersRes.status === 'fulfilled') {
        setCustomers(customersRes.value.data)
      }
      if (ordersRes.status === 'fulfilled') {
        setOrders(ordersRes.value.data)
      }
      if (abandonedRes.status === 'fulfilled') {
        setAbandonedCarts(abandonedRes.value.data)
      }
      if (productsRes.status === 'fulfilled') {
        setProducts(productsRes.value.data.products || [])
      }
      if (homeContentRes.status === 'fulfilled') {
        setHomeContentForm(mapHomeContentToForm(homeContentRes.value.data))
      }
      if (aboutContentRes.status === 'fulfilled') {
        setAboutContentForm(mapAboutContentToForm(aboutContentRes.value.data))
      }
      if (shippingRes.status === 'fulfilled') {
        setShippingCarriers(shippingRes.value.data || [])
      }
      if (paymentRes.status === 'fulfilled') {
        setPaymentSettingsForm({ ...defaultPaymentSettings, ...paymentRes.value.data })
      }

      const visibleFailures = failedRequests.filter((result) => result.reason?.response?.status !== 404)
      if (visibleFailures.length > 0) {
        setError('Algumas informacoes do painel nao carregaram. Clique em Atualizar ou verifique os logs da API no Render.')
      }
    } catch (loadError) {
      console.error('Erro ao carregar dashboard admin:', loadError)
      const status = loadError?.response?.status
      const serverMessage = loadError?.response?.data?.detail

      if (status === 401) {
        clearStoredToken()
        navigate('/login')
        return
      }

      if (status === 403) {
        setError('Sua conta nao tem permissao para acessar a dashboard admin.')
        return
      }

      setError(serverMessage || 'Nao foi possivel carregar a dashboard admin.')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    const loadTimer = window.setTimeout(() => {
      void loadAdminData()
    }, 0)
    return () => window.clearTimeout(loadTimer)
  }, [loadAdminData, navigate, token])

  useEffect(() => {
    if (!success) {
      return undefined
    }
    const timer = setTimeout(() => setSuccess(''), 2500)
    return () => clearTimeout(timer)
  }, [success])

  const handleProductFieldChange = (field, value) => {
    setProductForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const resetProductForm = () => {
    setEditingProductId(null)
    setProductForm({ ...emptyProductForm })
  }

  const resetShippingCarrierForm = () => {
    setEditingCarrierId(null)
    setShippingCarrierForm({ ...emptyCarrier })
  }

  const handleAdminSectionClick = (section) => {
    const target = document.getElementById(adminSectionIds[section])
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleHomeContentFieldChange = (field, value) => {
    setHomeContentForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const handleAboutContentFieldChange = (field, value) => {
    setAboutContentForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const handleShippingCarrierFieldChange = (field, value) => {
    setShippingCarrierForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const handlePaymentSettingsFieldChange = (field, value) => {
    setPaymentSettingsForm((currentForm) => ({ ...currentForm, [field]: value }))
  }

  const handleSubmitHomeContent = async () => {
    setSavingHomeContent(true)
    setError('')

    try {
      const response = await api.put('/admin/home-content', buildHomeContentPayload(homeContentForm))
      setHomeContentForm(mapHomeContentToForm(response.data))
      setSuccess('Conteudo da home atualizado com sucesso.')
    } catch (submitError) {
      console.error('Erro ao salvar conteudo da home:', submitError)
      const serverMessage = submitError?.response?.data?.detail
      setError(serverMessage || 'Nao foi possivel salvar o conteudo da home.')
    } finally {
      setSavingHomeContent(false)
    }
  }

  const handleUploadHomeImage = async (file) => {
    setUploadingHomeImage(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'charme/banners')

      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      handleHomeContentFieldChange('image_url', response.data.secure_url)
      setSuccess('Imagem da home enviada ao Cloudinary com sucesso.')
    } catch (uploadError) {
      console.error('Erro ao enviar imagem da home:', uploadError)
      const serverMessage = uploadError?.response?.data?.detail
      setError(serverMessage || 'Nao foi possivel enviar a imagem da home.')
    } finally {
      setUploadingHomeImage(false)
    }
  }

  const handleSubmitAboutContent = async () => {
    setSavingAboutContent(true)
    setError('')

    try {
      const response = await api.put('/admin/about-content', buildHomeContentPayload(aboutContentForm))
      setAboutContentForm(mapAboutContentToForm(response.data))
      setSuccess('Conteudo do Sobre nos atualizado com sucesso.')
    } catch (submitError) {
      console.error('Erro ao salvar conteudo do Sobre nos:', submitError)
      const serverMessage = submitError?.response?.data?.detail
      setError(serverMessage || 'Nao foi possivel salvar o conteudo do Sobre nos.')
    } finally {
      setSavingAboutContent(false)
    }
  }

  const handleUploadAboutImage = async (file) => {
    setUploadingAboutImage(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'charme/banners')

      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      handleAboutContentFieldChange('image_url', response.data.secure_url)
      setSuccess('Imagem do Sobre nos enviada ao Cloudinary com sucesso.')
    } catch (uploadError) {
      console.error('Erro ao enviar imagem do Sobre nos:', uploadError)
      const serverMessage = uploadError?.response?.data?.detail
      setError(serverMessage || 'Nao foi possivel enviar a imagem ao Cloudinary.')
    } finally {
      setUploadingAboutImage(false)
    }
  }

  const buildShippingCarrierPayload = () => ({
    name: shippingCarrierForm.name.trim(),
    region: shippingCarrierForm.region,
    base_freight: Number(shippingCarrierForm.base_freight || 0),
    price_per_kg: Number(shippingCarrierForm.price_per_kg || 0),
    value_rate: Number(shippingCarrierForm.value_rate || 0),
    estimated_days: Number(shippingCarrierForm.estimated_days || 1),
    active: Boolean(shippingCarrierForm.active),
  })

  const handleSubmitShippingCarrier = async () => {
    setSavingCarrier(true)
    setError('')

    try {
      const payload = buildShippingCarrierPayload()
      if (editingCarrierId) {
        await api.put(`/admin/shipping-carriers/${editingCarrierId}`, payload)
        setSuccess('Transportadora atualizada com sucesso.')
      } else {
        await api.post('/admin/shipping-carriers', payload)
        setSuccess('Transportadora cadastrada com sucesso.')
      }
      resetShippingCarrierForm()
      await loadAdminData()
    } catch (submitError) {
      console.error('Erro ao salvar transportadora:', submitError)
      const serverMessage = submitError?.response?.data?.detail
      setError(serverMessage || 'Nao foi possivel salvar a transportadora.')
    } finally {
      setSavingCarrier(false)
    }
  }

  const handleEditShippingCarrier = (carrier) => {
    setEditingCarrierId(carrier.id)
    setShippingCarrierForm({
      name: carrier.name || '',
      region: carrier.region || 'Sudeste',
      base_freight: String(carrier.base_freight ?? 0),
      price_per_kg: String(carrier.price_per_kg ?? 0),
      value_rate: String(carrier.value_rate ?? 0),
      estimated_days: String(carrier.estimated_days ?? 5),
      active: Boolean(carrier.active),
    })
  }

  const handleDeleteShippingCarrier = async (carrier) => {
    const confirmed = window.confirm(`Deseja excluir a transportadora "${carrier.name}"?`)
    if (!confirmed) {
      return
    }

    setError('')
    try {
      await api.delete(`/admin/shipping-carriers/${carrier.id}`)
      setSuccess('Transportadora excluida com sucesso.')
      if (editingCarrierId === carrier.id) {
        resetShippingCarrierForm()
      }
      await loadAdminData()
    } catch (deleteError) {
      console.error('Erro ao excluir transportadora:', deleteError)
      const serverMessage = deleteError?.response?.data?.detail
      setError(serverMessage || 'Nao foi possivel excluir a transportadora.')
    }
  }

  const handleSubmitPaymentSettings = async () => {
    setSavingPayment(true)
    setError('')

    try {
      const payload = {
        provider: paymentSettingsForm.provider,
        pix_enabled: Boolean(paymentSettingsForm.pix_enabled),
        boleto_enabled: Boolean(paymentSettingsForm.boleto_enabled),
        pix_key: paymentSettingsForm.pix_key?.trim() || null,
        recipient_name: paymentSettingsForm.recipient_name?.trim() || null,
        bank_name: paymentSettingsForm.bank_name?.trim() || null,
        instructions: paymentSettingsForm.instructions?.trim() || null,
      }
      const response = await api.put('/admin/payment-settings', payload)
      setPaymentSettingsForm({ ...defaultPaymentSettings, ...response.data })
      setSuccess('Configuracoes de pagamento atualizadas com sucesso.')
    } catch (submitError) {
      console.error('Erro ao salvar pagamento:', submitError)
      const serverMessage = submitError?.response?.data?.detail
      setError(serverMessage || 'Nao foi possivel salvar as configuracoes de pagamento.')
    } finally {
      setSavingPayment(false)
    }
  }

  const handleSubmitProduct = async () => {
    setSavingProduct(true)
    setError('')

    try {
      const payload = buildProductPayload(productForm)

      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, payload)
        setSuccess('Produto atualizado com sucesso.')
      } else {
        await api.post('/products/', payload)
        setSuccess('Produto cadastrado com sucesso.')
      }

      resetProductForm()
      await loadAdminData()
    } catch (submitError) {
      console.error('Erro ao salvar produto:', submitError)
      const serverMessage = submitError?.response?.data?.detail
      setError(serverMessage || 'Nao foi possivel salvar o produto.')
    } finally {
      setSavingProduct(false)
    }
  }

  const handleUploadProductImage = async (file) => {
    setUploadingImage(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'charme/produtos')

      const response = await api.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      handleProductFieldChange('image_url', response.data.secure_url)
      setSuccess('Imagem enviada ao Cloudinary com sucesso.')
    } catch (uploadError) {
      console.error('Erro ao enviar imagem:', uploadError)
      const serverMessage = uploadError?.response?.data?.detail
      setError(serverMessage || 'Nao foi possivel enviar a imagem ao Cloudinary.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProductId(product.id)
    setProductForm(mapProductToForm(product))
    setError('')
  }

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`Deseja excluir o produto "${product.name}"?`)
    if (!confirmed) {
      return
    }

    setError('')
    try {
      await api.delete(`/products/${product.id}`)
      setSuccess('Produto excluido com sucesso.')
      if (editingProductId === product.id) {
        resetProductForm()
      }
      await loadAdminData()
    } catch (deleteError) {
      console.error('Erro ao excluir produto:', deleteError)
      const serverMessage = deleteError?.response?.data?.detail
      setError(serverMessage || 'Nao foi possivel excluir o produto.')
    }
  }

  if (!token) {
    return null
  }

  if (loading) {
    return (
      <div className="rounded-[6px] border border-[#0A6772]/12 bg-white p-8 text-[#101827]/64 shadow-[0_18px_45px_rgba(10,103,114,0.06)]">
        Carregando dashboard admin...
      </div>
    )
  }

  const averageTicket =
    metrics?.paid_orders > 0 ? metrics.paid_sales_amount / metrics.paid_orders : 0

  return (
    <section className="space-y-6">
      <header className="rounded-[6px] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_45px_rgba(10,103,114,0.06)] sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B98D3A]">Charme Admin</p>
            <h1 className="mt-2 font-serif text-3xl text-[#12343A] sm:text-4xl">Dashboard Admin</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#101827]/62">
              Gestao de pedidos, produtos, clientes, vendas e carrinhos abandonados em uma area clara e responsiva.
            </p>
          </div>
          <button
            type="button"
            onClick={loadAdminData}
            className="h-11 rounded-full border border-[#0A6772]/20 px-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#0A6772] transition hover:border-[#0A6772]"
          >
            Atualizar
          </button>
        </div>

        <nav className="mt-5 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {adminSections.map((section) => (
            <button
              key={section}
              type="button"
              onClick={() => handleAdminSectionClick(section)}
              className="shrink-0 rounded-full border border-[#0A6772]/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#101827]/62 transition hover:border-[#0A6772]/35 hover:text-[#0A6772]"
            >
              {section}
            </button>
          ))}
        </nav>
      </header>

      {error && (
        <div className="rounded-[6px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-[6px] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {metrics && (
        <div id="dashboard" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <AdminMetricCard title="Pedidos" value={metrics.total_orders} subtitle={`${metrics.paid_orders} pagos`} />
          <AdminMetricCard title="Vendas" value={formatPrice(metrics.total_sales_amount)} subtitle={`${formatPrice(metrics.paid_sales_amount)} pagas`} />
          <AdminMetricCard title="Ticket medio" value={formatPrice(averageTicket)} subtitle="pedidos pagos" />
          <AdminMetricCard title="Clientes" value={metrics.total_customers} />
          <AdminMetricCard title="Produtos" value={metrics.total_products} />
          <AdminMetricCard title="Abandonados" value={metrics.abandoned_carts} subtitle={`${metrics.abandoned_items} itens`} />
        </div>
      )}

      <div id="conteudo-home" className="scroll-mt-28">
        <AdminHomeContentForm
          form={homeContentForm}
          loading={savingHomeContent}
          uploadingImage={uploadingHomeImage}
          onChange={handleHomeContentFieldChange}
          onSubmit={handleSubmitHomeContent}
          onUploadImage={handleUploadHomeImage}
        />
      </div>

      <div id="sobre-nos" className="scroll-mt-28">
        <AdminHomeContentForm
          form={aboutContentForm}
          loading={savingAboutContent}
          uploadingImage={uploadingAboutImage}
          eyebrow="Sobre nos"
          title="Conteudo da pagina Sobre nos"
          description="Edite o texto, imagem e botao exibidos na pagina institucional da marca."
          submitLabel="Salvar Sobre nos"
          onChange={handleAboutContentFieldChange}
          onSubmit={handleSubmitAboutContent}
          onUploadImage={handleUploadAboutImage}
        />
      </div>

      <div id="produtos" className="grid scroll-mt-28 gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminProductForm
          form={productForm}
          loading={savingProduct}
          editing={Boolean(editingProductId)}
          onChange={handleProductFieldChange}
          onSubmit={handleSubmitProduct}
          onCancelEdit={resetProductForm}
          onUploadImage={handleUploadProductImage}
          uploadingImage={uploadingImage}
        />

        <AdminProductsTable
          products={products}
          loading={loading}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      </div>

      <div id="frete" className="scroll-mt-28">
        <AdminShippingSettings
          carriers={shippingCarriers}
          form={shippingCarrierForm}
          editingId={editingCarrierId}
          loading={savingCarrier}
          onChange={handleShippingCarrierFieldChange}
          onSubmit={handleSubmitShippingCarrier}
          onEdit={handleEditShippingCarrier}
          onDelete={handleDeleteShippingCarrier}
          onCancel={resetShippingCarrierForm}
        />
      </div>

      <div id="pagamento" className="scroll-mt-28">
        <AdminPaymentSettings
          form={paymentSettingsForm}
          loading={savingPayment}
          onChange={handlePaymentSettingsFieldChange}
          onSubmit={handleSubmitPaymentSettings}
        />
      </div>

      <div id="pedidos" className="scroll-mt-28">
        <AdminOrdersTable orders={orders} />
      </div>
      <div id="clientes" className="scroll-mt-28">
        <AdminCustomersTable customers={customers} />
      </div>
      <div id="carrinhos" className="scroll-mt-28">
        <AdminAbandonedCartsTable carts={abandonedCarts} />
      </div>
      <section id="relatorios" className="scroll-mt-28 rounded-[6px] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_45px_rgba(10,103,114,0.06)]">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#B98D3A]">Relatorios</p>
        <h2 className="mt-2 font-serif text-2xl text-[#12343A]">Resumo comercial</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminMetricCard title="Vendas totais" value={formatPrice(metrics?.total_sales_amount || 0)} />
          <AdminMetricCard title="Vendas pagas" value={formatPrice(metrics?.paid_sales_amount || 0)} />
          <AdminMetricCard title="Pedidos" value={metrics?.total_orders || 0} />
          <AdminMetricCard title="Ticket medio" value={formatPrice(averageTicket)} />
        </div>
      </section>
    </section>
  )
}

export default AdminDashboard
