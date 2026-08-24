import {
  createContext,
  type Dispatch,
  type SetStateAction,
} from 'react'
import type { Connection } from '../data'

export type VoiceMode = 'type' | 'voice'

export type Theme = 'dark' | 'light'

export type ParsedCommand = { title: string; description: string; meta: string }

export type CreatedReminder = ParsedCommand & { id: string }

export type UmbraContextValue = {
  openCommand: (mode?: VoiceMode) => void
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  connections: Connection[]
  setConnections: Dispatch<SetStateAction<Connection[]>>
  reminders: CreatedReminder[]
  addReminder: (reminder: ParsedCommand) => void
}

export const UmbraContext = createContext<UmbraContextValue | null>(null)
