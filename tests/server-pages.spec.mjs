import { expect, test } from '@playwright/test'

const account = { user: { id: 'user-one', name: 'Test User', email: 'user@example.com' }, workspace: { id: 'workspace-one' } }

test.beforeEach(async ({ page }) => {
  await page.route('**/api/v1/auth/session', route => route.fulfill({ json: account }))
  await page.route('**/api/v1/auth/challenge', route => route.fulfill({ json: { nonce: 'test-nonce' } }))
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, (route) => route.abort())
  await page.route('https://accounts.google.com/gsi/client*', (route) => route.fulfill({ contentType: 'application/javascript', body: 'window.google = { accounts: { oauth2: { initCodeClient: () => ({ requestCode() {} }) } } };' }))
})

test('Google Calendar handles popup closure and exchange failure, then refreshes the saved connection', async ({ page }) => {
  await page.route('https://accounts.google.com/gsi/client*', (route) => route.fulfill({
    contentType: 'application/javascript',
    body: `window.google = { accounts: { oauth2: { initCodeClient(config) {
      window.calendarScope = config.scope;
      return { requestCode() {
        if (window.googlePopupMode !== 'success') config.error_callback({ type: 'popup_closed' });
        else config.callback({ code: 'test-google-code', scope: config.scope });
      } };
    } } } };`,
  }))
  let connected = false
  let fail = true
  const exchanges = []
  await page.route('**/api/v1/connections', (route) => route.fulfill({ json: [{ id: null, provider: 'gcal', status: connected ? 'connected' : 'disconnected', connected_at: null }] }))
  await page.route('**/api/v1/auth/google/save', async (route) => {
    exchanges.push({ body: route.request().postDataJSON(), headers: route.request().headers() })
    if (fail) { await route.fulfill({ status: 503, json: { detail: 'Connection storage unavailable' } }); return }
    connected = true
    await route.fulfill({ json: { status: 'success', message: 'Google Calendar connected.' } })
  })
  await openAccount(page)
  await navigate(page, 'Connections')
  const button = page.getByRole('button', { name: 'Connect Google Calendar', exact: true })
  await expect(button).toBeEnabled()
  await button.click()
  await expect(page.getByRole('alert')).toContainText('Google sign-in was closed')
  expect(exchanges).toHaveLength(0)
  await page.evaluate(() => { window.googlePopupMode = 'success' })
  await button.click()
  await expect(page.getByRole('alert')).toContainText('Connection storage unavailable')
  await expect(page.getByText('0 of 1 sources connected')).toBeVisible()
  fail = false
  await button.click()
  await expect(page.getByText('Google Calendar connected.')).toBeVisible()
  await expect(page.getByText('1 of 1 sources connected')).toBeVisible()
  expect(exchanges.at(-1).body).toEqual({ code: 'test-google-code' })
  expect(exchanges.at(-1).headers['x-api-key']).toBeUndefined()
  expect(exchanges.at(-1).headers['x-requested-with']).toBe('XmlHttpRequest')
  expect(await page.evaluate(() => window.calendarScope)).toBe('https://www.googleapis.com/auth/calendar.readonly')
  await expect(button).toHaveCount(0)
})

test('Google library failure leaves the rest of Sources usable', async ({ page }) => {
  await page.route('https://accounts.google.com/gsi/client*', (route) => route.abort())
  await page.route('**/api/v1/connections', (route) => route.fulfill({ json: [{ id: null, provider: 'gcal', status: 'disconnected', connected_at: null }] }))
  await openAccount(page)
  await navigate(page, 'Connections')
  await expect(page.getByRole('alert')).toContainText('Google sign-in could not load')
  await expect(page.getByRole('button', { name: 'Connect Google Calendar', exact: true })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Refresh status' })).toBeEnabled()
})

async function navigate(page, name) {
  await page.getByRole('complementary', { name: 'Primary navigation' }).getByRole('link', { name, exact: true }).click()
}

async function openAccount(page) {
  await page.goto('/settings', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('button', { name: 'Sign out', exact: true })).toBeVisible()
  await expect(page.getByLabel('API key', { exact: true })).toHaveCount(0)
}

test('brief shows loading, reports failure, and retries using the server response', async ({ page }) => {
  let fail = true
  let release
  const ready = new Promise((resolve) => { release = resolve })
  await page.route('**/api/v1/brief/today', async (route) => {
    await ready
    await route.fulfill({ status: fail ? 503 : 200, json: fail ? { detail: 'Brief temporarily unavailable' } : { title: 'Brief from the API', summary: 'A unique server summary.' } })
  })
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('status')).toHaveText('Loading from Umbra…')
  release()
  await expect(page.getByRole('alert')).toContainText('Brief temporarily unavailable')
  fail = false
  await page.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('heading', { name: 'Brief from the API' })).toBeVisible()
  await expect(page.getByText('A unique server summary.')).toBeVisible()
  await expect(page.getByText('Dave asked about dinner')).toHaveCount(0)
})

test('session restoration supplies access and expiry removes private content', async ({ page }) => {
  const requests = []
  let expired = false
  await page.route('**/api/v1/timeline*', async route => {
    requests.push(route.request().headers())
    await route.fulfill(expired ? { status: 401, json: { detail: 'Session expired' } } : { json: [{ id: 'one', source: 'gmail', type: 'message', timestamp: '2026-09-10T09:00:00Z', title: 'Private workspace record', detail: 'Full content' }] })
  })
  await page.goto('/timeline', { waitUntil: 'domcontentloaded' })
  await expect(page.getByText('Private workspace record')).toBeVisible()
  expect(requests.at(-1)['x-api-key']).toBeUndefined()
  expect(requests.at(-1)['x-workspace-id']).toBeUndefined()
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.getByText('Private workspace record')).toBeVisible()
  expired = true
  await page.getByRole('button', { name: /Refresh/ }).click()
  await expect(page.getByRole('heading', { name: 'Welcome to your workspace' })).toBeVisible()
  await expect(page.getByText('Private workspace record')).toHaveCount(0)
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('workspace-one')
})

test('search submits the query and shows real snippets or an empty state', async ({ page }) => {
  const bodies = []
  await page.route('**/api/v1/search', async (route) => {
    const body = route.request().postDataJSON()
    bodies.push(body)
    await route.fulfill({ json: body.query === 'missing' ? [] : [{ id: 'match-one', snippet: 'The server found this exact text.' }] })
  })
  await openAccount(page)
  await navigate(page, 'Search')
  await page.getByRole('textbox', { name: 'Search memory' }).fill('invoice')
  await page.getByRole('button', { name: 'Search', exact: true }).click()
  await expect(page.getByText('The server found this exact text.')).toBeVisible()
  expect(bodies.at(-1)).toEqual({ query: 'invoice', limit: 100 })
  await page.getByRole('textbox', { name: 'Search memory' }).fill('missing')
  await page.getByRole('button', { name: 'Search', exact: true }).click()
  await expect(page.getByText('No matching items. Try different words.')).toBeVisible()
  await expect(page.getByText('The server found this exact text.')).toHaveCount(0)
})

test('disconnect requires confirmation, reports errors, and refreshes after success', async ({ page }) => {
  let connected = true
  let fail = true
  let writes = 0
  await page.route('**/api/v1/connections', (route) => route.fulfill({ json: [{ id: 'connection-one', provider: 'gcal', status: connected ? 'connected' : 'disconnected', connected_at: null }] }))
  await page.route('**/api/v1/connections/gcal/disconnect', async (route) => {
    writes++
    if (fail) { await route.fulfill({ status: 500, json: { detail: 'Disconnect failed' } }); return }
    connected = false
    await route.fulfill({ json: { id: null, provider: 'gcal', status: 'disconnected', connected_at: null } })
  })
  await openAccount(page)
  await navigate(page, 'Connections')
  await expect(page.getByText('1 of 1 sources connected')).toBeVisible()
  await page.getByRole('button', { name: 'Disconnect', exact: true }).click()
  expect(writes).toBe(0)
  await page.getByRole('button', { name: 'Confirm disconnect' }).click()
  await expect(page.getByRole('alert')).toHaveText('Disconnect failed')
  await expect(page.getByText('1 of 1 sources connected')).toBeVisible()
  fail = false
  await page.getByRole('button', { name: 'Confirm disconnect' }).click()
  await expect(page.getByText('0 of 1 sources connected')).toBeVisible()
  expect(writes).toBe(2)
})

test('calendar uses saved event records and does not invent scheduled times', async ({ page }) => {
  await page.route('**/api/v1/timeline*', (route) => route.fulfill({ json: [
    { id: 'event', source: 'gcal', type: 'event', title: 'Calendar API item', detail: 'Event payload', timestamp: '2026-09-10T09:00:00Z' },
    { id: 'message', source: 'gmail', type: 'message', title: 'Excluded message', detail: 'Message payload', timestamp: '2026-09-10T09:00:00Z' },
  ] }))
  await openAccount(page)
  await navigate(page, 'Calendar')
  await expect(page.getByText('Calendar API item')).toBeVisible()
  await expect(page.getByText('Excluded message')).toHaveCount(0)
  await expect(page.getByText('scheduled start and end times are not available yet.', { exact: false })).toBeVisible()
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByText('Calendar API item')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: 'test-results/calendar-mobile.png' })
})

test('health and commands display server values without fabricated success', async ({ page }) => {
  await page.route('http://localhost:4173/health', (route) => route.fulfill({ json: { status: 'ok', app: 'Test Umbra server', env: 'test', using_mock_vectorstore: true, using_mock_embeddings: false } }))
  await page.route('**/api/v1/commands', (route) => route.fulfill({ json: { success: true, message: 'Command received, no reminder created.' } }))
  await page.goto('/admin/health', { waitUntil: 'domcontentloaded' })
  await expect(page.getByText('Test Umbra server')).toBeVisible()
  await expect(page.getByText('Mock', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /Search your memory or ask Umbra/ }).click()
  await page.getByRole('textbox', { name: 'Search or command' }).fill('Remind me to call someone')
  await page.getByRole('button', { name: 'Run command' }).click()
  await expect(page.getByText('Command received, no reminder created.')).toBeVisible()
  await expect(page.getByText('Server response', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Confirm', exact: true })).toHaveCount(0)
})
