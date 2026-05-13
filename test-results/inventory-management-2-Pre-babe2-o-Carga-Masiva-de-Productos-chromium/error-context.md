# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: inventory-management.spec.ts >> 2. Preparación de Inventario >> Carga Masiva de Productos
- Location: tests\inventory-management.spec.ts:112:7

# Error details

```
Test timeout of 180000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Inventario/i }).first()

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
  3   | test.describe('2. Preparación de Inventario', () => {
  4   |   test.beforeEach(async ({ page }) => {
  5   |     await page.goto('/');
  6   |     const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
  7   |     try {
  8   |       await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
  9   |       await loginBtn.click();
  10  |     } catch (e) {}
  11  | 
  12  |     await page.waitForSelector('input[type="email"]', { timeout: 10000 });
  13  |     
  14  |     if (await page.locator('input[type="email"]').isVisible()) {
  15  |       await page.fill('input[type="email"]', 'test@fostpos.com');
  16  |       await page.fill('input[type="password"]', 'password123');
  17  |       await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
  18  |     }
  19  |     
  20  |     const inventoryGroup = page.getByRole('button', { name: /Inventario/i }).first();
> 21  |     await inventoryGroup.click();
      |                          ^ Error: locator.click: Test timeout of 180000ms exceeded.
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
  113 |     await page.getByRole('button', { name: /Importar/i }).click();
  114 |     
  115 |     // Subir archivo JSON de prueba
  116 |     // Nota: El archivo debe existir en el entorno de ejecución
  117 |     // const filePath = path.resolve(__dirname, '../data/products.json');
  118 |     // await page.setInputFiles('input[type="file"]', filePath);
  119 |     
  120 |     // Simulamos la carga si no hay archivo real disponible o usamos un textarea
  121 |     if (await page.locator('textarea[name="bulkJson"]').isVisible()) {
```