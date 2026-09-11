import axios from 'axios'
import { useCallback, useEffect, useRef, useState } from 'react'
import { apiReq, getApiErrorMessage } from '../constansts/requests'
import type { SessionResponse } from '../types/api'

export function useSession() {
  const [session, setSession] = useState<SessionResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const sequence = useRef(0)
  const channel = useRef<BroadcastChannel | null>(null)
  const clear = useCallback(() => {
    sequence.current += 1
    setSession(null)
    setLoading(false)
    setError(null)
  }, [])
  const restore = useCallback(async () => {
    const current = ++sequence.current
    try {
      const { data } = await apiReq.get<SessionResponse>('/auth/session')
      if (sequence.current === current) { setSession(data); setError(null) }
    } catch (cause) {
      if (sequence.current !== current) return
      setSession(null)
      if (!axios.isAxiosError(cause) || cause.response?.status !== 401) setError(getApiErrorMessage(cause))
    } finally {
      if (sequence.current === current) setLoading(false)
    }
  }, [])
  useEffect(() => {
    let active = true
    queueMicrotask(() => { if (active) void restore() })
    window.addEventListener('umbra:session-expired', clear)
    if ('BroadcastChannel' in window) {
      channel.current = new BroadcastChannel('umbra-session')
      channel.current.onmessage = () => clear()
    }
    return () => {
      active = false
      sequence.current += 1
      window.removeEventListener('umbra:session-expired', clear)
      channel.current?.close()
    }
  }, [clear, restore])
  const signIn = useCallback(async (credential: string) => {
    const current = ++sequence.current
    const { data } = await apiReq.post<SessionResponse>('/auth/google', { credential })
    if (sequence.current !== current) return
    setError(null)
    setSession(data)
    channel.current?.postMessage('account-changed')
  }, [])
  const logout = useCallback(async () => {
    await apiReq.post('/auth/logout')
    clear()
    channel.current?.postMessage('signed-out')
  }, [clear])
  const retry = useCallback(() => {
    setLoading(true)
    setError(null)
    return restore()
  }, [restore])
  return { session, loading, error, restore: retry, signIn, logout }
}
