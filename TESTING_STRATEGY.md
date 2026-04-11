# 🧪 ESTRATEGIA DE PRUEBAS - SaaS POS Colombia

## 📊 Resumen de Módulos a Probar

| # | Módulo | Prioridad | Tipo de Prueba |
|---|--------|-----------|----------------|
| 1 | Sistema Multi-Tenant | Alta | E2E, API |
| 2 | Autenticación y Roles | Alta | E2E, API, Seguridad |
| 3 | Landing Page | Media | UI, E2E |
| 4 | Super Admin Panel | Alta | E2E, API |
| 5 | Dashboard POS | Alta | UI, E2E |
| 6 | Punto de Venta | Crítica | E2E, API |
| 7 | Productos | Alta | CRUD, API |
| 8 | Categorías | Media | CRUD, API |
| 9 | Clientes | Alta | CRUD, API |
| 10 | Fiados/Créditos | Alta | E2E, API |
| 11 | Control de Caja | Crítica | E2E, API |
| 12 | Gastos | Media | CRUD, API |
| 13 | Multi-Sucursal | Alta | E2E, API |
| 14 | Usuarios/Cajeros | Alta | CRUD, API |
| 15 | Notificaciones | Media | UI, API |
| 16 | Inventario | Alta | API, Carga Masiva |

---

## 🔐 FASE 1: Pruebas de Autenticación y Roles

### 1.1 Flujo de Super Admin
```
□ Crear Super Admin inicial (Setup)
  - Verificar que no existan usuarios previos
  - Crear usuario con rol SUPER_ADMIN
  - Verificar redirección a login

□ Login Super Admin
  - Ingresar credenciales correctas
  - Verificar acceso al panel de Super Admin
  - Verificar que NO tiene acceso a POS

□ Logout Super Admin
  - Cerrar sesión
  - Verificar redirección a login
```

### 1.2 Flujo de Registro de Negocio
```
□ Registrar nuevo negocio
  - Completar todos los campos del formulario
  - Verificar mensaje de "Solicitud Enviada"
  - Verificar estado PENDING en BD

□ Intentar login con negocio pendiente
  - Verificar que NO puede acceder
  - Verificar mensaje de error apropiado

□ Activar negocio desde Super Admin
  - Cambiar estado a ACTIVE
  - Verificar email de confirmación (si aplica)

□ Login como Tenant Admin
  - Ingresar con credenciales del negocio
  - Verificar acceso al POS
  - Verificar datos del tenant en sesión
```

### 1.3 Roles de Usuario
```
□ Crear Cajero (CASHIER)
  - Asignar a una sucursal
  - Verificar que solo ve su sucursal
  - Verificar permisos limitados

□ Crear Bodeguero (WAREHOUSE)
  - Verificar acceso a inventario
  - Verificar permisos de productos

□ Probar usuario desactivado
  - Desactivar usuario
  - Verificar que NO puede hacer login
```

---

## 🏪 FASE 2: Pruebas de Multi-Sucursal

### 2.1 Gestión de Sucursales
```
□ Crear sucursal principal
  - Primera sucursal debe ser principal automáticamente
  - Verificar en BD isMain = true

□ Crear sucursal secundaria
  - Verificar que NO es principal por defecto
  - Verificar stock inicial en 0 para productos

□ Editar sucursal
  - Cambiar nombre, dirección, teléfono
  - Verificar persistencia

□ Cambiar sucursal principal
  - Marcar otra como principal
  - Verificar que la anterior ya no es principal

□ Eliminar sucursal (no principal)
  - Verificar confirmación
  - Verificar eliminación en BD
  - Verificar que usuarios asignados quedan sin sucursal

□ Intentar eliminar sucursal principal
  - Verificar que NO se puede eliminar
```

### 2.2 Asignación de Cajeros
```
□ Crear cajero SIN sucursal
  - Verificar que el formulario lo impide
  - Mostrar mensaje de error

□ Crear cajero CON sucursal
  - Asignar sucursal específica
  - Verificar en BD la relación

□ Cambiar cajero de sucursal
  - Editar y asignar nueva sucursal
  - Verificar actualización
```

---

## 📦 FASE 3: Pruebas de Productos e Inventario

### 3.1 CRUD de Productos
```
□ Crear producto completo
  - Código, nombre, precio costo, precio venta
  - Stock inicial, stock mínimo
  - Unidad, categoría
  - Verificar en BD

□ Crear producto mínimo (solo campos requeridos)
  - Solo nombre y precio venta
  - Verificar valores por defecto

□ Editar producto
  - Cambiar precios
  - Actualizar stock
  - Cambiar categoría

□ Desactivar producto
  - Verificar que NO aparece en POS
  - Verificar que sigue en reportes

□ Eliminar producto
  - Verificar que NO se puede si tiene ventas
  - Si no tiene ventas, permitir eliminación
```

### 3.2 Categorías
```
□ Crear categoría con color
□ Editar categoría
□ Eliminar categoría sin productos
□ Intentar eliminar categoría con productos
  - Verificar restricción o cascade
```

### 3.3 Stock por Sucursal
```
□ Verificar stock independiente por sucursal
□ Registrar entrada de inventario
□ Registrar salida de inventario
□ Ajuste de inventario
```

### 3.4 Carga Masiva
```
□ Cargar archivo JSON válido
  - Verificar creación múltiple
  - Verificar contador de productos creados

□ Cargar JSON con errores
  - Verificar mensajes de error

□ Cargar archivo vacío
  - Verificar mensaje apropiado
```

---

## 🛒 FASE 4: Pruebas de Punto de Venta (CRÍTICO)

### 4.1 Carrito de Compras
```
□ Agregar producto al carrito
  - Verificar cantidad = 1
  - Verificar subtotal

□ Agregar mismo producto múltiples veces
  - Verificar incremento de cantidad

□ Cambiar cantidad manualmente
  - Incrementar
  - Decrementar
  - Establecer en 0 (debe eliminar)

□ Eliminar producto del carrito
  - Verificar actualización de totales

□ Vaciar carrito completo
```

### 4.2 Cálculos
```
□ Verificar subtotal (suma de productos)
□ Verificar IVA 19%
□ Verificar total (subtotal + IVA - descuento)
□ Aplicar descuento
  - Verificar que no exceda el subtotal
```

### 4.3 Selección de Cliente
```
□ Venta sin cliente (Cliente General)
□ Seleccionar cliente existente
□ Crear cliente desde el POS (si aplica)
```

### 4.4 Métodos de Pago
```
□ Pago en Efectivo
  - Ingresar monto recibido
  - Verificar cálculo de cambio
  - Verificar registro en caja

□ Pago con Tarjeta
  - Verificar registro en caja

□ Pago por Transferencia
  - Verificar registro en caja

□ Pago a Crédito (Fiado)
  - Requiere cliente seleccionado
  - Verificar creación de crédito
  - Verificar que NO suma a caja en efectivo

□ Pago Mixto (si aplica)
```

### 4.5 Validaciones
```
□ Intentar venta sin caja abierta
  - Verificar mensaje de alerta
  - Botón para abrir caja

□ Intentar venta con carrito vacío
  - Verificar que el botón está deshabilitado

□ Venta con producto sin stock
  - Verificar advertencia
  - Permitir o bloquear según configuración
```

---

## 💰 FASE 5: Pruebas de Control de Caja

### 5.1 Apertura de Caja
```
□ Abrir caja con efectivo inicial
  - Verificar estado OPEN
  - Verificar hora de apertura

□ Intentar abrir caja si ya hay una abierta
  - Verificar que no se permite
```

### 5.2 Operaciones
```
□ Registrar venta en efectivo
  - Verificar suma al totalCash

□ Registrar venta tarjeta
  - Verificar suma al totalCard

□ Registrar venta transferencia
  - Verificar suma al totalTransfer

□ Registrar venta fiado
  - Verificar suma al totalCredit
  - NO suma a efectivo

□ Registrar gasto desde caja
  - Verificar suma al totalExpenses
```

### 5.3 Cierre de Caja
```
□ Cerrar caja con arqueo exacto
  - Efectivo esperado = Efectivo contado
  - Verificar diferencia = 0

□ Cerrar caja con sobrante
  - Efectivo contado > Esperado
  - Verificar diferencia positiva

□ Cerrar caja con faltante
  - Efectivo contado < Esperado
  - Verificar diferencia negativa

□ Verificar cálculo de efectivo esperado:
  - Efectivo inicial + Ventas efectivo - Gastos
```

---

## 👥 FASE 6: Pruebas de Clientes y Fiados

### 6.1 CRUD de Clientes
```
□ Crear cliente completo
  - Nombre, documento, teléfono, email, dirección

□ Crear cliente con documento duplicado
  - Verificar error de unicidad

□ Editar cliente
□ Eliminar cliente sin créditos
□ Ver historial de compras del cliente
```

### 6.2 Sistema de Fiados
```
□ Crear venta a crédito
  - Verificar estado PENDING
  - Verificar balance = total

□ Registrar abono parcial
  - Verificar estado cambia a PARTIAL
  - Verificar balance reducido

□ Registrar abono total
  - Verificar estado cambia a PAID
  - Verificar balance = 0

□ Verificar crédito vencido
  - Crédito con dueDate < hoy
  - Estado debe ser OVERDUE

□ Filtrar créditos
  - Todos los pendientes
  - Solo vencidos
  - Por vencer (7 días)
```

---

## 📊 FASE 7: Pruebas de Dashboard y Reportes

### 7.1 Dashboard
```
□ Verificar ventas del día
  - Comparar con suma de ventas reales

□ Verificar ventas del mes
  - Comparar con suma de ventas del mes

□ Verificar transacciones del día
  - Contar ventas de hoy

□ Verificar productos más vendidos
  - Ordenar por cantidad vendida
  - Ordenar por ingresos

□ Verificar ventas recientes
  - Últimas 5-10 ventas
```

### 7.2 Alertas
```
□ Alerta de stock bajo
  - Productos con stock < minStock
  - Verificar contador correcto

□ Alerta de créditos vencidos
  - Verificar lista correcta
```

---

## 🔔 FASE 8: Pruebas de Notificaciones

### 8.1 Generación de Notificaciones
```
□ Notificación de stock bajo
  - Crear producto con stock < mínimo
  - Verificar que aparece en notificaciones

□ Notificación de crédito vencido
  - Crear crédito con fecha pasada
  - Verificar notificación

□ Notificación de crédito por vencer
  - Crédito con dueDate en 7 días
  - Verificar notificación
```

### 8.2 Panel de Notificaciones
```
□ Ver contador de no leídas
□ Marcar como leída
□ Marcar todas como leídas
```

---

## 🧾 FASE 9: Pruebas de Gastos

### 9.1 CRUD de Gastos
```
□ Crear gasto con todos los campos
□ Crear gasto mínimo
□ Filtrar por categoría
□ Ver total de gastos
□ Ver gastos del día
```

---

## 👑 FASE 10: Pruebas de Super Admin

### 10.1 Gestión de Tenants
```
□ Listar todos los negocios
□ Ver detalles de un negocio
□ Activar negocio pendiente
□ Suspender negocio activo
□ Reactivar negocio suspendido
□ Eliminar negocio
```

### 10.2 Estadísticas Globales
```
□ Total de negocios por estado
□ Ventas totales del sistema
□ Negocios por ciudad
□ Total de productos en sistema
```

---

## 🔒 FASE 11: Pruebas de Seguridad

### 11.1 Aislamiento de Datos
```
□ Usuario de Tenant A no puede ver datos de Tenant B
  - Productos
  - Clientes
  - Ventas
  - Usuarios

□ Cajero solo ve su sucursal
□ Bodeguero no puede acceder a ventas (si aplica)
```

### 11.2 Autenticación
```
□ Login con credenciales incorrectas
  - Email incorrecto
  - Contraseña incorrecta

□ Login con usuario inactivo
□ Login con negocio suspendido
□ Acceso a rutas protegidas sin login
```

### 11.3 Validaciones de API
```
□ Crear recurso sin tenantId
□ Acceder a recurso de otro tenant
□ Modificar recurso de otro tenant
```

---

## 🌐 FASE 12: Pruebas de API

### 12.1 Endpoints CRUD
```
GET    /api/products     - Listar productos
POST   /api/products     - Crear producto
PATCH  /api/products/:id - Actualizar producto
DELETE /api/products/:id - Eliminar producto

GET    /api/customers    - Listar clientes
POST   /api/customers    - Crear cliente
PATCH  /api/customers/:id - Actualizar cliente
DELETE /api/customers/:id - Eliminar cliente

GET    /api/branches     - Listar sucursales
POST   /api/branches     - Crear sucursal
PATCH  /api/branches/:id - Actualizar sucursal
DELETE /api/branches/:id - Eliminar sucursal

GET    /api/users        - Listar usuarios
POST   /api/users        - Crear usuario
PATCH  /api/users/:id    - Actualizar usuario
DELETE /api/users/:id    - Eliminar usuario

GET    /api/sales        - Listar ventas
POST   /api/sales        - Crear venta
GET    /api/sales?type=stats - Estadísticas

GET    /api/cash         - Estado de caja
POST   /api/cash         - Abrir caja
PATCH  /api/cash         - Cerrar caja

GET    /api/credits      - Listar créditos
POST   /api/credits/:id  - Registrar abono

GET    /api/expenses     - Listar gastos
POST   /api/expenses     - Crear gasto

GET    /api/notifications - Listar notificaciones
PATCH  /api/notifications - Marcar leídas
```

### 12.2 Códigos de Respuesta
```
□ 200 - OK (GET, PATCH exitoso)
□ 201 - Created (POST exitoso)
□ 400 - Bad Request (datos inválidos)
□ 401 - Unauthorized (no autenticado)
□ 403 - Forbidden (sin permisos)
□ 404 - Not Found (recurso no existe)
□ 500 - Internal Server Error
```

---

## 📱 FASE 13: Pruebas de UI/UX

### 13.1 Responsividad
```
□ Vista móvil (< 640px)
  - Sidebar colapsado
  - Botón de menú funcional
  - Formularios adaptables

□ Vista tablet (640px - 1024px)
□ Vista desktop (> 1024px)
```

### 13.2 Animaciones
```
□ Transiciones de página
□ Hover en botones y tarjetas
□ Animaciones de carga
□ Toast notifications
```

### 13.3 Accesibilidad
```
□ Navegación por teclado
□ Focus visible en elementos
□ Colores con contraste adecuado
□ Labels en formularios
```

---

## ✅ CHECKLIST DE APROBACIÓN

### Criticidad Alta (Bloqueante)
- [ ] Login funciona correctamente
- [ ] Venta se registra correctamente
- [ ] Caja abre y cierra correctamente
- [ ] Fiados se registran y pagan
- [ ] Datos aislados por tenant

### Criticidad Media (Importante)
- [ ] Productos CRUD completo
- [ ] Clientes CRUD completo
- [ ] Sucursales funcionan
- [ ] Usuarios se crean y asignan
- [ ] Dashboard muestra datos correctos

### Criticidad Baja (Deseable)
- [ ] Notificaciones funcionan
- [ ] Animaciones suaves
- [ ] Responsive en todos los tamaños
- [ ] Mensajes de error claros

---

## 🐛 REPORTE DE ERRORES

### Formato de Reporte
```
**Módulo:** [Nombre del módulo]
**Severidad:** [Crítica | Alta | Media | Baja]
**Descripción:** [Qué sucede]
**Pasos para reproducir:**
  1. Paso 1
  2. Paso 2
  3. Paso 3
**Resultado esperado:** [Qué debería pasar]
**Resultado actual:** [Qué pasa en realidad]
**Evidencia:** [Screenshot/Video si aplica]
**Ambiente:** [Navegador, dispositivo]
```

---

## 📈 MÉTRICAS DE CALIDAD

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| Cobertura de módulos | 100% | - |
| Casos de prueba | 150+ | - |
| Bugs críticos | 0 | - |
| Bugs altos | < 5 | - |
| Tasa de éxito E2E | > 95% | - |

---

## 🚀 EJECUCIÓN DE PRUEBAS

### Orden Recomendado
1. Autenticación y Roles
2. Multi-Sucursal
3. Productos e Inventario
4. Punto de Venta
5. Control de Caja
6. Clientes y Fiados
7. Dashboard
8. Notificaciones
9. Gastos
10. Super Admin
11. Seguridad
12. API
13. UI/UX

### Tiempo Estimado
- Pruebas manuales: 4-6 horas
- Pruebas de API: 2-3 horas
- Pruebas de seguridad: 2 horas
- **Total: 8-11 horas**

---

*Documento actualizado: Enero 2025*
*Versión: 1.0*
