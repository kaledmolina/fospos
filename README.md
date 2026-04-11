# FostPOS - SaaS POS Multi-Tenant (Colombia 🇨🇴)

FostPOS es una solución integral de Punto de Venta (POS) diseñada bajo una arquitectura **SaaS Multi-Tenant**, permitiendo que múltiples negocios operen de forma independiente y aislada en una única plataforma. Optimizada para el mercado colombiano, incluye gestión de impuestos (IVA), facturación con prefijos y múltiples funcionalidades administrativas.

## 🚀 Tecnologías Utilizadas

Este proyecto utiliza un stack moderno y eficiente:

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Base de Datos**: [SQLite](https://www.sqlite.org/) con [Prisma ORM](https://www.prisma.io/)
- **Autenticación**: [NextAuth.js](https://next-auth.js.org/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Estado**: [Zustand](https://docs.pmnd.rs/zustand/) & [TanStack Query](https://tanstack.com/query/latest)

---

## 📦 Módulos y Funcionalidades

### 🏠 Arquitectura Multi-Tenant
- **Aislamiento Total**: Cada negocio (Tenant) tiene sus propios datos, usuarios, productos y configuraciones.
- **Super Admin**: Panel global para gestionar negocios, activar cuentas y ver estadísticas globales.

### 💰 Punto de Venta (POS)
- **Venta Rápida**: Interfaz optimizada con búsqueda por código de barras o SKU.
- **Carrito Dinámico**: Gestión de múltiples items, descuentos y selección de clientes.
- **Métodos de Pago**: Soporte para Efectivo, Tarjeta, Transferencia, Crédito (Fiado) y Pagos Mixtos.

### 📦 Gestión de Inventario
- **Multi-Sucursal**: Control de stock independiente por cada sede.
- **Movimientos**: Registro automático de entradas, salidas y ajustes.
- **Alertas de Stock**: Notificaciones cuando los productos están por debajo del mínimo.

### 🤝 Clientes y Créditos (Fiados)
- **Fidelización**: Sistema de puntos configurables por cada negocio.
- **Gestión de Fiados**: Módulo completo para seguimiento de deudas, abonos y fechas de vencimiento.

### 📅 Suscripciones y Servicios
- **Pagos Recurrentes**: Ideal para gimnasios, membresías o servicios de streaming.
- **Control de Vencimientos**: Alertas automáticas para suscripciones próximas a vencer.

### 📊 Administración y Finanzas
- **Caja (Arqueo)**: Control de apertura y cierre de caja con gestión de efectivo esperado vs real.
- **Gastos**: Registro de egresos detallado por categoría (Servicios, Nómina, etc.).
- **Reportes**: Estadísticas en tiempo real de ventas, ganancias y movimientos.

---

## 🛠️ Guía de Instalación

Sigue estos pasos para ejecutar el proyecto localmente:

### 1. Clonar el repositorio
```bash
git clone https://github.com/kaledmolina/fospos.git
cd fospos
```

### 2. Instalar dependencias
Se recomienda usar **bun** o **npm**:
```bash
npm install
# o
bun install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz (puedes guiarte de `.env.example` si existe):
```env
DATABASE_URL="file:./db/custom.db"
NEXTAUTH_SECRET="tu_secreto_aqui"
NEXTAUTH_URL="http://localhost:3000"
SETUP_KEY="clave_para_primer_admin"
```

### 4. Inicializar la Base de Datos
```bash
npx prisma db push
```

### 5. Ejecutar el servidor de desarrollo
```bash
npm run dev
# o
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) en su navegador.

---

## 🔐 Configuración Inicial (Super Admin)

Al ejecutar la aplicación por primera vez con la base de datos limpia, el sistema te redirigirá a la vista de **Setup**. 
1. Introduce la `SETUP_KEY` definida en tu `.env`.
2. Crea la cuenta del Super Administrador global.
3. Una vez dentro, podrás registrar tu primer negocio (Tenant) y comenzar a operar.

---

## 📄 Licencia

Este proyecto es propiedad privada. Todos los derechos reservados.
