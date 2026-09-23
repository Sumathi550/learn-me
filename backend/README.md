# Learn Me — Central Cloud REST API

Production-ready backend API service for **Learn Me**, powering both the **Student Website** and the **Admin Website**.

---

## 🏗️ Architecture Overview

```
                      ┌─────────────────────────┐
                      │    Central Cloud API    │
                      │       (Express)         │
                      └────────────┬────────────┘
                                   │
                  ┌────────────────┴────────────────┐
                  │                                 │
         ┌────────▼────────┐               ┌────────▼────────┐
         │ Student Website │               │  Admin Website  │
         │  (Port 3000)    │               │  (Port 3001)    │
         └─────────────────┘               └─────────────────┘
                  │                                 │
                  └────────────────┬────────────────┘
                                   │
                           ┌───────▼────────┐
                           │ Cloud Database │
                           │ (PostgreSQL/   │
                           │     SQLite)    │
                           └────────────────┘
```

---

## 🛡️ Authentication & RBAC

- **JWT Authentication**: Sent in `Authorization: Bearer <token>` header.
- **Roles**:
  - `user`: Student learner role.
  - `admin`: Administrative manager role.
- **Admin Isolation**: All `/api/admin/*` endpoints strictly require `req.user.role === 'admin'`. Non-admin tokens receive **HTTP 403 Forbidden**.

---

## 📡 REST API Route Catalog

### 1. Public & Health
- `GET /api/health` — System uptime, service name, and heap memory usage.

### 2. Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a student account (passwords $\ge$ 8 chars, hashed via bcrypt).
- `POST /api/auth/login` — Sign in and receive JWT access token.
- `GET /api/auth/me` — Inspect active user profile (requires Bearer token).
- `POST /api/auth/logout` — Secure sign out.

### 3. Student Courses (`/api/courses`)
- `GET /api/courses` — List all published courses (answer keys stripped).
- `GET /api/courses/search?q=<query>` — Search courses by title, topic, or difficulty.
- `GET /api/courses/:courseId` — Detailed course syllabus and module lessons.
- `GET /api/courses/:courseId/quiz` — Randomized assessment question set from the 50-question course bank.

### 4. Quiz Engine (`/api/quiz`)
- `GET /api/quiz/questions/:courseId` — Randomized questions with options.
- `POST /api/quiz/submit` — Server-side answer evaluation. Passing threshold is 70%. Records attempt and updates student course progress.

### 5. Progress Tracking (`/api/progress`)
- `GET /api/progress` — All course progress metrics for authenticated student.
- `GET /api/progress/:courseId` — Detailed progress for a specific course.
- `PUT /api/progress/:courseId/lesson` — Mark a lesson as completed/incomplete. Server recalculates module and course completion percentage.
- `PUT /api/progress/:courseId/module` — Mark all lessons in a module completed.

### 6. Certificates (`/api/certificates`)
- `POST /api/certificates/generate` — **Strict 100% Completion Rule**: Must have completed 100% of all required lessons/modules and passed all required quizzes (score $\ge$ 70%). Returns HTTP 403 with reasons if incomplete.
- `GET /api/certificates/my-certificates` — List all earned certificates for current student.
- `GET /api/certificates/download/:certificateId` — Ownership validation: Only the earning student (or admin) can download the certificate.
- `GET /api/certificates/verify/:certificateId` — **Public verification endpoint**: Returns validity status, recipient student name, course title, and completion date.

### 7. Admin Control APIs (`/api/admin/*`)
*Strictly protected by `requireAuth` + `requireAdmin` (403 Forbidden for students)*
- `GET /api/admin/dashboard` — Platform statistics, KPI counts, recent activity feed.
- `GET /api/admin/users` — List student users with enrollment & certificate counts.
- `GET /api/admin/users/:userId` — Detailed student history, quiz attempts, and activity logs.
- `PATCH /api/admin/users/:userId/status` — Activate or deactivate user accounts.
- `DELETE /api/admin/users/:userId` — Delete user and cascading enrollments.
- `GET /api/admin/courses` — List all courses (including drafts and full answer keys).
- `POST /api/admin/courses` — Create new course with modules and quiz config.
- `PUT /api/admin/courses/:courseId` — Update course metadata and curriculum.
- `PATCH /api/admin/courses/:courseId/status` — Publish or unpublish course.
- `DELETE /api/admin/courses/:courseId` — Delete course.
- `GET /api/admin/courses/:courseId/questions` — List question bank for course.
- `POST /api/admin/courses/:courseId/questions` — Add question with multiple choice options.
- `PUT /api/admin/courses/:courseId/questions/:index` — Update question or answer key.
- `DELETE /api/admin/courses/:courseId/questions/:index` — Delete question.
- `GET /api/admin/certificates` — Search and inspect all issued certificates.
- `PATCH /api/admin/certificates/:certificateId/revoke` — Revoke certificate.
- `PATCH /api/admin/certificates/:certificateId/restore` — Restore revoked certificate.
- `GET /api/admin/audit-log` — Audit log of administrative actions.
- `GET /api/admin/system-health` — Real-time memory, platform metrics, and DB diagnostics.
- `GET /api/admin/settings` / `PUT /api/admin/settings` — Platform pricing and payment instructions.

---

## 🗄️ Database Dialects & Migration

1. **Development**: Uses SQLite by default (`backend/data/learnme.sqlite`).
2. **Production**: Uses Managed Cloud PostgreSQL (Neon, Supabase, Render, Railway, AWS RDS) by setting `DATABASE_URL`.
3. **Migration Command**:
   ```bash
   npm run db:migrate:postgres
   ```
   Safely creates a timestamped SQLite backup, connects to PostgreSQL, creates tables, and migrates all records with a reconciliation summary.

---

## 🧪 Automated Testing

Run the full verification and RBAC test suite:
```bash
npm test
```
Or run individual test suites:
```bash
node backend/test_rules.js       # 48 progress, quiz threshold, and certificate invariants
node backend/tests/rbac.test.js  # 26 strict 403 RBAC authorization checks
```
