export type Source = 'whatsapp' | 'gmail' | 'calendar' | 'manual'

export type TimelineItem = {
  id: string
  source: Source
  kind: 'message' | 'email' | 'event' | 'reminder'
  sender: string
  title: string
  preview: string
  body: string
  time: string
  day: 'Today' | 'Yesterday' | 'Earlier this week'
  unread?: boolean
  meta?: string
  attachment?: { name: string; size: string }
  insight?: string
}

export const sourceMeta: Record<Source, { label: string; shortLabel: string }> = {
  whatsapp: { label: 'WhatsApp', shortLabel: 'WA' },
  gmail: { label: 'Gmail', shortLabel: 'GM' },
  calendar: { label: 'Calendar', shortLabel: 'GC' },
  manual: { label: 'Umbra', shortLabel: 'UM' },
}

export const priorities = [
  {
    id: 'q3-feedback',
    title: 'Q3 report needs your feedback',
    detail: 'Maya asked for a review before Thursday. Two comments still need a response.',
    source: 'gmail' as Source,
    due: 'Due tomorrow',
    action: 'Review report',
  },
  {
    id: 'dave-dinner',
    title: 'Reply to Dave about Friday',
    detail: 'He suggested dinner at Noya and is waiting for a time that works.',
    source: 'whatsapp' as Source,
    due: 'Waiting 3h',
    action: 'Open message',
  },
  {
    id: 'dentist',
    title: 'Dentist at 2:00 PM',
    detail: 'Annual checkup at Broad Street Dental. Leave by 1:25 PM.',
    source: 'calendar' as Source,
    due: 'In 4 hours',
    action: 'View event',
  },
]

export const timelineItems: TimelineItem[] = [
  {
    id: 'wa-dave',
    source: 'whatsapp',
    kind: 'message',
    sender: 'Dave Morgan',
    title: 'Dinner on Friday?',
    preview: 'Dinner Friday? Noya has a table at 7:30. Let me know by tomorrow.',
    body: 'Hey Kelvin — dinner Friday? Noya has a table at 7:30. I can hold it until tomorrow afternoon. Let me know what works for you.',
    time: '9:42 AM',
    day: 'Today',
    unread: true,
    meta: 'Personal · 2 messages',
    insight: 'Dave is waiting for a reply, and the reservation hold expires tomorrow afternoon.',
  },
  {
    id: 'gm-q3',
    source: 'gmail',
    kind: 'email',
    sender: 'Maya Chen',
    title: 'Q3 report — final review',
    preview: 'Please review the updated acquisition section and send feedback before Thursday.',
    body: 'Hi Kelvin, I incorporated the team’s notes into the Q3 report. Could you review the updated acquisition section and resolve the two comments assigned to you before Thursday?',
    time: '8:17 AM',
    day: 'Today',
    unread: true,
    meta: 'Work · Has attachment',
    attachment: { name: 'Q3-report-final.pdf', size: '2.4 MB' },
    insight: 'This needs a response before Thursday and connects to your 11 AM focus block.',
  },
  {
    id: 'gc-dentist',
    source: 'calendar',
    kind: 'event',
    sender: 'Google Calendar',
    title: 'Dentist appointment',
    preview: 'Annual checkup at Broad Street Dental, 2:00–3:00 PM.',
    body: 'Annual dental checkup. Broad Street Dental, 18 Broad Street. Your travel time from the office is approximately 25 minutes.',
    time: '7:30 AM',
    day: 'Today',
    meta: '2:00–3:00 PM · 18 Broad Street',
    insight: 'Leave by 1:25 PM to arrive with a ten-minute buffer.',
  },
  {
    id: 'gm-flight',
    source: 'gmail',
    kind: 'email',
    sender: 'Aero',
    title: 'Your flight to New York is confirmed',
    preview: 'SFO → JFK · Sep 03 · Confirmation 7KQ2LM.',
    body: 'Your trip is confirmed. Flight AR 218 departs SFO at 8:20 AM on September 3 and arrives at JFK at 4:52 PM.',
    time: '6:04 PM',
    day: 'Yesterday',
    meta: 'Travel · Sep 03',
    insight: 'This trip overlaps with one work event that may need to be moved.',
  },
  {
    id: 'wa-family',
    source: 'whatsapp',
    kind: 'message',
    sender: 'Family group',
    title: 'Sunday lunch plans',
    preview: 'Mum: Let’s make it 1pm. I’ll send the address in the morning.',
    body: 'Mum: Let’s make it 1pm. I’ll send the address in the morning. Ada: Perfect, I’ll bring dessert.',
    time: '3:26 PM',
    day: 'Yesterday',
    meta: 'Family · 8 messages',
    insight: 'The final address is still pending. Umbra can watch the thread for it.',
  },
  {
    id: 'um-reminder',
    source: 'manual',
    kind: 'reminder',
    sender: 'Umbra Assistant',
    title: 'Renew design software',
    preview: 'Reminder created from your voice command last Monday.',
    body: 'Renew the design software subscription before the trial expires. Created from a voice command.',
    time: '11:10 AM',
    day: 'Earlier this week',
    meta: 'Due Aug 26 · Voice command',
    insight: 'Created from your voice command last Monday.',
  },
]

export const agenda = [
  {
    id: 'daily-standup',
    time: '9:30',
    period: 'AM',
    end: '9:50 AM',
    title: 'Product stand-up',
    detail: 'Umbra team · Google Meet',
    source: 'calendar' as Source,
    state: 'done',
  },
  {
    id: 'review-block',
    time: '11:00',
    period: 'AM',
    end: '12:00 PM',
    title: 'Focus block: Q3 review',
    detail: 'Protected focus time',
    source: 'manual' as Source,
    state: 'next',
  },
  {
    id: 'dentist-event',
    time: '2:00',
    period: 'PM',
    end: '3:00 PM',
    title: 'Dentist appointment',
    detail: 'Broad Street Dental · 25 min travel',
    source: 'calendar' as Source,
    state: 'upcoming',
  },
  {
    id: 'caroline-call',
    time: '4:30',
    period: 'PM',
    end: '5:00 PM',
    title: 'Call with Caroline',
    detail: 'Quarterly planning',
    source: 'calendar' as Source,
    state: 'upcoming',
  },
]

export const weekDays = [
  { label: 'Mon', date: '17', load: 2 },
  { label: 'Tue', date: '18', load: 3 },
  { label: 'Wed', date: '19', load: 1 },
  { label: 'Thu', date: '20', load: 4 },
  { label: 'Fri', date: '21', load: 4, active: true },
  { label: 'Sat', date: '22', load: 1 },
  { label: 'Sun', date: '23', load: 2 },
]

export const searchResults = [
  {
    id: 'result-q3-email',
    source: 'gmail' as Source,
    title: 'Q3 report — final review',
    context: 'Maya Chen · Today at 8:17 AM',
    snippet: 'Please review the updated acquisition section and send feedback before Thursday. Two comments are assigned to you.',
    score: '97% match',
    timelineId: 'gm-q3',
  },
  {
    id: 'result-q3-wa',
    source: 'whatsapp' as Source,
    title: 'Launch planning',
    context: 'Umbra Product · Tuesday at 4:51 PM',
    snippet: 'Maya: I moved the Q3 retention chart into the report. Kelvin, can you sanity-check the source numbers?',
    score: '89% match',
    timelineId: 'gm-q3',
  },
  {
    id: 'result-q3-calendar',
    source: 'calendar' as Source,
    title: 'Q3 close-out review',
    context: 'Calendar · Thursday at 3:00 PM',
    snippet: 'Review the final narrative, open comments, and acquisition numbers before the leadership share-out.',
    score: '82% match',
    timelineId: 'gm-q3',
  },
  {
    id: 'result-dentist',
    source: 'calendar' as Source,
    title: 'Dentist appointment',
    context: 'Calendar · Today at 2:00 PM',
    snippet: 'Annual checkup at Broad Street Dental. Leave by 1:25 PM for the 25-minute journey.',
    score: '98% match',
    timelineId: 'gc-dentist',
  },
  {
    id: 'result-flight',
    source: 'gmail' as Source,
    title: 'Your flight to New York is confirmed',
    context: 'Aero · Yesterday at 6:04 PM',
    snippet: 'SFO to JFK on September 3. Flight AR 218 departs at 8:20 AM. Confirmation 7KQ2LM.',
    score: '96% match',
    timelineId: 'gm-flight',
  },
  {
    id: 'result-dave',
    source: 'whatsapp' as Source,
    title: 'Dinner on Friday?',
    context: 'Dave Morgan · Today at 9:42 AM',
    snippet: 'Dave suggested Noya at 7:30 PM and needs an answer by tomorrow afternoon.',
    score: '94% match',
    timelineId: 'wa-dave',
  },
  {
    id: 'result-family',
    source: 'whatsapp' as Source,
    title: 'Sunday lunch plans',
    context: 'Family group · Yesterday at 3:26 PM',
    snippet: 'Sunday lunch is set for 1 PM. Mum will send the address in the morning.',
    score: '91% match',
    timelineId: 'wa-family',
  },
]

export type Connection = {
  id: Source
  name: string
  account: string
  description: string
  status: 'connected' | 'disconnected'
  lastSync?: string
  count?: string
}

export const initialConnections: Connection[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    account: '+234 ••• ••• 1042',
    description: 'Messages and shared links from your conversations.',
    status: 'connected',
    lastSync: '2 min ago',
    count: '1,284 items',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    account: 'kelvin@umbra.app',
    description: 'Email, attachments, and conversation threads.',
    status: 'connected',
    lastSync: '4 min ago',
    count: '3,921 items',
  },
  {
    id: 'calendar',
    name: 'Google Calendar',
    account: 'kelvin@umbra.app',
    description: 'Events, invites, locations, and meeting notes.',
    status: 'connected',
    lastSync: 'Just now',
    count: '286 events',
  },
]
