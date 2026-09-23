import { expect, test } from '@playwright/test'

for (const reducedMotion of ['no-preference', 'reduce']) {
  test.describe(`Loader motion: ${reducedMotion}`, () => {
    test.use({ reducedMotion })

    test('session loader keeps animating while the request is pending', async ({ page }) => {
      await page.route('**/auth/session', () => {})
      await page.goto('/signin', { waitUntil: 'domcontentloaded' })
      const loader = page.getByRole('status').filter({ hasText: 'Checking your session' })
      await expect(loader).toBeVisible()
      const spinner = loader.locator('.loading-indicator__spinner')
      for (const pseudo of ['::before', '::after']) {
        const initial = await spinner.evaluate((element, pseudo) => {
          const style = getComputedStyle(element, pseudo)
          return { transform: style.transform, duration: style.animationDuration, iterations: style.animationIterationCount }
        }, pseudo)
        expect(initial.iterations).toBe('infinite')
        expect(parseFloat(initial.duration)).toBeGreaterThan(0.1)
        await expect.poll(() => spinner.evaluate((element, pseudo) => getComputedStyle(element, pseudo).transform, pseudo)).not.toBe(initial.transform)
      }
    })
  })
}
