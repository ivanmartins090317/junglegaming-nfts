import { defineConfig, devices } from '@playwright/test'

const baseURL = 'http://127.0.0.1:5173'
const mockOffURL = 'http://127.0.0.1:5174'

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 45_000,
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.03,
    },
  },
  use: {
    baseURL,
    trace: 'on-first-retry',
    locale: 'pt-BR',
  },
  projects: [
    {
      name: 'chromium-desktop',
      grepInvert: /@mobile/,
      testIgnore: ['**/mock-off.spec.ts', '**/visual.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'chromium-mobile',
      grep: /@mobile/,
      testIgnore: ['**/mock-off.spec.ts', '**/visual.spec.ts'],
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'visual-desktop',
      testMatch: /visual\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: 'visual-mobile',
      testMatch: /visual\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: 'mock-off',
      testMatch: /mock-off\.spec\.ts/,
      use: {
        ...devices['Pixel 5'],
        baseURL: mockOffURL,
        viewport: { width: 390, height: 844 },
      },
    },
  ],
  webServer: [
    {
      command: 'pnpm dev --host 127.0.0.1 --port 5173',
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'pnpm dev --host 127.0.0.1 --port 5174',
      url: mockOffURL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        ...process.env,
        VITE_ENABLE_MOCK: 'false',
      },
    },
  ],
})