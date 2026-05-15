import { useEffect, useState } from 'react'

import HomeBenefitsBar from '../components/home/HomeBenefitsBar'
import HomeHeroSection from '../components/home/HomeHeroSection'
import HomeHighlightsSection from '../components/home/HomeHighlightsSection'
import api from '../services/api'

function Home() {
  const [products, setProducts] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [productsError, setProductsError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products', { params: { size: 5 } })
        setProducts(response.data.products || [])
      } catch (error) {
        console.error('Erro ao carregar destaques da home:', error)
        setProductsError('Nao foi possivel carregar os destaques agora.')
      } finally {
        setLoadingProducts(false)
      }
    }

    loadProducts()
  }, [])

  return (
    <section className="bg-black">
      <HomeHeroSection />
      <HomeBenefitsBar />
      <HomeHighlightsSection products={products} loading={loadingProducts} error={productsError} />
    </section>
  )
}

export default Home
