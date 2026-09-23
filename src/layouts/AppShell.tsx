import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import CommandDeck from '../components/CommandDeck'
import MobileNav from '../components/MobileNav'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import LegalLinks from '../components/LegalLinks'
import { SettingsContext } from '../context/SettingsContext'
import {
  UmbraContext,
  type VoiceMode,
} from '../context/UmbraContext'
import { useSession } from '../hooks/useSession'
import { useCommandShortcut } from '../hooks/useCommandShortcut'
import { useSettingsState } from '../hooks/useSettingsState'
import { useTheme } from '../hooks/useTheme'

export default function AppShell() {
  const sessionState = useSession()
  const session = sessionState.session
  return <AppFrame key={session ? `${session.user.id}:${session.workspace.id}` : 'signed-out'} sessionState={sessionState} />
}

function AppFrame({ sessionState }: { sessionState: ReturnType<typeof useSession> }) {
  const { session, loading, error, restore, signIn, logout } = sessionState
  const navigate = useNavigate()
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandMode, setCommandMode] = useState<VoiceMode>('type')
  const [commandSession, setCommandSession] = useState(0)
  const { theme, setTheme, toggleTheme } = useTheme()
  const settingsState = useSettingsState()
  const location = useLocation()
  const mainRef = useRef<HTMLElement>(null)

  const openCommand = useCallback((mode: VoiceMode = 'type') => {
    if (!session) { navigate('/signin', { state: { from: location.pathname + location.search } }); return }
    setCommandMode(mode)
    setCommandSession((current) => current + 1)
    setCommandOpen(true)
  }, [location.pathname, location.search, navigate, session])

  const closeCommand = useCallback(() => setCommandOpen(false), [])

  useCommandShortcut(openCommand)

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <SettingsContext.Provider value={settingsState}>
      <UmbraContext.Provider value={{ openCommand, theme, setTheme, toggleTheme, auth: session, logout, signIn, sessionLoading: loading, sessionError: error, retrySession: restore }}>
        <div className="app-shell">
          <Sidebar />
          <div className="app-column">
            <TopBar onOpen={openCommand} />
            <main className="app-main" ref={mainRef}>
              <Outlet key={session ? `${session.user.id}:${session.workspace.id}` : 'signed-out'} />
              <footer className="app-legal-footer"><LegalLinks /></footer>
            </main>
          </div>
          <MobileNav />
          <CommandDeck
            key={`${session?.user.id ?? 'signed-out'}:${commandSession}`}
            open={Boolean(session) && commandOpen}
            initialMode={commandMode}
            onClose={closeCommand}
          />
        </div>
      </UmbraContext.Provider>
    </SettingsContext.Provider>
  )
}
