function CartQuantityControl({
  quantity,
  min = 1,
  max,
  disabled = false,
  onCommit,
}) {
  const clampQuantity = (rawValue) => {
    const parsedValue = Number.parseInt(rawValue, 10)
    if (Number.isNaN(parsedValue)) {
      return quantity
    }

    const withMin = Math.max(parsedValue, min)
    if (typeof max !== 'number') {
      return withMin
    }

    return Math.min(withMin, max)
  }

  const commitDraft = (rawValue) => {
    if (disabled) {
      return
    }

    const nextQuantity = clampQuantity(rawValue)
    if (nextQuantity !== quantity) {
      onCommit(nextQuantity)
    }
  }

  const handleDecrease = () => {
    if (disabled || quantity <= min) {
      return
    }
    onCommit(quantity - 1)
  }

  const handleIncrease = () => {
    if (disabled) {
      return
    }

    if (typeof max === 'number' && quantity >= max) {
      return
    }

    onCommit(quantity + 1)
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-[#0b6f78]/12 bg-[#fbf8f1] p-1">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled || quantity <= min}
        className="h-8 w-8 rounded-full border border-[#0b6f78]/20 bg-white text-sm font-semibold text-[#111226]/75 transition hover:border-[#d8a84f] hover:text-[#062f35] disabled:cursor-not-allowed disabled:opacity-50"
      >
        -
      </button>
      <input
        key={quantity}
        type="number"
        min={min}
        max={max}
        defaultValue={quantity}
        onBlur={(event) => commitDraft(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur()
          }
        }}
        disabled={disabled}
        className="h-8 w-16 rounded-full border border-[#0b6f78]/20 bg-white px-3 text-center text-sm font-semibold text-[#062f35] outline-none transition focus:border-[#0b6f78] disabled:cursor-not-allowed disabled:opacity-60"
      />
      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled || (typeof max === 'number' && quantity >= max)}
        className="h-8 w-8 rounded-full border border-[#0b6f78]/20 bg-white text-sm font-semibold text-[#111226]/75 transition hover:border-[#d8a84f] hover:text-[#062f35] disabled:cursor-not-allowed disabled:opacity-50"
      >
        +
      </button>
    </div>
  )
}

export default CartQuantityControl
