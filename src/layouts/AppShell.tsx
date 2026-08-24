import { useCallback, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import CommandDeck from '../components/CommandDeck'
import MobileNav from '../components/MobileNav'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { SettingsContext } from '../context/SettingsContext'
import {
  UmbraContext,
  type CreatedReminder,
  type ParsedCommand,
  type VoiceMode,
} from '../context/UmbraContext'
import { initialConnections } from '../data'
import { useCommandShortcut } from '../hooks/useCommandShortcut'
import { useSettingsState } from '../hooks/useSettingsState'
import { useTheme } from '../hooks/useTheme'

export default function AppShell() {
  const [commandOpen, setCommandOpen] = useState(false)
  const [commandMode, setCommandMode] = useState<VoiceMode>('type')
  const [commandSession, setCommandSession] = useState(0)
  const [connections, setConnections] = useState(initialConnections)
  const [reminders, setReminders] = useState<CreatedReminder[]>([])
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

  const addReminder = useCallback((reminder: ParsedCommand) => {
    setReminders((current) => [{ ...reminder, id: `voice-${Date.now()}` }, ...current])
  }, [])

  useCommandShortcut(openCommand)

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <SettingsContext.Provider value={settingsState}>
      <UmbraContext.Provider value={{ openCommand, theme, setTheme, toggleTheme, connections, setConnections, reminders, addReminder }}>
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
