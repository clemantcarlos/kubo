<div align="center">

# 🍞 Kubo — POS & Inventory Management System

**Sistema de punto de venta y gestión de inventario para panaderías y restaurantes**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

> **⚠️ Proyecto en desarrollo —** Este es un proyecto de aprendizaje en curso. Algunas funcionalidades están incompletas o en progreso. Está construido para practicar y reforzar conocimientos en desarrollo full-stack con TypeScript.

---

> **📚 Portfolio Personal —** Kubo fue desarrollado como parte de mi proceso de formación como desarrollador de software. El objetivo principal era aplicar y consolidar conceptos de arquitectura de software, diseño de bases de datos, autenticación JWT, y desarrollo de interfaces modernas con React.

---

## 📋 Sobre el Proyecto

> **📚 Proyecto de aprendizaje:** Kubo fue desarrollado como parte de mi proceso de formación como desarrollador de software. El objetivo principal era aplicar y consolidar conceptos de arquitectura de software, diseño de bases de datos, autenticación JWT, y desarrollo de interfaces modernas con React. Este proyecto está en desarrollo activo y contiene funcionalidades incompletas.

**Kubo** es una aplicación web full-stack construida como proyecto de aprendizaje para gestionar las operaciones de un negocio de panadería/cantina. Combina un sistema de punto de venta (POS) para el mostrador con un panel de administración completo para el back-office. El proyecto está en desarrollo activo y contiene funcionalidades incompletas.

### Principales Funcionalidades

| Módulo | Descripción |
|--------|-------------|
| **Punto de Venta (POS)** | Interfaz intuitiva para procesar pedidos en caja, gestión de mesas y meseros |
| **Gestión de Inventario** | CRUD de productos, control de stock, trazabilidad de movimientos de inventario |
| **Compras** | Flujo completo de órdenes de compra: creación → aprobación → recepción → facturación → pagos |
| **Recetas/Producción** | Definición de recetas con ingredientes, salidas y control de rendimiento |
| **Proveedores** | Registro y gestión de proveedores con información de contacto e identificación fiscal |
| **Autenticación** | JWT con access/refresh tokens, roles y permisos granulares (RBAC) |
| **API Documentada** | Swagger UI integrado para exploración interactiva de la API |

> **Nota:** Este proyecto está en desarrollo activo. El módulo de carrito, algunos reportes y funcionalidades avanzadas aún se encuentran en construcción.

---

## 🏗️ Arquitectura

```
kubo-master/
├── frontend/          # React 19 + Vite + Tailwind CSS + shadcn/ui
│   ├── src/
│   │   ├── modules/   # Módulos por dominio (auth, pos, inventory, restaurant)
│   │   ├── components/# Componentes compartidos y UI (shadcn/ui)
│   │   ├── services/  # Capa de servicios HTTP
│   │   ├── queryHooks/# TanStack React Query hooks
│   │   └── lib/       # Utilidades y configuración
│   └── ...
│
├── backend/           # NestJS + Prisma + PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma          # Schema de base de datos (25+ modelos)
│   │   ├── migrations/            # 13 migraciones de DB
│   │   └── SCHEMA_DOCUMENTATION.txt
│   ├── src/
│   │   ├── modules/   # Módulos por dominio (auth, inventory, sale, cart)
│   │   ├── prisma/    # Servicio global de Prisma
│   │   ├── utils/     # Utilidades (regex, hashing, imágenes)
│   │   └── interfaces/# Tipos de respuesta estándar
│   └── test/          # Tests unitarios y e2e
│
└── package.json       # pnpm workspace root
```

---

## 🛠️ Stack Tecnológico

### Backend

- **Framework:** NestJS con arquitectura modular
- **ORM:** Prisma con PostgreSQL
- **Autenticación:** Passport.js + JWT (access + refresh tokens)
- **Validación:** class-validator + class-transformer
- **Documentación:** Swagger/OpenAPI
- **Testing:** Jest + Supertest
- **Subida de archivos:** Multer

### Frontend

- **Framework:** React 19 con TypeScript
- **Build Tool:** Vite con SWC
- **Estilos:** Tailwind CSS 4 + shadcn/ui (New York style)
- **Routing:** React Router 7
- **State Server:** TanStack React Query 5
- **Formularios:** React Hook Form + Zod
- **Tablas:** TanStack React Table
- **Iconos:** Lucide React
- **Notificaciones:** Sonner
- **Tema:** next-themes (dark/light mode)
- **Encriptación:** CryptoJS (AES en localStorage)

### Herramientas

- **Monorepo:** pnpm workspaces
- **Linter:** ESLint
- **Formatter:** Prettier
- **IDE:** VS Code con 89 extensiones recomendadas

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18
- pnpm >= 9
- PostgreSQL >= 14

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/kubo-master.git
cd kubo-master

# Instalar dependencias
pnpm install
```

### Configuración

```bash
# Backend
cd backend
cp .env.example .env
# Editar .env con tu configuración de PostgreSQL

# Frontend
cd ../frontend
cp .env.example .env
# Editar .env con la URL de tu API
```

### Variables de Entorno

**Backend (`.env`)**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/kubo"
PORT=3000
```

**Frontend (`.env`)**

```env
API_URL=http://localhost:3000
VITE_ENCRYPTION_KEY=tu-clave-secreta
```

### Ejecutar

```bash
# Desde la raíz del proyecto
pnpm start:backend    # Inicia NestJS en http://localhost:3000
pnpm start:frontend   # Inicia Vite en http://localhost:5173
```

### Base de Datos

```bash
cd backend

# Ejecutar migraciones
pnpm run prisma:dev

# Generar cliente Prisma
npx prisma generate

# (Opcional) Sembrar datos de prueba
curl http://localhost:3000/start
```

---

## 📚 Documentación

La documentación detallada se encuentra en:

- **Schema de Base de Datos:** [`backend/prisma/SCHEMA_DOCUMENTATION.txt`](backend/prisma/SCHEMA_DOCUMENTATION.txt) — Documentación completa de los 25+ modelos, relaciones y flujos de operación
- **Órdenes de Compra:** [`backend/src/modules/inventory/purchase/PURCHASE_SERVICE_DOCUMENTATION.txt`](backend/src/modules/inventory/purchase/PURCHASE_SERVICE_DOCUMENTATION.txt) — Ciclo de vida completo de órdenes de compra con diagramas de estado
- **Movimientos de Inventario:** [`backend/src/modules/inventory/movement/INVENTORY_MOVEMENT_MODULE_DOCUMENTATION.txt`](backend/src/modules/inventory/movement/INVENTORY_MOVEMENT_MODULE_DOCUMENTATION.txt) — Tipos, auditoría y consideraciones de seguridad
- **API Swagger:** Disponible en `http://localhost:3000/api` al ejecutar el backend

---

## 🧪 Testing

```bash
# Backend - Tests unitarios
cd backend
pnpm run test

# Backend - Tests con cobertura
pnpm run test:cov

# Backend - Tests E2E
pnpm run test:e2e

# Frontend - Lint
cd frontend
pnpm run lint
```

---

## 📦 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm start:frontend` | Iniciar servidor de desarrollo del frontend |
| `pnpm start:backend` | Iniciar NestJS en modo watch |
| `pnpm run build` | Build de producción |
| `pnpm run prisma:dev` | Ejecutar migraciones de Prisma |
| `pnpm run test` | Ejecutar tests unitarios |
| `pnpm run test:e2e` | Ejecutar tests end-to-end |
| `pnpm run test:cov` | Tests con reporte de cobertura |
| `pnpm run lint` | Linting con ESLint |
| `pnpm run format` | Formatear con Prettier |

---

## 🎨 Diseño del Sistema

### Flujo de Compras

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ PENDING  │───▶│ APPROVED │───▶│ RECEIVED │───▶│INVOICED  │───▶│  PAID    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     └───────┐       │       ┌───────┘       ┌───────┘
             ▼       ▼       ▼               ▼
        CANCELLED         PARTIAL         OVERDUE
```

### Modelos de Base de Datos (25+)

```
User ─┬─ Role ─── Permission
      │
Sale ─┴─ SaleItem ─── Product
      │
Purchase ─┬─ PurchaseItem ─── Product
          │
          ├─ Supplier
          │
          ├─ PurchaseInvoice ── Payment
          │
InventoryMovement ─── Product
      │
Recipe ─┬─ RecipeIngredient ─── Product
        └─ RecipeOutput ─── Product
```

---

## 📸 Capturas de Pantalla

<details>
<summary>🖥️ Panel de Administración</summary>

- Dashboard con métricas de ventas e inventario
- Gestión de productos con imágenes
- Órdenes de compra con flujo de aprobación
- Reportes de inventario

</details>

<details>
<summary>🛒 Punto de Venta</summary>

- Interfaz de caja rápida
- Selección de productos
- Gestión de mesas
- Procesamiento de pedidos

</details>

---

## 🔧 Estado del Proyecto — Funcionalidades incompletas

- [ ] Módulo de carrito completo (actualmente stub)
- [ ] Reportes y gráficos de ventas
- [ ] Notificaciones en tiempo real
- [ ] Modo offline para el POS
- [ ] Integración con impresoras térmicas
- [ ] Gestión de caja chica
- [ ] Programa de fidelización de clientes

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 👤 Autor

**Carlos**

[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github)](https://github.com/tu-usuario)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin)](https://linkedin.com/in/tu-perfil)

---

<div align="center">

**Si este proyecto te resultó útil, ¡dale una ⭐!**

</div>
