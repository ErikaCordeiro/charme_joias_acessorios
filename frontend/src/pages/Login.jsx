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
        setError('Nao foi possivel autenticar. Tente novamente.')
      }
    } catch (loginError) {
      console.error('Erro no login:', loginError)
      const serverMessage = loginError?.response?.data?.detail
      const status = loginError?.response?.status
      const friendlyMessage = loginError?.friendlyMessage
      setError(
        serverMessage
          ? `Erro ${status}: ${serverMessage}`
          : friendlyMessage || 'Nao foi possivel entrar. Verifique seus dados.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-190px)] max-w-6xl items-center gap-8 py-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-10">
      <div className="hidden overflow-hidden rounded-[2rem] bg-[#062f35] shadow-soft lg:block">
        <img
          src="/products/charme/conjunto-coracao-dourado.jpeg"
          alt="Joias Charme"
          className="h-[560px] w-full object-cover opacity-95"
        />
      </div>

      <div className="mx-auto w-full max-w-xl rounded-[1.75rem] border border-[#0b6f78]/12 bg-white p-5 shadow-[0_24px_70px_rgba(17,18,38,0.08)] sm:p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#0b6f78]">Minha conta</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-[#111226] sm:text-5xl">Entrar</h1>
        <p className="mt-3 text-sm leading-6 text-[#111226]/62 sm:text-base">
          Acesse sua conta Charme Joias e continue comprando com praticidade.
        </p>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-50 p-4 text-sm leading-6 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block space-y-2 text-sm font-medium text-[#111226]/75">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="h-12 w-full rounded-full border border-[#0b6f78]/16 bg-[#fbf8f1] px-5 text-sm text-[#111226] outline-none transition focus:border-[#0b6f78] focus:bg-white focus:ring-4 focus:ring-[#0b6f78]/10"
            />
          </label>

          <label className="block space-y-2 text-sm font-medium text-[#111226]/75">
            Senha
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="h-12 w-full rounded-full border border-[#0b6f78]/16 bg-[#fbf8f1] px-5 text-sm text-[#111226] outline-none transition focus:border-[#0b6f78] focus:bg-white focus:ring-4 focus:ring-[#0b6f78]/10"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-full bg-[#0b6f78] px-6 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#095a62] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-sm text-[#111226]/62">
          Nao tem conta?{' '}
          <Link to="/register" className="font-semibold text-[#0b6f78] hover:text-[#095a62]">
            Crie uma agora
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Login
