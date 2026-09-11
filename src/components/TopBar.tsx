import { Bell, Command, LockKeyhole, Mic, Moon, Search, Sun } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import type { VoiceMode } from '../context/UmbraContext'
import { useSettings } from '../hooks/useSettings'
import { useUmbra } from '../hooks/useUmbra'
import { pageTitles } from '../navigation'
import { BrandMark } from './BrandMark'

type TopBarProps = {
  onOpen: (mode?: VoiceMode) => void
}

export default function TopBar({ onOpen }: TopBarProps) {
  const location = useLocation()
  const { theme, toggleTheme, auth } = useUmbra()
  const { settings } = useSettings()
  const title = pageTitles[location.pathname] ?? 'Umbra'

  return (
    <header className="topbar">
      <div className="topbar__mobile-brand">
        <BrandMark compact />
        <span>{title}</span>
      </div>
      <button className="command-trigger" onClick={() => onOpen('type')} aria-keyshortcuts="Control+K Meta+K">
        <Search size={15} strokeWidth={1.8} />
        <span>Search your memory or ask Umbra…</span>
        <kbd><Command size={11} /> K</kbd>
      </button>
      <div className="topbar__actions">
        <span className="private-label"><LockKeyhole size={12} /> Private workspace</span>
        <button className="icon-button theme-trigger" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button className="icon-button mic-trigger" onClick={() => onOpen('voice')} disabled={!settings.voiceCommands} aria-label={settings.voiceCommands ? 'Start a voice command' : 'Voice commands are disabled'}>
          <Mic size={17} />
        </button>
        <Link to="/notifications" className="icon-button notification-button" aria-label="Notifications"><Bell size={17} /></Link>
        {auth ? <Link to="/settings" className="topbar__avatar" aria-label="Open settings">{auth.user.name.trim().split(/\s+/).map(part => part[0]).slice(0, 2).join('')}</Link>
          : <Link to="/signin" state={{ from: location.pathname + location.search }} className="button button--gold topbar-sign-in">Sign in</Link>}
      </div>
    </header>
  )
}
