import { test, expect } from '@playwright/test'

test('Google sign-in opens the workspace, reload restores it, and logout returns to sign-in', async ({ page }) => {
  let signedIn = false
  const credentials = []
  const account = { user: { id: 'registered-user', name: 'Registered User', email: 'registered@example.com' }, workspace: { id: 'generated-workspace' } }
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort())
  await page.route('https://accounts.google.com/gsi/client*', route => route.fulfill({ contentType: 'application/javascript', body: `
    window.google = { accounts: { id: {
      initialize(config) { window.signInConfig = config },
      renderButton(element) { const button = document.createElement('button'); button.textContent = 'Sign in with Google'; button.onclick = () => window.signInConfig.callback({ credential: 'google-id-token' }); element.appendChild(button) },
      cancel() {}, disableAutoSelect() {}
    } } };
  ` }))
  await page.route('**/api/v1/auth/session', route => route.fulfill(signedIn ? { json: account } : { status: 401, json: { detail: 'Sign in' } }))
  await page.route('**/api/v1/auth/challenge', route => route.fulfill({ json: { nonce: 'server-challenge' } }))
  await page.route('**/api/v1/auth/google', async route => {
    credentials.push(route.request().postDataJSON())
    expect(route.request().headers()['x-requested-with']).toBe('XmlHttpRequest')
    signedIn = true
    await route.fulfill({ json: account })
  })
  await page.route('**/api/v1/auth/logout', route => { signedIn = false; return route.fulfill({ status: 204 }) })
  await page.goto('/settings', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('heading', { name: 'Welcome to your workspace' })).toBeVisible()
  await page.getByRole('button', { name: 'Sign in with Google' }).click()
  expect(await page.evaluate(() => window.signInConfig.nonce)).toBe('server-challenge')
  await expect(page.getByText('registered@example.com')).toBeVisible()
  expect(credentials).toEqual([{ credential: 'google-id-token' }])
  await expect(page.getByLabel('API key', { exact: true })).toHaveCount(0)
  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(page.getByText('registered@example.com')).toBeVisible()
  expect(await page.evaluate(() => JSON.stringify(localStorage) + JSON.stringify(sessionStorage))).not.toMatch(/google-id-token|generated-workspace/)
  await page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Welcome to your workspace' })).toBeVisible()
  await expect(page.getByText('registered@example.com')).toHaveCount(0)
})

test('a failed session request offers retry instead of showing signed-in pages', async ({ page }) => {
  await page.route('https://accounts.google.com/gsi/client*', route => route.abort())
  await page.route('**/api/v1/auth/session', route => route.fulfill({ status: 503, json: { detail: 'Session storage unavailable' } }))
  await page.goto('/timeline', { waitUntil: 'domcontentloaded' })
  await expect(page.getByRole('alert')).toContainText('Session storage unavailable')
  await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible()
  await expect(page.getByRole('complementary', { name: 'Primary navigation' })).toHaveCount(0)
})
