import { useEffect, useState } from 'react'

import AccountField from '../components/AccountField'
import {
  buildUserProfilePayload,
  emptyUserProfileForm,
  formatFullAddress,
  getUserProfileFormValues,
  userProfileFields,
} from '../helpers/userProfile'
import api from '../services/api'

function Profile() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState(emptyUserProfileForm)
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
        const message = err?.response?.data?.detail || err?.message || 'Nao foi possivel carregar seus dados.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
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
      const axiosMessage = saveError?.message
      setError(
        serverMessage
          ? `Erro ${status}: ${serverMessage}`
          : axiosMessage
            ? `Erro de conexao: ${axiosMessage}`
            : 'Nao foi possivel salvar seus dados.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl rounded-3xl border border-zinc-900 bg-zinc-950/70 p-8 shadow-soft">
      <div className="flex flex-col gap-6">
        <div className="rounded-3xl border border-zinc-900 bg-black/70 p-6">
          <h1 className="text-3xl font-semibold text-white">Minha Conta</h1>
          <p className="mt-2 text-zinc-400">Mantenha nome, CPF, telefone e endereco sempre atualizados.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-zinc-900 bg-black/70 p-6 text-zinc-300">Carregando seus dados...</div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-sm text-red-200">{error}</div>
        ) : (
          <>
            {success && <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">{success}</div>}

            {user && (
              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <form onSubmit={handleSubmit} className="rounded-3xl border border-zinc-900 bg-black/70 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-white">Dados cadastrais</h2>
                      <p className="mt-2 text-zinc-400">Atualize os dados usados na sua conta e nos pedidos.</p>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-full bg-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving ? 'Salvando...' : 'Salvar dados'}
                    </button>
                  </div>

                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    <AccountField
                      label="Email"
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

                <div className="rounded-3xl border border-zinc-900 bg-black/70 p-6">
                  <h2 className="text-xl font-semibold text-white">Resumo da conta</h2>
                  <div className="mt-5 space-y-4">
                    <div className="rounded-3xl bg-zinc-950 p-4 text-zinc-200">
                      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Email</p>
                      <p className="mt-2 text-base font-medium text-white">{user.email}</p>
                    </div>
                    <div className="rounded-3xl bg-zinc-950 p-4 text-zinc-200">
                      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Nome</p>
                      <p className="mt-2 text-base font-medium text-white">{user.full_name || 'Nao informado'}</p>
                    </div>
                    <div className="rounded-3xl bg-zinc-950 p-4 text-zinc-200">
                      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Telefone</p>
                      <p className="mt-2 text-base font-medium text-white">{user.phone || 'Nao informado'}</p>
                    </div>
                    <div className="rounded-3xl bg-zinc-950 p-4 text-zinc-200">
                      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">CPF</p>
                      <p className="mt-2 text-base font-medium text-white">{user.cpf || 'Nao informado'}</p>
                    </div>
                    <div className="rounded-3xl bg-zinc-950 p-4 text-zinc-200">
                      <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Endereco completo</p>
                      <p className="mt-2 text-base font-medium text-white">{formatFullAddress(user) || 'Nao informado'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-3xl border border-zinc-900 bg-black/70 p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Pedidos</h2>
                  <p className="mt-2 text-zinc-400">Veja o historico de compras feitas com esta conta.</p>
                </div>
              </div>

              {orders.length === 0 ? (
                <div className="mt-6 rounded-3xl border border-zinc-900 bg-zinc-950 p-6 text-zinc-300">
                  Voce ainda nao fez nenhum pedido.
                </div>
              ) : (
                <div className="mt-6 space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="rounded-3xl border border-zinc-900 bg-zinc-950 p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Pedido</p>
                          <p className="mt-1 text-lg font-semibold text-white">#{order.id}</p>
                        </div>
                        <div className="grid gap-2 sm:grid-flow-col sm:auto-cols-max">
                          <span className="rounded-full bg-black px-3 py-1 text-sm text-zinc-300">Status: {order.status}</span>
                          <span className="rounded-full bg-black px-3 py-1 text-sm text-zinc-300">Total: R${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="rounded-3xl bg-black p-4 text-zinc-200">
                            <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Item #{item.product_id}</p>
                            <p className="mt-2 text-base font-medium text-white">Quantidade: {item.quantity}</p>
                            <p className="mt-1 text-sm text-zinc-400">Preco no pedido: R${item.price_at_time.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Profile
