import { createContext } from 'react'

export type UmbraSettings = {
  voiceCommands: boolean
  spokenConfirmations: boolean
  autoSubmitVoice: boolean
  recognitionLanguage: string
  responseLanguage: string
}

export const defaultSettings: UmbraSettings = {
  voiceCommands: true,
  spokenConfirmations: true,
  autoSubmitVoice: true,
  recognitionLanguage: 'en-US',
  responseLanguage: 'same',
}

export type SettingsContextValue = {
  settings: UmbraSettings
  updateSettings: (updates: Partial<UmbraSettings>) => void
  resetSettings: () => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)
