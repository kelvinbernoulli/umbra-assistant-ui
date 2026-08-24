import { NavLink } from 'react-router-dom'
import { navItems } from '../navigation'

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Primary navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `mobile-nav__link${isActive ? ' mobile-nav__link--active' : ''}`}
        >
          <item.icon size={20} strokeWidth={1.8} />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
