/**
 * 🧪 Suite de Pruebas Funcionales - POS Colombia
 * 
 * Este archivo contiene instrucciones paso a paso para probar
 * manualmente cada módulo del sistema.
 * 
 * Ejecutar con: bun run test:functional
 */

// ============================================
// INSTRUCCIONES DE PRUEBA
// ============================================

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🧪 SUITE DE PRUEBAS FUNCIONALES - POS COLOMBIA            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

Este script contiene instrucciones para probar manualmente 
todos los módulos del sistema.

════════════════════════════════════════════════════════════════

📋 PREPARACIÓN
════════════════

1. Abrir el navegador en: http://localhost:3000
2. Abrir DevTools (F12) para ver la consola y red
3. Tener la base de datos limpia (usar botón Reset si es necesario)

════════════════════════════════════════════════════════════════

🔐 FASE 1: AUTENTICACIÓN Y ROLES (15 min)
═════════════════════════════════════════

[ ] 1.1 Verificar página de Setup
    - Si no hay usuarios, debe mostrar formulario de Super Admin
    - Llenar: nombre, email, contraseña
    - Click en "Crear Super Admin"
    - Esperar: "Super Admin creado. Ahora puedes iniciar sesión."

[ ] 1.2 Login como Super Admin
    - Ir a tab "Iniciar Sesión"
    - Ingresar credenciales creadas
    - Click en "Iniciar Sesión"
    - Esperar: Panel de Super Admin con lista de negocios

[ ] 1.3 Verificar panel Super Admin
    - Ver lista de tenants (vacía inicialmente)
    - Ver estadísticas (todos en 0)
    - Ver tabs: "Negocios" y "Estadísticas"

[ ] 1.4 Logout Super Admin
    - Click en "Cerrar Sesión" en sidebar
    - Esperar: Volver a página de login

[ ] 1.5 Registrar nuevo negocio
    - Ir a tab "Registrar Negocio"
    - Llenar todos los campos:
      * Nombre: "Tienda La Esquina"
      * NIT: "900123456"
      * Teléfono: "3001234567"
      * Propietario: "Juan Pérez"
      * Email: "juan@tienda.com"
      * Ciudad: "Bogotá"
      * Dirección: "Calle 123 #45-67"
      * Contraseña: "password123"
      * Confirmar: "password123"
    - Click en "Registrar Negocio"
    - Esperar: Pantalla de confirmación "¡Solicitud Enviada!"

[ ] 1.6 Verificar estado pendiente
    - Click en "Ir a Iniciar Sesión"
    - Intentar login con las credenciales del negocio
    - Esperar: Error "Credenciales incorrectas o cuenta no activada"

[ ] 1.7 Activar negocio como Super Admin
    - Login como Super Admin
    - Ver el negocio en la lista con estado "PENDIENTE"
    - Click en botón "Activar"
    - Esperar: Estado cambia a "ACTIVO"
    - Logout

[ ] 1.8 Login como Tenant Admin
    - Login con: "juan@tienda.com" / "password123"
    - Esperar: Panel POS con Dashboard

[ ] 1.9 Verificar datos de sesión
    - En sidebar ver: Nombre del negocio "Tienda La Esquina"
    - Ver nombre del usuario "Juan Pérez"
    - Ver rol "TENANT_ADMIN"

════════════════════════════════════════════════════════════════

🏪 FASE 2: MULTI-SUCURSAL (10 min)
════════════════════════════════════════

[ ] 2.1 Crear sucursal principal
    - Ir a "Sucursales" en sidebar
    - Click en "Nueva Sucursal"
    - Llenar: Nombre: "Sucursal Centro", Ciudad: "Bogotá"
    - Click en "Crear Sucursal"
    - Verificar: Badge "Principal" en la tarjeta

[ ] 2.2 Crear sucursal secundaria
    - Click en "Nueva Sucursal"
    - Nombre: "Sucursal Norte", Ciudad: "Bogotá"
    - Click en "Crear Sucursal"
    - Verificar: NO tiene badge "Principal"

[ ] 2.3 Editar sucursal
    - Click en ícono de lápiz en "Sucursal Norte"
    - Cambiar dirección: "Cra 10 #20-30"
    - Click en "Actualizar Sucursal"
    - Verificar: Dirección actualizada

[ ] 2.4 Intentar eliminar sucursal principal
    - Click en ícono de basura en "Sucursal Centro"
    - Verificar: NO debería permitir (no aparece botón)

[ ] 2.5 Eliminar sucursal secundaria
    - Click en basura en "Sucursal Norte"
    - Confirmar eliminación
    - Verificar: Sucursal eliminada

════════════════════════════════════════════════════════════════

👤 FASE 3: GESTIÓN DE USUARIOS (10 min)
═══════════════════════════════════════════

[ ] 3.1 Crear cajero
    - Ir a "Usuarios" en sidebar
    - Click en "Nuevo Usuario"
    - Llenar:
      * Nombre: "María López"
      * Email: "maria@tienda.com"
      * Contraseña: "maria123"
      * Rol: "Cajero"
      * Sucursal: "Sucursal Centro"
    - Click en "Crear Usuario"
    - Verificar: Usuario aparece en lista con badge "Cajero"

[ ] 3.2 Crear bodeguero
    - Click en "Nuevo Usuario"
    - Nombre: "Carlos Ruiz"
    - Email: "carlos@tienda.com"
    - Contraseña: "carlos123"
    - Rol: "Bodeguero" (no requiere sucursal)
    - Click en "Crear Usuario"
    - Verificar: Usuario con badge "Bodeguero"

[ ] 3.3 Desactivar usuario
    - Click en "Desactivar" en María López
    - Verificar: Badge "Inactivo" y opacidad reducida

[ ] 3.4 Reactivar usuario
    - Click en "Activar" en María López
    - Verificar: Sin badge "Inactivo"

[ ] 3.5 Editar usuario
    - Click en lápiz en Carlos
    - Cambiar teléfono
    - Click en "Actualizar Usuario"

════════════════════════════════════════════════════════════════

📁 FASE 4: CATEGORÍAS Y PRODUCTOS (15 min)
══════════════════════════════════════════════

[ ] 4.1 Crear categoría
    - Ir a "Productos" en sidebar
    - Click en "Nueva Categoría" (o buscar el botón)
    - Nombre: "Bebidas"
    - Seleccionar color verde
    - Click en "Guardar Categoría"

[ ] 4.2 Crear producto
    - Click en "Nuevo Producto"
    - Código: "BEB001"
    - Nombre: "Coca Cola 500ml"
    - Precio Costo: 2000
    - Precio Venta: 3000
    - Stock: 50
    - Stock Mínimo: 10
    - Unidad: "unidad"
    - Categoría: "Bebidas"
    - Click en "Guardar Producto"

[ ] 4.3 Crear más productos de prueba
    - Producto 2: "Pepsi 500ml", Precio: 2800, Stock: 30
    - Producto 3: "Agua 500ml", Precio: 1500, Stock: 5 (stock bajo)

[ ] 4.4 Verificar alerta de stock bajo
    - Ir a Dashboard
    - Verificar: Alerta "Tienes 1 productos con stock bajo"

[ ] 4.5 Editar producto
    - Ir a Productos
    - Click en editar un producto
    - Cambiar precio
    - Guardar cambios

════════════════════════════════════════════════════════════════

👥 FASE 5: CLIENTES (5 min)
═════════════════════════════

[ ] 5.1 Crear cliente
    - Ir a "Clientes"
    - Click en "Nuevo Cliente"
    - Nombre: "Ana García"
    - Documento: "12345678"
    - Teléfono: "3109876543"
    - Email: "ana@email.com"
    - Click en "Guardar Cliente"

[ ] 5.2 Crear cliente para fiado
    - Nombre: "Pedro Martínez"
    - Documento: "87654321"
    - Teléfono: "3201234567"
    - Guardar

════════════════════════════════════════════════════════════════

💰 FASE 6: CONTROL DE CAJA (10 min)
══════════════════════════════════════

[ ] 6.1 Verificar caja cerrada
    - Ir a "Caja"
    - Verificar: Muestra "Caja Cerrada"
    - Verificar: Botón "Abrir Caja"

[ ] 6.2 Abrir caja
    - Click en "Abrir Caja"
    - Efectivo inicial: 100000
    - Click en "Abrir Caja"
    - Verificar: Estado cambia a "Caja Abierta"
    - Verificar: Animación del punto verde

[ ] 6.3 Verificar en Nueva Venta
    - Ir a "Nueva Venta"
    - Verificar: NO aparece alerta de abrir caja

════════════════════════════════════════════════════════════════

🛒 FASE 7: PUNTO DE VENTA - CRÍTICO (20 min)
══════════════════════════════════════════════════

[ ] 7.1 Agregar productos al carrito
    - Click en "Coca Cola 500ml" → Agrega 1
    - Click en "Coca Cola 500ml" de nuevo → Ahora 2
    - Click en "Pepsi 500ml" → Agrega 1
    - Verificar: Carrito muestra 3 productos

[ ] 7.2 Verificar cálculos
    - Subtotal: (2 × 3000) + (1 × 2800) = 8800
    - IVA (19%): 1672
    - Total: 10472

[ ] 7.3 Seleccionar cliente
    - En dropdown de cliente seleccionar "Ana García"
    - Verificar: Cliente seleccionado

[ ] 7.4 Aplicar descuento
    - Ingresar descuento: 500
    - Verificar: Total se reduce

[ ] 7.5 Procesar venta en EFECTIVO
    - Método de pago: "Efectivo"
    - Click en "Procesar Venta"
    - Verificar: Toast "Venta registrada exitosamente"
    - Verificar: Carrito vacío

[ ] 7.6 Verificar en caja
    - Ir a "Caja"
    - Verificar: Ventas totales = 9972 (total con descuento)
    - Verificar: Efectivo = 9972

[ ] 7.7 Venta con TARJETA
    - Ir a Nueva Venta
    - Agregar productos
    - Método: "Tarjeta"
    - Procesar venta
    - Verificar en Caja: Total tarjeta incrementó

[ ] 7.8 Venta a CRÉDITO (Fiado)
    - Nueva Venta
    - Agregar productos
    - Seleccionar cliente "Pedro Martínez"
    - Método: "Fiado"
    - Procesar venta
    - Verificar: Toast de éxito

════════════════════════════════════════════════════════════════

💳 FASE 8: FIADOS/CRÉDITOS (10 min)
════════════════════════════════════════

[ ] 8.1 Ver crédito pendiente
    - Ir a "Fiados"
    - Verificar: Crédito de Pedro Martínez aparece
    - Verificar: Balance = total de la venta

[ ] 8.2 Registrar abono parcial
    - Click en "Registrar Abono"
    - Monto: 50% del total (usar botón 50%)
    - Click en "Registrar Abono"
    - Verificar: Balance reducido
    - Verificar: Badge "Pago Parcial"

[ ] 8.3 Registrar abono total
    - Click en "Registrar Abono"
    - Click en botón "Total"
    - Registrar
    - Verificar: Estado "Pagado"
    - Verificar: Ya no aparece en lista principal

════════════════════════════════════════════════════════════════

🧾 FASE 9: GASTOS (5 min)
════════════════════════════

[ ] 9.1 Registrar gasto
    - Ir a "Gastos"
    - Click en "Nuevo Gasto"
    - Categoría: "Servicios"
    - Descripción: "Pago de luz"
    - Monto: 50000
    - Click en "Registrar Gasto"

[ ] 9.2 Verificar en caja
    - Ir a Caja
    - Verificar: Gastos del día = 50000
    - Verificar: Efectivo esperado se redujo

════════════════════════════════════════════════════════════════

🔔 FASE 10: NOTIFICACIONES (5 min)
══════════════════════════════════════

[ ] 10.1 Ver notificaciones
    - Click en campana (esquina superior derecha)
    - Verificar: Notificación de stock bajo (Agua 500ml)

[ ] 10.2 Crear crédito con fecha de vencimiento
    - Hacer una venta a fiado con fecha de vencimiento cercana
    - Verificar notificación de "por vencer"

════════════════════════════════════════════════════════════════

📊 FASE 11: DASHBOARD (5 min)
════════════════════════════════

[ ] 11.1 Verificar estadísticas
    - Ir a Dashboard
    - Verificar: Ventas hoy > 0
    - Verificar: Transacciones = número de ventas
    - Verificar: Fiados pendientes

[ ] 11.2 Ver productos más vendidos
    - Verificar lista ordenada por cantidad

[ ] 11.3 Ver ventas recientes
    - Verificar últimas ventas

════════════════════════════════════════════════════════════════

💰 FASE 12: CIERRE DE CAJA (10 min)
═════════════════════════════════════════

[ ] 12.1 Preparar cierre
    - Ir a Caja
    - Ver resumen:
      * Efectivo inicial
      * Ventas en efectivo
      * Gastos del día
      * Efectivo esperado

[ ] 12.2 Cerrar con arqueo exacto
    - Click en "Cerrar Caja"
    - En "Efectivo contado" poner el valor exacto esperado
    - Click en "Cerrar Caja"
    - Verificar: "Diferencia: $0"

[ ] 12.3 Abrir nueva caja
    - Verificar caja cerrada
    - Abrir con nuevo efectivo inicial

════════════════════════════════════════════════════════════════

👑 FASE 13: SUPER ADMIN (10 min)
════════════════════════════════════════

[ ] 13.1 Ver estadísticas globales
    - Logout y login como Super Admin
    - Ir a "Estadísticas"
    - Verificar totales del sistema

[ ] 13.2 Suspender negocio
    - Ir a "Negocios"
    - Click en "Suspender" en Tienda La Esquina
    - Verificar: Estado cambia a "Suspendido"

[ ] 13.3 Verificar acceso denegado
    - Intentar login como Juan Pérez
    - Verificar: Error de autenticación

[ ] 13.4 Reactivar negocio
    - Como Super Admin, click en "Reactivar"
    - Verificar login funciona nuevamente

════════════════════════════════════════════════════════════════

🔒 FASE 14: SEGURIDAD (10 min)
════════════════════════════════════════

[ ] 14.1 Login con cajero
    - Logout
    - Login como María López (cajero)
    - Verificar: NO ve "Sucursales" ni "Usuarios" en menú

[ ] 14.2 Verificar aislamiento de datos
    - Verificar que solo ve productos de su tenant
    - Verificar que solo ve clientes de su tenant

[ ] 14.3 Acceso directo a URL protegida
    - Estando logout, intentar ir a / directamente
    - Verificar: Redirección a login

════════════════════════════════════════════════════════════════

📱 FASE 15: RESPONSIVE (5 min)
══════════════════════════════════

[ ] 15.1 Vista móvil
    - Reducir ancho del navegador a < 640px
    - Verificar: Sidebar colapsado
    - Verificar: Botón hamburguesa funciona
    - Verificar: Formularios adaptables

[ ] 15.2 Vista tablet
    - Ancho entre 640px y 1024px
    - Verificar layout correcto

[ ] 15.3 Vista desktop
    - Pantalla completa
    - Verificar sidebar expandido

════════════════════════════════════════════════════════════════

✅ CHECKLIST FINAL
══════════════════

[ ] Todos los CRUDs funcionan
[ ] Ventas se procesan correctamente
[ ] Caja abre y cierra con arqueo
[ ] Fiados se registran y pagan
[ ] Notificaciones aparecen
[ ] Usuarios tienen permisos correctos
[ ] UI responsive
[ ] Sin errores en consola

════════════════════════════════════════════════════════════════

🎯 TIEMPO ESTIMADO: 2-3 horas

📝 NOTAS:
- Documentar cualquier error encontrado
- Tomar screenshots de bugs
- Probar casos límite (valores negativos, vacíos, etc.)
- Verificar que los cálculos sean correctos

`);

// Exportar para uso como módulo si es necesario
export const testInstructions = "Ver instrucciones arriba";
