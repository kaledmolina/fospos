# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: sale-flow.spec.ts >> Flujo de Venta Completo >> debe abrir caja, vender un producto y verificar el balance
- Location: tests\sale-flow.spec.ts:4:7

# Error details

```
Test timeout of 60000ms exceeded.
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
  3  | test.describe('Flujo de Venta Completo', () => {
  4  |   test('debe abrir caja, vender un producto y verificar el balance', async ({ page }) => {
  5  |     // 1. Login
  6  |     await page.goto('/');
  7  |     
  8  |     // Si está en el setup, fallar con aviso
  9  |     if (await page.locator('text=Configuración del Motor').isVisible()) {
  10 |       throw new Error('Sistema en modo SETUP. Corre el seeder primero.');
  11 |     }
  12 | 
  13 |     // Login
  14 |     const loginBtn = page.getByRole('button', { name: /Log In/i }).first();
  15 |     if (await loginBtn.isVisible()) await loginBtn.click();
  16 | 
> 17 |     await page.fill('input[type="email"]', 'test@fostpos.com');
     |                ^ Error: page.fill: Test timeout of 60000ms exceeded.
  18 |     await page.fill('input[type="password"]', 'password123');
  19 |     await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
  20 | 
  21 |     // Dashboard
  22 |     await expect(page.locator('main')).toBeVisible({ timeout: 20000 });
  23 | 
  24 |     // 2. Navegar a "Caja" usando el icono de Wallet o el texto
  25 |     // Intentamos por rol y nombre (que es lo más robusto en Playwright)
  26 |     const cajaTab = page.getByRole('button', { name: /Caja/i });
  27 |     await cajaTab.click();
  28 |     
  29 |     // Abrir caja si está cerrada
  30 |     const openBtn = page.getByRole('button', { name: /Abrir Caja/i }).first();
  31 |     if (await openBtn.isVisible()) {
  32 |       await openBtn.click();
  33 |       await page.fill('div[role="dialog"] input[type="number"]', '50000');
  34 |       await page.click('div[role="dialog"] button:has-text("Abrir Caja")');
  35 |       await expect(page.locator('text=Caja Abierta')).toBeVisible();
  36 |     }
  37 | 
  38 |     // 3. Navegar a "Venta"
  39 |     const ventaTab = page.getByRole('button', { name: /Venta/i });
  40 |     await ventaTab.click();
  41 | 
  42 |     // 4. Agregar Producto
  43 |     const product = page.locator('button:has-text("Test Product")').first();
  44 |     await expect(product).toBeVisible();
  45 |     await product.click();
  46 | 
  47 |     // Verificar carrito
  48 |     await expect(page.locator('aside').filter({ hasText: 'Test Product' })).toBeVisible();
  49 | 
  50 |     // 5. Procesar Venta
  51 |     await page.click('button:has-text("Procesar Venta")');
  52 | 
  53 |     // Éxito
  54 |     await expect(page.locator('text=Venta Exitosa')).toBeVisible({ timeout: 15000 });
  55 |     
  56 |     // Cerrar
  57 |     const close = page.getByRole('button', { name: /Cerrar/i }).first();
  58 |     if (await close.isVisible()) await close.click();
  59 | 
  60 |     // 6. Verificar Caja Final
  61 |     await cajaTab.click();
  62 |     // Balance: 50000 + 1190 = 51190
  63 |     await expect(page.locator('text=$51.190')).toBeVisible();
  64 |   });
  65 | });
  66 | 
```