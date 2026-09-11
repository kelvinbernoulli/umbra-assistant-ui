import { useContext, useEffect, useRef, useState } from 'react'
import { useGoogleLogin, useGoogleOAuth } from '@react-oauth/google'
import { googleCalendarScope } from '../constansts/googleAuth'
import { GoogleAuthStatusContext } from '../context/GoogleAuthStatusContext'
import { useApiRequest } from './useApiRequest'

type GoogleAuthResponse = { status: string; message: string }

export function useGoogleCalendar(onConnected: (message: string) => void) {
  const { scriptLoadedSuccessfully } = useGoogleOAuth()
  const scriptError = useContext(GoogleAuthStatusContext)
  const { execute, error: requestError, reset } = useApiRequest<GoogleAuthResponse, { code: string }>()
  const [isLoading, setIsLoading] = useState(false)
  const [oauthError, setOauthError] = useState<string | null>(null)
  const mounted = useRef(false)
  const pending = useRef(false)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  function finish(message: string | null) {
    if (!mounted.current) return
    pending.current = false
    setIsLoading(false)
    setOauthError(message)
  }

  const login = useGoogleLogin({
    flow: 'auth-code',
    ux_mode: 'popup',
    scope: googleCalendarScope,
    overrideScope: true,
    onSuccess: async ({ code }) => {
      if (!mounted.current || !pending.current) return
      const result = await execute({
        method: 'POST', url: '/auth/google/save', data: { code },
        headers: { 'X-Requested-With': 'XmlHttpRequest' },
      })
      if (!mounted.current) return
      if (result && result.status !== 'success') { finish(result.message); return }
      finish(null)
      if (result) onConnected(result.message)
    },
    onError: () => finish('Google authorization was declined. You can try connecting again.'),
    onNonOAuthError: ({ type }) => finish(type === 'popup_closed'
      ? 'Google sign-in was closed. Your connection has not changed.'
      : 'Google sign-in could not open. Allow popups for this site and try again.'),
  })

  function connect() {
    if (pending.current || !scriptLoadedSuccessfully || scriptError) return
    pending.current = true
    setIsLoading(true)
    setOauthError(null)
    reset()
    try { login() } catch { finish('Google sign-in could not open. Please try again.') }
  }

  return {
    connect, isLoading,
    isReady: scriptLoadedSuccessfully && !scriptError,
    error: scriptError ? 'Google sign-in could not load. Check your connection and reload the page.' : oauthError || requestError,
  }
}
