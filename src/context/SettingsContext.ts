import { createContext } from 'react'

export type UmbraSettings = {
  morningBrief: boolean
  proactiveSuggestions: boolean
  voiceCommands: boolean
  spokenConfirmations: boolean
  autoSubmitVoice: boolean
  recognitionLanguage: string
  responseLanguage: string
  weekendBriefs: boolean
  briefTime: string
  importantMessages: boolean
  eventReminders: boolean
  reminderConfirmations: boolean
  quietHours: boolean
  quietStart: string
  quietEnd: string
  emailDigest: boolean
  semanticSearch: boolean
  crossSourceSuggestions: boolean
  locationTriggers: boolean
  retentionPeriod: string
  modelImprovement: boolean
}

export const defaultSettings: UmbraSettings = {
  morningBrief: true,
  proactiveSuggestions: false,
  voiceCommands: true,
  spokenConfirmations: true,
  autoSubmitVoice: true,
  recognitionLanguage: 'en-US',
  responseLanguage: 'same',
  weekendBriefs: false,
  briefTime: '07:30',
  importantMessages: true,
  eventReminders: true,
  reminderConfirmations: true,
  quietHours: true,
  quietStart: '22:00',
  quietEnd: '07:00',
  emailDigest: false,
  semanticSearch: true,
  crossSourceSuggestions: true,
  locationTriggers: true,
  retentionPeriod: 'forever',
  modelImprovement: false,
}

export type SettingsContextValue = {
  settings: UmbraSettings
  updateSettings: (updates: Partial<UmbraSettings>) => void
  resetSettings: () => void
}

export const SettingsContext = createContext<SettingsContextValue | null>(null)
