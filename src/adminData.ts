import type { Source } from './data'

export type AdminRange = '7d' | '30d'

export type AdminSourceId = Exclude<Source, 'manual'>

export type AdminKpi = {
  id: 'users' | 'items' | 'searches' | 'automation'
  label: string
  value: string
  change: number
  helper: string
}

export type AdminUsagePoint = {
  label: string
  activeUsers: number
  searches: number
  voiceCommands: number
  itemsIngested: number
}

export type AdminSourceHealth = {
  id: AdminSourceId
  name: string
  status: 'operational' | 'degraded' | 'paused'
  connectedUsers: number
  itemsToday: number
  deliveryRate: number
  latency: string
  lastEvent: string
  action: 'View logs' | 'Restart sync' | 'Resume source'
}

export type AdminServiceHealth = {
  id: 'webhook-api' | 'normalization-worker' | 'embeddings' | 'pinecone' | 'llm-agent'
  name: string
  description: string
  status: 'operational' | 'degraded' | 'outage'
  uptime: number
  latency: string
  throughput: string
  lastChecked: string
}

export type AdminUser = {
  id: string
  name: string
  email: string
  initials: string
  role: 'member' | 'admin' | 'support'
  plan: 'Free' | 'Pro' | 'Team'
  status: 'active' | 'invited' | 'suspended'
  sourceCount: number
  itemsIndexed: number
  lastActive: string
  joined: string
  action: 'View user' | 'Resend invite' | 'Restore access'
}

export type AdminAuditEvent = {
  id: string
  actor: string
  initials: string
  action: string
  target: string
  category: 'user' | 'source' | 'security' | 'system'
  severity: 'info' | 'warning' | 'success'
  time: string
}

export const adminKpis: AdminKpi[] = [
  {
    id: 'users',
    label: 'Active users',
    value: '2,418',
    change: 12.4,
    helper: 'vs previous 30 days',
  },
  {
    id: 'items',
    label: 'Items indexed',
    value: '1.84M',
    change: 8.7,
    helper: 'across all namespaces',
  },
  {
    id: 'searches',
    label: 'Memory searches',
    value: '48.2K',
    change: 19.1,
    helper: '94.6% successful retrieval',
  },
  {
    id: 'automation',
    label: 'Commands completed',
    value: '13.7K',
    change: -2.3,
    helper: '91.8% completion rate',
  },
]

export const adminUsageTrend7Days: AdminUsagePoint[] = [
  { label: 'Mon', activeUsers: 1480, searches: 6200, voiceCommands: 1510, itemsIngested: 45200 },
  { label: 'Tue', activeUsers: 1630, searches: 7100, voiceCommands: 1780, itemsIngested: 49800 },
  { label: 'Wed', activeUsers: 1570, searches: 6850, voiceCommands: 1660, itemsIngested: 47600 },
  { label: 'Thu', activeUsers: 1810, searches: 7900, voiceCommands: 2130, itemsIngested: 55100 },
  { label: 'Fri', activeUsers: 1940, searches: 8420, voiceCommands: 2360, itemsIngested: 58400 },
  { label: 'Sat', activeUsers: 1190, searches: 4310, voiceCommands: 1240, itemsIngested: 32800 },
  { label: 'Sun', activeUsers: 1320, searches: 4870, voiceCommands: 1390, itemsIngested: 36100 },
]

export const adminUsageTrend30Days: AdminUsagePoint[] = [
  { label: 'Jul 23', activeUsers: 1094, searches: 4010, voiceCommands: 980, itemsIngested: 31800 },
  { label: 'Jul 24', activeUsers: 1138, searches: 4230, voiceCommands: 1040, itemsIngested: 33100 },
  { label: 'Jul 25', activeUsers: 1172, searches: 4390, voiceCommands: 1080, itemsIngested: 34500 },
  { label: 'Jul 26', activeUsers: 902, searches: 3260, voiceCommands: 790, itemsIngested: 26900 },
  { label: 'Jul 27', activeUsers: 986, searches: 3540, voiceCommands: 850, itemsIngested: 28400 },
  { label: 'Jul 28', activeUsers: 1214, searches: 4620, voiceCommands: 1150, itemsIngested: 36100 },
  { label: 'Jul 29', activeUsers: 1278, searches: 4910, voiceCommands: 1210, itemsIngested: 37800 },
  { label: 'Jul 30', activeUsers: 1310, searches: 5070, voiceCommands: 1280, itemsIngested: 38900 },
  { label: 'Jul 31', activeUsers: 1344, searches: 5290, voiceCommands: 1320, itemsIngested: 40200 },
  { label: 'Aug 01', activeUsers: 1381, searches: 5480, voiceCommands: 1360, itemsIngested: 41600 },
  { label: 'Aug 02', activeUsers: 1042, searches: 3760, voiceCommands: 920, itemsIngested: 29700 },
  { label: 'Aug 03', activeUsers: 1108, searches: 4020, voiceCommands: 990, itemsIngested: 31200 },
  { label: 'Aug 04', activeUsers: 1406, searches: 5620, voiceCommands: 1390, itemsIngested: 42800 },
  { label: 'Aug 05', activeUsers: 1438, searches: 5810, voiceCommands: 1430, itemsIngested: 43700 },
  { label: 'Aug 06', activeUsers: 1472, searches: 5980, voiceCommands: 1480, itemsIngested: 44900 },
  { label: 'Aug 07', activeUsers: 1516, searches: 6170, voiceCommands: 1540, itemsIngested: 46300 },
  { label: 'Aug 08', activeUsers: 1548, searches: 6340, voiceCommands: 1580, itemsIngested: 47100 },
  { label: 'Aug 09', activeUsers: 1126, searches: 4090, voiceCommands: 1020, itemsIngested: 31600 },
  { label: 'Aug 10', activeUsers: 1198, searches: 4380, voiceCommands: 1090, itemsIngested: 33400 },
  { label: 'Aug 11', activeUsers: 1584, searches: 6490, voiceCommands: 1620, itemsIngested: 48200 },
  { label: 'Aug 12', activeUsers: 1628, searches: 6730, voiceCommands: 1690, itemsIngested: 49400 },
  { label: 'Aug 13', activeUsers: 1662, searches: 6920, voiceCommands: 1750, itemsIngested: 50800 },
  { label: 'Aug 14', activeUsers: 1714, searches: 7240, voiceCommands: 1840, itemsIngested: 52600 },
  { label: 'Aug 15', activeUsers: 1768, searches: 7510, voiceCommands: 1960, itemsIngested: 54100 },
  { label: 'Aug 16', activeUsers: 1234, searches: 4470, voiceCommands: 1130, itemsIngested: 34100 },
  { label: 'Aug 17', activeUsers: 1480, searches: 6200, voiceCommands: 1510, itemsIngested: 45200 },
  { label: 'Aug 18', activeUsers: 1630, searches: 7100, voiceCommands: 1780, itemsIngested: 49800 },
  { label: 'Aug 19', activeUsers: 1570, searches: 6850, voiceCommands: 1660, itemsIngested: 47600 },
  { label: 'Aug 20', activeUsers: 1810, searches: 7900, voiceCommands: 2130, itemsIngested: 55100 },
  { label: 'Aug 21', activeUsers: 1940, searches: 8420, voiceCommands: 2360, itemsIngested: 58400 },
]

export const adminSourceHealth: AdminSourceHealth[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    status: 'operational',
    connectedUsers: 1842,
    itemsToday: 28431,
    deliveryRate: 99.98,
    latency: '1.2s',
    lastEvent: '18 sec ago',
    action: 'View logs',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    status: 'operational',
    connectedUsers: 2164,
    itemsToday: 19782,
    deliveryRate: 99.94,
    latency: '2.4s',
    lastEvent: '42 sec ago',
    action: 'View logs',
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    status: 'degraded',
    connectedUsers: 2038,
    itemsToday: 6421,
    deliveryRate: 96.72,
    latency: '8.7s',
    lastEvent: '4 min ago',
    action: 'Restart sync',
  },
]

export const adminSystemHealth: AdminServiceHealth[] = [
  {
    id: 'webhook-api',
    name: 'Webhook API',
    description: 'Receives signed events from every connected source.',
    status: 'operational',
    uptime: 99.99,
    latency: '84ms',
    throughput: '628 events/min',
    lastChecked: '12 sec ago',
  },
  {
    id: 'normalization-worker',
    name: 'Normalization worker',
    description: 'Converts incoming events into Umbra memory records.',
    status: 'operational',
    uptime: 99.97,
    latency: '146ms',
    throughput: '604 jobs/min',
    lastChecked: '18 sec ago',
  },
  {
    id: 'embeddings',
    name: 'Embedding service',
    description: 'Generates semantic vectors for normalized content.',
    status: 'operational',
    uptime: 99.94,
    latency: '382ms',
    throughput: '571 vectors/min',
    lastChecked: '21 sec ago',
  },
  {
    id: 'pinecone',
    name: 'Pinecone index',
    description: 'Stores and retrieves vectors in isolated user namespaces.',
    status: 'operational',
    uptime: 99.99,
    latency: '71ms',
    throughput: '1.8K queries/min',
    lastChecked: '9 sec ago',
  },
  {
    id: 'llm-agent',
    name: 'LLM agent',
    description: 'Synthesizes briefs and interprets user commands.',
    status: 'degraded',
    uptime: 99.82,
    latency: '2.8s',
    throughput: '214 runs/min',
    lastChecked: '15 sec ago',
  },
]

export const adminUsers: AdminUser[] = [
  {
    id: 'usr-1042',
    name: 'Amara Okafor',
    email: 'amara@northstar.co',
    initials: 'AO',
    role: 'support',
    plan: 'Pro',
    status: 'active',
    sourceCount: 3,
    itemsIndexed: 12842,
    lastActive: '2 min ago',
    joined: 'Aug 04, 2026',
    action: 'View user',
  },
  {
    id: 'usr-1038',
    name: 'Daniel Kim',
    email: 'daniel@atelier.io',
    initials: 'DK',
    role: 'support',
    plan: 'Team',
    status: 'active',
    sourceCount: 3,
    itemsIndexed: 9481,
    lastActive: '18 min ago',
    joined: 'Jul 28, 2026',
    action: 'View user',
  },
  {
    id: 'usr-1031',
    name: 'Sofia Mendes',
    email: 'sofia@lumina.dev',
    initials: 'SM',
    role: 'member',
    plan: 'Free',
    status: 'invited',
    sourceCount: 0,
    itemsIndexed: 0,
    lastActive: 'Never',
    joined: 'Aug 20, 2026',
    action: 'Resend invite',
  },
  {
    id: 'usr-1026',
    name: 'Noah Williams',
    email: 'noah@fieldnote.app',
    initials: 'NW',
    role: 'member',
    plan: 'Pro',
    status: 'suspended',
    sourceCount: 2,
    itemsIndexed: 6204,
    lastActive: '3 days ago',
    joined: 'Jun 12, 2026',
    action: 'Restore access',
  },
  {
    id: 'usr-1021',
    name: 'Priya Shah',
    email: 'priya@formwork.studio',
    initials: 'PS',
    role: 'admin',
    plan: 'Team',
    status: 'active',
    sourceCount: 3,
    itemsIndexed: 18790,
    lastActive: '34 min ago',
    joined: 'May 19, 2026',
    action: 'View user',
  },
  {
    id: 'usr-1018',
    name: 'Lucas Bernard',
    email: 'lucas@northline.fr',
    initials: 'LB',
    role: 'member',
    plan: 'Free',
    status: 'active',
    sourceCount: 1,
    itemsIndexed: 2188,
    lastActive: '1 hr ago',
    joined: 'Aug 11, 2026',
    action: 'View user',
  },
  {
    id: 'usr-1012',
    name: 'Zainab Bello',
    email: 'zainab@commonroom.ng',
    initials: 'ZB',
    role: 'member',
    plan: 'Pro',
    status: 'active',
    sourceCount: 2,
    itemsIndexed: 7742,
    lastActive: '4 hr ago',
    joined: 'Apr 27, 2026',
    action: 'View user',
  },
  {
    id: 'usr-1007',
    name: 'Ethan Brooks',
    email: 'ethan@daybreak.work',
    initials: 'EB',
    role: 'member',
    plan: 'Team',
    status: 'invited',
    sourceCount: 0,
    itemsIndexed: 0,
    lastActive: 'Never',
    joined: 'Aug 21, 2026',
    action: 'Resend invite',
  },
  {
    id: 'usr-1003',
    name: 'Hana Sato',
    email: 'hana@orbit.jp',
    initials: 'HS',
    role: 'admin',
    plan: 'Pro',
    status: 'active',
    sourceCount: 3,
    itemsIndexed: 11026,
    lastActive: 'Yesterday',
    joined: 'Mar 08, 2026',
    action: 'View user',
  },
  {
    id: 'usr-0998',
    name: 'Mateo Rivera',
    email: 'mateo@casauno.mx',
    initials: 'MR',
    role: 'member',
    plan: 'Free',
    status: 'suspended',
    sourceCount: 1,
    itemsIndexed: 1483,
    lastActive: '8 days ago',
    joined: 'Feb 16, 2026',
    action: 'Restore access',
  },
]

export const adminAuditActivity: AdminAuditEvent[] = [
  {
    id: 'evt-8821',
    actor: 'Kelvin Admin',
    initials: 'KA',
    action: 'Suspended user access',
    target: 'Noah Williams',
    category: 'user',
    severity: 'warning',
    time: '12 min ago',
  },
  {
    id: 'evt-8818',
    actor: 'Umbra Monitor',
    initials: 'UM',
    action: 'Detected elevated sync latency',
    target: 'Google Calendar',
    category: 'system',
    severity: 'warning',
    time: '31 min ago',
  },
  {
    id: 'evt-8812',
    actor: 'Maya Chen',
    initials: 'MC',
    action: 'Updated retention policy',
    target: '90-day event logs',
    category: 'security',
    severity: 'info',
    time: '2 hr ago',
  },
  {
    id: 'evt-8806',
    actor: 'Umbra Monitor',
    initials: 'UM',
    action: 'Completed connector recovery',
    target: 'Gmail webhook',
    category: 'source',
    severity: 'success',
    time: '5 hr ago',
  },
  {
    id: 'evt-8799',
    actor: 'Kelvin Admin',
    initials: 'KA',
    action: 'Resent workspace invitation',
    target: 'Sofia Mendes',
    category: 'user',
    severity: 'success',
    time: 'Yesterday, 4:18 PM',
  },
  {
    id: 'evt-8791',
    actor: 'Umbra Monitor',
    initials: 'UM',
    action: 'Rotated webhook signing key',
    target: 'WhatsApp connector',
    category: 'security',
    severity: 'success',
    time: 'Yesterday, 11:42 AM',
  },
  {
    id: 'evt-8784',
    actor: 'Maya Chen',
    initials: 'MC',
    action: 'Exported analytics report',
    target: 'August usage summary',
    category: 'system',
    severity: 'info',
    time: 'Aug 20, 2026',
  },
  {
    id: 'evt-8776',
    actor: 'Kelvin Admin',
    initials: 'KA',
    action: 'Restored user access',
    target: 'Ibrahim Diallo',
    category: 'user',
    severity: 'success',
    time: 'Aug 19, 2026',
  },
  {
    id: 'evt-8768',
    actor: 'Umbra Monitor',
    initials: 'UM',
    action: 'Rejected invalid webhook signature',
    target: 'Unknown Gmail request',
    category: 'security',
    severity: 'warning',
    time: 'Aug 18, 2026',
  },
  {
    id: 'evt-8759',
    actor: 'Maya Chen',
    initials: 'MC',
    action: 'Paused source maintenance window',
    target: 'Google Calendar',
    category: 'source',
    severity: 'info',
    time: 'Aug 17, 2026',
  },
]
