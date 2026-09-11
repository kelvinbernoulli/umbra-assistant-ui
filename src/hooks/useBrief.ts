import { useCallback } from 'react'
import { useApiRequest } from './useApiRequest'
import type { BriefResponse } from '../types/api'

export function useBrief() {
  const { execute, ...state } = useApiRequest<BriefResponse>()
  const fetchBrief = useCallback(() => execute({ method: 'GET', url: '/brief/today' }), [execute])

  return { ...state, brief: state.data, fetchBrief }
}
