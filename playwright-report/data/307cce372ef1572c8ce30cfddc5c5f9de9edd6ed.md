# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chaos-testing.spec.ts >> Chaos & Security Testing >> prevención de XSS en nombres de productos
- Location: tests\chaos-testing.spec.ts:64:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('aside')
Expected: visible
Timeout: 20000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 20000ms
  - waiting for locator('aside')

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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Chaos & Security Testing', () => {
  4  |   test.beforeEach(async ({ page }) => {
  5  |     await page.goto('/');
  6  |     
  7  |     // Esperar a que la página cargue y buscar el botón de Log In o Get Started
  8  |     const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
  9  |     try {
  10 |       await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
  11 |       await loginBtn.click();
  12 |     } catch (e) {
  13 |       // Si no aparece, tal vez ya estamos en la página de login o dashboard
  14 |       console.log('Botón de login no encontrado o ya en sesión');
  15 |     }
  16 | 
  17 |     // Asegurar que el input de email esté visible antes de continuar
  18 |     await page.waitForSelector('input[type="email"]', { timeout: 10000 }).catch(() => {
  19 |       console.log('Email input not found, checking if already logged in');
  20 |     });
  21 |     
  22 |     if (await page.locator('input[type="email"]').isVisible()) {
  23 |       await page.fill('input[type="email"]', 'test@fostpos.com');
  24 |       await page.fill('input[type="password"]', 'password123');
  25 |       await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
  26 |     }
  27 |     
> 28 |     await expect(page.locator('aside')).toBeVisible({ timeout: 20000 });
     |                                         ^ Error: expect(locator).toBeVisible() failed
  29 |   });
  30 | 
  31 |   test('no debe permitir vender productos con stock 0', async ({ page }) => {
  32 |     // Usar selectores robustos para el sidebar
  33 |     await page.getByRole('button', { name: /Productos/i }).click();
  34 |     await page.getByRole('button', { name: /Añadir Producto/i }).click();
  35 | 
  36 |     const name = "Zero Stock Item";
  37 |     await page.fill('input[placeholder*="nombre"]', name);
  38 |     
  39 |     // Categoría
  40 |     await page.click('button:has-text("Seleccionar...")');
  41 |     await page.click('div[role="listbox"] div[role="option"]:first-child');
  42 | 
  43 |     // Tab Precios
  44 |     await page.click('button:has-text("Precios")');
  45 |     await page.fill('input[type="number"]', '1000'); // Precio de venta
  46 | 
  47 |     // Tab Stock -> Asegurar que sea 0
  48 |     await page.click('button:has-text("Stock")');
  49 |     // El stock inicial suele ser 0 por defecto, pero lo forzamos
  50 |     const stockInput = page.locator('input[type="number"]').nth(1); // El primero suele ser costo
  51 |     await stockInput.fill('0');
  52 | 
  53 |     await page.click('button:has-text("Guardar Producto")');
  54 |     
  55 |     // Ir a Venta
  56 |     await page.getByRole('button', { name: /Venta/i }).click();
  57 |     
  58 |     // Buscar el producto
  59 |     const productBtn = page.locator(`button:has-text("${name}")`).first();
  60 |     await expect(productBtn).toBeDisabled();
  61 |     await expect(productBtn).toHaveClass(/grayscale/);
  62 |   });
  63 | 
  64 |   test('prevención de XSS en nombres de productos', async ({ page }) => {
  65 |     await page.getByRole('button', { name: /Productos/i }).click();
  66 |     await page.getByRole('button', { name: /Añadir Producto/i }).click();
  67 | 
  68 |     const xssPayload = "<img src=x onerror=alert(1)> Malicious";
  69 |     await page.fill('input[placeholder*="nombre"]', xssPayload);
  70 |     
  71 |     await page.click('button:has-text("Seleccionar...")');
  72 |     await page.click('div[role="listbox"] div[role="option"]:first-child');
  73 | 
  74 |     await page.click('button:has-text("Precios")');
  75 |     await page.fill('input[type="number"]', '1000');
  76 | 
  77 |     await page.click('button:has-text("Guardar Producto")');
  78 | 
  79 |     // Ir a Venta y verificar que el payload se vea como texto literal
  80 |     await page.getByRole('button', { name: /Venta/i }).click();
  81 |     const productTitle = page.locator(`text=${xssPayload}`).first();
  82 |     await expect(productTitle).toBeVisible();
  83 |   });
  84 | });
  85 | 
```