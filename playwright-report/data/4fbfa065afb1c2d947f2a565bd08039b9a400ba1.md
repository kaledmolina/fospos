# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: security-resilience.spec.ts >> Seguridad (Malicious User) >> Salto de URL (IDOR)
- Location: tests\security-resilience.spec.ts:129:7

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: page.fill: Test timeout of 180000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - img [ref=e7]
          - generic [ref=e12]:
            - heading "FostPOS" [level=1] [ref=e13]
            - paragraph [ref=e14]: Smart Business Cloud
        - navigation [ref=e15]:
          - link "Inicio" [ref=e16] [cursor=pointer]:
            - /url: "#inicio"
          - link "Características" [ref=e17] [cursor=pointer]:
            - /url: "#caracteristicas"
          - link "Planes" [ref=e18] [cursor=pointer]:
            - /url: "#precios"
          - link "Clientes" [ref=e19] [cursor=pointer]:
            - /url: "#testimonios"
        - generic [ref=e20]:
          - button [ref=e22] [cursor=pointer]:
            - generic [ref=e23]:
              - img
          - button "Log In" [ref=e24] [cursor=pointer]
          - button "Get Started" [ref=e25] [cursor=pointer]
    - generic [ref=e27]:
      - generic [ref=e28]:
        - generic [ref=e29]:
          - img [ref=e30]
          - generic [ref=e32]: The Future of Retail is Here
        - heading "Vende más. Gana mejor." [level=2] [ref=e33]:
          - text: Vende más.
          - text: Gana mejor.
        - paragraph [ref=e34]: La plataforma de gestión empresarial más avanzada y visualmente impresionante. Control total de tu negocio desde cualquier lugar, en tiempo real.
        - generic [ref=e35]:
          - button "Empezar Ahora" [ref=e36] [cursor=pointer]:
            - text: Empezar Ahora
            - img
          - button "Agendar Demo" [ref=e37] [cursor=pointer]
      - generic [ref=e39]:
        - generic [ref=e41]:
          - generic [ref=e47]: FOST-POS-ENGINE.V2.0
          - img "FostPOS Dashboard" [ref=e48]
        - generic [ref=e50]:
          - img [ref=e51]
          - generic [ref=e54]:
            - generic [ref=e55]: Revenue Today
            - generic [ref=e56]: $4.890.000
    - generic [ref=e58]:
      - generic [ref=e59]:
        - generic [ref=e60]:
          - heading "Capabilities" [level=2] [ref=e61]
          - heading "Potencia bruta para tu comercio." [level=3] [ref=e62]:
            - text: Potencia bruta para
            - text: tu comercio.
          - paragraph [ref=e63]: Diseñado para ser la espina dorsal de tu operación. Sin fricciones, sin retrasos, solo resultados.
        - generic [ref=e64]:
          - generic [ref=e65]:
            - paragraph [ref=e66]: 5k+
            - paragraph [ref=e67]: Negocios
          - generic [ref=e68]:
            - paragraph [ref=e69]: 99%
            - paragraph [ref=e70]: Uptime
      - generic [ref=e71]:
        - generic [ref=e73]:
          - img [ref=e75]
          - heading "Flujo de Caja" [level=4] [ref=e78]
          - paragraph [ref=e79]: Gestión impecable de ingresos y egresos. Cada peso bajo control, cada cierre perfecto.
        - generic [ref=e81]:
          - img [ref=e83]
          - heading "Manejo de Stock" [level=4] [ref=e87]
          - paragraph [ref=e88]: Alertas inteligentes y control multi-sede. Nunca te quedes sin stock de lo que más vendes.
        - generic [ref=e90]:
          - img [ref=e92]
          - heading "CRM de Clientes" [level=4] [ref=e97]
          - paragraph [ref=e98]: Conoce a tus clientes. Gestiona créditos y deudas con un sistema de cobro automático.
        - generic [ref=e100]:
          - img [ref=e102]
          - heading "Business Intelligence" [level=4] [ref=e104]
          - paragraph [ref=e105]: Reportes visuales de alto impacto. Descubre tendencias y optimiza tus márgenes.
        - generic [ref=e107]:
          - img [ref=e109]
          - heading "Ciberseguridad" [level=4] [ref=e111]
          - paragraph [ref=e112]: Protección de datos nivel bancario. Tu información es tu activo más valioso.
        - generic [ref=e114]:
          - img [ref=e116]
          - heading "Experiencia Móvil" [level=4] [ref=e118]
          - paragraph [ref=e119]: La aplicación de ventas más rápida del mercado. Toda la potencia en la palma de tu mano.
    - generic [ref=e121]:
      - img "FostPOS Mobile" [ref=e124]
      - generic [ref=e125]:
        - heading "Mobility" [level=2] [ref=e126]
        - heading "Tu negocio en el bolsillo." [level=3] [ref=e127]:
          - text: Tu negocio
          - text: en el bolsillo.
        - paragraph [ref=e128]: Vende en ferias, domicilios o en el salón. Nuestra app móvil no es una versión reducida, es todo el motor de FostPOS optimizado para un toque.
        - generic [ref=e129]:
          - generic [ref=e130]:
            - img [ref=e132]
            - generic [ref=e135]:
              - heading "Ventas Offline" [level=5] [ref=e136]
              - paragraph [ref=e137]: Sigue vendiendo incluso sin internet.
          - generic [ref=e138]:
            - img [ref=e140]
            - generic [ref=e143]:
              - heading "Escaneo por Cámara" [level=5] [ref=e144]
              - paragraph [ref=e145]: No necesitas hardware adicional.
          - generic [ref=e146]:
            - img [ref=e148]
            - generic [ref=e151]:
              - heading "Tickets Digitales" [level=5] [ref=e152]
              - paragraph [ref=e153]: Ahorra en papel y cuida el planeta.
        - button "Descargar App" [ref=e154] [cursor=pointer]
    - generic [ref=e156]:
      - generic [ref=e157]:
        - heading "Precios transparentes." [level=2] [ref=e158]
        - paragraph [ref=e159]: Escale su negocio sin sorpresas al final del mes.
      - generic [ref=e160]:
        - generic [ref=e162]:
          - generic [ref=e163]:
            - heading "Emprendedor" [level=4] [ref=e164]
            - generic [ref=e165]:
              - generic [ref=e166]: $
              - generic [ref=e167]: "49.900"
              - generic [ref=e168]: /mo
            - paragraph [ref=e169]: Ideal para pequeños negocios que están comenzando.
          - generic [ref=e170]:
            - list [ref=e171]:
              - listitem [ref=e172]:
                - img [ref=e173]
                - text: 1 Sede
              - listitem [ref=e176]:
                - img [ref=e177]
                - text: Hasta 500 productos
              - listitem [ref=e180]:
                - img [ref=e181]
                - text: Ventas y Facturación
              - listitem [ref=e184]:
                - img [ref=e185]
                - text: Control de Inventario
              - listitem [ref=e188]:
                - img [ref=e189]
                - text: Soporte por email
            - button "Start Plan" [ref=e192] [cursor=pointer]
        - generic [ref=e193]:
          - generic [ref=e194]: Most Chosen
          - generic [ref=e195]:
            - generic [ref=e197]:
              - heading "Negocio Pro" [level=4] [ref=e198]
              - generic [ref=e199]:
                - generic [ref=e200]: $
                - generic [ref=e201]: "89.900"
                - generic [ref=e202]: /mo
              - paragraph [ref=e203]: Todo lo que necesitas para escalar tu negocio.
            - generic [ref=e204]:
              - list [ref=e205]:
                - listitem [ref=e206]:
                  - img [ref=e207]
                  - text: Hasta 3 Sedes
                - listitem [ref=e210]:
                  - img [ref=e211]
                  - text: Productos ilimitados
                - listitem [ref=e214]:
                  - img [ref=e215]
                  - text: Reportes avanzados
                - listitem [ref=e218]:
                  - img [ref=e219]
                  - text: Módulo de Clientes y Fiados
                - listitem [ref=e222]:
                  - img [ref=e223]
                  - text: Soporte prioritario
              - button "Start Plan" [ref=e226] [cursor=pointer]
        - generic [ref=e228]:
          - generic [ref=e229]:
            - heading "Empresarial" [level=4] [ref=e230]
            - generic [ref=e232]: Consultar
            - paragraph [ref=e233]: Soluciones personalizadas para grandes operaciones.
          - generic [ref=e234]:
            - list [ref=e235]:
              - listitem [ref=e236]:
                - img [ref=e237]
                - text: Sedes ilimitadas
              - listitem [ref=e240]:
                - img [ref=e241]
                - text: Usuarios ilimitados
              - listitem [ref=e244]:
                - img [ref=e245]
                - text: API personalizada
              - listitem [ref=e248]:
                - img [ref=e249]
                - text: Integraciones externas
              - listitem [ref=e252]:
                - img [ref=e253]
                - text: Account Manager dedicado
            - button "Start Plan" [ref=e256] [cursor=pointer]
    - generic [ref=e258]:
      - generic [ref=e259]:
        - heading "Wall of Trust." [level=3] [ref=e260]
        - generic [ref=e261]:
          - img [ref=e263]
          - img [ref=e266]
          - img [ref=e269]
          - img [ref=e272]
          - img [ref=e275]
      - generic [ref=e277]:
        - generic [ref=e279]:
          - paragraph [ref=e280]: "\"Desde que implementamos FostPOS, el control de mi inventario es impecable. Los fiados ya no son un dolor de cabeza.\""
          - generic [ref=e281]:
            - generic [ref=e282]: CR
            - generic [ref=e283]:
              - generic [ref=e284]: Carlos Rodríguez
              - generic [ref=e285]: Dueño de Minimal Tienda
        - generic [ref=e287]:
          - paragraph [ref=e288]: "\"La facilidad de uso en el móvil me permite ver cómo va mi negocio incluso cuando no estoy en el local. ¡Altamente recomendado!\""
          - generic [ref=e289]:
            - generic [ref=e290]: EG
            - generic [ref=e291]:
              - generic [ref=e292]: Elena Gómez
              - generic [ref=e293]: Gerente de Boutique Aurora
        - generic [ref=e295]:
          - paragraph [ref=e296]: "\"El soporte técnico es excelente y el sistema es muy intuitivo. Mis cajeros aprendieron a usarlo en menos de una hora.\""
          - generic [ref=e297]:
            - generic [ref=e298]: RM
            - generic [ref=e299]:
              - generic [ref=e300]: Ricardo Mesa
              - generic [ref=e301]: Propietario de Ferretería El Martillo
    - generic [ref=e302]:
      - generic [ref=e303]:
        - heading "Ready to Transform?" [level=2] [ref=e304]:
          - text: Ready to
          - text: Transform?
        - paragraph [ref=e305]: Únase a los miles de negocios que ya operan a la velocidad de la luz con FostPOS.
        - button "Start Free Today" [ref=e307] [cursor=pointer]:
          - text: Start Free Today
          - img
        - paragraph [ref=e308]: No credit card required • 30-day trial
      - generic:
        - img
    - contentinfo [ref=e309]:
      - generic [ref=e310]:
        - generic [ref=e311]:
          - generic [ref=e312]:
            - img [ref=e314]
            - heading "FostPOS" [level=1] [ref=e319]
          - paragraph [ref=e320]: Redefiniendo el comercio en América Latina con tecnología SaaS de vanguardia e interfaces que inspiran grandeza.
          - generic [ref=e321]:
            - img [ref=e323] [cursor=pointer]
            - img [ref=e327] [cursor=pointer]
            - img [ref=e331] [cursor=pointer]
        - generic [ref=e333]:
          - heading "Product" [level=5] [ref=e334]
          - list [ref=e335]:
            - listitem [ref=e336]:
              - link "Features" [ref=e337] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e338]:
              - link "Integrations" [ref=e339] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e340]:
              - link "Pricing" [ref=e341] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e342]:
              - link "Changelog" [ref=e343] [cursor=pointer]:
                - /url: "#"
        - generic [ref=e344]:
          - heading "Company" [level=5] [ref=e345]
          - list [ref=e346]:
            - listitem [ref=e347]:
              - link "Story" [ref=e348] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e349]:
              - link "Contact" [ref=e350] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e351]:
              - link "Privacy" [ref=e352] [cursor=pointer]:
                - /url: "#"
            - listitem [ref=e353]:
              - link "Legal" [ref=e354] [cursor=pointer]:
                - /url: "#"
      - generic [ref=e355]:
        - paragraph [ref=e356]: © 2024 FOSTPOS SOFTWARE LTD.
        - generic [ref=e357]:
          - generic [ref=e358] [cursor=pointer]: System Status
          - generic [ref=e359] [cursor=pointer]: Help Center
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e365] [cursor=pointer]:
    - img [ref=e366]
  - alert [ref=e369]
```

# Test source

```ts
  32  |   });
  33  | 
  34  |   test('Persistencia del Carrito (F5)', async ({ page }) => {
  35  |     await page.goto('/');
  36  |     await page.fill('input[type="email"]', 'test@fostpos.com');
  37  |     await page.fill('input[type="password"]', 'password123');
  38  |     await page.click('button[type="submit"]');
  39  | 
  40  |     await page.getByRole('button', { name: /Venta/i }).click();
  41  |     await page.click('button:has-text("Test Product")');
  42  |     await expect(page.locator('aside')).toContainText('Test Product');
  43  | 
  44  |     await page.reload();
  45  |     await expect(page.locator('aside')).toContainText('Test Product');
  46  |   });
  47  | });
  48  | 
  49  | test.describe('Resiliencia y Chaos Testing', () => {
  50  |   test.beforeEach(async ({ page }) => {
  51  |     await page.goto('/');
  52  |     await page.fill('input[type="email"]', 'test@fostpos.com');
  53  |     await page.fill('input[type="password"]', 'password123');
  54  |     await page.click('button[type="submit"]');
  55  |   });
  56  | 
  57  |   test('El Doble Clic Asesino en Finalizar Venta', async ({ page }) => {
  58  |     await page.getByRole('button', { name: /Venta/i }).click();
  59  |     await page.click('button:has-text("Test Product")');
  60  |     await page.click('button:has-text("Procesar Venta")');
  61  |     
  62  |     const finalizeBtn = page.getByRole('button', { name: /Finalizar/i });
  63  |     // Clic rápido 3 veces
  64  |     await finalizeBtn.click({ clickCount: 3, delay: 50 });
  65  |     
  66  |     await expect(page.locator('text=Venta Exitosa')).toBeVisible();
  67  |     // Verificar que solo se creó UNA venta en el historial
  68  |     await page.getByRole('button', { name: /Reportes/i }).click();
  69  |     await page.click('text=Ventas Recientes');
  70  |     const rows = page.locator('tr:has-text("Test Product")');
  71  |     await expect(rows).toHaveCount(1);
  72  |   });
  73  | 
  74  |   test('Stock Fantasma (Venta Simultánea)', async ({ browser }) => {
  75  |     // Necesitamos dos páginas con el mismo usuario
  76  |     const context = await browser.newContext();
  77  |     const page1 = await context.newPage();
  78  |     const page2 = await context.newPage();
  79  | 
  80  |     for (const p of [page1, page2]) {
  81  |       await p.goto('/');
  82  |       await p.fill('input[type="email"]', 'test@fostpos.com');
  83  |       await p.fill('input[type="password"]', 'password123');
  84  |       await p.click('button[type="submit"]');
  85  |       await p.getByRole('button', { name: /Venta/i }).click();
  86  |     }
  87  | 
  88  |     // Suponiendo stock: 1
  89  |     await page1.click('button:has-text("Test Product")');
  90  |     await page2.click('button:has-text("Test Product")');
  91  | 
  92  |     await page1.click('button:has-text("Procesar Venta")');
  93  |     await page2.click('button:has-text("Procesar Venta")');
  94  | 
  95  |     // Finalizar en ambas casi al tiempo
  96  |     await Promise.all([
  97  |       page1.click('button:has-text("Finalizar")'),
  98  |       page2.click('button:has-text("Finalizar")')
  99  |     ]);
  100 | 
  101 |     // Una debe fallar o el stock no debe ser -1
  102 |     const errorMsg = page1.locator('text=Stock insuficiente').or(page2.locator('text=Stock insuficiente'));
  103 |     await expect(errorMsg).toBeVisible();
  104 |   });
  105 | 
  106 |   test('Eliminación con Dependencias', async ({ page }) => {
  107 |     await page.getByRole('button', { name: /Inventario/i }).click();
  108 |     await page.getByRole('button', { name: /Categorías/i }).click();
  109 |     
  110 |     // Intentar eliminar categoría con productos
  111 |     await page.click('tr:has-text("Test Category") button:has-text("Eliminar")');
  112 |     await page.click('button:has-text("Confirmar")');
  113 |     
  114 |     await expect(page.locator('text=No se puede eliminar|Existen productos asociados')).toBeVisible();
  115 |   });
  116 | 
  117 |   test('Precios y Cantidades Negativas', async ({ page }) => {
  118 |     await page.getByRole('button', { name: /Productos/i }).click();
  119 |     await page.click('tr:has-text("Test Product") button:has-text("Editar")');
  120 |     
  121 |     await page.fill('input[name="salePrice"]', '-100');
  122 |     await page.click('button:has-text("Guardar")');
  123 |     
  124 |     await expect(page.locator('text=El precio debe ser mayor a 0')).toBeVisible();
  125 |   });
  126 | });
  127 | 
  128 | test.describe('Seguridad (Malicious User)', () => {
  129 |   test('Salto de URL (IDOR)', async ({ page }) => {
  130 |     // Login como Cajero
  131 |     await page.goto('/');
> 132 |     await page.fill('input[type="email"]', 'cajero@test.com');
      |                ^ Error: page.fill: Test timeout of 180000ms exceeded.
  133 |     await page.fill('input[type="password"]', 'cajero123');
  134 |     await page.click('button[type="submit"]');
  135 | 
  136 |     // Intentar acceder a panel de super admin o settings de otro tenant
  137 |     await page.goto('/super-admin/tenants');
  138 |     await expect(page.locator('text=403|Acceso Denegado')).toBeVisible();
  139 |   });
  140 | 
  141 |   test('Manipulación de Precios desde el DOM', async ({ page }) => {
  142 |     await page.goto('/');
  143 |     await page.fill('input[type="email"]', 'test@fostpos.com');
  144 |     await page.fill('input[type="password"]', 'password123');
  145 |     await page.click('button[type="submit"]');
  146 |     
  147 |     await page.getByRole('button', { name: /Venta/i }).click();
  148 |     await page.click('button:has-text("Test Product")');
  149 |     
  150 |     // Inyectar script para cambiar el valor del input de total en el carrito
  151 |     await page.evaluate(() => {
  152 |       const totalInput = document.querySelector('input[name="total"]') as HTMLInputElement;
  153 |       if (totalInput) totalInput.value = "1"; // Intentar pagar 1 peso
  154 |     });
  155 | 
  156 |     await page.click('button:has-text("Procesar Venta")');
  157 |     await page.click('button:has-text("Finalizar")');
  158 |     
  159 |     // El servidor debe rechazarlo o recalcular correctamente
  160 |     await expect(page.locator('text=Error de validación|Monto inválido')).toBeVisible();
  161 |   });
  162 | });
  163 | 
```