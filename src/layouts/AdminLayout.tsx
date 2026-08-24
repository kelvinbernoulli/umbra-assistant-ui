import {
  Activity,
  ChartNoAxesCombined,
  DatabaseZap,
  HeartPulse,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'
import { AdminContext } from '../context/AdminContext'
import { useAdminState } from '../hooks/useAdminState'

const adminNavigation: Array<{
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}> = [
  { to: '/admin', label: 'Overview', icon: ChartNoAxesCombined, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/sources', label: 'Sources', icon: DatabaseZap },
  { to: '/admin/activity', label: 'Activity', icon: Activity },
  { to: '/admin/health', label: 'System health', icon: HeartPulse },
]

export default function AdminLayout() {
  const adminState = useAdminState()

  return (
    <AdminContext.Provider value={adminState}>
      <div className="page page--admin">
        <div className="page-intro">
          <p className="eyebrow">Workspace control</p>
          <h1>Administration</h1>
          <p className="page-intro__copy">
            Monitor Umbra, manage access, and keep every connected source healthy.
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
    </AdminContext.Provider>
  )
}
