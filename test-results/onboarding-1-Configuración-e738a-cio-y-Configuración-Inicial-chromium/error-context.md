# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.ts >> 1. Configuración Inicial (Onboarding) >> Registro de Negocio y Configuración Inicial
- Location: tests\onboarding.spec.ts:26:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Registro Completado')
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('text=Registro Completado')

```

```yaml
- heading "FostPOS" [level=1]
- paragraph: Smart Engine
- heading "Control total en la palma de tu mano." [level=2]
- paragraph: Unete a la revolucion del comercio digital. Gestiona sedes, inventarios y ventas con tecnologia de punta.
- img "Dashboard Mockup"
- paragraph: Growth
- paragraph: +240%
- text: Multi-Sede Nube Segura SOPORTE 24/7
- button
- heading "Crea tu cuenta." [level=2]
- paragraph: Empieza tu prueba gratuita de 30 días hoy.
- tablist:
  - tab "Admin"
  - tab "Personal"
  - tab "Registrarse" [selected]
- tabpanel "Registrarse":
  - text: Business Name
  - textbox "Nombre de tu negocio": Automated Test Business
  - text: NIT / ID
  - textbox "NIT o Cédula": NIT-1778687885682
  - text: Phone
  - textbox "+57..."
  - text: Owner Name
  - textbox "Nombre completo responsable": Test Owner
  - text: Email
  - textbox "email@empresa.com": admin-1778687885682@test.com
  - text: City
  - textbox "Bogotá, Medellín...": Test City
  - text: Contraseña
  - textbox "••••••••": password123
  - button
  - text: Confirmar Contraseña
  - textbox "••••••••": password123
  - text: Código de Activación (Opcional)
  - textbox "FOST-XXXX-XXXX"
  - paragraph: Si tienes una llave de activación, ingrésala para activar tu cuenta de inmediato.
  - button "Registrar mi Negocio"
  - paragraph: Al registrarte, aceptas nuestros Términos y Condiciones y Política de Privacidad.
- button "Volver a la landing page"
- contentinfo: © 2024 FOSTPOS SOFTWARE LTD. - System Engine V2.0
- region "Notifications (F8)":
  - list
- region "Notifications alt+T"
- alert
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
> 53  |     await expect(page.locator('text=Registro Completado')).toBeVisible({ timeout: 15000 });
      |                                                            ^ Error: expect(locator).toBeVisible() failed
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
  85  |     await configGroup.click();
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