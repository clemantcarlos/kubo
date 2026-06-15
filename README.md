<div align="center">

🍞 Kubo — POS & Inventory Management System

Point of Sale and Inventory Management System for Bakeries and Restaurants

[!TypeScript](https://www.typescriptlang.org/)
[!NestJS](https://nestjs.com/)
[!React](https://react.dev/)
[!Prisma](https://www.prisma.io/)
[!PostgreSQL](https://www.postgresql.org/)
[!Tailwind CSS](https://tailwindcss.com/)
[!License](LICENSE)

</div>

> ⚠️ Work in Progress — This is a learning project in progress. Some features are incomplete or still under development. It was built to practice and reinforce full-stack development skills with TypeScript.

***
> 📚 Personal Portfolio — Kubo was developed as part of my training as a software developer. The main goal was to apply and consolidate concepts in software architecture, database design, JWT authentication, and modern UI development with React.

***
📋 About the Project

> 📚 Learning Project: Kubo was developed as part of my training as a software developer. The main goal was to apply and consolidate concepts in software architecture, database design, JWT authentication, and modern UI development with React. This project is actively under development and contains incomplete features.

Kubo is a full-stack web application built as a learning project to manage operations for a bakery/cantina business. It combines a Point of Sale (POS) system for the counter with a complete back-office administration panel. The project is actively under development and contains incomplete features.

Key Features

Module	Description
Point of Sale (POS)	Intuitive interface for processing register orders, table and waiter management
Inventory Management	Product CRUD, stock control, inventory movement traceability
Purchasing	Complete purchase order workflow: creation → approval → receiving → invoicing → payments
Recipes/Production	Recipe definition with ingredients, outputs, and yield tracking
Suppliers	Supplier registration and management with contact info and tax identification
Authentication	JWT with access/refresh tokens, roles and granular permissions (RBAC)
Documented API	Swagger UI integrated for interactive API exploration
	> Note: This project is actively under development. The cart module, some reports, and advanced features are still under construction.

***
🏗️ Architecture

kubo-master/
├── frontend/          # React 19 + Vite + Tailwind CSS + shadcn/ui
│   ├── src/
│   │   ├── modules/   # Domain modules (auth, pos, inventory, restaurant)
│   │   ├── components/# Shared components and UI (shadcn/ui)
│   │   ├── services/  # HTTP service layer
│   │   ├── queryHooks/# TanStack React Query hooks
│   │   └── lib/       # Utilities and configuration
│   └── ...
│
├── backend/           # NestJS + Prisma + PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (25+ models)
│   │   ├── migrations/            # 13 DB migrations
│   │   └── SCHEMA_DOCUMENTATION.txt
│   ├── src/
│   │   ├── modules/   # Domain modules (auth, inventory, sale, cart)
│   │   ├── prisma/    # Global Prisma service
│   │   ├── utils/     # Utilities (regex, hashing, images)
│   │   └── interfaces/# Standard response types
│   └── test/          # Unit and e2e tests
│
└── package.json       # pnpm workspace root

***
🛠️ Tech Stack

Backend

Framework: NestJS with modular architecture
ORM: Prisma with PostgreSQL
Authentication: Passport.js + JWT (access + refresh tokens)
Validation: class-validator + class-transformer
Documentation: Swagger/OpenAPI
Testing: Jest + Supertest
File Upload: Multer

Frontend

Framework: React 19 with TypeScript
Build Tool: Vite with SWC
Styling: Tailwind CSS 4 + shadcn/ui (New York style)
Routing: React Router 7
Server State: TanStack React Query 5
Forms: React Hook Form + Zod
Tables: TanStack React Table
Icons: Lucide React
Notifications: Sonner
Theming: next-themes (dark/light mode)
Encryption: CryptoJS (AES in localStorage)

Tools

Monorepo: pnpm workspaces
Linter: ESLint
Formatter: Prettier
IDE: VS Code with 89 recommended extensions

***
🚀 Getting Started

Prerequisites

Node.js >= 18
pnpm >= 9
PostgreSQL >= 14

Installation

# Clone the repository
git clone https://github.com/your-username/kubo-master.git
cd kubo-master

# Install dependencies
pnpm install

Configuration

# Backend
cd backend
cp .env.example .env
# Edit .env with your PostgreSQL configuration

# Frontend
cd ../frontend
cp .env.example .env
# Edit .env with your API URL

Environment Variables

Backend (.env)

DATABASE_URL="postgresql://user:password@localhost:5432/kubo"
PORT=3000

Frontend (.env)

API_URL=http://localhost:3000
VITE_ENCRYPTION_KEY=your-secret-key

Running the Application

# From the project root
pnpm start:backend    # Starts NestJS at http://localhost:3000
pnpm start:frontend   # Starts Vite at http://localhost:5173

Database Setup

cd backend

# Run migrations
pnpm run prisma:dev

# Generate Prisma client
npx prisma generate

# (Optional) Seed test data
curl http://localhost:3000/start

***
📚 Documentation

Detailed documentation can be found at:

Database Schema: backend/prisma/SCHEMA_DOCUMENTATION.txt — Complete documentation of 25+ models, relationships, and operation flows
Purchase Orders: backend/src/modules/inventory/purchase/PURCHASE_SERVICE_DOCUMENTATION.txt — Full purchase order lifecycle with state diagrams
Inventory Movements: backend/src/modules/inventory/movement/INVENTORY_MOVEMENT_MODULE_DOCUMENTATION.txt — Types, auditing, and security considerations
Swagger API: Available at http://localhost:3000/api when running the backend

***
🧪 Testing

# Backend - Unit tests
cd backend
pnpm run test

# Backend - Tests with coverage
pnpm run test:cov

# Backend - E2E tests
pnpm run test:e2e

# Frontend - Lint
cd frontend
pnpm run lint

***
📦 Available Commands

Command	Description
pnpm start:frontend	Start frontend development server
pnpm start:backend	Start NestJS in watch mode
pnpm run build	Production build
pnpm run prisma:dev	Run Prisma migrations
pnpm run test	Run unit tests
pnpm run test:e2e	Run end-to-end tests
pnpm run test:cov	Tests with coverage report
pnpm run lint	Lint with ESLint
pnpm run format	Format with Prettier
	***
🎨 System Design

Purchase Workflow

┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ PENDING  │───▶│ APPROVED │───▶│ RECEIVED │───▶│INVOICED  │───▶│  PAID    │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
     │               │               │               │
     └───────┐       │       ┌───────┘       ┌───────┘
             ▼       ▼       ▼               ▼
        CANCELLED         PARTIAL         OVERDUE

Database Models (25+)

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

***
📸 Screenshots

<details>
<summary>🖥️ Administration Panel</summary>

Dashboard with sales and inventory metrics
Product management with images
Purchase orders with approval workflow
Inventory reports

</details>

<details>
<summary>🛒 Point of Sale</summary>

Quick register interface
Product selection
Table management
Order processing

</details>

***
🔧 Project Status — Incomplete Features

Complete cart module (currently a stub)
Sales reports and charts
Real-time notifications
Offline mode for POS
Thermal printer integration
Petty cash management
Customer loyalty program

***
📄 License

This project is licensed under the MIT License. See LICENSE for more details.

***
👤 Author

Carlos

[!GitHub](https://github.com/your-username)
[!LinkedIn](https://linkedin.com/in/your-profile)

***
<div align="center">

If you found this project helpful, give it a ⭐!

</div>
