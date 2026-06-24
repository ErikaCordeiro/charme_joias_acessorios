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
        <section className="mx-auto mt-10 max-w-2xl rounded-3xl border border-[#0b6f78]/12 bg-white p-8 text-[#062f35]">
          <h1 className="text-2xl font-semibold text-[#062f35]">Ocorreu um erro ao carregar o site</h1>
          <p className="mt-3 text-[#111226]/70">
            Atualize a pagina para tentar novamente.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-full bg-[#d8a84f] px-5 py-2 text-sm font-semibold text-[#062f35] transition hover:bg-[#efc66b]"
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
