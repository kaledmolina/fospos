import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Manejar el estado de "Setup" si aparece (base de datos vacía)
    const setupTitle = page.locator('text=Configuración del Motor');
    if (await setupTitle.isVisible()) {
      console.log('⚠️ El sistema requiere configuración inicial. No se puede probar login normal.');
      // Aquí podrías automatizar el setup si tuvieras la Master Key, 
      // por ahora marcamos la prueba como saltada o fallida con explicación.
      test.skip(true, 'Sistema en modo Setup. Limpia la base de datos o completa el setup primero.');
    }
  });

  test('debe mostrar error con credenciales inválidas', async ({ page }) => {
    // 1. Si está la landing page, entrar a la app
    const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
    try {
      await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
      await loginBtn.click();
    } catch (e) {}

    // 2. Llenar el formulario de login
    // Usamos selectores más específicos por si hay varios inputs
    await page.waitForSelector('input[type="email"]');
    await page.fill('input[type="email"]', 'usuario@error.com');
    await page.fill('input[type="password"]', 'password_incorrecto');

    // 3. Click en Iniciar Sesión
    await page.click('button[type="submit"]:has-text("Iniciar Sesión")');

    // 4. Verificar mensaje de error
    const errorMessage = page.locator('text=Credenciales inválidas o cuenta no activada');
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
  });

  test('debe permitir cambiar a la pestaña de Registro', async ({ page }) => {
    const loginBtn = page.getByRole('button', { name: /Log In|Get Started/i }).first();
    try {
      await loginBtn.waitFor({ state: 'visible', timeout: 5000 });
      await loginBtn.click();
    } catch (e) {}

    // Click en la pestaña "Registrarse"
    await page.click('button:has-text("Registrarse")');

    // Verificar que aparece el campo de "Business Name"
    await expect(page.locator('text=Business Name')).toBeVisible();
  });
});
