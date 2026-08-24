import { useCallback, useMemo, useRef, useState } from 'react'
import {
  adminAuditActivity,
  adminKpis,
  adminSourceHealth,
  adminSystemHealth,
  adminUsageTrend30Days,
  adminUsageTrend7Days,
  adminUsers,
  type AdminAuditEvent,
  type AdminRange,
  type AdminSourceId,
  type AdminUser,
} from '../adminData'
import type {
  AdminActivityInput,
  AdminContextValue,
} from '../context/AdminContext'

type AdminSnapshot = Pick<
  AdminContextValue,
  'users' | 'sources' | 'activity' | 'systemHealth' | 'lastHealthRefresh'
>

type AdminStore = AdminSnapshot & {
  history: AdminSnapshot[]
}

const historyLimit = 20

function createInitialSnapshot(): AdminSnapshot {
  return {
    users: adminUsers.map((user) => ({ ...user })),
    sources: adminSourceHealth.map((source) => ({ ...source })),
    activity: adminAuditActivity.map((event) => ({ ...event })),
    systemHealth: adminSystemHealth.map((service) => ({ ...service })),
    lastHealthRefresh: 'Not refreshed this session',
  }
}

function snapshotStore(store: AdminStore): AdminSnapshot {
  return {
    users: store.users,
    sources: store.sources,
    activity: store.activity,
    systemHealth: store.systemHealth,
    lastHealthRefresh: store.lastHealthRefresh,
  }
}

function actionForStatus(status: AdminUser['status']): AdminUser['action'] {
  if (status === 'invited') return 'Resend invite'
  if (status === 'suspended') return 'Restore access'
  return 'View user'
}

function userStatusActivity(status: AdminUser['status']) {
  if (status === 'suspended') {
    return { action: 'Suspended user access', severity: 'warning' as const }
  }

  if (status === 'invited') {
    return { action: 'Moved user to invited', severity: 'info' as const }
  }

  return { action: 'Restored user access', severity: 'success' as const }
}

export function useAdminState(): AdminContextValue {
  const [range, setRange] = useState<AdminRange>('7d')
  const [store, setStore] = useState<AdminStore>(() => ({
    ...createInitialSnapshot(),
    history: [],
  }))
  const activitySequence = useRef(0)

  const createActivity = useCallback((input: AdminActivityInput): AdminAuditEvent => {
    activitySequence.current += 1

    return {
      id: `evt-local-${Date.now()}-${activitySequence.current}`,
      actor: input.actor ?? 'Kelvin Admin',
      initials: input.initials ?? 'KA',
      action: input.action,
      target: input.target,
      category: input.category,
      severity: input.severity,
      time: 'Just now',
    }
  }, [])

  const commit = useCallback((
    update: (current: AdminSnapshot) => AdminSnapshot,
    event?: AdminAuditEvent,
  ) => {
    setStore((current) => {
      const previous = snapshotStore(current)
      const updated = update(previous)
      const nextActivity = event ? [event, ...updated.activity] : updated.activity

      return {
        ...updated,
        activity: nextActivity,
        history: [previous, ...current.history].slice(0, historyLimit),
      }
    })
  }, [])

  const updateUserStatus = useCallback((userId: string, status: AdminUser['status']) => {
    const target = store.users.find((user) => user.id === userId)
    if (!target || target.status === status) return

    const activityCopy = userStatusActivity(status)
    commit(
      (current) => ({
        ...current,
        users: current.users.map((user) => user.id === userId
          ? { ...user, status, action: actionForStatus(status) }
          : user),
      }),
      createActivity({
        ...activityCopy,
        target: target.name,
        category: 'user',
      }),
    )
  }, [commit, createActivity, store.users])

  const updateUserRole = useCallback((userId: string, role: AdminUser['role']) => {
    const target = store.users.find((user) => user.id === userId)
    if (!target || target.role === role) return

    commit(
      (current) => ({
        ...current,
        users: current.users.map((user) => user.id === userId ? { ...user, role } : user),
      }),
      createActivity({
        action: `Changed role to ${role}`,
        target: target.name,
        category: 'user',
        severity: 'info',
      }),
    )
  }, [commit, createActivity, store.users])

  const toggleSource = useCallback((sourceId: AdminSourceId) => {
    const target = store.sources.find((source) => source.id === sourceId)
    if (!target) return

    const resuming = target.status === 'paused'
    commit(
      (current) => ({
        ...current,
        sources: current.sources.map((source) => source.id === sourceId
          ? {
              ...source,
              status: resuming ? 'operational' : 'paused',
              action: resuming ? 'View logs' : 'Resume source',
              lastEvent: resuming ? 'Just now' : source.lastEvent,
            }
          : source),
      }),
      createActivity({
        action: resuming ? 'Resumed source ingestion' : 'Paused source ingestion',
        target: target.name,
        category: 'source',
        severity: resuming ? 'success' : 'warning',
      }),
    )
  }, [commit, createActivity, store.sources])

  const retrySource = useCallback((sourceId: AdminSourceId) => {
    const target = store.sources.find((source) => source.id === sourceId)
    if (!target) return

    commit(
      (current) => ({
        ...current,
        sources: current.sources.map((source) => source.id === sourceId
          ? {
              ...source,
              status: 'operational',
              action: 'View logs',
              deliveryRate: Math.max(source.deliveryRate, 99.9),
              latency: source.id === 'calendar' ? '1.8s' : source.latency,
              lastEvent: 'Just now',
            }
          : source),
      }),
      createActivity({
        action: 'Retried source synchronization',
        target: target.name,
        category: 'source',
        severity: 'success',
      }),
    )
  }, [commit, createActivity, store.sources])

  const logActivity = useCallback((input: AdminActivityInput) => {
    commit((current) => current, createActivity(input))
  }, [commit, createActivity])

  const refreshHealth = useCallback(() => {
    const refreshedAt = new Intl.DateTimeFormat(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date())

    commit(
      (current) => ({
        ...current,
        systemHealth: current.systemHealth.map((service) => ({
          ...service,
          lastChecked: 'Just now',
        })),
        lastHealthRefresh: refreshedAt,
      }),
      createActivity({
        action: 'Refreshed system health checks',
        target: 'All platform services',
        category: 'system',
        severity: 'success',
      }),
    )
  }, [commit, createActivity])

  const undoLastAction = useCallback(() => {
    setStore((current) => {
      const [previous, ...remainingHistory] = current.history
      if (!previous) return current

      return {
        ...previous,
        history: remainingHistory,
      }
    })
  }, [])

  const resetAdminState = useCallback(() => {
    setStore((current) => ({
      ...createInitialSnapshot(),
      history: [snapshotStore(current), ...current.history].slice(0, historyLimit),
    }))
  }, [])

  const usageTrend = range === '7d' ? adminUsageTrend7Days : adminUsageTrend30Days

  return useMemo(() => ({
    range,
    setRange,
    kpis: adminKpis,
    usageTrend,
    users: store.users,
    sources: store.sources,
    activity: store.activity,
    systemHealth: store.systemHealth,
    lastHealthRefresh: store.lastHealthRefresh,
    canUndo: store.history.length > 0,
    updateUserStatus,
    updateUserRole,
    toggleSource,
    retrySource,
    logActivity,
    refreshHealth,
    undoLastAction,
    resetAdminState,
  }), [
    logActivity,
    range,
    refreshHealth,
    resetAdminState,
    retrySource,
    store,
    toggleSource,
    undoLastAction,
    updateUserRole,
    updateUserStatus,
    usageTrend,
  ])
}
