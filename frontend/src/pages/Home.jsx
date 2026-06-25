import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import SearchModal from '../components/SearchModal'
import HomeBrandSection from '../components/home/HomeBrandSection'
import CollectionsSection from '../components/home/CollectionsSection'
import HomeBenefitsBar from '../components/home/HomeBenefitsBar'
import HomeFooter from '../components/home/HomeFooter'
import HomeHeroSection from '../components/home/HomeHeroSection'
import HomeHighlightsSection from '../components/home/HomeHighlightsSection'
import api from '../services/api'

function Home() {
  const navigate = useNavigate()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [featuredLoading, setFeaturedLoading] = useState(true)
  const [featuredError, setFeaturedError] = useState('')
  const menuItems = [
    { label: 'JOIAS', to: '/products' },
    { label: 'BRINCOS', to: '/products?category=brincos' },
    { label: 'COLARES', to: '/products?category=colares' },
    { label: 'PULSEIRAS', to: '/products?category=pulseiras' },
    { label: 'ANEIS', to: '/products?category=aneis' },
    { label: 'PINGENTES', to: '/products?category=pingentes' },
    { label: 'PRESENTES', to: '/products?category=presentes' },
    { label: 'SALE', to: '/products?category=sale' },
  ]

  useEffect(() => {
    let mounted = true

    const loadFeaturedProducts = async () => {
      setFeaturedLoading(true)
      setFeaturedError('')
      try {
        const response = await api.get('/products', { params: { page: 1, size: 4 } })
        if (mounted) {
          setFeaturedProducts(response.data?.products || [])
        }
      } catch (loadError) {
        console.error('Erro ao carregar produtos em destaque:', loadError)
        if (mounted) {
          setFeaturedProducts([])
          setFeaturedError('Cadastre produtos no painel admin para exibir os mais vendidos.')
        }
      } finally {
        if (mounted) {
          setFeaturedLoading(false)
        }
      }
    }

    void loadFeaturedProducts()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbf8f1]">
      <header className="sticky top-0 z-50 border-b border-[#062f35]/10 bg-[#fbfaf7]/98 backdrop-blur">
        <div className="mx-auto grid min-h-[56px] w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-3 sm:min-h-[62px] sm:gap-5 sm:px-5 lg:px-8">
          <nav className="hide-scrollbar flex min-w-0 items-center gap-5 overflow-x-auto whitespace-nowrap pr-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#062f35] sm:gap-7 sm:text-[11px] md:justify-center lg:gap-9 xl:gap-11">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="shrink-0 py-4 leading-none transition hover:text-[#0A6772]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 bg-[#fbfaf7] pl-1 text-[#062f35] sm:gap-4 lg:gap-5">
            <button type="button" aria-label="Buscar" onClick={() => setIsSearchOpen(true)} className="transition hover:text-[#0A6772]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.6] sm:h-6 sm:w-6">
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" />
              </svg>
            </button>
            <button type="button" aria-label="Favoritos" onClick={() => navigate('/products')} className="transition hover:text-[#0A6772]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.5] sm:h-6 sm:w-6">
                <path d="M20.8 8.6c0 5.1-8.8 10.1-8.8 10.1S3.2 13.7 3.2 8.6A4.6 4.6 0 0 1 12 6.7a4.6 4.6 0 0 1 8.8 1.9Z" />
              </svg>
            </button>
            <button type="button" aria-label="Sacola" onClick={() => navigate('/cart')} className="relative transition hover:text-[#0A6772]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-[1.35] sm:h-6 sm:w-6">
                <path d="M6.5 8.5h11l.8 11H5.7l.8-11Z" />
                <path d="M9 8.5a3 3 0 0 1 6 0" />
              </svg>
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#062f35] text-[0.58rem] font-bold text-white">0</span>
            </button>
          </div>
        </div>
      </header>

      <HomeHeroSection />

      <HomeBenefitsBar />

      <HomeBrandSection />

      <CollectionsSection />

      <HomeHighlightsSection products={featuredProducts} loading={featuredLoading} error={featuredError} />

      <HomeFooter />

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </main>
  )
}

export default Home
