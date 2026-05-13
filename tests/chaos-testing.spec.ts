import { test, expect } from '@playwright/test';

test.describe('Chaos & Security Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Esperar a que la página cargue y buscar el botón de Log In o Get Started
    const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
    try {
      await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
      await loginBtn.click();
    } catch (e) {
      // Si no aparece, tal vez ya estamos en la página de login o dashboard
      console.log('Botón de login no encontrado o ya en sesión');
    }

    // Asegurar que el input de email esté visible antes de continuar
    await page.waitForSelector('input[type="email"]', { timeout: 10000 }).catch(() => {
      console.log('Email input not found, checking if already logged in');
    });
    
    if (await page.locator('input[type="email"]').isVisible()) {
      await page.fill('input[type="email"]', 'test@fostpos.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
    }
    
    await expect(page.locator('aside')).toBeVisible({ timeout: 20000 });
  });

  test('no debe permitir vender productos con stock 0', async ({ page }) => {
    // Usar selectores robustos para el sidebar
    await page.getByRole('button', { name: /Productos/i }).click();
    await page.getByRole('button', { name: /Añadir Producto/i }).click();

    const name = "Zero Stock Item";
    await page.fill('input[placeholder*="nombre"]', name);
    
    // Categoría
    await page.click('button:has-text("Seleccionar...")');
    await page.click('div[role="listbox"] div[role="option"]:first-child');

    // Tab Precios
    await page.click('button:has-text("Precios")');
    await page.fill('input[type="number"]', '1000'); // Precio de venta

    // Tab Stock -> Asegurar que sea 0
    await page.click('button:has-text("Stock")');
    // El stock inicial suele ser 0 por defecto, pero lo forzamos
    const stockInput = page.locator('input[type="number"]').nth(1); // El primero suele ser costo
    await stockInput.fill('0');

    await page.click('button:has-text("Guardar Producto")');
    
    // Ir a Venta
    await page.getByRole('button', { name: /Venta/i }).click();
    
    // Buscar el producto
    const productBtn = page.locator(`button:has-text("${name}")`).first();
    await expect(productBtn).toBeDisabled();
    await expect(productBtn).toHaveClass(/grayscale/);
  });

  test('prevención de XSS en nombres de productos', async ({ page }) => {
    await page.getByRole('button', { name: /Productos/i }).click();
    await page.getByRole('button', { name: /Añadir Producto/i }).click();

    const xssPayload = "<img src=x onerror=alert(1)> Malicious";
    await page.fill('input[placeholder*="nombre"]', xssPayload);
    
    await page.click('button:has-text("Seleccionar...")');
    await page.click('div[role="listbox"] div[role="option"]:first-child');

    await page.click('button:has-text("Precios")');
    await page.fill('input[type="number"]', '1000');

    await page.click('button:has-text("Guardar Producto")');

    // Ir a Venta y verificar que el payload se vea como texto literal
    await page.getByRole('button', { name: /Venta/i }).click();
    const productTitle = page.locator(`text=${xssPayload}`).first();
    await expect(productTitle).toBeVisible();
  });
});
