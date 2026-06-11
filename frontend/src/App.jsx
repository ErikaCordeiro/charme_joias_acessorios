import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'

import Header from './components/Header'
import About from './pages/About'
import AdminDashboard from './pages/AdminDashboard'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import Login from './pages/Login'
import Products from './pages/Products'
import Profile from './pages/Profile'
import Register from './pages/Register'

const routeMetadata = {
  '/': {
    title: 'Charme Joias Acessórios | Elegância em Cada Detalhe',
    description: 'Semijoias e acessórios femininos selecionados para mulheres que valorizam elegância, personalidade e sofisticação.',
  },
  '/products': {
    title: 'Coleções | Charme Joias Acessórios',
    description: 'Conheça as coleções de joias, semijoias e acessórios femininos da Charme.',
  },
  '/about': {
    title: 'Sobre a Marca | Charme Joias Acessórios',
    description: 'Conheça a Charme Joias Acessórios, uma marca de semijoias femininas em Palhoça.',
  },
}

function applyMetadata(pathname) {
  const metadata = routeMetadata[pathname] || routeMetadata['/']
  document.title = metadata.title

  const description = document.querySelector('meta[name="description"]')
  if (description) {
    description.setAttribute('content', metadata.description)
  }
}

function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    applyMetadata(location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#fbf8f1] text-[#111226]">
      <Header />
      <main className={isHome ? '' : 'mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  )
}

export default App
