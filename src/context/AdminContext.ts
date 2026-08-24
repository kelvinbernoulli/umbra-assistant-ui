import { createContext } from 'react'
import type {
  AdminAuditEvent,
  AdminKpi,
  AdminRange,
  AdminServiceHealth,
  AdminSourceHealth,
  AdminSourceId,
  AdminUsagePoint,
  AdminUser,
} from '../adminData'

export type AdminActivityInput = Pick<
  AdminAuditEvent,
  'action' | 'target' | 'category' | 'severity'
> & Partial<Pick<AdminAuditEvent, 'actor' | 'initials'>>

export type AdminContextValue = {
  range: AdminRange
  setRange: (range: AdminRange) => void
  kpis: AdminKpi[]
  usageTrend: AdminUsagePoint[]
  users: AdminUser[]
  sources: AdminSourceHealth[]
  activity: AdminAuditEvent[]
  systemHealth: AdminServiceHealth[]
  lastHealthRefresh: string
  canUndo: boolean
  updateUserStatus: (userId: string, status: AdminUser['status']) => void
  updateUserRole: (userId: string, role: AdminUser['role']) => void
  toggleSource: (sourceId: AdminSourceId) => void
  retrySource: (sourceId: AdminSourceId) => void
  logActivity: (event: AdminActivityInput) => void
  refreshHealth: () => void
  undoLastAction: () => void
  resetAdminState: () => void
}

export const AdminContext = createContext<AdminContextValue | null>(null)
