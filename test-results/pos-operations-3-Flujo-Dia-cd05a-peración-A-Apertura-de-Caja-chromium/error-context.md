# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: pos-operations.spec.ts >> 3. Flujo Diario de Operación >> A. Apertura de Caja
- Location: tests\pos-operations.spec.ts:21:7

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Caja/i })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - complementary [ref=e3]:
      - img [ref=e7] [cursor=pointer]
      - navigation [ref=e15]:
        - generic [ref=e16]:
          - img [ref=e19]
          - generic [ref=e22]:
            - button [ref=e24] [cursor=pointer]:
              - generic [ref=e25]:
                - img
            - button [ref=e29] [cursor=pointer]:
              - generic [ref=e30]:
                - img
            - button [ref=e32] [cursor=pointer]:
              - generic [ref=e33]:
                - img
            - button [ref=e35] [cursor=pointer]:
              - generic [ref=e36]:
                - img
        - generic [ref=e37]:
          - img [ref=e40]
          - generic [ref=e44]:
            - button [ref=e46] [cursor=pointer]:
              - generic [ref=e47]:
                - img
            - button [ref=e49] [cursor=pointer]:
              - generic [ref=e50]:
                - img
            - button [ref=e52] [cursor=pointer]:
              - generic [ref=e53]:
                - img
            - button [ref=e55] [cursor=pointer]:
              - generic [ref=e56]:
                - img
        - generic [ref=e57]:
          - img [ref=e60]
          - generic [ref=e65]:
            - button [ref=e67] [cursor=pointer]:
              - generic [ref=e68]:
                - img
            - button [ref=e70] [cursor=pointer]:
              - generic [ref=e71]:
                - img
            - button [ref=e73] [cursor=pointer]:
              - generic [ref=e74]:
                - img
            - button [ref=e76] [cursor=pointer]:
              - generic [ref=e77]:
                - img
        - generic [ref=e78]:
          - img [ref=e81]
          - generic [ref=e86]:
            - button [ref=e88] [cursor=pointer]:
              - generic [ref=e89]:
                - img
            - button [ref=e91] [cursor=pointer]:
              - generic [ref=e92]:
                - img
        - generic [ref=e93]:
          - img [ref=e96]
          - generic [ref=e99]:
            - button [ref=e101] [cursor=pointer]:
              - generic [ref=e102]:
                - img
            - button [ref=e104] [cursor=pointer]:
              - generic [ref=e105]:
                - img
            - button [ref=e107] [cursor=pointer]:
              - generic [ref=e108]:
                - img
      - generic [ref=e109]:
        - img [ref=e113] [cursor=pointer]
        - button "Cerrar Sesión" [ref=e119] [cursor=pointer]:
          - generic [ref=e120]:
            - img
    - main [ref=e121]:
      - generic [ref=e123]:
        - generic [ref=e124]:
          - button [ref=e125] [cursor=pointer]:
            - img
          - generic [ref=e129]: Test Branch
        - generic [ref=e130]:
          - button [ref=e131] [cursor=pointer]:
            - img
          - button [ref=e134] [cursor=pointer]:
            - generic [ref=e135]:
              - img
          - button [ref=e137] [cursor=pointer]:
            - img
      - generic [ref=e140]:
        - heading "Resumen General" [level=1] [ref=e142]
        - generic [ref=e143]:
          - generic [ref=e147] [cursor=pointer]:
            - generic [ref=e148]:
              - img [ref=e150]
              - generic [ref=e153]: +12%
            - generic [ref=e154]:
              - paragraph [ref=e155]: Ventas Hoy
              - generic [ref=e157]: $0
            - paragraph [ref=e162]: Ver Detalles
          - generic [ref=e166] [cursor=pointer]:
            - generic [ref=e167]:
              - img [ref=e169]
              - generic [ref=e172]: +5%
            - generic [ref=e173]:
              - paragraph [ref=e174]: Transacciones
              - generic [ref=e175]: "0"
            - paragraph [ref=e180]: Ver Detalles
          - generic [ref=e184] [cursor=pointer]:
            - generic [ref=e185]:
              - img [ref=e187]
              - generic [ref=e189]: +18%
            - generic [ref=e190]:
              - paragraph [ref=e191]: Este Mes
              - generic [ref=e193]: $0
            - paragraph [ref=e198]: Ver Detalles
          - generic [ref=e202] [cursor=pointer]:
            - generic [ref=e203]:
              - img [ref=e205]
              - generic [ref=e207]: Créditos
            - generic [ref=e208]:
              - paragraph [ref=e209]: Cobros Pendientes
              - generic [ref=e211]: $0
            - paragraph [ref=e216]: Ver Detalles
        - generic [ref=e220]:
          - generic [ref=e221]:
            - generic [ref=e222]:
              - img [ref=e223]
              - paragraph [ref=e227]: Meta Mensual
            - generic [ref=e228]:
              - paragraph [ref=e229]: $ 0
              - paragraph [ref=e230]: de $ 0
            - generic [ref=e233]: 0%
          - generic [ref=e234]:
            - paragraph [ref=e235]: Tu progreso hoy
            - generic [ref=e237]:
              - paragraph [ref=e238]: 0%
              - paragraph [ref=e239]: Objetivo Diario
        - generic [ref=e240]:
          - generic [ref=e242]:
            - generic [ref=e243]:
              - generic [ref=e244]: Tendencia de Ventas (7 días)
              - img [ref=e245]
            - img [ref=e251]:
              - generic [ref=e253]:
                - generic [ref=e255]: Jue
                - generic [ref=e257]: Vie
                - generic [ref=e259]: Sab
                - generic [ref=e261]: Dom
                - generic [ref=e263]: Lun
                - generic [ref=e265]: Mar
                - generic [ref=e267]: Mie
              - generic [ref=e269]:
                - generic [ref=e271]: $0
                - generic [ref=e273]: $1
                - generic [ref=e275]: $2
                - generic [ref=e277]: $3
                - generic [ref=e279]: $4
          - generic [ref=e281]:
            - img [ref=e283]
            - generic [ref=e287]:
              - paragraph [ref=e288]: Tu progreso hoy
              - heading "0% de la meta" [level=3] [ref=e289]
              - paragraph [ref=e291]: ¡Sigue así! Estás cerca de superar tu promedio.
        - generic [ref=e292]:
          - generic [ref=e293]:
            - generic [ref=e295]: Productos Más Vendidos
            - generic [ref=e298]:
              - img [ref=e299]
              - paragraph [ref=e301]: No hay ventas aún
          - generic [ref=e302]:
            - generic [ref=e304]: Ventas Recientes
            - generic [ref=e310]:
              - img [ref=e311]
              - paragraph [ref=e314]: No hay ventas aún
    - button "Nueva Venta" [ref=e317] [cursor=pointer]:
      - img [ref=e319]
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e325] [cursor=pointer]:
    - img [ref=e326]
  - alert [ref=e329]
  - generic [ref=e330]: $0
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | test.describe('3. Flujo Diario de Operación', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
  7   |     try {
  8   |       await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
  9   |       await loginBtn.click();
  10  |     } catch (e) {}
  11  | 
  12  |     await page.waitForSelector('input[type="email"]', { timeout: 10000 }).catch(() => {});
  13  |     
  14  |     if (await page.locator('input[type="email"]').isVisible()) {
  15  |       await page.fill('input[type="email"]', 'test@fostpos.com');
  16  |       await page.fill('input[type="password"]', 'password123');
  17  |       await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
  18  |     }
  19  |   });
  20  | 
  21  |   test('A. Apertura de Caja', async ({ page }) => {
> 22  |     await page.getByRole('button', { name: /Caja/i }).click();
      |                                                       ^ Error: locator.click: Test timeout of 180000ms exceeded.
  23  |     
  24  |     // Si ya está abierta, la cerramos para la prueba
  25  |     const closeBtn = page.getByRole('button', { name: /Cerrar Caja/i }).first();
  26  |     if (await closeBtn.isVisible()) {
  27  |       await closeBtn.click();
  28  |       await page.fill('input[name="actualCash"]', '0');
  29  |       await page.click('button:has-text("Confirmar Cierre")');
  30  |     }
  31  | 
  32  |     await page.getByRole('button', { name: /Abrir Caja/i }).click();
  33  |     await page.fill('input[name="baseAmount"]', '50000');
  34  |     await page.click('button:has-text("Abrir Caja")');
  35  | 
  36  |     await expect(page.locator('text=Caja Abierta')).toBeVisible();
  37  |     await expect(page.locator('text=$50.000')).toBeVisible();
  38  |   });
  39  | 
  40  |   test('B. Ventas y Transacciones', async ({ page }) => {
  41  |     await page.getByRole('button', { name: /Venta/i }).click();
  42  | 
  43  |     // 1. Venta Rápida (Efectivo) con Cambio
  44  |     await page.click('button:has-text("Test Product")');
  45  |     await page.click('button:has-text("Procesar Venta")');
  46  |     await page.fill('input[name="receivedAmount"]', '2000'); 
  47  |     // El producto cuesta 1000 + IVA (según seeder)
  48  |     // Suponiendo total $1.190, cambio debe ser $810
  49  |     await expect(page.locator('text=Cambio: $810')).toBeVisible();
  50  |     await page.click('button:has-text("Finalizar")');
  51  | 
  52  |     // 2. Venta con Descuento (10%)
  53  |     await page.click('button:has-text("Test Product")');
  54  |     await page.click('button:has-text("Descuento")'); // Botón en el carrito o item
  55  |     await page.fill('input[name="discountPercent"]', '10');
  56  |     await page.click('button:has-text("Aplicar")');
  57  |     // Verificar que el total bajó
  58  |     await expect(page.locator('aside text=$1.071')).toBeVisible(); // 1190 - 119 = 1071
  59  |     await page.click('button:has-text("Procesar Venta")');
  60  |     await page.click('button:has-text("Finalizar")');
  61  | 
  62  |     // 3. Venta a Crédito (Fiado)
  63  |     await page.click('button:has-text("Test Product")');
  64  |     await page.click('button:has-text("Seleccionar Cliente")');
  65  |     await page.click('text=Cliente de Prueba'); // O crear uno rápido
  66  |     await page.click('button:has-text("Procesar Venta")');
  67  |     await page.click('button:has-text("Crédito")');
  68  |     await page.click('button:has-text("Finalizar")');
  69  | 
  70  |     // Verificar en módulo de Créditos
  71  |     await page.getByRole('button', { name: /Créditos/i }).click();
  72  |     await expect(page.locator('tr:has-text("Cliente de Prueba")')).toBeVisible();
  73  |   });
  74  | 
  75  |   test('C. Gestión de Gastos', async ({ page }) => {
  76  |     await page.getByRole('button', { name: /Caja/i }).click();
  77  |     await page.getByRole('button', { name: /Registrar Gasto/i }).click();
  78  |     await page.fill('input[name="description"]', 'Pago de almuerzo');
  79  |     await page.fill('input[name="amount"]', '15000');
  80  |     await page.click('button:has-text("Guardar Gasto")');
  81  | 
  82  |     await expect(page.locator('text=Gasto registrado')).toBeVisible();
  83  |     // El balance debe bajar
  84  |   });
  85  | 
  86  |   test('4. Cierre y Auditoría', async ({ page }) => {
  87  |     // 1. Abono a Crédito
  88  |     await page.getByRole('button', { name: /Créditos/i }).click();
  89  |     await page.click('tr:has-text("Cliente de Prueba") button:has-text("Abonar")');
  90  |     await page.fill('input[name="paymentAmount"]', '500');
  91  |     await page.click('button:has-text("Registrar Abono")');
  92  |     await expect(page.locator('text=Abono exitoso')).toBeVisible();
  93  | 
  94  |     // 2. Cierre de Caja (Arqueo) con Faltante
  95  |     await page.getByRole('button', { name: /Caja/i }).click();
  96  |     await page.click('button:has-text("Cerrar Caja")');
  97  |     
  98  |     // Si el sistema espera p.ej $40.000 y ponemos $35.000
  99  |     const expected = await page.locator('text=Efectivo Esperado:').innerText();
  100 |     const expectedVal = parseFloat(expected.replace(/[^0-9]/g, ''));
  101 |     await page.fill('input[name="actualCash"]', (expectedVal - 5000).toString());
  102 |     
  103 |     await page.click('button:has-text("Confirmar Cierre")');
  104 |     await expect(page.locator('text=Diferencia: -$5.000')).toBeVisible();
  105 |     await expect(page.locator('text=Estado: Faltante')).toBeVisible();
  106 | 
  107 |     // 3. Reporte de Ventas
  108 |     await page.getByRole('button', { name: /Reportes/i }).click();
  109 |     await page.click('text=Ventas del Día');
  110 |     await expect(page.locator('text=Total Ventas')).toBeVisible();
  111 |   });
  112 | });
  113 | 
```