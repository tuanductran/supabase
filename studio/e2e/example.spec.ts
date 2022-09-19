import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'parallel' })

test.describe('Project page', () => {
  test('should default page with created projects', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 })
    await page.goto('http://localhost:8082/')

    const title = await page.locator('data-test-id=projectName')
    await expect(title).toHaveText('friday16')
    title.click()

    const projectTitle = await page.locator('data-test-id=projectName')
    await expect(projectTitle).toHaveText('friday16')

    await page.locator('data-test-id=editor').click()
  })
})
