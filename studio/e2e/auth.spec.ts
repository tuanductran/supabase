import { test, expect } from '@playwright/test'

test.describe('Auth page', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 })
    await page.goto('http://localhost:8082/')

    await page.locator('data-test-id=projectName').first().click()
    await page.locator('data-test-id=auth').click()
  })

  test('Should be able to invite a new user', async ({ page }) => {
    await page.locator('data-test-id=inviteUser').click()

    await page.locator('data-test-id=userEmail').fill('francisco+1@supabase.io')
    page.locator('text=Invite user').click()
    const userEmail = await page.locator('td').first()
    await expect(userEmail).toHaveText('francisco+1@supabase.io')
  })

  test('Should be able to create a policy', async ({ page }) => {
    await page.locator('text=policies').click()
    await page.locator('data-test-id=newPolicy').click()
    await page.locator('data-test-id=policyGetStartedQuickly').click()
  })
})
