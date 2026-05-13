import { test, expect } from '@playwright/test';

test.describe('1. Configuración Inicial (Onboarding)', () => {
  const uniqueNit = `NIT-${Date.now()}`;
  const businessName = 'Automated Test Business';
  const adminEmail = `admin-${Date.now()}@test.com`;
  const cashierEmail = `cashier-${Date.now()}@test.com`;

  async function loginAs(page, email, password) {
    await page.goto('/');
    const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
    try {
      await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
      await loginBtn.click();
    } catch (e) {}

    await page.waitForSelector('input[type="email"]', { timeout: 10000 }).catch(() => {});
    
    if (await page.locator('input[type="email"]').isVisible()) {
      await page.fill('input[type="email"]', email);
      await page.fill('input[type="password"]', password);
      await page.click('button[type="submit"]:has-text("Iniciar Sesión")');
    }
  }

  test('Registro de Negocio y Configuración Inicial', async ({ page }) => {
    await page.goto('/');

    // 1. Registro de Negocio
    const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
    try {
      await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
      await loginBtn.click();
    } catch (e) {}
    
    await page.click('button:has-text("Registrarse")');
    await page.waitForSelector('input[placeholder="Nombre de tu negocio"]');

    await page.fill('input[placeholder="Nombre de tu negocio"]', businessName);
    await page.fill('input[placeholder="NIT o Cédula"]', uniqueNit);
    await page.fill('input[placeholder="Nombre completo responsable"]', 'Test Owner');
    await page.fill('input[placeholder="email@empresa.com"]', adminEmail);
    await page.fill('input[placeholder="Bogotá, Medellín..."]', 'Test City');
    
    // Usar locatarios específicos para la pestaña de registro
    const registerPanel = page.locator('[role="tabpanel"][data-state="active"]');
    await registerPanel.locator('input[type="password"]').first().fill('password123');
    await registerPanel.locator('input[type="password"]').last().fill('password123');
    
    await page.click('button:has-text("Registrar mi Negocio")');

    // Verificar que redirige al Dashboard o muestra mensaje de éxito
    await expect(page.locator('text=Registro Completado')).toBeVisible({ timeout: 15000 });
    // Verificar estado pendiente
    await expect(page.locator('text=Pendiente Actvacion')).toBeVisible();
  });

  test('Configuración de Sucursal Principal', async ({ page }) => {
    // Login con el admin creado
    await loginAs(page, 'test@fostpos.com', 'password123');

    // Navegar a Configuración/Sucursales
    // Abrir grupo Configuración si es necesario
    const configGroup = page.getByRole('button', { name: /Configuración/i });
    await configGroup.click();
    await page.getByRole('button', { name: /Sucursales/i }).click();

    // Crear/Editar Sucursal
    await page.getByRole('button', { name: /Añadir Sucursal/i }).click();
    await page.fill('input[placeholder*="Nombre"]', 'Sucursal Norte');
    await page.fill('input[placeholder*="Dirección"]', 'Calle 100 #15-20');
    await page.fill('input[placeholder*="Teléfono"]', '3001234567');
    await page.fill('input[placeholder*="NIT"]', '900-123-456');
    
    await page.click('button:has-text("Guardar")');
    await expect(page.locator('text=Sucursal creada correctamente')).toBeVisible();
    await expect(page.locator('text=Sucursal Norte')).toBeVisible();
  });

  test('Creación de Usuarios (Admin y Cajero)', async ({ page }) => {
    // Login Admin
    await loginAs(page, 'test@fostpos.com', 'password123');

    const configGroup = page.getByRole('button', { name: /Configuración/i });
    await configGroup.click();
    await page.getByRole('button', { name: /Usuarios/i }).click();

    // Crear Cajero
    await page.getByRole('button', { name: /Añadir Usuario/i }).click();
    await page.fill('input[placeholder*="Nombre"]', 'Cajero de Prueba');
    await page.fill('input[type="email"]', cashierEmail);
    await page.fill('input[type="password"]', 'cajero123');
    
    // Seleccionar Rol Cajero
    await page.selectOption('select[name="role"]', 'CASHIER');
    // Asignar a sucursal (asumimos que hay un select o checkbox)
    await page.selectOption('select[name="branchId"]', { label: 'Sucursal Norte' });

    await page.click('button:has-text("Guardar")');
    await expect(page.locator('text=Usuario creado')).toBeVisible();
  });

  test('Prueba de Roles: Restricciones del Cajero', async ({ page }) => {
    // Login con el Cajero
    await loginAs(page, cashierEmail, 'cajero123');

    // Verificar que NO vea el menú de Configuración
    await expect(page.getByRole('button', { name: /Configuración/i })).not.toBeVisible();
    
    // Intentar entrar por URL (IDOR test parcial)
    await page.goto('/admin/settings');
    await expect(page.locator('text=Acceso Denegado|403|Unauthorized')).toBeVisible();
  });
});
