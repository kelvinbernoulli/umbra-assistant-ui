import { expect, test } from '@playwright/test'

for (const [path, title] of [['/privacy', 'Privacy policy'], ['/terms', 'Terms of service']]) {
  test(`${path} is public and readable without a backend`, async ({ page }) => {
    const apiRequests = []
    await page.route('**/api/**', route => { apiRequests.push(route.request().url()); return route.abort() })
    await page.route('https://accounts.google.com/**', route => route.abort())
    await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort())
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(path, { waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
    await expect(page).toHaveTitle(`${title} | Umbra`)
    await page.getByRole('heading', { name: 'Contact', exact: true }).scrollIntoViewIfNeeded()
    await expect(page.getByRole('heading', { name: 'Contact', exact: true })).toBeInViewport()
    expect(apiRequests).toEqual([])
    expect(await page.locator('.legal-page').evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
  })
}
