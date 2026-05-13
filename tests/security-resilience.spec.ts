import { test, expect } from '@playwright/test';

test.describe('5. Seguridad y Aislamiento (Multi-Tenant)', () => {
  test('Aislamiento de Sucursal', async ({ browser }) => {
    // Sucursal A
    const contextA = await browser.newContext();
    const pageA = await contextA.newPage();
    await pageA.goto('/');
    await pageA.fill('input[type="email"]', 'admin-sucursal-a@test.com');
    await pageA.fill('input[type="password"]', 'password123');
    await pageA.click('button[type="submit"]');

    // Sucursal B
    const contextB = await browser.newContext();
    const pageB = await contextB.newPage();
    await pageB.goto('/');
    await pageB.fill('input[type="email"]', 'admin-sucursal-b@test.com');
    await pageB.fill('input[type="password"]', 'password123');
    await pageB.click('button[type="submit"]');

    // Verificar que A no vea los productos de B
    await pageB.getByRole('button', { name: /Productos/i }).click();
    await pageB.getByRole('button', { name: /Añadir/i }).click();
    await pageB.fill('input[name="name"]', 'Producto Exclusivo B');
    await pageB.click('button:has-text("Guardar")');

    await pageA.getByRole('button', { name: /Productos/i }).click();
    await expect(pageA.locator('text=Producto Exclusivo B')).not.toBeVisible();
    
    await contextA.close();
    await contextB.close();
  });

  test('Persistencia del Carrito (F5)', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@fostpos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.getByRole('button', { name: /Venta/i }).click();
    await page.click('button:has-text("Test Product")');
    await expect(page.locator('aside')).toContainText('Test Product');

    await page.reload();
    await expect(page.locator('aside')).toContainText('Test Product');
  });
});

test.describe('Resiliencia y Chaos Testing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@fostpos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('El Doble Clic Asesino en Finalizar Venta', async ({ page }) => {
    await page.getByRole('button', { name: /Venta/i }).click();
    await page.click('button:has-text("Test Product")');
    await page.click('button:has-text("Procesar Venta")');
    
    const finalizeBtn = page.getByRole('button', { name: /Finalizar/i });
    // Clic rápido 3 veces
    await finalizeBtn.click({ clickCount: 3, delay: 50 });
    
    await expect(page.locator('text=Venta Exitosa')).toBeVisible();
    // Verificar que solo se creó UNA venta en el historial
    await page.getByRole('button', { name: /Reportes/i }).click();
    await page.click('text=Ventas Recientes');
    const rows = page.locator('tr:has-text("Test Product")');
    await expect(rows).toHaveCount(1);
  });

  test('Stock Fantasma (Venta Simultánea)', async ({ browser }) => {
    // Necesitamos dos páginas con el mismo usuario
    const context = await browser.newContext();
    const page1 = await context.newPage();
    const page2 = await context.newPage();

    for (const p of [page1, page2]) {
      await p.goto('/');
      await p.fill('input[type="email"]', 'test@fostpos.com');
      await p.fill('input[type="password"]', 'password123');
      await p.click('button[type="submit"]');
      await p.getByRole('button', { name: /Venta/i }).click();
    }

    // Suponiendo stock: 1
    await page1.click('button:has-text("Test Product")');
    await page2.click('button:has-text("Test Product")');

    await page1.click('button:has-text("Procesar Venta")');
    await page2.click('button:has-text("Procesar Venta")');

    // Finalizar en ambas casi al tiempo
    await Promise.all([
      page1.click('button:has-text("Finalizar")'),
      page2.click('button:has-text("Finalizar")')
    ]);

    // Una debe fallar o el stock no debe ser -1
    const errorMsg = page1.locator('text=Stock insuficiente').or(page2.locator('text=Stock insuficiente'));
    await expect(errorMsg).toBeVisible();
  });

  test('Eliminación con Dependencias', async ({ page }) => {
    await page.getByRole('button', { name: /Inventario/i }).click();
    await page.getByRole('button', { name: /Categorías/i }).click();
    
    // Intentar eliminar categoría con productos
    await page.click('tr:has-text("Test Category") button:has-text("Eliminar")');
    await page.click('button:has-text("Confirmar")');
    
    await expect(page.locator('text=No se puede eliminar|Existen productos asociados')).toBeVisible();
  });

  test('Precios y Cantidades Negativas', async ({ page }) => {
    await page.getByRole('button', { name: /Productos/i }).click();
    await page.click('tr:has-text("Test Product") button:has-text("Editar")');
    
    await page.fill('input[name="salePrice"]', '-100');
    await page.click('button:has-text("Guardar")');
    
    await expect(page.locator('text=El precio debe ser mayor a 0')).toBeVisible();
  });
});

test.describe('Seguridad (Malicious User)', () => {
  test('Salto de URL (IDOR)', async ({ page }) => {
    // Login como Cajero
    await page.goto('/');
    await page.fill('input[type="email"]', 'cajero@test.com');
    await page.fill('input[type="password"]', 'cajero123');
    await page.click('button[type="submit"]');

    // Intentar acceder a panel de super admin o settings de otro tenant
    await page.goto('/super-admin/tenants');
    await expect(page.locator('text=403|Acceso Denegado')).toBeVisible();
  });

  test('Manipulación de Precios desde el DOM', async ({ page }) => {
    await page.goto('/');
    await page.fill('input[type="email"]', 'test@fostpos.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await page.getByRole('button', { name: /Venta/i }).click();
    await page.click('button:has-text("Test Product")');
    
    // Inyectar script para cambiar el valor del input de total en el carrito
    await page.evaluate(() => {
      const totalInput = document.querySelector('input[name="total"]') as HTMLInputElement;
      if (totalInput) totalInput.value = "1"; // Intentar pagar 1 peso
    });

    await page.click('button:has-text("Procesar Venta")');
    await page.click('button:has-text("Finalizar")');
    
    // El servidor debe rechazarlo o recalcular correctamente
    await expect(page.locator('text=Error de validación|Monto inválido')).toBeVisible();
  });
});
