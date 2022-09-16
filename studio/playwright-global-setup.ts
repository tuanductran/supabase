import { chromium, FullConfig } from '@playwright/test'

import * as OTPAuth from 'otpauth'
// BWQWSK4WNXROF5DC
let totp = new OTPAuth.TOTP({
  label: 'Github',
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: process.env.USER_OTP_SECRET,
})

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1200, height: 900 })
  await page.goto(process.env.BASE_URL || 'http://localhost:8082')

  await page.locator('button:has-text("Sign In with GitHub")').first().click()

  await page.fill('input[name="login"]', 'pucho')
  await page.fill('input[name="password"]', 'quepasaconGH2000')
  await page.click('input[name="commit"]')
  // Pass 2FA
  await page.fill('input[name="otp"]', totp.generate())
  //   // In case verification has not started automatically on code submission
  //   try {
  //     if (
  //       (await page.locator('button[type="submit"]').isVisible()) &&
  //       (await page.locator('button[type="submit"]').isEnabled())
  //     ) {
  //       await page.click('button[type="submit"]')
  //     }
  //   } catch (e) {
  //     // that may be cause by auto submit and redirect
  //     console.log(e)
  //   }

  // reauthorize supabase if needed
  try {
    if (await page.locator('"Authorize supabase"').isVisible({ timeout: 2000 })) {
      await page.locator('"Authorize supabase"').hover()
      await page.locator('"Authorize supabase"').isEnabled({ timeout: 10000 })
      await page.click('"Authorize supabase"')
    }
  } catch (e) {
    // small probability that GH may ask for authorization of supabase again
  }
  await page.waitForNavigation({ url: process.env.BASE_URL || 'http://localhost:8082' })

  // Save signed-in state to 'storageState.json'.
  await page.context().storageState({ path: 'storageState.json' })
  await browser.close()
}

export default globalSetup
