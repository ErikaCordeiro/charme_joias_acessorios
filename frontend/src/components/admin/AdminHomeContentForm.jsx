function AdminHomeContentForm({
  form,
  loading = false,
  uploadingImage = false,
  onChange,
  onSubmit,
  onUploadImage,
}) {
  const inputClass =
    'h-11 rounded-full border border-[#0A6772]/14 bg-[#FAFAF8] px-4 text-sm text-[#101827] outline-none transition placeholder:text-[#101827]/35 focus:border-[#0A6772] focus:bg-white focus:ring-4 focus:ring-[#0A6772]/10'
  const textareaClass =
    'rounded-[6px] border border-[#0A6772]/14 bg-[#FAFAF8] px-4 py-3 text-sm text-[#101827] outline-none transition placeholder:text-[#101827]/35 focus:border-[#0A6772] focus:bg-white focus:ring-4 focus:ring-[#0A6772]/10'

  return (
    <section id="conteudo-home" className="rounded-[6px] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_45px_rgba(10,103,114,0.06)]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B98D3A]">Home</p>
        <h2 className="mt-1 font-serif text-2xl text-[#12343A]">Conteudo institucional</h2>
        <p className="mt-2 text-sm leading-6 text-[#101827]/58">
          Edite o texto e a imagem da secao "Elegancia em cada detalhe" exibida na pagina inicial.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
        className="mt-5 grid gap-3 lg:grid-cols-2"
      >
        <input
          type="text"
          value={form.eyebrow}
          onChange={(event) => onChange('eyebrow', event.target.value)}
          placeholder="Texto pequeno acima do titulo"
          className={inputClass}
        />
        <input
          type="text"
          value={form.title}
          onChange={(event) => onChange('title', event.target.value)}
          placeholder="Titulo"
          required
          className={inputClass}
        />
        <textarea
          value={form.body_primary}
          onChange={(event) => onChange('body_primary', event.target.value)}
          placeholder="Primeiro paragrafo"
          rows={4}
          className={textareaClass}
        />
        <textarea
          value={form.body_secondary}
          onChange={(event) => onChange('body_secondary', event.target.value)}
          placeholder="Segundo paragrafo"
          rows={4}
          className={textareaClass}
        />
        <input
          type="text"
          value={form.cta_label}
          onChange={(event) => onChange('cta_label', event.target.value)}
          placeholder="Texto do botao"
          className={inputClass}
        />
        <input
          type="text"
          value={form.cta_url}
          onChange={(event) => onChange('cta_url', event.target.value)}
          placeholder="Link do botao"
          className={inputClass}
        />
        <div className="grid gap-3 lg:col-span-2 lg:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={form.image_url}
            onChange={(event) => onChange('image_url', event.target.value)}
            placeholder="URL da imagem"
            className={inputClass}
          />
          <label className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-[#0A6772]/20 px-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#0A6772] transition hover:border-[#0A6772]">
            {uploadingImage ? 'Enviando...' : 'Upload imagem'}
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
        <input
          type="text"
          value={form.image_alt}
          onChange={(event) => onChange('image_alt', event.target.value)}
          placeholder="Descricao acessivel da imagem"
          className={`${inputClass} lg:col-span-2`}
        />

        {form.image_url && (
          <div className="overflow-hidden rounded-[6px] border border-[#0A6772]/12 bg-[#FAFAF8] lg:col-span-2">
            <img src={form.image_url} alt={form.image_alt || 'Preview'} className="h-56 w-full object-cover" />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-full bg-[#0A6772] px-5 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#095c65] disabled:opacity-60 lg:col-span-2"
        >
          {loading ? 'Salvando...' : 'Salvar conteudo da home'}
        </button>
      </form>
    </section>
  )
}

export default AdminHomeContentForm
