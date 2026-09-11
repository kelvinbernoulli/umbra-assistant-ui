import { useCallback } from 'react'
import type { WebhookTokenResponse } from '../types/api'
import { useApiRequest } from './useApiRequest'

/** Explicit action: provisions or rotates a workspace's webhook token. */
export function useWorkspace(workspaceId: string) {
  const { execute, ...state } = useApiRequest<WebhookTokenResponse>()
  const provisionWebhookToken = useCallback(() => execute({
    method: 'POST', url: `/workspaces/${encodeURIComponent(workspaceId)}/webhook-token`,
  }), [workspaceId, execute])
  return { ...state, provisionWebhookToken }
}
