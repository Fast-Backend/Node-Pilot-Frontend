# 🧩 VIBES Frontend — Visual Backend Code Generator

**VIBES Frontend** is an interactive, canvas-based web application that allows users to visually model their backend by creating entities, defining properties, and configuring relationships — all without writing a single line of code.

It connects with the VIBES backend to generate a complete, production-ready Node.js + TypeScript + Prisma + PostgreSQL codebase, tailored to your design.

---

## 🧠 What It Does

- 🎨 Drag-and-drop interface to **create and manage entities**
- 🧾 Define entity **properties**, **data types**, and **validations**
- 🔗 Create **relationships** between entities via visual edge linking
- 🔁 Supports **one-to-one**, **one-to-many**, and **many-to-many** relationships
- 🌐 Configure **CORS options** directly from the interface
- 📚 **NEW**: Enable interactive **Swagger/OpenAPI documentation**
- 🌱 **NEW**: Configure **intelligent test data seeding** with Faker.js
- ⚙️ **NEW**: Select and configure **optional project features**
- 📦 Sends your model to the backend to generate a fully functional backend project zipped and ready to download

---

## ⚙️ Tech Stack

- **React** – UI framework
- **TypeScript** – Type-safe development
- **React Flow** – Interactive canvas and edge linking
- **Tailwind CSS** – Utility-first styling
- **Axios** – HTTP client for backend communication

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

---

### 2. Run the development server

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

---

## 🧱 How to Use the Canvas

### ✨ Create Entities

1. Click **"Add Entity"** to add a new card to the canvas.
2. Double-click an entity to edit its:
   - **Name** (e.g., `User`, `Post`)
   - **Properties** (name, type, required, unique, etc.)

### 🔌 Link Entities

1. Drag from a **parent edge** of one entity to a **child edge** of another.
2. Choose the **relationship type**:
   - `One-to-One`
   - `One-to-Many`
   - `Many-to-Many`
3. You can chain multiple relationships to reflect your data structure.

> Relationships are used to generate Prisma schema and database relationships.

---

### ⚙️ Configure Project Settings

Click the **Settings icon** to configure:

**Basic Settings:**
- Project name
- CORS options (origins, methods, headers, credentials)

**Optional Features:**
- **📚 API Documentation**: Generate interactive Swagger UI
  - Set documentation title and description
  - Configure API version
  - Enable/disable Swagger UI interface
- **🌱 Test Data Seeding**: Generate realistic test data
  - Set number of records per entity
  - Choose data locale (en, es, fr, etc.)
  - Enable custom seeding templates
- **🔐 Email Authentication**: Complete user authentication system
  - Choose email provider (Nodemailer, SendGrid, Resend)
  - Configure email templates (verification, password reset, welcome)
  - JWT token management with refresh tokens
  - Rate limiting and security features

All configurations are included in the generated backend project.

---

### 🏗 Generate Backend Code

Once your model is ready:

1. Click **"Generate Project"**
2. The frontend will:
   - Compile the visual model (entities, relationships, CORS)
   - Send it to the backend
   - Receive a downloadable ZIP file with the backend code

---

## 📦 Output

The backend project includes:

- RESTful routes with full CRUD operations
- Type-safe controllers with validation
- Prisma schema with relationships
- PostgreSQL integration
- CORS middleware
- **Optional**: Interactive Swagger/OpenAPI documentation
- **Optional**: Intelligent test data seeding with Faker.js
- **Optional**: Email authentication with verification & password reset
- **Optional**: Additional features (payments, OAuth, etc.)
- File structure ready for development or deployment

See the [VIBES Backend README](../backend/README.md) for more.

---

## ✅ Example Use Case

Create a mini blogging app:

- Entities: `User`, `Post`, `Comment`
- Relationships:
  - `User` ➝ `Post` (One-to-Many)
  - `Post` ➝ `Comment` (One-to-Many)
- Properties:
  - `User`: `email`, `password`
  - `Post`: `title`, `body`
  - `Comment`: `content`

Generate the backend, connect your frontend, and start building — fast.

---

## 💡 Tips

- You can reposition entities freely on the canvas
- Click an edge to edit or delete relationships
- Use consistent naming (camelCase or PascalCase)
- Add validation constraints for better generated types

---

## 🔄 Backend Communication

All generation requests are sent to the VIBES backend via:

```http
POST /api/workflows
```

Payload includes:

- Entities with properties and types
- Relationships (parent/child links and types)
- Optional CORS configuration

Response:

- A ZIP file with the complete backend codebase

---

## ✅ Available Features

- 📚 **Interactive Swagger/OpenAPI Documentation** - Generate beautiful, interactive API docs
- 🌱 **Intelligent Test Data Seeding** - Realistic fake data with Faker.js
- ⚙️ **Configurable Project Features** - Enable/disable features as needed
- 🔗 **Visual Relationship Modeling** - Drag-and-drop entity relationships
- 🌐 **CORS Configuration** - Full CORS settings management
- 🔐 **Email Authentication** - Complete verification & password reset system

## 🔒 Coming Soon

- 🛒 **Payment Integration** - Stripe, PayPal, Square support
- 🔐 **OAuth Providers** - Google, GitHub, Facebook, Twitter auth
- 🧠 **AI Code Suggestions** - Smart entity design recommendations
- 📊 **Database Migrations** - Version-controlled schema changes
- 🔒 **Role-Based Access Control** - User permissions and roles
- 🌐 **Multi-tenant Support** - Tenant isolation and management

---

## ✨ Build your backend visually with **VIBES** — no boilerplate, no problem.
