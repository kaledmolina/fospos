# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chaos-testing.spec.ts >> Chaos & Security Testing >> no debe permitir vender productos con stock 0
- Location: tests\chaos-testing.spec.ts:14:7

# Error details

```
Test timeout of 60000ms exceeded while running "beforeEach" hook.
```

```
Error: page.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Chaos & Security Testing', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     const loginBtn = page.getByRole('button', { name: /Log In/i }).first();
  7  |     if (await loginBtn.isVisible()) await loginBtn.click();
> 8  |     await page.fill('input[type="email"]', 'test@fostpos.com');
     |                ^ Error: page.fill: Test timeout of 60000ms exceeded.
  9  |     await page.fill('input[type="password"]', 'password123');
  10 |     await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
  11 |     await expect(page.locator('aside')).toBeVisible({ timeout: 20000 });
  12 |   });
  13 | 
  14 |   test('no debe permitir vender productos con stock 0', async ({ page }) => {
  15 |     // Usar selectores robustos para el sidebar
  16 |     await page.getByRole('button', { name: /Productos/i }).click();
  17 |     await page.getByRole('button', { name: /Añadir Producto/i }).click();
  18 | 
  19 |     const name = "Zero Stock Item";
  20 |     await page.fill('input[placeholder*="nombre"]', name);
  21 |     
  22 |     // Categoría
  23 |     await page.click('button:has-text("Seleccionar...")');
  24 |     await page.click('div[role="listbox"] div[role="option"]:first-child');
  25 | 
  26 |     // Tab Precios
  27 |     await page.click('button:has-text("Precios")');
  28 |     await page.fill('input[type="number"]', '1000'); // Precio de venta
  29 | 
  30 |     // Tab Stock -> Asegurar que sea 0
  31 |     await page.click('button:has-text("Stock")');
  32 |     // El stock inicial suele ser 0 por defecto, pero lo forzamos
  33 |     const stockInput = page.locator('input[type="number"]').nth(1); // El primero suele ser costo
  34 |     await stockInput.fill('0');
  35 | 
  36 |     await page.click('button:has-text("Guardar Producto")');
  37 |     
  38 |     // Ir a Venta
  39 |     await page.getByRole('button', { name: /Venta/i }).click();
  40 |     
  41 |     // Buscar el producto
  42 |     const productBtn = page.locator(`button:has-text("${name}")`).first();
  43 |     await expect(productBtn).toBeDisabled();
  44 |     await expect(productBtn).toHaveClass(/grayscale/);
  45 |   });
  46 | 
  47 |   test('prevención de XSS en nombres de productos', async ({ page }) => {
  48 |     await page.getByRole('button', { name: /Productos/i }).click();
  49 |     await page.getByRole('button', { name: /Añadir Producto/i }).click();
  50 | 
  51 |     const xssPayload = "<img src=x onerror=alert(1)> Malicious";
  52 |     await page.fill('input[placeholder*="nombre"]', xssPayload);
  53 |     
  54 |     await page.click('button:has-text("Seleccionar...")');
  55 |     await page.click('div[role="listbox"] div[role="option"]:first-child');
  56 | 
  57 |     await page.click('button:has-text("Precios")');
  58 |     await page.fill('input[type="number"]', '1000');
  59 | 
  60 |     await page.click('button:has-text("Guardar Producto")');
  61 | 
  62 |     // Ir a Venta y verificar que el payload se vea como texto literal
  63 |     await page.getByRole('button', { name: /Venta/i }).click();
  64 |     const productTitle = page.locator(`text=${xssPayload}`).first();
  65 |     await expect(productTitle).toBeVisible();
  66 |   });
  67 | });
  68 | 
```