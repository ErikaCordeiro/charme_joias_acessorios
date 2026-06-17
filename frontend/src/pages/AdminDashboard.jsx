import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AdminAbandonedCartsTable from '../components/admin/AdminAbandonedCartsTable'
import AdminCustomersTable from '../components/admin/AdminCustomersTable'
import AdminMetricCard from '../components/admin/AdminMetricCard'
import AdminOrdersTable from '../components/admin/AdminOrdersTable'
import AdminProductForm from '../components/admin/AdminProductForm'
import AdminProductsTable from '../components/admin/AdminProductsTable'
import { buildProductPayload, emptyProductForm, mapProductToForm } from '../helpers/admin'
import { formatPrice } from '../helpers/price'
import { clearStoredToken, getStoredToken } from '../helpers/storage'
import api from '../services/api'

const adminSections = ['Dashboard', 'Produtos', 'Pedidos', 'Clientes', 'Carrinhos', 'Relatorios']

function AdminDashboard() {
  const token = getStoredToken()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(Boolean(token))
  const [savingProduct, setSavingProduct] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [metrics, setMetrics] = useState(null)
  const [customers, setCustomers] = useState([])
  const [orders, setOrders] = useState([])
  const [abandonedCarts, setAbandonedCarts] = useState([])
  const [products, setProducts] = useState([])

  const [productForm, setProductForm] = useState({ ...emptyProductForm })
  const [editingProductId, setEditingProductId] = useState(null)

  const loadAdminData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const [dashboardRes, customersRes, ordersRes, abandonedRes, productsRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/admin/customers', { params: { limit: 300 } }),
        api.get('/admin/orders', { params: { limit: 300 } }),
        api.get('/admin/abandoned-carts', { params: { limit: 300 } }),
        api.get('/products', { params: { page: 1, size: 100 } }),
      ])

      setMetrics(dashboardRes.data.metrics)
      setCustomers(customersRes.data)
      setOrders(ordersRes.data)
      setAbandonedCarts(abandonedRes.data)
      setProducts(productsRes.data.products || [])
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
            <a
              key={section}
              href={section === 'Dashboard' ? '#dashboard' : `#${section.toLowerCase()}`}
              className="shrink-0 rounded-full border border-[#0A6772]/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#101827]/62 transition hover:border-[#0A6772]/35 hover:text-[#0A6772]"
            >
              {section}
            </a>
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

      <div id="produtos" className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
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

        <AdminAbandonedCartsTable carts={abandonedCarts} />
      </div>

      <AdminProductsTable
        products={products}
        loading={loading}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <div id="pedidos">
        <AdminOrdersTable orders={orders} />
      </div>
      <div id="clientes">
        <AdminCustomersTable customers={customers} />
      </div>
    </section>
  )
}

export default AdminDashboard
