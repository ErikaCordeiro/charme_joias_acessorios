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
  return (
    <section className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-100">
          {editing ? 'Editar produto' : 'Cadastrar produto'}
        </h2>
        {editing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-full border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-200 transition hover:border-zinc-500"
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
          className="h-11 rounded-xl border border-zinc-800 bg-black/70 px-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
        <input
          type="text"
          value={form.category}
          onChange={(event) => onChange('category', event.target.value)}
          placeholder="Categoria"
          className="h-11 rounded-xl border border-zinc-800 bg-black/70 px-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(event) => onChange('price', event.target.value)}
          placeholder="Preco"
          required
          className="h-11 rounded-xl border border-zinc-800 bg-black/70 px-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
        <input
          type="number"
          min="0"
          value={form.stock}
          onChange={(event) => onChange('stock', event.target.value)}
          placeholder="Estoque"
          required
          className="h-11 rounded-xl border border-zinc-800 bg-black/70 px-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
        />
        <div className="grid gap-3 md:col-span-2 md:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={form.image_url}
            onChange={(event) => onChange('image_url', event.target.value)}
            placeholder="URL da imagem Cloudinary"
            className="h-11 rounded-xl border border-zinc-800 bg-black/70 px-3 text-sm text-zinc-100 outline-none transition focus:border-zinc-500"
          />
          <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-xl border border-zinc-700 px-4 text-xs font-semibold text-zinc-200 transition hover:border-zinc-500">
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
          className="rounded-xl border border-zinc-800 bg-black/70 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-zinc-500 md:col-span-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-full bg-zinc-300 px-5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:opacity-60 md:col-span-2"
        >
          {loading ? 'Salvando...' : editing ? 'Atualizar produto' : 'Cadastrar produto'}
        </button>
      </form>
    </section>
  )
}

export default AdminProductForm
