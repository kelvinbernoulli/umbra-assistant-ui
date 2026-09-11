export function Toggle({ active, onClick, label, disabled = false }: { active: boolean; onClick?: () => void; label: string; disabled?: boolean }) {
  return <button className={`toggle${active ? ' toggle--active' : ''}`} role="switch" aria-checked={active} aria-label={label} onClick={onClick} disabled={disabled}><span /></button>
}
