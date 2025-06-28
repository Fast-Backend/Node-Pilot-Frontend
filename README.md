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

### ⚙️ Configure CORS

Click the **Settings icon** tab to define:

- Project name
- Allowed origins
- Methods
- Headers
- Credentials

This config is included in the generated backend's middleware setup.

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

- RESTful routes
- Type-safe controllers
- Prisma schema
- PostgreSQL integration
- CORS middleware
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

## 🔒 Coming Soon

- 🔐 Email verification & password reset support
- 🛒 Stripe integration (subscriptions & payments)
- 💳 PayPal integration
- 🧪 Test data seeding (fake data generation)
- 🔐 OAuth (Google, GitHub, etc.) authentication
- 🧠 AI code suggestions for entity design
- 📘 API documentation generation (Swagger/OpenAPI)

---

## ✨ Build your backend visually with **VIBES** — no boilerplate, no problem.
