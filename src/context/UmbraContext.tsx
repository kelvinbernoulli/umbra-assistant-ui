import { createContext } from 'react'
import type { SessionResponse } from '../types/api'

export type VoiceMode = 'type' | 'voice'

export type Theme = 'dark' | 'light'

export type UmbraContextValue = {
  openCommand: (mode?: VoiceMode) => void
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  auth: SessionResponse | null
  sessionLoading: boolean
  sessionError: string | null
  retrySession: () => Promise<void>
  signIn: (credential: string) => Promise<void>
  logout: () => Promise<void>
}

export const UmbraContext = createContext<UmbraContextValue | null>(null)
