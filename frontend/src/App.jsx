import { useEffect } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'

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
import { getStoredToken } from './helpers/storage'

const routeMetadata = {
  '/': {
    title: 'Charme Joias Acessorios | Elegancia em Cada Detalhe',
    description: 'Semijoias e acessorios femininos selecionados para mulheres que valorizam elegancia, personalidade e sofisticacao.',
  },
  '/products': {
    title: 'Joias | Charme Joias Acessorios',
    description: 'Conheca as colecoes de joias, semijoias e acessorios femininos da Charme.',
  },
  '/about': {
    title: 'Sobre a Marca | Charme Joias Acessorios',
    description: 'Conheca a Charme Joias Acessorios, uma marca de semijoias femininas em Palhoca.',
  },
  '/profile': {
    title: 'Minha Conta | Charme Joias Acessorios',
    description: 'Acompanhe seus pedidos e gerencie seus dados na Charme Joias Acessorios.',
  },
  '/admin': {
    title: 'Dashboard Admin | Charme Joias Acessorios',
    description: 'Area administrativa protegida da Charme Joias Acessorios.',
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

function ProtectedRoute({ children }) {
  return getStoredToken() ? children : <Navigate to="/login" replace />
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
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
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
