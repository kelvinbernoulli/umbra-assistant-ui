import { useCallback } from 'react'
import type { RegistryItem, RegistryKind } from '../types/api'
import { useApiRequest } from './useApiRequest'

export function useTypeRegistry(kind: RegistryKind) {
  const { execute, ...state } = useApiRequest<RegistryItem[]>()
  const fetchTypes = useCallback(() => execute({
    method: 'GET', url: `/types/${kind}`,
  }), [execute, kind])
  return { ...state, items: state.data, fetchTypes }
}

export function useAddRegistryType(kind: RegistryKind) {
  const { execute, ...state } = useApiRequest<RegistryItem, { name: string }>()
  const addType = useCallback((name: string) => execute({
    method: 'POST', url: `/types/${kind}`, data: { name },
  }), [execute, kind])
  return { ...state, addType }
}
