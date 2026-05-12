import { test, expect } from '@playwright/test';

test.describe('Flujo de Venta Completo', () => {
  test('debe abrir caja, vender un producto y verificar el balance', async ({ page }) => {
    // 1. Login
    await page.goto('/');
    
    // Si está en el setup, fallar con aviso
    if (await page.locator('text=Configuración del Motor').isVisible()) {
      throw new Error('Sistema en modo SETUP. Corre el seeder primero.');
    }

    // Login
    const loginBtn = page.getByRole('button', { name: /Log In/i }).first();
    if (await loginBtn.isVisible()) await loginBtn.click();

    await page.fill('input[type="email"]', 'test@fostpos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]:has-text("Iniciar Sesión")');

    // Dashboard
    await expect(page.locator('main')).toBeVisible({ timeout: 20000 });

    // 2. Navegar a "Caja" usando el icono de Wallet o el texto
    // Intentamos por rol y nombre (que es lo más robusto en Playwright)
    const cajaTab = page.getByRole('button', { name: /Caja/i });
    await cajaTab.click();
    
    // Abrir caja si está cerrada
    const openBtn = page.getByRole('button', { name: /Abrir Caja/i }).first();
    if (await openBtn.isVisible()) {
      await openBtn.click();
      await page.fill('div[role="dialog"] input[type="number"]', '50000');
      await page.click('div[role="dialog"] button:has-text("Abrir Caja")');
      await expect(page.locator('text=Caja Abierta')).toBeVisible();
    }

    // 3. Navegar a "Venta"
    const ventaTab = page.getByRole('button', { name: /Venta/i });
    await ventaTab.click();

    // 4. Agregar Producto
    const product = page.locator('button:has-text("Test Product")').first();
    await expect(product).toBeVisible();
    await product.click();

    // Verificar carrito
    await expect(page.locator('aside').filter({ hasText: 'Test Product' })).toBeVisible();

    // 5. Procesar Venta
    await page.click('button:has-text("Procesar Venta")');

    // Éxito
    await expect(page.locator('text=Venta Exitosa')).toBeVisible({ timeout: 15000 });
    
    // Cerrar
    const close = page.getByRole('button', { name: /Cerrar/i }).first();
    if (await close.isVisible()) await close.click();

    // 6. Verificar Caja Final
    await cajaTab.click();
    // Balance: 50000 + 1190 = 51190
    await expect(page.locator('text=$51.190')).toBeVisible();
  });
});
