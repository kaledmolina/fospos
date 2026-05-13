# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: performance-ux.spec.ts >> Rendimiento y Estrés >> Manejo de Internet Inestable
- Location: tests\performance-ux.spec.ts:86:7

# Error details

```
Test timeout of 180000ms exceeded while running "beforeEach" hook.
```

```
Error: page.fill: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('Robustez de la Interfaz (UX)', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     await page.fill('input[type="email"]', 'test@fostpos.com');
  7   |     await page.fill('input[type="password"]', 'password123');
  8   |     await page.click('button[type="submit"]');
  9   |   });
  10  | 
  11  |   test('Pérdida de Sesión con Carrito Abierto', async ({ page, context }) => {
  12  |     await page.getByRole('button', { name: /Venta/i }).click();
  13  |     await page.click('button:has-text("Test Product")');
  14  |     
  15  |     // Borrar cookies para simular pérdida de sesión
  16  |     await context.clearCookies();
  17  |     
  18  |     await page.click('button:has-text("Procesar Venta")');
  19  |     // Debe redirigir a login o mostrar error de sesión
  20  |     await expect(page).toHaveURL(/.*login.*/);
  21  |   });
  22  | 
  23  |   test('Nombres Gigantes y Diseño Responsivo', async ({ page }) => {
  24  |     await page.getByRole('button', { name: /Inventario/i }).click();
  25  |     await page.getByRole('button', { name: /Productos/i }).click();
  26  |     await page.getByRole('button', { name: /Añadir/i }).click();
  27  | 
  28  |     const giantName = "A".repeat(500);
  29  |     await page.fill('input[name="name"]', giantName);
  30  |     await page.click('button:has-text("Guardar")');
  31  | 
  32  |     // Verificar que no se rompa el layout (no hay scroll horizontal inesperado)
  33  |     const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  34  |     const windowWidth = await page.evaluate(() => window.innerWidth);
  35  |     expect(bodyWidth).toBeLessThanOrEqual(windowWidth);
  36  |   });
  37  | 
  38  |   test('Validación de Teclado (No letras en montos)', async ({ page }) => {
  39  |     await page.getByRole('button', { name: /Venta/i }).click();
  40  |     await page.click('button:has-text("Test Product")');
  41  |     await page.click('button:has-text("Procesar Venta")');
  42  |     
  43  |     const input = page.locator('input[name="receivedAmount"]');
  44  |     await input.fill('abc#$');
  45  |     const value = await input.inputValue();
  46  |     expect(value).toBe(''); // No debe permitir letras
  47  |   });
  48  | });
  49  | 
  50  | test.describe('Rendimiento y Estrés', () => {
  51  |   test.beforeEach(async ({ page }) => {
  52  |     await page.goto('/');
> 53  |     await page.fill('input[type="email"]', 'test@fostpos.com');
      |                ^ Error: page.fill: Test timeout of 180000ms exceeded.
  54  |     await page.fill('input[type="password"]', 'password123');
  55  |     await page.click('button[type="submit"]');
  56  |   });
  57  | 
  58  |   test('Búsqueda con Gran Cantidad de Productos', async ({ page }) => {
  59  |     await page.getByRole('button', { name: /Venta/i }).click();
  60  |     
  61  |     const searchInput = page.locator('input[placeholder*="Buscar"]');
  62  |     
  63  |     // Medir tiempo de respuesta
  64  |     const start = Date.now();
  65  |     await searchInput.fill('a');
  66  |     await page.waitForLoadState('networkidle');
  67  |     const end = Date.now();
  68  |     
  69  |     expect(end - start).toBeLessThan(2000); // Menos de 2 segundos
  70  |   });
  71  | 
  72  |   test('Factura de 100 Items', async ({ page }) => {
  73  |     await page.getByRole('button', { name: /Venta/i }).click();
  74  |     
  75  |     // Agregar 100 veces el producto (o 100 productos diferentes)
  76  |     for (let i = 0; i < 100; i++) {
  77  |       await page.click('button:has-text("Test Product")');
  78  |     }
  79  |     
  80  |     await page.click('button:has-text("Procesar Venta")');
  81  |     await page.click('button:has-text("Finalizar")');
  82  |     
  83  |     await expect(page.locator('text=Venta Exitosa')).toBeVisible({ timeout: 30000 });
  84  |   });
  85  | 
  86  |   test('Manejo de Internet Inestable', async ({ page, context }) => {
  87  |     await page.getByRole('button', { name: /Venta/i }).click();
  88  |     await page.click('button:has-text("Test Product")');
  89  |     
  90  |     // Desconectar internet
  91  |     await context.setOffline(true);
  92  |     
  93  |     await page.click('button:has-text("Procesar Venta")');
  94  |     await page.click('button:has-text("Finalizar")');
  95  |     
  96  |     await expect(page.locator('text=Sin conexión|Error de red|Reintentar')).toBeVisible();
  97  |     
  98  |     // Volver a conectar
  99  |     await context.setOffline(false);
  100 |     await page.click('button:has-text("Reintentar")');
  101 |     await expect(page.locator('text=Venta Exitosa')).toBeVisible();
  102 |   });
  103 | });
  104 | 
```