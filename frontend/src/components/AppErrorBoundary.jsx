import { Component } from 'react'

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Erro inesperado na aplicacao:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto mt-10 max-w-2xl rounded-3xl border border-zinc-800 bg-zinc-950/80 p-8 text-zinc-100">
          <h1 className="text-2xl font-semibold text-white">Ocorreu um erro ao carregar o site</h1>
          <p className="mt-3 text-zinc-300">
            Atualize a pagina para tentar novamente.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-zinc-300 px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200"
          >
            Recarregar
          </button>
        </section>
      )
    }

    return this.props.children
  }
}

export default AppErrorBoundary
