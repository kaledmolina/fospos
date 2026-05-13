import { test, expect } from '@playwright/test';

test.describe('Robustez de la Interfaz (UX)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@fostpos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('Pérdida de Sesión con Carrito Abierto', async ({ page, context }) => {
    await page.getByRole('button', { name: /Venta/i }).click();
    await page.click('button:has-text("Test Product")');
    
    // Borrar cookies para simular pérdida de sesión
    await context.clearCookies();
    
    await page.click('button:has-text("Procesar Venta")');
    // Debe redirigir a login o mostrar error de sesión
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('Nombres Gigantes y Diseño Responsivo', async ({ page }) => {
    await page.getByRole('button', { name: /Inventario/i }).click();
    await page.getByRole('button', { name: /Productos/i }).click();
    await page.getByRole('button', { name: /Añadir/i }).click();

    const giantName = "A".repeat(500);
    await page.fill('input[name="name"]', giantName);
    await page.click('button:has-text("Guardar")');

    // Verificar que no se rompa el layout (no hay scroll horizontal inesperado)
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(windowWidth);
  });

  test('Validación de Teclado (No letras en montos)', async ({ page }) => {
    await page.getByRole('button', { name: /Venta/i }).click();
    await page.click('button:has-text("Test Product")');
    await page.click('button:has-text("Procesar Venta")');
    
    const input = page.locator('input[name="receivedAmount"]');
    await input.fill('abc#$');
    const value = await input.inputValue();
    expect(value).toBe(''); // No debe permitir letras
  });
});

test.describe('Rendimiento y Estrés', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@fostpos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('Búsqueda con Gran Cantidad de Productos', async ({ page }) => {
    await page.getByRole('button', { name: /Venta/i }).click();
    
    const searchInput = page.locator('input[placeholder*="Buscar"]');
    
    // Medir tiempo de respuesta
    const start = Date.now();
    await searchInput.fill('a');
    await page.waitForLoadState('networkidle');
    const end = Date.now();
    
    expect(end - start).toBeLessThan(2000); // Menos de 2 segundos
  });

  test('Factura de 100 Items', async ({ page }) => {
    await page.getByRole('button', { name: /Venta/i }).click();
    
    // Agregar 100 veces el producto (o 100 productos diferentes)
    for (let i = 0; i < 100; i++) {
      await page.click('button:has-text("Test Product")');
    }
    
    await page.click('button:has-text("Procesar Venta")');
    await page.click('button:has-text("Finalizar")');
    
    await expect(page.locator('text=Venta Exitosa')).toBeVisible({ timeout: 30000 });
  });

  test('Manejo de Internet Inestable', async ({ page, context }) => {
    await page.getByRole('button', { name: /Venta/i }).click();
    await page.click('button:has-text("Test Product")');
    
    // Desconectar internet
    await context.setOffline(true);
    
    await page.click('button:has-text("Procesar Venta")');
    await page.click('button:has-text("Finalizar")');
    
    await expect(page.locator('text=Sin conexión|Error de red|Reintentar')).toBeVisible();
    
    // Volver a conectar
    await context.setOffline(false);
    await page.click('button:has-text("Reintentar")');
    await expect(page.locator('text=Venta Exitosa')).toBeVisible();
  });
});
