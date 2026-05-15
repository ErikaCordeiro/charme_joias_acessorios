function AccountField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  autoComplete,
  required = true,
  maxLength,
  disabled = false,
  readOnly = false,
}) {
  return (
    <label className="block space-y-2 text-sm text-zinc-300">
      {label}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        maxLength={maxLength}
        disabled={disabled}
        readOnly={readOnly}
        className="w-full rounded-3xl border border-zinc-900 bg-black/85 px-4 py-3 text-sm text-white outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-300/30 disabled:cursor-not-allowed disabled:opacity-70"
      />
    </label>
  )
}

export default AccountField
