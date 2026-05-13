# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.ts >> 1. Configuración Inicial (Onboarding) >> Creación de Usuarios (Admin y Cajero)
- Location: tests\onboarding.spec.ts:80:7

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: locator.click: Test timeout of 180000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Configuración/i })

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
  3   | test.describe('1. Configuración Inicial (Onboarding)', () => {
  4   |   const uniqueNit = `NIT-${Date.now()}`;
  5   |   const businessName = 'Automated Test Business';
  6   |   const adminEmail = `admin-${Date.now()}@test.com`;
  7   |   const cashierEmail = `cashier-${Date.now()}@test.com`;
  8   | 
  9   |   async function loginAs(page, email, password) {
  10  |     await page.goto('/');
  11  |     const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
  12  |     try {
  13  |       await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
  14  |       await loginBtn.click();
  15  |     } catch (e) {}
  16  | 
  17  |     await page.waitForSelector('input[type="email"]', { timeout: 10000 }).catch(() => {});
  18  |     
  19  |     if (await page.locator('input[type="email"]').isVisible()) {
  20  |       await page.fill('input[type="email"]', email);
  21  |       await page.fill('input[type="password"]', password);
  22  |       await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
  23  |     }
  24  |   }
  25  | 
  26  |   test('Registro de Negocio y Configuración Inicial', async ({ page }) => {
  27  |     await page.goto('/');
  28  | 
  29  |     // 1. Registro de Negocio
  30  |     const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
  31  |     try {
  32  |       await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
  33  |       await loginBtn.click();
  34  |     } catch (e) {}
  35  |     
  36  |     await page.click('button:has-text("Registrarse")');
  37  |     await page.waitForSelector('input[placeholder="Nombre de tu negocio"]');
  38  | 
  39  |     await page.fill('input[placeholder="Nombre de tu negocio"]', businessName);
  40  |     await page.fill('input[placeholder="NIT o Cédula"]', uniqueNit);
  41  |     await page.fill('input[placeholder="Nombre completo responsable"]', 'Test Owner');
  42  |     await page.fill('input[placeholder="email@empresa.com"]', adminEmail);
  43  |     await page.fill('input[placeholder="Bogotá, Medellín..."]', 'Test City');
  44  |     
  45  |     // Usar locatarios específicos para la pestaña de registro
  46  |     const registerPanel = page.locator('[role="tabpanel"][data-state="active"]');
  47  |     await registerPanel.locator('input[type="password"]').first().fill('password123');
  48  |     await registerPanel.locator('input[type="password"]').last().fill('password123');
  49  |     
  50  |     await page.click('button:has-text("Registrar mi Negocio")');
  51  | 
  52  |     // Verificar que redirige al Dashboard o muestra mensaje de éxito
  53  |     await expect(page.locator('text=Registro Completado')).toBeVisible({ timeout: 15000 });
  54  |     // Verificar estado pendiente
  55  |     await expect(page.locator('text=Pendiente Actvacion')).toBeVisible();
  56  |   });
  57  | 
  58  |   test('Configuración de Sucursal Principal', async ({ page }) => {
  59  |     // Login con el admin creado
  60  |     await loginAs(page, 'test@fostpos.com', 'password123');
  61  | 
  62  |     // Navegar a Configuración/Sucursales
  63  |     // Abrir grupo Configuración si es necesario
  64  |     const configGroup = page.getByRole('button', { name: /Configuración/i });
  65  |     await configGroup.click();
  66  |     await page.getByRole('button', { name: /Sucursales/i }).click();
  67  | 
  68  |     // Crear/Editar Sucursal
  69  |     await page.getByRole('button', { name: /Añadir Sucursal/i }).click();
  70  |     await page.fill('input[placeholder*="Nombre"]', 'Sucursal Norte');
  71  |     await page.fill('input[placeholder*="Dirección"]', 'Calle 100 #15-20');
  72  |     await page.fill('input[placeholder*="Teléfono"]', '3001234567');
  73  |     await page.fill('input[placeholder*="NIT"]', '900-123-456');
  74  |     
  75  |     await page.click('button:has-text("Guardar")');
  76  |     await expect(page.locator('text=Sucursal creada correctamente')).toBeVisible();
  77  |     await expect(page.locator('text=Sucursal Norte')).toBeVisible();
  78  |   });
  79  | 
  80  |   test('Creación de Usuarios (Admin y Cajero)', async ({ page }) => {
  81  |     // Login Admin
  82  |     await loginAs(page, 'test@fostpos.com', 'password123');
  83  | 
  84  |     const configGroup = page.getByRole('button', { name: /Configuración/i });
> 85  |     await configGroup.click();
      |                       ^ Error: locator.click: Test timeout of 180000ms exceeded.
  86  |     await page.getByRole('button', { name: /Usuarios/i }).click();
  87  | 
  88  |     // Crear Cajero
  89  |     await page.getByRole('button', { name: /Añadir Usuario/i }).click();
  90  |     await page.fill('input[placeholder*="Nombre"]', 'Cajero de Prueba');
  91  |     await page.fill('input[type="email"]', cashierEmail);
  92  |     await page.fill('input[type="password"]', 'cajero123');
  93  |     
  94  |     // Seleccionar Rol Cajero
  95  |     await page.selectOption('select[name="role"]', 'CASHIER');
  96  |     // Asignar a sucursal (asumimos que hay un select o checkbox)
  97  |     await page.selectOption('select[name="branchId"]', { label: 'Sucursal Norte' });
  98  | 
  99  |     await page.click('button:has-text("Guardar")');
  100 |     await expect(page.locator('text=Usuario creado')).toBeVisible();
  101 |   });
  102 | 
  103 |   test('Prueba de Roles: Restricciones del Cajero', async ({ page }) => {
  104 |     // Login con el Cajero
  105 |     await loginAs(page, cashierEmail, 'cajero123');
  106 | 
  107 |     // Verificar que NO vea el menú de Configuración
  108 |     await expect(page.getByRole('button', { name: /Configuración/i })).not.toBeVisible();
  109 |     
  110 |     // Intentar entrar por URL (IDOR test parcial)
  111 |     await page.goto('/admin/settings');
  112 |     await expect(page.locator('text=Acceso Denegado|403|Unauthorized')).toBeVisible();
  113 |   });
  114 | });
  115 | 
```