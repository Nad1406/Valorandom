import { expect, test } from '@playwright/test';

test.describe('E2E: Squad Random, Lock & Share Link (P4-02, AC-21.1, AC-23.x, AC-24.x)', () => {
  test('generates squad, locks an agent, rerolls with lock preserved, and hydrates from share link', async ({
    page,
    context,
  }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    await page.goto('/#/squad');

    // 1. Initial 5 slots rendered
    const slotCount = page.getByTestId('slot-count');
    await expect(slotCount).toHaveText(/5 \/ 5 slots/i);

    // 2. Click Random Squad -> renders results
    const randomBtn = page.getByRole('button', { name: /random đội hình/i });
    await randomBtn.click();

    await expect(page.getByText(/đội hình đã random/i)).toBeVisible();

    // 3. Lock agent Jett on slot 1
    const lockBtns = page.getByRole('button', { name: /\+ khóa đặc vụ/i });
    await lockBtns.first().click();

    // Modal dialog opens
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    // Search and select Jett
    const searchInput = page.getByPlaceholder(/tìm kiếm/i);
    await searchInput.fill('Jett');
    const jettBtn = page.getByRole('button', { name: /^jett$/i });
    await jettBtn.click();
    await expect(modal).not.toBeVisible();

    // Slot 1 now has locked Jett
    await expect(page.getByRole('button', { name: /mở khóa jett/i })).toBeVisible();

    // 4. Reroll squad -> Jett remains locked with badge
    const rerollBtn = page.getByRole('button', { name: /random lại/i });
    await rerollBtn.click();

    await expect(page.getByText('🔒 LOCKED')).toBeVisible();
    await expect(page.getByText(/đội hình đã random/i)).toBeVisible();

    // 5. Click Share Link
    const shareBtn = page.getByRole('button', { name: /chia sẻ link/i });
    await shareBtn.click();

    // Toast displays
    await expect(page.getByText(/đã sao chép link!/i)).toBeVisible();

    // URL contains ?s=
    await expect(page).toHaveURL(/\?s=/);
    const currentUrl = page.url();

    // 6. Navigate directly to the shared URL in a fresh page load (AC-24.2)
    await page.goto(currentUrl);

    // Verify state restored: slot 1 is locked with Jett
    await expect(page.getByRole('button', { name: /mở khóa jett/i })).toBeVisible();
  });

  test('AC-23.2: locking all slots disables random button', async ({ page }) => {
    await page.goto('/#/squad');

    // Remove 4 slots to leave 1 slot
    for (let i = 0; i < 4; i += 1) {
      const btn = page.getByRole('button', { name: /xóa slot/i }).first();
      await btn.click();
      await page.waitForTimeout(100);
    }
    const slotCount = page.getByTestId('slot-count');
    await expect(slotCount).toHaveText(/1 \/ 5 slots/i);

    // Lock the only slot
    const lockBtn = page.getByRole('button', { name: /\+ khóa đặc vụ/i });
    await lockBtn.click();
    await page.getByPlaceholder(/tìm kiếm/i).fill('Jett');
    await page.getByRole('button', { name: /^jett$/i }).click();

    // Random button is disabled with message
    const randomBtn = page.getByRole('button', { name: /random đội hình/i });
    await expect(randomBtn).toBeDisabled();
    await expect(page.getByText(/tất cả slot đã được khóa/i)).toBeVisible();
  });
});
