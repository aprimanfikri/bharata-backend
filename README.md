## 📑 Table of Contents

- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Load Testing with k6](#load-testing-with-k6)

---

## 📦 Installation

1. **Clone the repository**:

```bash
git clone https://github.com/aprimanfikri/bharata-backend.git
cd backend
```

2. **Install dependencies**:

```bash
npm install

# or

yarn install
```

---

## 🔐 Environment Variables

Buat file **.env** di root directory dan tambahkan:

```env

# Database connection URL for Prisma

DATABASE_URL="postgresql://user:password@host:port/database?schema=public"

# Secret key for JWT token generation and verification

JWT_SECRET="your_super_secret_jwt_key_here"

# Port for the Express server (optional, defaults to 3000)

PORT=3000

# Admin Username

ADMIN_USERNAME="your_admin_username"

# Admin Password

ADMIN_PASSWORD="your_admin_password"

```

---

## 🗃️ Database Setup

### 1. Generate Prisma Client

```bash
npm run prisma:generate
```

### 2. Run Database Migrations

```bash
npm run prisma:migrate
```

### 3. Seed Database

```bash
npm run prisma:seed

# or

node seed.js
```

---

## 🚀 Running the Application

### Development Mode

Run with **nodemon** (hot reload):

```bash
npm run dev
```

### Production Mode

1. **Build Project**

```bash
npm run build
```

2. **Start Server**

```bash
npm start
```

---

## 🔗 API Endpoints

Base URL: `http://localhost:PORT/api/v1`

### 📖 API Documentation (Swagger UI)

Access at:

`http://localhost:PORT/docs`

---

## 🧪 Load Testing with k6

### 1. Install k6

Follow the [k6 Installation Guide](https://k6.io/docs/get-started/installation/).

---

### 2. Update Test Data

In **k6 run stock-transaction-test.js**, modify:

```js
const OPERATOR_TOKEN = 'YOUR_ACTUAL_OPERATOR_JWT_TOKEN_HERE';
const PRODUCT_ID = 'YOUR_ACTUAL_PRODUCT_ID_HERE';
```

---

### 3. Run Load Test

```bash
k6 run stock-transaction-test.js --out json=output.json
```

---

### 4. Generate HTML Report

After completion, a **summary.html** file will be generated. Open it in your browser to view the visual results.

---
