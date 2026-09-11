import {
  Activity,
  Users,
  ChartNoAxesCombined,
  DatabaseZap,
  HeartPulse,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const adminNavigation: Array<{
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}> = [
  { to: '/admin', label: 'Overview', icon: ChartNoAxesCombined, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/activity', label: 'Activity', icon: Activity },
  { to: '/admin/sources', label: 'Sources', icon: DatabaseZap },
  { to: '/admin/health', label: 'System health', icon: HeartPulse },
]

export default function AdminLayout() {
  return (
      <div className="page page--admin">
        <div className="page-intro">
          <p className="eyebrow">Workspace control</p>
          <h1>Administration</h1>
          <p className="page-intro__copy">
            View server health and manage registered source types.
          </p>
        </div>

        <div className="admin-layout">
          <nav className="admin-nav" aria-label="Administration">
            {adminNavigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `admin-nav__item${isActive ? ' admin-nav__item--active' : ''}`}
              >
                <item.icon size={16} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="admin-content">
            <Outlet />
          </div>
        </div>
      </div>
  )
}
