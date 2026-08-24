export function Toggle({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return <button className={`toggle${active ? ' toggle--active' : ''}`} role="switch" aria-checked={active} aria-label={label} onClick={onClick}><span /></button>
}
