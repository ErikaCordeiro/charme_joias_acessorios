import { useCallback, useState } from 'react'

export function useViaCep() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchCep = useCallback(async (cep) => {
    // Remove non-digits
    const cleanCep = cep.replace(/\D/g, '')

    // Must be 8 digits
    if (cleanCep.length !== 8) {
      setError('CEP deve conter 8 dígitos')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)

      if (!response.ok) {
        throw new Error('Erro ao buscar CEP')
      }

      const data = await response.json()

      if (data.erro) {
        setError('CEP não encontrado')
        return null
      }

      return {
        street: data.logradouro || '',
        district: data.bairro || '',
        city: data.localidade || '',
        state: data.uf || '',
      }
    } catch (err) {
      const message = err.message || 'Erro ao buscar CEP'
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { searchCep, loading, error }
}
