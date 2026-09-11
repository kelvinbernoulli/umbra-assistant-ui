import { Mic, ShieldCheck, User, type LucideIcon } from 'lucide-react'
import { NavLink, Outlet } from 'react-router-dom'

const settingsNavigation: Array<{
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}> = [
  { to: '/settings', label: 'Preferences', icon: User, end: true },
  { to: '/settings/voice-language', label: 'Voice & language', icon: Mic },
  { to: '/settings/privacy-data', label: 'Privacy & data', icon: ShieldCheck },
]

export default function SettingsLayout() {
  return (
    <div className="page page--settings">
      <div className="page-intro">
        <p className="eyebrow">Your space</p>
        <h1>Settings</h1>
        <p className="page-intro__copy">Tune how Umbra works around you.</p>
      </div>

      <div className="settings-layout">
        <aside className="settings-nav" aria-label="Settings navigation">
          {settingsNavigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `settings-nav__item${isActive ? ' settings-nav__active' : ''}`}
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </aside>

        <div className="settings-content">
          <p className="page-intro__copy">Preferences are saved on this device. Server preference sync is not available yet.</p>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
