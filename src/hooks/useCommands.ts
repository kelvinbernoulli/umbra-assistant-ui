import { useCallback } from 'react'
import type { CommandResponse } from '../types/api'
import { useApiRequest } from './useApiRequest'

export function useCommands() {
  const { execute, ...state } = useApiRequest<CommandResponse, { text: string }>()
  const submitCommand = useCallback((text: string) => execute({
    method: 'POST', url: '/commands', data: { text },
  }), [execute])
  return { ...state, submitCommand }
}
