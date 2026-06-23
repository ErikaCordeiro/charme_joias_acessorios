import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = searchTerm.trim()
    if (trimmed) {
      navigate(`/products?search=${encodeURIComponent(trimmed)}`)
      setSearchTerm('')
      onClose()
    }
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-20 px-4"
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-[0_24px_70px_rgba(17,18,38,0.12)]">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <label htmlFor="search-modal" className="sr-only">
            Buscar produtos
          </label>
          <input
            ref={searchInputRef}
            id="search-modal"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar joias, brincos, colares, pulseiras..."
            className="w-full border-b-2 border-[#0b6f78]/20 bg-transparent px-2 py-4 text-lg text-[#111226] outline-none transition placeholder:text-[#111226]/40 focus:border-[#0b6f78]"
          />
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#111226]/20 px-5 py-2 text-sm font-semibold text-[#111226] transition hover:border-[#111226]/50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!searchTerm.trim()}
              className="rounded-full bg-[#0b6f78] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#095a62] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buscar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SearchModal
