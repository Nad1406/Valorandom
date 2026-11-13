import { expect, test } from '@playwright/test';

test.describe('E2E: Single Random & Offline Verification (P4-01, AC-01.1, AC-10.x, AC-04.1)', () => {
  test('AC-01.1: app operates 100% offline without network requests to valorant-api.com', async ({
    page,
  }) => {
    const apiRequests: string[] = [];

    // Intercept and record any API calls
    await page.route('**/*', (route) => {
      const url = route.request().url();
      if (url.includes('valorant-api.com/v1/')) {
        apiRequests.push(url);
        route.abort('blockedbyclient');
      } else {
        route.continue();
      }
    });

    await page.goto('/');

    // Verify app shell and single random page render cleanly
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/random/i);
    expect(apiRequests).toHaveLength(0);

    // Click random button and verify no API requests are dispatched
    const randomBtn = page.getByRole('button', { name: /^random$/i });
    await randomBtn.click();

    await expect(page.getByTestId('agent-card')).toBeVisible();
    expect(apiRequests).toHaveLength(0);
  });

  test('AC-10.x & AC-04.1: filters by role, custom pool selection, and empty state disable', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Filter by Duelist role
    const duelistBtn = page.getByRole('button', { name: /^duelist$/i });
    await duelistBtn.click();

    // 2. Click Random -> Card displays
    const randomBtn = page.getByRole('button', { name: /^random$/i });
    await randomBtn.click();

    const agentCard = page.getByTestId('agent-card');
    await expect(agentCard).toBeVisible();

    // Button updates to "Random lại" (Re-roll)
    const rerollBtn = page.getByRole('button', { name: /random lại/i });
    await expect(rerollBtn).toBeVisible();

    // 3. Test Custom Pool Selector: Deselect All
    const deselectAllBtn = page.getByRole('button', { name: /^bỏ chọn tất cả$/i });
    await deselectAllBtn.click();

    // Empty state should be visible and random button disabled
    await expect(page.getByRole('heading', { name: /không tìm thấy dữ liệu/i })).toBeVisible();
    await expect(rerollBtn).toBeDisabled();

    // 4. Select All restores the pool
    const selectAllBtn = page.getByRole('button', { name: /^chọn tất cả$/i }).first();
    await selectAllBtn.click();
    await expect(rerollBtn).toBeEnabled();
  });

  test('switches tabs to Map and Weapon, performing random draws', async ({ page }) => {
    await page.goto('/');

    // Switch to Map tab
    const mapTab = page.getByRole('tab', { name: /bản đồ/i });
    await mapTab.click();

    const toggle = page.getByRole('switch');
    await expect(toggle).toBeVisible();

    const randomMapBtn = page.getByRole('button', { name: /^random$/i });
    await randomMapBtn.click();
    await expect(page.getByTestId('map-card')).toBeVisible();

    // Switch to Weapon tab
    const weaponTab = page.getByRole('tab', { name: /vũ khí/i });
    await weaponTab.click();

    const randomWeaponBtn = page.getByRole('button', { name: /^random$/i });
    await randomWeaponBtn.click();
    await expect(page.getByTestId('weapon-card')).toBeVisible();
  });
});
