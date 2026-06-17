import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AccountField from '../components/AccountField'
import {
  buildUserProfilePayload,
  emptyUserProfileForm,
  formatFullAddress,
  getUserProfileFormValues,
  userProfileFields,
} from '../helpers/userProfile'
import { formatPrice } from '../helpers/price'
import { clearStoredToken } from '../helpers/storage'
import api from '../services/api'

function Profile() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState(emptyUserProfileForm)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true)
      setError('')

      try {
        const [userRes, ordersRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/orders'),
        ])

        setUser(userRes.data)
        setForm(getUserProfileFormValues(userRes.data))
        setOrders(ordersRes.data)
      } catch (err) {
        console.error('Erro ao carregar perfil:', err)
        const status = err?.response?.status
        if (status === 401 || status === 403) {
          clearStoredToken()
          navigate('/login')
          return
        }
        const message = err?.response?.data?.detail || err?.message || 'Nao foi possivel carregar seus dados.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleLogout = () => {
    clearStoredToken()
    navigate('/login')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await api.put('/auth/me', buildUserProfilePayload(form))
      setUser(response.data)
      setForm(getUserProfileFormValues(response.data))
      setSuccess('Dados da conta atualizados com sucesso.')
    } catch (saveError) {
      console.error('Erro ao salvar perfil:', saveError)
      const serverMessage = saveError?.response?.data?.detail
      const status = saveError?.response?.status
      setError(serverMessage ? `Erro ${status}: ${serverMessage}` : 'Nao foi possivel salvar seus dados.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-[1.5rem] border border-[#0A6772]/12 bg-white p-8 text-center text-[#101827]/65 shadow-[0_18px_50px_rgba(16,24,39,0.06)]">
        Carregando sua conta...
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="rounded-[1.5rem] border border-red-500/20 bg-red-50 p-6 text-sm text-red-700">
        {error}
      </div>
    )
  }

  return (
    <section className="space-y-8">
      <div className="rounded-[1.75rem] border border-[#0A6772]/12 bg-white p-6 shadow-[0_18px_50px_rgba(16,24,39,0.06)] sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0A6772]">Área do cliente</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#101827] sm:text-5xl">Minha Conta</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#101827]/62">
          Gerencie seus dados, pedidos e informações pessoais.
        </p>
      </div>

      {success && <div className="rounded-2xl border border-emerald-500/20 bg-emerald-50 p-4 text-sm text-emerald-700">{success}</div>}
      {error && <div className="rounded-2xl border border-red-500/20 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

      {user && (
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,39,0.05)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#101827]">Dados cadastrais</h2>
                <p className="mt-2 text-sm leading-6 text-[#101827]/58">Atualize os dados usados na sua conta e nos pedidos.</p>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="h-11 rounded-full bg-[#0A6772] px-6 text-sm font-bold text-white transition hover:bg-[#08545d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Salvando...' : 'Salvar dados'}
              </button>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <AccountField
                label="E-mail"
                name="email"
                type="email"
                value={user.email}
                onChange={undefined}
                autoComplete="email"
                disabled
                readOnly
              />

              {userProfileFields.map((field) => (
                <AccountField
                  key={field.name}
                  label={field.label}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required={field.required ?? true}
                  maxLength={field.maxLength}
                />
              ))}
            </div>
          </form>

          <aside className="space-y-6">
            <div className="rounded-[1.5rem] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,39,0.05)] sm:p-6">
              <h2 className="font-serif text-2xl font-semibold text-[#101827]">Endereço principal</h2>
              <p className="mt-4 rounded-2xl bg-[#FAFAF8] p-4 text-sm leading-7 text-[#101827]/68">
                {formatFullAddress(user) || 'Nenhum endereço informado.'}
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,39,0.05)] sm:p-6">
              <h2 className="font-serif text-2xl font-semibold text-[#101827]">Segurança da conta</h2>
              <div className="mt-5 grid gap-3">
                <button type="button" className="h-11 rounded-full border border-[#0A6772]/20 px-5 text-sm font-semibold text-[#0A6772] transition hover:border-[#0A6772]">
                  Alterar senha
                </button>
                <button type="button" onClick={handleLogout} className="h-11 rounded-full bg-[#101827] px-5 text-sm font-semibold text-white transition hover:bg-[#0A6772]">
                  Sair da conta
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="rounded-[1.5rem] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_50px_rgba(16,24,39,0.05)] sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#101827]">Meus pedidos</h2>
            <p className="mt-2 text-sm text-[#101827]/58">Acompanhe status, valores e histórico de compras.</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-[#0A6772]/10 bg-[#FAFAF8] p-6 text-sm text-[#101827]/62">
            Você ainda não fez nenhum pedido.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-2xl border border-[#0A6772]/10 bg-[#FAFAF8] p-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#0A6772]">Pedido #{order.id}</p>
                    <p className="mt-2 text-sm text-[#101827]/60">{new Date(order.created_at).toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#101827]/70">Status: {order.status}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#101827]/70">Total: {formatPrice(order.total)}</span>
                    <button type="button" className="rounded-full bg-[#0A6772] px-4 py-1 text-xs font-semibold text-white">Ver detalhes</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Profile
