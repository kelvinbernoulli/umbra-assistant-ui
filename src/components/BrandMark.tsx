export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark${compact ? ' brand-mark--compact' : ''}`} aria-label="Umbra">
      <img className="brand-mark__logo" src="/umbra-logo.svg" alt="" width="32" height="32" aria-hidden="true" />
      {!compact && <span className="brand-mark__name">umbra</span>}
    </div>
  )
}
