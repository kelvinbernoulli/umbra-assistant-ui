import { useEffect } from 'react'
import type { VoiceMode } from '../context/UmbraContext'

export function useCommandShortcut(openCommand: (mode?: VoiceMode) => void) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openCommand('type')
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [openCommand])
}
