# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: onboarding.spec.ts >> 1. Configuración Inicial (Onboarding) >> Prueba de Roles: Restricciones del Cajero
- Location: tests\onboarding.spec.ts:103:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Acceso Denegado|403|Unauthorized')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for locator('text=Acceso Denegado|403|Unauthorized')

```

```yaml
- banner:
  - heading "FostPOS" [level=1]
  - paragraph: Smart Business Cloud
  - navigation:
    - link "Inicio":
      - /url: "#inicio"
    - link "Características":
      - /url: "#caracteristicas"
    - link "Planes":
      - /url: "#precios"
    - link "Clientes":
      - /url: "#testimonios"
  - button
  - button "Log In"
  - button "Get Started"
- text: The Future of Retail is Here
- heading "Vende más. Gana mejor." [level=2]
- paragraph: La plataforma de gestión empresarial más avanzada y visualmente impresionante. Control total de tu negocio desde cualquier lugar, en tiempo real.
- button "Empezar Ahora"
- button "Agendar Demo"
- text: FOST-POS-ENGINE.V2.0
- img "FostPOS Dashboard"
- text: Revenue Today $4.890.000
- heading "Capabilities" [level=2]
- heading "Potencia bruta para tu comercio." [level=3]
- paragraph: Diseñado para ser la espina dorsal de tu operación. Sin fricciones, sin retrasos, solo resultados.
- paragraph: 5k+
- paragraph: Negocios
- paragraph: 99%
- paragraph: Uptime
- heading "Flujo de Caja" [level=4]
- paragraph: Gestión impecable de ingresos y egresos. Cada peso bajo control, cada cierre perfecto.
- heading "Manejo de Stock" [level=4]
- paragraph: Alertas inteligentes y control multi-sede. Nunca te quedes sin stock de lo que más vendes.
- heading "CRM de Clientes" [level=4]
- paragraph: Conoce a tus clientes. Gestiona créditos y deudas con un sistema de cobro automático.
- heading "Business Intelligence" [level=4]
- paragraph: Reportes visuales de alto impacto. Descubre tendencias y optimiza tus márgenes.
- heading "Ciberseguridad" [level=4]
- paragraph: Protección de datos nivel bancario. Tu información es tu activo más valioso.
- heading "Experiencia Móvil" [level=4]
- paragraph: La aplicación de ventas más rápida del mercado. Toda la potencia en la palma de tu mano.
- img "FostPOS Mobile"
- heading "Mobility" [level=2]
- heading "Tu negocio en el bolsillo." [level=3]
- paragraph: Vende en ferias, domicilios o en el salón. Nuestra app móvil no es una versión reducida, es todo el motor de FostPOS optimizado para un toque.
- heading "Ventas Offline" [level=5]
- paragraph: Sigue vendiendo incluso sin internet.
- heading "Escaneo por Cámara" [level=5]
- paragraph: No necesitas hardware adicional.
- heading "Tickets Digitales" [level=5]
- paragraph: Ahorra en papel y cuida el planeta.
- button "Descargar App"
- heading "Precios transparentes." [level=2]
- paragraph: Escale su negocio sin sorpresas al final del mes.
- heading "Emprendedor" [level=4]
- text: $ 49.900 /mo
- paragraph: Ideal para pequeños negocios que están comenzando.
- list:
  - listitem: 1 Sede
  - listitem: Hasta 500 productos
  - listitem: Ventas y Facturación
  - listitem: Control de Inventario
  - listitem: Soporte por email
- button "Start Plan"
- text: Most Chosen
- heading "Negocio Pro" [level=4]
- text: $ 89.900 /mo
- paragraph: Todo lo que necesitas para escalar tu negocio.
- list:
  - listitem: Hasta 3 Sedes
  - listitem: Productos ilimitados
  - listitem: Reportes avanzados
  - listitem: Módulo de Clientes y Fiados
  - listitem: Soporte prioritario
- button "Start Plan"
- heading "Empresarial" [level=4]
- text: Consultar
- paragraph: Soluciones personalizadas para grandes operaciones.
- list:
  - listitem: Sedes ilimitadas
  - listitem: Usuarios ilimitados
  - listitem: API personalizada
  - listitem: Integraciones externas
  - listitem: Account Manager dedicado
- button "Start Plan"
- heading "Wall of Trust." [level=3]
- paragraph: "\"Desde que implementamos FostPOS, el control de mi inventario es impecable. Los fiados ya no son un dolor de cabeza.\""
- text: CR Carlos Rodríguez Dueño de Minimal Tienda
- paragraph: "\"La facilidad de uso en el móvil me permite ver cómo va mi negocio incluso cuando no estoy en el local. ¡Altamente recomendado!\""
- text: EG Elena Gómez Gerente de Boutique Aurora
- paragraph: "\"El soporte técnico es excelente y el sistema es muy intuitivo. Mis cajeros aprendieron a usarlo en menos de una hora.\""
- text: RM Ricardo Mesa Propietario de Ferretería El Martillo
- heading "Ready to Transform?" [level=2]
- paragraph: Únase a los miles de negocios que ya operan a la velocidad de la luz con FostPOS.
- button "Start Free Today"
- paragraph: No credit card required • 30-day trial
- contentinfo:
  - heading "FostPOS" [level=1]
  - paragraph: Redefiniendo el comercio en América Latina con tecnología SaaS de vanguardia e interfaces que inspiran grandeza.
  - heading "Product" [level=5]
  - list:
    - listitem:
      - link "Features":
        - /url: "#"
    - listitem:
      - link "Integrations":
        - /url: "#"
    - listitem:
      - link "Pricing":
        - /url: "#"
    - listitem:
      - link "Changelog":
        - /url: "#"
  - heading "Company" [level=5]
  - list:
    - listitem:
      - link "Story":
        - /url: "#"
    - listitem:
      - link "Contact":
        - /url: "#"
    - listitem:
      - link "Privacy":
        - /url: "#"
    - listitem:
      - link "Legal":
        - /url: "#"
  - paragraph: © 2024 FOSTPOS SOFTWARE LTD.
  - text: System Status Help Center
- region "Notifications (F8)":
  - list
- region "Notifications alt+T"
- alert
```

# Test source

```ts
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
> 112 |     await expect(page.locator('text=Acceso Denegado|403|Unauthorized')).toBeVisible();
      |                                                                         ^ Error: expect(locator).toBeVisible() failed
  113 |   });
  114 | });
  115 | 
```