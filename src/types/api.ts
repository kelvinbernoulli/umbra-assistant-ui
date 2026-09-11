export type BriefResponse = { title: string; summary: string }
export type SearchRequest = {
  query: string
  source?: string | null
  document_type?: string | null
  limit?: number
}
export type SearchResult = { id: string; snippet: string }
export type TimelineEvent = {
  id: string
  source: string
  type: string
  timestamp: string
  title: string
  detail: string
}
export type ConnectionResponse = {
  id: string | null
  provider: string
  status: string
  connected_at: string | null
}
export type CommandResponse = { success: boolean; message: string }
export type RegistryItem = { name: string; is_default: boolean; created_at: number }
export type RegistryKind = 'sources' | 'document-types'
export type WebhookTokenResponse = { workspace_id: string; token: string }
export type SessionResponse = { user: { id: string; name: string; email: string }; workspace: { id: string } }
