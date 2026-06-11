import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { setStoredToken } from '../helpers/storage'
import api from '../services/api'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/auth/login', { email, password })
      const token = response.data?.access_token
      if (token) {
        setStoredToken(token)
        navigate('/profile')
      } else {
        setError('Não foi possível autenticar. Tente novamente.')
      }
    } catch (loginError) {
      console.error('Erro no login:', loginError)
      const serverMessage = loginError?.response?.data?.detail
      const status = loginError?.response?.status
      const axiosMessage = loginError?.message
      setError(
        serverMessage
          ? `Erro ${status}: ${serverMessage}`
          : axiosMessage
            ? `Erro de conexao: ${axiosMessage}`
            : 'Não foi possível entrar. Verifique seus dados.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-zinc-900 bg-zinc-950/70 p-8 shadow-soft">
      <h1 className="text-3xl font-semibold text-white">Entrar</h1>
      <p className="mt-2 text-zinc-400">Acesse sua conta Charme Joias e continue comprando.</p>

      {error && <div className="mt-6 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <label className="block space-y-2 text-sm text-zinc-300">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="w-full rounded-3xl border border-zinc-900 bg-black/85 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-300/30"
          />
        </label>

        <label className="block space-y-2 text-sm text-zinc-300">
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="w-full rounded-3xl border border-zinc-900 bg-black/85 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-300/30"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-400">
        Não tem conta?{' '}
        <Link to="/register" className="text-zinc-300 hover:text-zinc-200">
          Crie uma agora
        </Link>
      </p>
    </section>
  )
}

export default Login
