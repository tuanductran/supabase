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

test.describe('Auth page', () => {
  test('Should be able to invite a new user', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 })
    await page.goto('http://localhost:8082/')

    const title = await page.locator('data-test-id=projectName')
    title.click()
    await page.locator('data-test-id=auth').click()
    await page.locator('data-test-id=inviteUser').click()

    await page.locator('data-test-id=userEmail').fill('francisco+1@supabase.io')
    page.locator('text=Invite user').click()
    const userEmail = await page.locator('td').first()
    await expect(userEmail).toHaveText('francisco@supabase.io')
  })
})
