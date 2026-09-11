import { Settings, ShieldCheck } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { navItems } from '../navigation'
import { BrandMark } from './BrandMark'

export default function Sidebar() {
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <Link className="sidebar__brand" to="/" aria-label="Umbra home">
        <BrandMark compact />
      </Link>
      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `rail-link${isActive ? ' rail-link--active' : ''}`}
            aria-label={item.label}
            data-label={item.label}
          >
            <item.icon size={19} strokeWidth={1.7} />
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__footer">
        <NavLink
          to="/admin"
          className={({ isActive }) => `rail-link${isActive ? ' rail-link--active' : ''}`}
          aria-label="Administration"
          data-label="Admin"
        >
          <ShieldCheck size={19} strokeWidth={1.7} />
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) => `rail-link${isActive ? ' rail-link--active' : ''}`}
          aria-label="Settings"
          data-label="Settings"
        >
          <Settings size={19} strokeWidth={1.7} />
        </NavLink>
        <div className="user-avatar" title="Umbra workspace">U</div>
      </div>
    </aside>
  )
}
