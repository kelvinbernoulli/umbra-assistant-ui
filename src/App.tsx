import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout'
import AppShell from './layouts/AppShell'
import SettingsLayout from './layouts/SettingsLayout'
import BriefPage from './pages/BriefPage'
import CalendarPage from './pages/CalendarPage'
import ConnectionsPage from './pages/ConnectionsPage'
import NotFoundPage from './pages/NotFoundPage'
import NotificationsSettingsPage from './pages/NotificationsSettingsPage'
import PrivacyDataSettingsPage from './pages/PrivacyDataSettingsPage'
import SearchPage from './pages/SearchPage'
import SettingsPage from './pages/SettingsPage'
import SignInPage from './pages/SignInPage'
import NotificationsPage from './pages/NotificationsPage'
import TimelinePage from './pages/TimelinePage'
import VoiceLanguageSettingsPage from './pages/VoiceLanguageSettingsPage'
import AdminActivityPage from './pages/admin/AdminActivityPage'
import AdminHealthPage from './pages/admin/AdminHealthPage'
import AdminOverviewPage from './pages/admin/AdminOverviewPage'
import AdminSourcesPage from './pages/admin/AdminSourcesPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<BriefPage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="connections" element={<ConnectionsPage />} />
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="sources" element={<AdminSourcesPage />} />
            <Route path="activity" element={<AdminActivityPage />} />
            <Route path="health" element={<AdminHealthPage />} />
          </Route>
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<SettingsPage />} />
            <Route path="voice-language" element={<VoiceLanguageSettingsPage />} />
            <Route path="notifications" element={<NotificationsSettingsPage />} />
            <Route path="privacy-data" element={<PrivacyDataSettingsPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
