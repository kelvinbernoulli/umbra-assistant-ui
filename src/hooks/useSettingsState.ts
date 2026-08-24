import { useCallback, useEffect, useState } from 'react'
import { defaultSettings, type UmbraSettings } from '../context/SettingsContext'

const settingsStorageKey = 'umbra-settings'

function getInitialSettings(): UmbraSettings {
  if (typeof window === 'undefined') return defaultSettings

  try {
    const savedSettings = window.localStorage.getItem(settingsStorageKey)
    if (savedSettings) {
      return { ...defaultSettings, ...JSON.parse(savedSettings) as Partial<UmbraSettings> }
    }
  } catch {
    // Fall back to defaults when storage is unavailable or contains invalid JSON.
  }

  return defaultSettings
}

export function useSettingsState() {
  const [settings, setSettings] = useState<UmbraSettings>(getInitialSettings)

  useEffect(() => {
    try {
      window.localStorage.setItem(settingsStorageKey, JSON.stringify(settings))
    } catch {
      // Keep settings active for the current session when persistence is unavailable.
    }
  }, [settings])

  const updateSettings = useCallback((updates: Partial<UmbraSettings>) => {
    setSettings((current) => ({ ...current, ...updates }))
  }, [])

  const resetSettings = useCallback(() => {
    setSettings({ ...defaultSettings })
  }, [])

  return { settings, updateSettings, resetSettings }
}
