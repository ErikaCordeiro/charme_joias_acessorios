function FeedbackToast({
  type = 'success',
  title = 'Sucesso',
  message,
  onClose,
}) {
  if (!message) {
    return null
  }

  const isSuccess = type === 'success'
  const containerClasses = isSuccess
    ? 'border-zinc-300/35 bg-zinc-900/95 text-zinc-100'
    : 'border-red-500/30 bg-red-950/90 text-red-100'
  const titleClasses = isSuccess ? 'text-zinc-300' : 'text-red-300'
  const buttonClasses = isSuccess
    ? 'border-zinc-400/60 bg-zinc-300 text-zinc-900 hover:bg-zinc-200'
    : 'border-red-300/50 bg-red-300 text-red-900 hover:bg-red-200'

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-[min(92vw,360px)] rounded-2xl border p-4 shadow-soft backdrop-blur ${containerClasses}`} role="status" aria-live="polite">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className={`text-xs uppercase tracking-[0.22em] ${titleClasses}`}>{title}</p>
          <p className="text-sm leading-6">{message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${buttonClasses}`}
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default FeedbackToast
