import { useCallback } from 'react'
import type { TimelineEvent } from '../types/api'
import { useApiRequest } from './useApiRequest'

export function useTimeline() {
  const { execute, ...state } = useApiRequest<TimelineEvent[]>()
  const fetchTimeline = useCallback((limit = 50) => execute({
    method: 'GET', url: '/timeline', params: { limit },
  }), [execute])
  return { ...state, events: state.data, fetchTimeline }
}
