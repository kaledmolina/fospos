# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory-management.spec.ts >> 2. Preparación de Inventario >> Unidades de Medida
- Location: tests\inventory-management.spec.ts:44:7

# Error details

```
TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]') to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e9] [cursor=pointer]:
    - img [ref=e10]
  - alert [ref=e13]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('2. Preparación de Inventario', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
  7   |     try {
  8   |       await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
  9   |       await loginBtn.click();
  10  |     } catch (e) {}
  11  | 
> 12  |     await page.waitForSelector('input[type="email"]', { timeout: 10000 });
      |                ^ TimeoutError: page.waitForSelector: Timeout 10000ms exceeded.
  13  |     
  14  |     if (await page.locator('input[type="email"]').isVisible()) {
  15  |       await page.fill('input[type="email"]', 'test@fostpos.com');
  16  |       await page.fill('input[type="password"]', 'password123');
  17  |       await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
  18  |     }
  19  |     
  20  |     const inventoryGroup = page.getByRole('button', { name: /Inventario/i }).first();
  21  |     await inventoryGroup.click();
  22  |     await page.getByRole('button', { name: /Productos/i }).click();
  23  |   });
  24  | 
  25  |   test('Gestión de Categorías', async ({ page }) => {
  26  |     await page.getByRole('button', { name: /Categorías/i }).click();
  27  |     
  28  |     const categories = [
  29  |       { name: 'Bebidas', color: '#ff0000' },
  30  |       { name: 'Aseo', color: '#00ff00' },
  31  |       { name: 'Snacks', color: '#0000ff' }
  32  |     ];
  33  | 
  34  |     for (const cat of categories) {
  35  |       await page.getByRole('button', { name: /Añadir Categoría/i }).click();
  36  |       await page.fill('input[placeholder*="Nombre"]', cat.name);
  37  |       // Asumimos un input de color o picker
  38  |       await page.fill('input[type="color"]', cat.color);
  39  |       await page.click('button:has-text("Guardar")');
  40  |       await expect(page.locator(`text=${cat.name}`)).toBeVisible();
  41  |     }
  42  |   });
  43  | 
  44  |   test('Unidades de Medida', async ({ page }) => {
  45  |     await page.getByRole('button', { name: /Unidades/i }).click();
  46  |     
  47  |     const units = ['Kilogramo', 'Caja', 'Litro'];
  48  |     for (const unit of units) {
  49  |       await page.getByRole('button', { name: /Añadir Unidad/i }).click();
  50  |       await page.fill('input[placeholder*="Nombre"]', unit);
  51  |       await page.fill('input[placeholder*="Abreviatura"]', unit.substring(0, 3).toUpperCase());
  52  |       await page.click('button:has-text("Guardar")');
  53  |       await expect(page.locator(`text=${unit}`)).toBeVisible();
  54  |     }
  55  |   });
  56  | 
  57  |   test('Registro de Producto con Alerta de Stock', async ({ page }) => {
  58  |     await page.getByRole('button', { name: /Productos/i }).click();
  59  |     await page.getByRole('button', { name: /Añadir Producto/i }).click();
  60  | 
  61  |     await page.fill('input[placeholder*="Nombre"]', 'Arroz Diana 1kg');
  62  |     await page.fill('input[placeholder*="Código"]', 'ARROZ001');
  63  |     
  64  |     // Precios
  65  |     await page.click('button:has-text("Precios")');
  66  |     await page.fill('input[name="salePrice"]', '5000');
  67  |     
  68  |     // Stock y Alerta
  69  |     await page.click('button:has-text("Stock")');
  70  |     await page.fill('input[name="currentStock"]', '5');
  71  |     await page.fill('input[name="minStock"]', '10');
  72  | 
  73  |     await page.click('button:has-text("Guardar")');
  74  |     await expect(page.locator('text=Producto guardado')).toBeVisible();
  75  |     
  76  |     // Verificar alerta (podría ser un icono o texto en la lista)
  77  |     await expect(page.locator('tr:has-text("Arroz Diana") .text-red-500')).toBeVisible();
  78  |   });
  79  | 
  80  |   test('Producto con Múltiples Presentaciones', async ({ page }) => {
  81  |     await page.getByRole('button', { name: /Añadir Producto/i }).click();
  82  |     await page.fill('input[placeholder*="Nombre"]', 'Cerveza Aguila');
  83  |     
  84  |     // Asumimos un toggle o pestaña de "Presentaciones" o "Variantes"
  85  |     await page.click('button:has-text("Presentaciones")');
  86  |     
  87  |     // Presentación 1: Individual
  88  |     await page.click('button:has-text("Agregar Presentación")');
  89  |     await page.fill('input[placeholder*="Nombre de presentación"]').last().fill('Individual');
  90  |     await page.fill('input[name="price"]').last().fill('3500');
  91  | 
  92  |     // Presentación 2: Six-Pack
  93  |     await page.click('button:has-text("Agregar Presentación")');
  94  |     await page.fill('input[placeholder*="Nombre de presentación"]').last().fill('Six-Pack');
  95  |     await page.fill('input[name="price"]').last().fill('18000');
  96  | 
  97  |     await page.click('button:has-text("Guardar")');
  98  |     
  99  |     // Ir a Venta y verificar cambio de precio
  100 |     await page.getByRole('button', { name: /Venta/i }).click();
  101 |     await page.click('button:has-text("Cerveza Aguila")');
  102 |     
  103 |     // Seleccionar Individual
  104 |     await page.click('text=Individual');
  105 |     await expect(page.locator('aside text=$3.500')).toBeVisible();
  106 |     
  107 |     // Cambiar a Six-Pack
  108 |     await page.click('text=Six-Pack');
  109 |     await expect(page.locator('aside text=$18.000')).toBeVisible();
  110 |   });
  111 | 
  112 |   test('Carga Masiva de Productos', async ({ page }) => {
```