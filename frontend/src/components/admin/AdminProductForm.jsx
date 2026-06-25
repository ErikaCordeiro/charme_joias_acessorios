function AdminProductForm({
  form,
  loading = false,
  editing = false,
  onChange,
  onSubmit,
  onCancelEdit,
  onUploadImage,
  uploadingImage = false,
}) {
  const categories = [
    { value: 'brincos', label: 'Brincos' },
    { value: 'colares', label: 'Colares' },
    { value: 'pulseiras', label: 'Pulseiras' },
    { value: 'aneis', label: 'Aneis' },
    { value: 'pingentes', label: 'Pingentes' },
    { value: 'presentes', label: 'Presentes' },
    { value: 'sale', label: 'Sale' },
  ]
  const inputClass =
    'h-11 rounded-full border border-[#0A6772]/14 bg-[#FAFAF8] px-4 text-sm text-[#101827] outline-none transition placeholder:text-[#101827]/35 focus:border-[#0A6772] focus:bg-white focus:ring-4 focus:ring-[#0A6772]/10'
  const textareaClass =
    'rounded-[6px] border border-[#0A6772]/14 bg-[#FAFAF8] px-4 py-3 text-sm text-[#101827] outline-none transition placeholder:text-[#101827]/35 focus:border-[#0A6772] focus:bg-white focus:ring-4 focus:ring-[#0A6772]/10 md:col-span-2'

  return (
    <section className="rounded-[6px] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_45px_rgba(10,103,114,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-2xl text-[#12343A]">
          {editing ? 'Editar produto' : 'Cadastrar produto'}
        </h2>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-full border border-[#0A6772]/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6772] transition hover:border-[#0A6772]"
          >
            Cancelar
          </button>
        )}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
        className="mt-4 grid gap-3 md:grid-cols-2"
      >
        <input
          type="text"
          value={form.name}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder="Nome"
          required
          className={inputClass}
        />
        <select
          value={form.category}
          onChange={(event) => onChange('category', event.target.value)}
          required
          className={inputClass}
        >
          <option value="">Categoria</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(event) => onChange('price', event.target.value)}
          placeholder="Preco"
          required
          className={inputClass}
        />
        <input
          type="number"
          min="0"
          value={form.stock}
          onChange={(event) => onChange('stock', event.target.value)}
          placeholder="Estoque"
          required
          className={inputClass}
        />
        <div className="grid gap-3 md:col-span-2 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={form.image_url}
            onChange={(event) => onChange('image_url', event.target.value)}
            placeholder="URL da imagem Cloudinary"
            className={inputClass}
          />
          <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-[#0A6772]/20 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6772] transition hover:border-[#0A6772]">
            {uploadingImage ? 'Enviando...' : 'Upload Cloudinary'}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              disabled={uploadingImage}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file && onUploadImage) {
                  onUploadImage(file)
                }
                event.target.value = ''
              }}
              className="sr-only"
            />
          </label>
        </div>
        <textarea
          value={form.description}
          onChange={(event) => onChange('description', event.target.value)}
          placeholder="Descricao"
          rows={3}
          className={textareaClass}
        />

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-full bg-[#0A6772] px-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#095c65] disabled:opacity-60 md:col-span-2"
        >
          {loading ? 'Salvando...' : editing ? 'Atualizar produto' : 'Cadastrar produto'}
        </button>
      </form>
    </section>
  )
}

export default AdminProductForm
