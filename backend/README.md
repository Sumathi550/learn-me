# Learn Me Backend

Express and MySQL API for Learn Me authentication, progress, certificates, activity tracking, and admin analytics.

## Setup

1. Copy `.env.example` to `.env`.
2. Create the database and tables:

```powershell
mysql -u root -p < sql\schema.sql
```

3. Set `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, and `DB_PORT` in `.env`.
4. Replace `JWT_SECRET` with a long random value.
5. Start the API:

```powershell
npm run dev
```

The API runs on `http://localhost:5000` by default. The schema is also available at
`backend/sql/schema.sql` for repeatable database setup.

## Endpoints

- `GET /api/health`
- `GET /api/courses`
- `GET /api/courses/:courseId`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/progress` (Bearer token)
- `PUT /api/progress/:courseId` (Bearer token)
- `GET /api/certificates/verify/:certificateId`
- `GET /api/certificates/mine` (Bearer token)
- `POST /api/certificates/:courseId` (Bearer token)
- `POST /api/certificates/generate` (Bearer token, body: `{ "courseId": "python" }`)
- `GET /api/certificates/my-certificates` (Bearer token)
- `GET /api/admin/dashboard` (admin Bearer token)
- `GET /api/admin/users` (admin Bearer token)
- `GET /api/admin/users/:id` (admin Bearer token)
- `GET /api/admin/activity` (admin Bearer token)
- `GET /api/admin/courses` (admin Bearer token)
- `GET /api/admin/certificates` (admin Bearer token)
- `PATCH /api/admin/certificates/:certificateId/revoke` (admin Bearer token)
- `POST /api/courses` (admin Bearer token)
- `PUT /api/courses/:courseId` (admin Bearer token)
- `DELETE /api/courses/:courseId` (admin Bearer token)

The frontend uses these endpoints for authentication, course catalog data, progress,
certificates, payments, and admin operations. Browser localStorage is used only for
the session token and lightweight UI cache.
