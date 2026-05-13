import { test, expect } from '@playwright/test';

test.describe('2. Preparación de Inventario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
    try {
      await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
      await loginBtn.click();
    } catch (e) {}

    await page.waitForSelector('input[type="email"]', { timeout: 10000 });
    
    if (await page.locator('input[type="email"]').isVisible()) {
      await page.fill('input[type="email"]', 'test@fostpos.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
    }
    
    const inventoryGroup = page.getByRole('button', { name: /Inventario/i }).first();
    await inventoryGroup.click();
    await page.getByRole('button', { name: /Productos/i }).click();
  });

  test('Gestión de Categorías', async ({ page }) => {
    await page.getByRole('button', { name: /Categorías/i }).click();
    
    const categories = [
      { name: 'Bebidas', color: '#ff0000' },
      { name: 'Aseo', color: '#00ff00' },
      { name: 'Snacks', color: '#0000ff' }
    ];

    for (const cat of categories) {
      await page.getByRole('button', { name: /Añadir Categoría/i }).click();
      await page.fill('input[placeholder*="Nombre"]', cat.name);
      // Asumimos un input de color o picker
      await page.fill('input[type="color"]', cat.color);
      await page.click('button:has-text("Guardar")');
      await expect(page.locator(`text=${cat.name}`)).toBeVisible();
    }
  });

  test('Unidades de Medida', async ({ page }) => {
    await page.getByRole('button', { name: /Unidades/i }).click();
    
    const units = ['Kilogramo', 'Caja', 'Litro'];
    for (const unit of units) {
      await page.getByRole('button', { name: /Añadir Unidad/i }).click();
      await page.fill('input[placeholder*="Nombre"]', unit);
      await page.fill('input[placeholder*="Abreviatura"]', unit.substring(0, 3).toUpperCase());
      await page.click('button:has-text("Guardar")');
      await expect(page.locator(`text=${unit}`)).toBeVisible();
    }
  });

  test('Registro de Producto con Alerta de Stock', async ({ page }) => {
    await page.getByRole('button', { name: /Productos/i }).click();
    await page.getByRole('button', { name: /Añadir Producto/i }).click();

    await page.fill('input[placeholder*="Nombre"]', 'Arroz Diana 1kg');
    await page.fill('input[placeholder*="Código"]', 'ARROZ001');
    
    // Precios
    await page.click('button:has-text("Precios")');
    await page.fill('input[name="salePrice"]', '5000');
    
    // Stock y Alerta
    await page.click('button:has-text("Stock")');
    await page.fill('input[name="currentStock"]', '5');
    await page.fill('input[name="minStock"]', '10');

    await page.click('button:has-text("Guardar")');
    await expect(page.locator('text=Producto guardado')).toBeVisible();
    
    // Verificar alerta (podría ser un icono o texto en la lista)
    await expect(page.locator('tr:has-text("Arroz Diana") .text-red-500')).toBeVisible();
  });

  test('Producto con Múltiples Presentaciones', async ({ page }) => {
    await page.getByRole('button', { name: /Añadir Producto/i }).click();
    await page.fill('input[placeholder*="Nombre"]', 'Cerveza Aguila');
    
    // Asumimos un toggle o pestaña de "Presentaciones" o "Variantes"
    await page.click('button:has-text("Presentaciones")');
    
    // Presentación 1: Individual
    await page.click('button:has-text("Agregar Presentación")');
    await page.fill('input[placeholder*="Nombre de presentación"]').last().fill('Individual');
    await page.fill('input[name="price"]').last().fill('3500');

    // Presentación 2: Six-Pack
    await page.click('button:has-text("Agregar Presentación")');
    await page.fill('input[placeholder*="Nombre de presentación"]').last().fill('Six-Pack');
    await page.fill('input[name="price"]').last().fill('18000');

    await page.click('button:has-text("Guardar")');
    
    // Ir a Venta y verificar cambio de precio
    await page.getByRole('button', { name: /Venta/i }).click();
    await page.click('button:has-text("Cerveza Aguila")');
    
    // Seleccionar Individual
    await page.click('text=Individual');
    await expect(page.locator('aside text=$3.500')).toBeVisible();
    
    // Cambiar a Six-Pack
    await page.click('text=Six-Pack');
    await expect(page.locator('aside text=$18.000')).toBeVisible();
  });

  test('Carga Masiva de Productos', async ({ page }) => {
    await page.getByRole('button', { name: /Importar/i }).click();
    
    // Subir archivo JSON de prueba
    // Nota: El archivo debe existir en el entorno de ejecución
    // const filePath = path.resolve(__dirname, '../data/products.json');
    // await page.setInputFiles('input[type="file"]', filePath);
    
    // Simulamos la carga si no hay archivo real disponible o usamos un textarea
    if (await page.locator('textarea[name="bulkJson"]').isVisible()) {
      await page.fill('textarea[name="bulkJson"]', JSON.stringify([
        { name: 'Bulk Item 1', price: 1000, stock: 10 },
        { name: 'Bulk Item 2', price: 2000, stock: 20 }
      ]));
      await page.click('button:has-text("Procesar")');
    }

    await expect(page.locator('text=Importación exitosa')).toBeVisible();
    await expect(page.locator('text=Bulk Item 1')).toBeVisible();
  });
});
