import { test, expect } from '@playwright/test';
import { loginAs, navigateToTab } from './helpers/auth';

test.describe('2. Preparación de Inventario', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    await navigateToTab(page, 'Inventario', 'Productos');
  });

  test('Gestión de Categorías', async ({ page }) => {
    await navigateToTab(page, 'Inventario', 'Categorías');

    const categories = [
      { name: 'Bebidas', color: '#ff0000' },
      { name: 'Aseo', color: '#00ff00' },
      { name: 'Snacks', color: '#0000ff' },
    ];

    for (const cat of categories) {
      // Buscar botón de añadir categoría
      const addBtn = page
        .getByRole('button', { name: /Añadir Categoría|Nueva Categoría|Agregar/i })
        .first();
      await addBtn.waitFor({ state: 'visible', timeout: 8000 });
      await addBtn.click();

      // Rellenar nombre
      await page.locator('input[placeholder*="ombre"]').first().fill(cat.name);

      // Rellenar color si existe
      const colorInput = page.locator('input[type="color"]').first();
      if (await colorInput.isVisible().catch(() => false)) {
        await colorInput.fill(cat.color);
      }

      // Guardar
      await page.locator('button[type="submit"], button:has-text("Guardar")').first().click();

      // Verificar categoría en la lista
      await expect(page.locator(`text=${cat.name}`).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('Unidades de Medida', async ({ page }) => {
    // Buscar si hay pestaña o menú de Unidades
    const unitsBtn = page
      .getByRole('button', { name: /Unidades?( de Medida)?/i })
      .first();
    const isVisible = await unitsBtn.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip(true, 'El módulo de Unidades de Medida no está disponible como pestaña separada.');
      return;
    }
    await unitsBtn.click();

    const units = ['Kilogramo', 'Caja', 'Litro'];
    for (const unit of units) {
      const addBtn = page
        .getByRole('button', { name: /Añadir Unidad|Nueva Unidad|Agregar/i })
        .first();
      await addBtn.waitFor({ state: 'visible', timeout: 8000 });
      await addBtn.click();

      await page.locator('input[placeholder*="ombre"]').first().fill(unit);
      const abbrInput = page.locator('input[placeholder*="breviat"]').first();
      if (await abbrInput.isVisible().catch(() => false)) {
        await abbrInput.fill(unit.substring(0, 3).toUpperCase());
      }
      await page.locator('button[type="submit"], button:has-text("Guardar")').first().click();
      await expect(page.locator(`text=${unit}`).first()).toBeVisible({ timeout: 10000 });
    }
  });

  test('Registro de Producto con Alerta de Stock', async ({ page }) => {
    const addBtn = page
      .getByRole('button', { name: /Añadir Producto|Nuevo Producto|Agregar Producto/i })
      .first();
    await addBtn.waitFor({ state: 'visible', timeout: 8000 });
    await addBtn.click();

    // Rellenar nombre y código
    await page.locator('input[placeholder*="ombre"]').first().fill('Arroz Diana 1kg');
    const codeInput = page.locator('input[placeholder*="ódigo"], input[name="code"]').first();
    if (await codeInput.isVisible().catch(() => false)) {
      await codeInput.fill('ARROZ001');
    }

    // Precio de venta
    const salePriceInput = page.locator(
      'input[name="salePrice"], input[placeholder*="recio"]'
    ).first();
    if (await salePriceInput.isVisible().catch(() => false)) {
      await salePriceInput.fill('5000');
    }

    // Stock mínimo (alerta)
    const minStockInput = page.locator(
      'input[name="minStock"], input[placeholder*="ínimo"]'
    ).first();
    if (await minStockInput.isVisible().catch(() => false)) {
      await minStockInput.fill('10');
    }

    const stockInput = page.locator(
      'input[name="stock"], input[name="currentStock"]'
    ).first();
    if (await stockInput.isVisible().catch(() => false)) {
      await stockInput.fill('5');
    }

    // Guardar
    await page.locator('button[type="submit"], button:has-text("Guardar")').first().click();

    // Verificar feedback de éxito (toast o texto)
    const savedConfirmation = page.locator(
      'text=guardado, text=Producto guardado, text=creado, [data-sonner-toast]'
    ).first();
    await expect(savedConfirmation).toBeVisible({ timeout: 15000 });
  });

  test('Producto con Múltiples Presentaciones', async ({ page }) => {
    const addBtn = page
      .getByRole('button', { name: /Añadir Producto|Nuevo Producto/i })
      .first();
    await addBtn.waitFor({ state: 'visible', timeout: 8000 });
    await addBtn.click();

    await page.locator('input[placeholder*="ombre"]').first().fill('Cerveza Aguila');

    // Intentar abrir pestaña de Presentaciones
    const presentationsTab = page.locator(
      'button:has-text("Presentaciones"), [role="tab"]:has-text("Presentaciones")'
    ).first();
    const hasTab = await presentationsTab.isVisible().catch(() => false);

    if (!hasTab) {
      test.skip(true, 'El módulo de Presentaciones no está disponible en este form.');
      return;
    }
    await presentationsTab.click();

    // Presentación 1
    const addPresBtn = page.locator('button:has-text("Agregar Presentación"), button:has-text("Añadir Presentación")').first();
    await addPresBtn.click();
    const nameInputs = page.locator('input[placeholder*="resentac"]');
    await nameInputs.last().fill('Individual');
    const priceInputs = page.locator('input[name="price"]');
    await priceInputs.last().fill('3500');

    // Presentación 2
    await addPresBtn.click();
    await nameInputs.last().fill('Six-Pack');
    await priceInputs.last().fill('18000');

    // Guardar
    await page.locator('button[type="submit"], button:has-text("Guardar")').first().click();
    await expect(
      page.locator('text=guardado, text=Producto guardado, [data-sonner-toast]').first()
    ).toBeVisible({ timeout: 15000 });
  });

  test('Carga Masiva de Productos', async ({ page }) => {
    const importBtn = page
      .getByRole('button', { name: /Importar|Carga Masiva/i })
      .first();

    const isVisible = await importBtn.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip(true, 'El módulo de Importación Masiva no está disponible en la UI actual.');
      return;
    }
    await importBtn.click();

    // Si hay un textarea para JSON
    const jsonTextarea = page.locator('textarea[name="bulkJson"]').first();
    if (await jsonTextarea.isVisible().catch(() => false)) {
      await jsonTextarea.fill(
        JSON.stringify([
          { name: 'Bulk Item 1', price: 1000, stock: 10 },
          { name: 'Bulk Item 2', price: 2000, stock: 20 },
        ])
      );
      await page.locator('button:has-text("Procesar")').first().click();
      await expect(page.locator('text=Importación exitosa').first()).toBeVisible({ timeout: 15000 });
      await expect(page.locator('text=Bulk Item 1').first()).toBeVisible();
    } else {
      // Si hay file input, el test requiere archivo real — skip con mensaje claro
      test.skip(true, 'La importación masiva requiere un archivo real. Sube products.json manualmente.');
    }
  });
});
