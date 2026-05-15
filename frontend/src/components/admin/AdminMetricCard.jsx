function AdminMetricCard({ title, value, subtitle = '' }) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-black/70 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-100">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
    </article>
  )
}

export default AdminMetricCard
