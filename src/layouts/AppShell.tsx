import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import CommandDeck from '../components/CommandDeck'
import MobileNav from '../components/MobileNav'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { SettingsContext } from '../context/SettingsContext'
import {
  UmbraContext,
  type VoiceMode,
} from '../context/UmbraContext'
import type { SessionResponse } from '../types/api'
import { useSession } from '../hooks/useSession'
import SignIn from '../components/SignIn'
import { useCommandShortcut } from '../hooks/useCommandShortcut'
import { useSettingsState } from '../hooks/useSettingsState'
import { useTheme } from '../hooks/useTheme'

export default function AppShell() {
  const { session, loading, error, restore, signIn, logout } = useSession()
  if (loading) return <main className="empty-state" role="status">Restoring your session…</main>
  if (error) return <main className="empty-state" role="alert"><p>{error}</p><button className="button button--outline" onClick={() => void restore()}>Try again</button></main>
  if (!session) return <SignIn signIn={signIn} />
  return <SignedInShell key={session.user.id + session.workspace.id} session={session} logout={logout} />
}

function SignedInShell({ session, logout }: { session: SessionResponse; logout: () => Promise<void> }) {
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandMode, setCommandMode] = useState<VoiceMode>('type')
  const [commandSession, setCommandSession] = useState(0)
  const { theme, setTheme, toggleTheme } = useTheme()
  const settingsState = useSettingsState()
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  const openCommand = useCallback((mode: VoiceMode = 'type') => {
    setCommandMode(mode)
    setCommandSession((current) => current + 1)
    setCommandOpen(true)
  }, [])

  const closeCommand = useCallback(() => setCommandOpen(false), [])

  useCommandShortcut(openCommand)

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <SettingsContext.Provider value={settingsState}>
      <UmbraContext.Provider value={{ openCommand, theme, setTheme, toggleTheme, auth: session, logout }}>
        <div className="app-shell">
          <Sidebar />
          <div className="app-column">
            <TopBar onOpen={openCommand} />
            <main className="app-main" ref={mainRef}>
              <Outlet />
            </main>
          </div>
          <MobileNav />
          <CommandDeck
            key={commandSession}
            open={commandOpen}
            initialMode={commandMode}
            onClose={closeCommand}
          />
        </div>
      </UmbraContext.Provider>
    </SettingsContext.Provider>
  )
}
