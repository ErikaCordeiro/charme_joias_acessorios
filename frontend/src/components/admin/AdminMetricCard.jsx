function AdminMetricCard({ title, value, subtitle = '' }) {
  return (
    <article className="rounded-[6px] border border-[#0A6772]/12 bg-white p-5 shadow-[0_18px_45px_rgba(10,103,114,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0A6772]">{title}</p>
      <p className="mt-3 text-2xl font-semibold text-[#101827]">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-[#101827]/58">{subtitle}</p>}
    </article>
  )
}

export default AdminMetricCard
