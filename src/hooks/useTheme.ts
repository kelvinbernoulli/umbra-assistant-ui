import { useCallback, useEffect, useState } from 'react'
import type { Theme } from '../context/UmbraContext'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'

  const appliedTheme = document.documentElement.dataset.theme
  if (appliedTheme === 'dark' || appliedTheme === 'light') return appliedTheme

  try {
    const savedTheme = window.localStorage.getItem('umbra-theme')
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme
  } catch {
    // Storage can be blocked in hardened browser modes; the system theme still works.
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  const toggleTheme = useCallback(() => {
    setTheme((current) => current === 'dark' ? 'light' : 'dark')
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme

    try {
      window.localStorage.setItem('umbra-theme', theme)
    } catch {
      // Keep the active theme even when persistence is unavailable.
    }

    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#12141a' : '#f7f4ee')
  }, [theme])

  return { theme, setTheme, toggleTheme }
}
