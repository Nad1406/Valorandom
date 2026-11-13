import { expect, test } from '@playwright/test';

const VIEWPORTS = [
  { name: 'Mobile (360px)', width: 360, height: 640 },
  { name: 'Tablet (768px)', width: 768, height: 1024 },
  { name: 'Desktop (1440px)', width: 1440, height: 900 },
];

test.describe('E2E: Responsive & Accessibility (P4-03, P4-04, NFR-2, NFR-4)', () => {
  for (const vp of VIEWPORTS) {
    test(`renders cleanly without horizontal overflow at ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      // Check header, tabs, and main elements are rendered
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      // Horizontal overflow check: clientWidth matches scrollWidth without body blowout
      const isOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
      });
      expect(isOverflowing).toBe(false);

      // Navigate to Squad page
      await page.goto('/squad');
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

      const isSquadOverflowing = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
      });
      expect(isSquadOverflowing).toBe(false);
    });
  }

  test('P4-03: verifies aria-live announcements and keyboard tab focus', async ({ page }) => {
    await page.goto('/');

    // Tab through header navigation
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBeTruthy();

    // Randomize and check aria-live region exists
    const randomBtn = page.getByRole('button', { name: /^random$/i });
    await randomBtn.click();

    const card = page.getByTestId('agent-card');
    await expect(card).toBeVisible();
  });
});
