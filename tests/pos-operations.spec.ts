import { test, expect } from '@playwright/test';

test.describe('3. Flujo Diario de Operación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
    try {
      await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
      await loginBtn.click();
    } catch (e) {}

    await page.waitForSelector('input[type="email"]', { timeout: 10000 }).catch(() => {});
    
    if (await page.locator('input[type="email"]').isVisible()) {
      await page.fill('input[type="email"]', 'test@fostpos.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
    }
  });

  test('A. Apertura de Caja', async ({ page }) => {
    await page.getByRole('button', { name: /Caja/i }).click();
    
    // Si ya está abierta, la cerramos para la prueba
    const closeBtn = page.getByRole('button', { name: /Cerrar Caja/i }).first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.fill('input[name="actualCash"]', '0');
      await page.click('button:has-text("Confirmar Cierre")');
    }

    await page.getByRole('button', { name: /Abrir Caja/i }).click();
    await page.fill('input[name="baseAmount"]', '50000');
    await page.click('button:has-text("Abrir Caja")');

    await expect(page.locator('text=Caja Abierta')).toBeVisible();
    await expect(page.locator('text=$50.000')).toBeVisible();
  });

  test('B. Ventas y Transacciones', async ({ page }) => {
    await page.getByRole('button', { name: /Venta/i }).click();

    // 1. Venta Rápida (Efectivo) con Cambio
    await page.click('button:has-text("Test Product")');
    await page.click('button:has-text("Procesar Venta")');
    await page.fill('input[name="receivedAmount"]', '2000'); 
    // El producto cuesta 1000 + IVA (según seeder)
    // Suponiendo total $1.190, cambio debe ser $810
    await expect(page.locator('text=Cambio: $810')).toBeVisible();
    await page.click('button:has-text("Finalizar")');

    // 2. Venta con Descuento (10%)
    await page.click('button:has-text("Test Product")');
    await page.click('button:has-text("Descuento")'); // Botón en el carrito o item
    await page.fill('input[name="discountPercent"]', '10');
    await page.click('button:has-text("Aplicar")');
    // Verificar que el total bajó
    await expect(page.locator('aside text=$1.071')).toBeVisible(); // 1190 - 119 = 1071
    await page.click('button:has-text("Procesar Venta")');
    await page.click('button:has-text("Finalizar")');

    // 3. Venta a Crédito (Fiado)
    await page.click('button:has-text("Test Product")');
    await page.click('button:has-text("Seleccionar Cliente")');
    await page.click('text=Cliente de Prueba'); // O crear uno rápido
    await page.click('button:has-text("Procesar Venta")');
    await page.click('button:has-text("Crédito")');
    await page.click('button:has-text("Finalizar")');

    // Verificar en módulo de Créditos
    await page.getByRole('button', { name: /Créditos/i }).click();
    await expect(page.locator('tr:has-text("Cliente de Prueba")')).toBeVisible();
  });

  test('C. Gestión de Gastos', async ({ page }) => {
    await page.getByRole('button', { name: /Caja/i }).click();
    await page.getByRole('button', { name: /Registrar Gasto/i }).click();
    await page.fill('input[name="description"]', 'Pago de almuerzo');
    await page.fill('input[name="amount"]', '15000');
    await page.click('button:has-text("Guardar Gasto")');

    await expect(page.locator('text=Gasto registrado')).toBeVisible();
    // El balance debe bajar
  });

  test('4. Cierre y Auditoría', async ({ page }) => {
    // 1. Abono a Crédito
    await page.getByRole('button', { name: /Créditos/i }).click();
    await page.click('tr:has-text("Cliente de Prueba") button:has-text("Abonar")');
    await page.fill('input[name="paymentAmount"]', '500');
    await page.click('button:has-text("Registrar Abono")');
    await expect(page.locator('text=Abono exitoso')).toBeVisible();

    // 2. Cierre de Caja (Arqueo) con Faltante
    await page.getByRole('button', { name: /Caja/i }).click();
    await page.click('button:has-text("Cerrar Caja")');
    
    // Si el sistema espera p.ej $40.000 y ponemos $35.000
    const expected = await page.locator('text=Efectivo Esperado:').innerText();
    const expectedVal = parseFloat(expected.replace(/[^0-9]/g, ''));
    await page.fill('input[name="actualCash"]', (expectedVal - 5000).toString());
    
    await page.click('button:has-text("Confirmar Cierre")');
    await expect(page.locator('text=Diferencia: -$5.000')).toBeVisible();
    await expect(page.locator('text=Estado: Faltante')).toBeVisible();

    // 3. Reporte de Ventas
    await page.getByRole('button', { name: /Reportes/i }).click();
    await page.click('text=Ventas del Día');
    await expect(page.locator('text=Total Ventas')).toBeVisible();
  });
});
