import { useCallback } from 'react'
import type { ConnectionResponse } from '../types/api'
import { useApiRequest } from './useApiRequest'

export function useConnections() {
  const { execute, ...state } = useApiRequest<ConnectionResponse[]>()
  const fetchConnections = useCallback(() => execute({
    method: 'GET', url: '/connections',
  }), [execute])
  return { ...state, connections: state.data, fetchConnections }
}

/** Refetch useConnections after a successful disconnect. */
export function useDisconnectConnection() {
  const { execute, ...state } = useApiRequest<ConnectionResponse>()
  const disconnect = useCallback((provider: string) => execute({
    method: 'POST', url: `/connections/${encodeURIComponent(provider)}/disconnect`,
  }), [execute])
  return { ...state, disconnect }
}
