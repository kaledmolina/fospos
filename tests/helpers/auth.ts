import { Page } from '@playwright/test';

/**
 * Helper robusto de login reutilizable en todos los tests.
 * - Si ya está logueado (dashboard visible), no hace nada.
 * - Si hay landing page, hace click en "Log In / Get Started".
 * - Si aparece el form de login, rellena credenciales y hace submit.
 */
export async function loginAs(
  page: Page,
  email: string = 'test@fostpos.com',
  password: string = 'password123'
): Promise<void> {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Si ya hay dashboard (botón de Venta visible), está logueado
  const alreadyLoggedIn = await page.locator('[data-testid="pos-dashboard"], button:has-text("Venta")').isVisible().catch(() => false);
  if (alreadyLoggedIn) return;

  // Intentar click en "Log In / Get Started" si está en landing
  try {
    const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
    await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
    await loginBtn.click();
  } catch (_) {}

  // Esperar y rellenar el form de login
  try {
    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    if (await page.locator('input[type="email"]').isVisible()) {
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', password);
      await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
      // Esperar redirección al POS
      await page.waitForLoadState('networkidle');
    }
  } catch (_) {}
}

/**
 * Navega a un tab del sidebar del POS por nombre de grupo y tab.
 */
export async function navigateToTab(
  page: Page,
  groupName: string,
  tabName: string
): Promise<void> {
  // Abrir grupo si está colapsado (solo cuando el sidebar está abierto)
  const groupBtn = page.getByRole('button', { name: new RegExp(groupName, 'i') }).first();
  const isGroupVisible = await groupBtn.isVisible().catch(() => false);
  if (isGroupVisible) {
    await groupBtn.click().catch(() => {});
    await page.waitForTimeout(300);
  }

  // Hacer click en la pestaña
  const tabBtn = page.getByRole('button', { name: new RegExp(tabName, 'i') }).first();
  await tabBtn.waitFor({ state: 'visible', timeout: 8000 });
  await tabBtn.click();
  await page.waitForLoadState('networkidle');
}
