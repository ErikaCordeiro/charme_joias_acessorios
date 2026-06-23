import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AccountField from '../components/AccountField'
import {
  buildUserProfilePayload,
  emptyUserProfileForm,
  userProfileFields,
} from '../helpers/userProfile'
import api from '../services/api'

function Register() {
  const [form, setForm] = useState(emptyUserProfileForm)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/auth/register', {
        email,
        password,
        ...buildUserProfilePayload(form),
      })
      setSuccess('Cadastro concluido com sucesso. Faca login para continuar.')
      setTimeout(() => navigate('/login'), 1200)
    } catch (registerError) {
      console.error('Erro no registro:', registerError)
      const serverMessage = registerError?.response?.data?.detail
      const status = registerError?.response?.status
      const axiosMessage = registerError?.message
      setError(
        typeof serverMessage === 'string'
          ? `Erro ${status}: ${serverMessage}`
          : axiosMessage
            ? `Erro de conexao: ${axiosMessage}`
            : 'Nao foi possivel completar o cadastro. Revise os dados e tente novamente.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-4xl rounded-3xl border border-zinc-900 bg-zinc-950/70 p-8 shadow-soft">
      <h1 className="text-3xl font-semibold text-white">Criar conta</h1>
      <p className="mt-2 text-zinc-400">Preencha seus dados para comprar e acompanhar pedidos na Charme Joias.</p>

      {success && <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">{success}</div>}
      {error && <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <AccountField
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="voce@exemplo.com"
          />
          <AccountField
            label="Senha"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            placeholder="Minimo de 10 caracteres, com letras e numeros"
            minLength={10}
            maxLength={72}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
    </section>
  )
}

export default Register
