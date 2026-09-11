import { useCallback } from 'react'
import type { SearchRequest, SearchResult } from '../types/api'
import { useApiRequest } from './useApiRequest'

export function useSearch() {
  const { execute, ...state } = useApiRequest<SearchResult[], SearchRequest>()
  const search = useCallback((request: SearchRequest) => execute({
    method: 'POST', url: '/search', data: request,
  }), [execute])
  return { ...state, results: state.data, search }
}
