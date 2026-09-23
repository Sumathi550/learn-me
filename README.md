# Learn Me — Production Architecture Separation

Production-grade educational platform featuring a **Dedicated Student Website**, an **Independent Admin Dashboard**, a **Central Cloud REST API**, and a **Cloud-Ready Database Layer** (SQLite for local dev & PostgreSQL for production).

---

## 🏛️ System Architecture

```
                    ┌─────────────────────────┐
                    │       CLOUD BACKEND     │
                    │       REST API          │
                    │      (Port 5000)        │
                    │                         │
                    │ Auth                    │
                    │ Users                   │
                    │ Courses                 │
                    │ Modules                 │
                    │ Lessons                 │
                    │ Quizzes                 │
                    │ Progress                │
                    │ Certificates            │
                    │ Admin APIs              │
                    └────────────┬────────────┘
                                 │
                ┌────────────────┴────────────────┐
                │                                 │
       ┌────────▼────────┐               ┌────────▼────────┐
       │ STUDENT WEBSITE │               │  ADMIN WEBSITE  │
       │  (Port 3000)    │               │  (Port 3001)    │
       │                 │               │                 │
       │ Learn Me        │               │ Learn Me Admin  │
       │ Student Portal  │               │ Admin Dashboard │
       └─────────────────┘               └─────────────────┘
                │                                 │
                └────────────────┬────────────────┘
                                 │
                         ┌───────▼────────┐
                         │ CLOUD DATABASE │
                         │                │
                         │ Users          │
                         │ Courses        │
                         │ Modules        │
                         │ Lessons        │
                         │ Quizzes        │
                         │ Progress       │
                         │ Certificates   │
                         └────────────────┘
```

---

## 📁 Project Directory Structure

```
learn-me/
│
├── student-web/                          # Dedicated Student Web Application
│   ├── index.html                        # Student Landing & Course Catalog showcase
│   ├── login.html                        # Dedicated Student Sign In
│   ├── signup.html                       # Student Registration (role: user)
│   ├── dashboard.html                    # Student Dashboard (Enrolled courses, Progress, Certs)
│   ├── courses.html                      # Catalog with search & category filters
│   ├── course-details.html               # Course curriculum, lesson reader & module tracker
│   ├── quiz.html                         # Interactive examination portal with timer
│   ├── certificate.html                  # Official Certificate preview, claim & PDF download
│   ├── verify.html                       # Public Certificate verification tool
│   ├── css/                              # Student theme stylesheets
│   ├── js/
│   │   ├── api.js                        # Centralized Student API Client
│   │   └── script.js                     # Course player & quiz fallback engine
│   └── assets/
│
├── admin-web/                            # Dedicated Admin Web Application
│   ├── index.html                        # Administrative auth gatekeeper
│   ├── login.html                        # Dedicated Admin Sign In
│   ├── dashboard.html                    # Admin Dashboard (KPI stats, recent activities, explorer)
│   ├── users.html                        # Student management, history inspection & account toggle
│   ├── courses.html                      # Course CRUD, module/lesson editor & status toggle
│   ├── quizzes.html                      # Quiz question bank manager & passing score configuration
│   ├── certificates.html                 # Certificate registry, revocation & restoration
│   ├── analytics.html                    # Platform analytics & completion rates
│   ├── settings.html                     # Platform pricing & system health diagnostics
│   ├── css/
│   │   └── admin.css                     # Premium dark theme admin design system
│   ├── js/
│   │   ├── api.js                        # Centralized Admin API Client (Auth headers + 401/403 trap)
│   │   ├── admin-auth.js                 # Admin credentials guardian
│   │   └── admin-app.js                  # Views manager & CRUD controller
│   └── assets/
│
├── backend/                              # Central Cloud REST API
│   ├── app.js                            # Express app, security headers, CORS, rate limits
│   ├── server.js                         # Database startup, seeding, HTTP listener
│   ├── config/
│   │   ├── database.js                   # Unified Sequelize DB (SQLite local / PostgreSQL cloud)
│   │   ├── env.js                        # Validated environment configuration
│   │   └── cors.js                       # Strict origin validation
│   ├── middleware/
│   │   ├── authMiddleware.js             # JWT verification & req.user attachment
│   │   ├── roleMiddleware.js             # requireRole('admin') guard (403 Forbidden)
│   │   ├── securityMiddleware.js         # Rate limiters & input sanitization
│   │   ├── adminAuditMiddleware.js       # Action audit logging
│   │   └── errorHandler.js               # Centralized exception handler
│   ├── models/                           # Sequelize models & associations
│   ├── routes/                           # Clean route namespaces
│   ├── controllers/                      # Business controllers
│   ├── services/                         # Core domain logic
│   ├── utils/
│   │   ├── courseProgressHelper.js       # Strict 100% course verification logic
│   │   ├── response.js                   # Standard response envelopes
│   │   └── seedData.js                   # Idempotent seeding & admin credential sync
│   ├── migrations/
│   │   ├── migrate-to-postgres.js        # Safe automated SQLite -> PostgreSQL data migrator
│   │   └── schema.sql                    # Cloud PostgreSQL DDL schema definition
│   ├── tests/
│   │   ├── rbac.test.js                  # 26 strict RBAC authorization tests
│   │   └── test_rules.js                 # 48 certificate, progress & quiz invariant tests
│   └── package.json
│
├── shared/                               # Shared contracts and constants
│   ├── constants/                        # Roles, Status, API Endpoints
│   └── api-contracts/                    # JSON schema contracts
│
├── .env.example                          # Environment template
├── serve-static.js                       # Static server utility for local ports 3000 & 3001
├── dev-all.js                            # Concurrent multi-tier dev launcher
├── start-website.bat                     # Windows single-click launcher
└── package.json
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js $\ge$ 18.0.0
- npm $\ge$ 9.0.0

### Option A: Single-Click Launch (Windows)
Double-click `start-website.bat`. It will start the backend API, the student website, and the admin website, and open your browser automatically.

### Option B: Concurrent npm command
```bash
# Install backend dependencies (first time)
npm --prefix backend install

# Start all three services concurrently:
npm run dev
```
This launches:
- **Student Website**: [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard**: [http://localhost:3001](http://localhost:3001)
- **Central REST API**: [http://localhost:5000](http://localhost:5000)

### Option C: Individual Services
```bash
# Terminal 1 - Central Backend API (Port 5000)
npm run dev:backend

# Terminal 2 - Student Website (Port 3000)
npm run dev:student

# Terminal 3 - Admin Dashboard (Port 3001)
npm run dev:admin
```

---

## 🔑 Default Credentials

| Portal | Email | Password | Role |
| :--- | :--- | :--- | :--- |
| **Admin Dashboard** | `sumathiaz550@gmail.com` | `Sumathi@12345` | `admin` |
| **Student Portal** | Any self-registered email | Custom password ($\ge$ 8 chars) | `user` |

---

## 🧪 Running Automated Tests

The test suite validates 74 critical security, progress, and certificate invariants:
```bash
# Run all tests (Progress, Quiz, Certificate, and RBAC)
npm test

# Run RBAC authorization tests specifically (asserts 403 on student accessing admin API)
npm run test:rbac
```

---

## 🗄️ Database Migration Strategy (SQLite $\to$ Cloud PostgreSQL)

When you are ready to deploy to production with Managed PostgreSQL (e.g., Neon, Supabase, Render, Railway, AWS RDS):

1. **Set your environment variable**:
   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/learnme?sslmode=require"
   ```
2. **Execute the migration script**:
   ```bash
   npm run db:migrate:postgres
   ```
3. **What the script does**:
   - Creates a timestamped local backup of `backend/data/learnme.sqlite` inside `backend/data/backups/`.
   - Connects to your PostgreSQL database with SSL pooling.
   - Synchronizes tables and indexes without dropping existing data.
   - Batch-migrates all existing 20 courses, users, enrollments, progress, and 4 original certificates.
   - Displays a reconciliation summary confirming 100% record match.

---

## ☁️ Production Deployment Guide

### 1. Central Backend API (Render / Railway / Fly.io)
1. Push repository to GitHub.
2. Create a **Web Service** pointing to the `backend/` directory.
3. Configure **Build Command**: `npm install`
4. Configure **Start Command**: `node server.js`
5. Configure **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=5000` (or provider default)
   - `DATABASE_URL=postgresql://user:password@cloud-host:5432/learnme?sslmode=require`
   - `DB_DIALECT=postgres`
   - `JWT_SECRET=<strong-random-64-character-string>`
   - `STUDENT_WEB_URL=https://learnme.example.com`
   - `ADMIN_WEB_URL=https://admin.learnme.example.com`

### 2. Student Website (Vercel / Netlify / Cloudflare Pages)
1. Deploy `student-web/` as a static site.
2. Configure custom domain: `https://learnme.example.com`.
3. Set environment variable: `LEARNME_API_URL=https://api.learnme.example.com/api`.

### 3. Admin Website (Vercel / Netlify / Cloudflare Pages)
1. Deploy `admin-web/` as a static site.
2. Configure custom domain: `https://admin.learnme.example.com`.
3. Set environment variable: `LEARNME_ADMIN_API_URL=https://api.learnme.example.com/api`.

---

## 🛡️ Critical Security Guarantees

1. **Student $\to$ Admin API = HTTP 403**:
   All `/api/admin/*` endpoints strictly check `req.user.role === 'admin'`. Frontend hiding is not trusted.
2. **100% Certificate Validation**:
   `POST /api/certificates/generate` calculates progress server-side. Certificate generation is rejected if any lesson, module, or quiz score is below 70%.
3. **Ownership-Protected Certificate Downloads**:
   Students cannot download or view another student's certificate without authorization.
4. **No Plaintext Passwords**:
   Passwords are never stored in plaintext, never transmitted back in API responses, and never logged in audit trails.
