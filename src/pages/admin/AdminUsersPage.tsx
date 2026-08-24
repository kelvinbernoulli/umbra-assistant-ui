import { CheckCircle2, RotateCcw, Search, UserRoundCheck, UserRoundX } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { AdminUser } from '../../adminData'
import AdminConfirmDialog from '../../components/admin/AdminConfirmDialog'
import AdminStatusBadge from '../../components/admin/AdminStatusBadge'
import AdminToolbar from '../../components/admin/AdminToolbar'
import { useAdmin } from '../../hooks/useAdmin'

type StatusFilter = 'all' | AdminUser['status']
type RoleFilter = 'all' | AdminUser['role']

export default function AdminUsersPage() {
  const { logActivity, updateUserRole, updateUserStatus, users } = useAdmin()
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [pendingSuspension, setPendingSuspension] = useState<AdminUser | null>(null)
  const [notice, setNotice] = useState('')

  const filteredUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return users.filter((user) => {
      const matchesQuery = !normalizedQuery || `${user.name} ${user.email} ${user.id}`.toLowerCase().includes(normalizedQuery)
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      return matchesQuery && matchesStatus && matchesRole
    })
  }, [query, roleFilter, statusFilter, users])

  const resetFilters = () => {
    setQuery('')
    setStatusFilter('all')
    setRoleFilter('all')
  }

  const runUserAction = (user: AdminUser) => {
    if (user.status === 'active') {
      setPendingSuspension(user)
      return
    }

    if (user.status === 'suspended') {
      updateUserStatus(user.id, 'active')
      setNotice(`${user.name} can access Umbra again.`)
      return
    }

    logActivity({ action: 'Resent workspace invitation', target: user.name, category: 'user', severity: 'success' })
    setNotice(`A new invitation was prepared for ${user.email}.`)
  }

  const confirmSuspension = () => {
    if (!pendingSuspension) return
    updateUserStatus(pendingSuspension.id, 'suspended')
    setNotice(`${pendingSuspension.name} was suspended in this admin session.`)
    setPendingSuspension(null)
  }

  return (
    <>
      <div className="admin-page-heading">
        <div><p className="eyebrow">Access management</p><h2>Users</h2><p>Manage roles and account access without exposing anyone’s private memory.</p></div>
      </div>

      <AdminToolbar
        label="Filter users"
        summary={`${filteredUsers.length} of ${users.length} users`}
        actions={<button className="button button--ghost" onClick={resetFilters}><RotateCcw size={14} /> Reset</button>}
      >
        <label className="admin-search-control"><span className="sr-only">Search users</span><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, or ID" /></label>
        <label><span className="sr-only">Filter by status</span><select className="setting-control" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}><option value="all">All statuses</option><option value="active">Active</option><option value="invited">Invited</option><option value="suspended">Suspended</option></select></label>
        <label><span className="sr-only">Filter by role</span><select className="setting-control" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}><option value="all">All roles</option><option value="member">Member</option><option value="support">Support</option><option value="admin">Admin</option></select></label>
      </AdminToolbar>

      {notice && <div className="settings-inline-status" role="status"><CheckCircle2 size={15} /> {notice}</div>}

      <div className="admin-table-wrap" tabIndex={0} aria-label="User management table">
        <table className="admin-table">
          <caption className="sr-only">Umbra users with account status, role, sources, indexed items, and management actions.</caption>
          <thead><tr><th scope="col">User</th><th scope="col">Status</th><th scope="col">Role</th><th scope="col">Sources</th><th scope="col">Indexed</th><th scope="col">Last active</th><th scope="col">Action</th></tr></thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td><div className="admin-user-cell"><span>{user.initials}</span><div><strong>{user.name}</strong><small>{user.email} · {user.plan}</small></div></div></td>
                <td><AdminStatusBadge label={user.status} tone={user.status === 'active' ? 'healthy' : user.status === 'suspended' ? 'error' : 'neutral'} /></td>
                <td><label><span className="sr-only">Role for {user.name}</span><select className="admin-role-select" value={user.role} onChange={(event) => updateUserRole(user.id, event.target.value as AdminUser['role'])} disabled={user.status === 'suspended'}><option value="member">Member</option><option value="support">Support</option><option value="admin">Admin</option></select></label></td>
                <td>{user.sourceCount}</td>
                <td>{user.itemsIndexed.toLocaleString()}</td>
                <td><span className="admin-table__muted">{user.lastActive}</span></td>
                <td><button className={`button ${user.status === 'active' ? 'button--ghost admin-action--danger' : 'button--outline'}`} onClick={() => runUserAction(user)}>{user.status === 'active' ? <UserRoundX size={14} /> : <UserRoundCheck size={14} />}{user.status === 'active' ? 'Suspend' : user.status === 'suspended' ? 'Restore' : 'Resend'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filteredUsers.length && <div className="empty-state"><Search size={23} /><strong>No users match those filters</strong><span>Reset the filters or try another search.</span></div>}
      </div>

      <AdminConfirmDialog
        open={Boolean(pendingSuspension)}
        title={`Suspend ${pendingSuspension?.name ?? 'this user'}?`}
        description="They will lose access to Umbra until an administrator restores the account. Their isolated data will not be deleted."
        confirmLabel="Suspend access"
        danger
        onCancel={() => setPendingSuspension(null)}
        onConfirm={confirmSuspension}
      />
    </>
  )
}
