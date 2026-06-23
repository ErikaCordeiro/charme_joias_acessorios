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
  minLength,
  disabled = false,
  readOnly = false,
}) {
  return (
    <label className="block space-y-2 text-sm font-medium text-[#101827]/72">
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
        minLength={minLength}
        disabled={disabled}
        readOnly={readOnly}
        className="h-12 w-full rounded-full border border-[#0A6772]/15 bg-[#FAFAF8] px-5 text-sm text-[#101827] outline-none transition placeholder:text-[#101827]/35 focus:border-[#0A6772] focus:bg-white focus:ring-4 focus:ring-[#0A6772]/10 disabled:cursor-not-allowed disabled:bg-[#F1EEE8] disabled:text-[#101827]/55"
      />
    </label>
  )
}

export default AccountField
