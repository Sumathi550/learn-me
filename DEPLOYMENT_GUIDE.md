# 🚀 Learn Me — Complete Cloud Deployment & Database Guide
# முழுமையான Deployment மற்றும் Cloud Database இணைப்பு கையேடு

இந்த Guide மூலம் உங்களது **Learn Me** தளத்தை இணையத்தில் (Internet) இலவசமாக Deploy செய்து, உங்களது சொந்த **Cloud Database** (PostgreSQL / Supabase / Neon / Render) உடன் இணைக்கலாம்.

---

## 📑 பொருளடக்கம் (Table of Contents)
1. [எப்படி இயங்குகிறது? (How It Works)](#1-எப்படி-இயங்குகிறது-how-it-works)
2. [படி 1: இலவச Cloud Database உருவாக்குதல் (Free Cloud DB Setup)](#படி-1-இலவச-cloud-database-உருவாக்குதல்-free-cloud-db-setup)
3. [படி 2: உள்ளூர் தரவுகளை Cloud Database-க்கு மாற்றுதல் (1-Command Migration)](#படி-2-உள்ளூர்-தரவுகளை-cloud-database-க்கு-மாற்றுதல்-1-command-migration)
4. [படி 3: Render-ல் இணையத்தில் Deploy செய்தல் (Free Hosting on Render)](#படி-3-render-ல்-இணையத்தில்-deploy-செய்தல்-free-hosting-on-render)
5. [படி 4: Vercel / Netlify வழியாக Deploy செய்தல் (Alternative)](#படி-4-vercel--netlify-வழியாக-deploy-செய்தல்-alternative)
6. [அட்மின் உள்நுழைவு & சோதனை (Admin Login & Test)](#அட்மின்-உள்நுழைவு--சோதனை-admin-login--test)

---

## 1. எப்படி இயங்குகிறது? (How It Works)

- **Local:** தற்பொழுது கணினியில் SQLite (`backend/data/learnme.sqlite`) இயங்குகிறது.
- **Production (இணையத்தில்):** Cloud-ல் SQLite சேமிக்க முடியாது என்பதால், **PostgreSQL** Database (`DATABASE_URL`) தேவைப்படுகிறது.
- எமது Backend இப்போது:
  - `student-web` (மாணவர் தளம்) -> `https://your-domain.com/`
  - `admin-web` (அட்மின் டாஷ்போர்டு) -> `https://your-domain.com/admin/`
  - `database explorer` -> `https://your-domain.com/database`
  - `Central REST API` -> `https://your-domain.com/api`
  எல்லாவற்றையும் **ஒரே சர்வரில் (Single Web Service)** மிக எளிதாக இயக்கும் வகையில் தயார் செய்யப்பட்டுள்ளது!

---

## படி 1: இலவச Cloud Database உருவாக்குதல் (Free Cloud DB Setup)

PostgreSQL Database-க்கு பின்வரும் 3 தளங்களில் ஏதேனும் ஒன்றை இலவசமாகப் பயன்படுத்தலாம் (பரிந்துரை: **Neon.tech** அல்லது **Supabase**):

### விருப்பம் A: Neon.tech (மிகவும் எளிது - 1 நிமிடம்) ⭐ பரிந்துரைக்கப்படுவது
1. [https://neon.tech](https://neon.tech) தளத்திற்கு செல்லவும்.
2. Google அல்லது GitHub வழியாக இலவசமாக Sign Up செய்யவும்.
3. புதிய Project பெயர் கொடுக்கவும் (எ.கா: `learnme`).
4. Dashboard-ல் திரையில் தோன்றும் **Connection Details**-ல் **Postgres URI** ஐ Copy செய்யவும்:
   ```text
   postgresql://username:password@ep-xyz-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

### விருப்பம் B: Supabase (PostgreSQL)
1. [https://supabase.com](https://supabase.com) சென்று Sign In செய்யவும்.
2. **New Project** உருவாக்கவும். Database Password நினைவில் வைத்துக்கொள்ளவும்.
3. **Project Settings** $\to$ **Database** $\to$ **Connection string** $\to$ **URI** என்பதை Copy செய்யவும்:
   ```text
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres
   ```

---

## படி 2: உள்ளூர் தரவுகளை Cloud Database-க்கு மாற்றுதல் (1-Command Migration)

உங்களது உள்ளூர் கணினியில் ஏற்கனவே உள்ள **20 பாடங்கள் (Courses)**, **வினாக்கள் (Quizzes)**, **பயனர்கள் (Users)**, மற்றும் **சான்றிதழ்களை (Certificates)** உங்களது Cloud Database-க்கு ஒரே command-ல் copy செய்யலாம்:

VS Code Terminal-ல் உங்களது `DATABASE_URL` உடன் பின்வரும் கட்டளையை இயக்கவும்:

```bash
npm run db:migrate:postgres "postgresql://user:password@ep-xyz.neon.tech/neondb?sslmode=require"
```

> **இது என்ன செய்யும்?**
> - உங்களது SQLite தரவுத்தளத்தை தானாக Backup எடுக்கும்.
> - உங்களது Cloud PostgreSQL-ல் தானாக அட்டவணைகளை (Tables) உருவாக்கும்.
> - அனைத்து 20 பாடங்கள் மற்றும் தரவுகளை அப்படியே Cloud Database-ல் ஏற்றும்.

---

## படி 3: Render-ல் இணையத்தில் Deploy செய்தல் (Free Hosting on Render)

[Render.com](https://render.com) முற்றிலும் இலவசமாக Node.js App-களை ஹோஸ்ட் செய்ய அனுமதிக்கிறது.

### வழிமுறை (Step-by-Step):

1. **GitHub-ல் Push செய்யவும்:**
   - உங்களது இந்த code repository-ஐ உங்களது GitHub கணக்கில் Push செய்யவும்.

2. **Render-ல் Web Service உருவாக்கவும்:**
   - [https://dashboard.render.com](https://dashboard.render.com) செல்லவும்.
   - **New +** $\to$ **Web Service** என்பதைத் தேர்ந்தெடுக்கவும்.
   - உங்களது GitHub repository-ஐ இணைக்கவும் (Connect).

3. **அமைப்புகளை நிரப்பவும் (Settings):**
   - **Name:** `learn-me-platform` (அல்லது உங்களுக்கு பிடித்த பெயர்)
   - **Region:** Singapore / Oregon / Frankfurt
   - **Branch:** `main` (அல்லது நீங்கள் பயன்படுத்தும் branch)
   - **Root Directory:** *(வெற்று இடமாக விடவும் - Leave empty)*
   - **Runtime:** `Node`
   - **Build Command:**
     ```bash
     npm install && npm --prefix backend install
     ```
   - **Start Command:**
     ```bash
     node backend/server.js
     ```
   - **Instance Type:** `Free`

4. **Environment Variables (சுற்றுச்சூழல் மாறிகள்) சேர்க்கவும்:**
   **Environment** பிரிவுக்குச் சென்று கீழே உள்ளவற்றைச் சேர்க்கவும்:

   | Key | Value | விளக்கம் |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Production mode |
   | `PORT` | `10000` | Render-ன் default port |
   | `DATABASE_URL` | `postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` | படி 1-ல் பெற்ற DB URL |
   | `DB_DIALECT` | `postgres` | Database வகை |
   | `DB_SSL` | `true` | Secure SSL இணைப்பு |
   | `JWT_SECRET` | `learn_me_production_secret_key_987654321` | பாதுகாப்பான ரகசிய குறியீடு |
   | `CORS_ORIGINS` | `*` | அனைத்து access-ம் அனுமதிக்க |
   | `ADMIN_EMAIL` | `sumathiaz550@gmail.com` | அட்மின் மின்னஞ்சல் |
   | `ADMIN_INITIAL_PASSWORD` | `Sumathi@12345` | அட்மின் கடவுச்சொல் |

5. **Deploy பட்டனை அழுத்தவும்:**
   - **Deploy Web Service** என்பதை கிளிக் செய்யவும்.
   - 2 நிமிடங்களில் உங்களது தளம் தயாராகி `https://learn-me-platform.onrender.com` போன்ற நேரடி URL கிடைக்கும்!

---

## படி 4: Vercel / Netlify வழியாக Deploy செய்தல் (Alternative)

நீங்கள் Frontend மற்றும் Backend-ஐ தனித்தனியாக பிரிக்க விரும்பினால்:

1. **Backend API:** Render-ல் மேலே உள்ளபடி Deploy செய்து API URL-ஐப் பெறவும் (எ.கா: `https://learn-me-api.onrender.com`).
2. **Student Portal (Vercel):**
   - Vercel-ல் `student-web` folder-ஐ deploy செய்யவும்.
   - Environment Variable: `LEARNME_API_URL=https://learn-me-api.onrender.com/api`
3. **Admin Portal (Vercel):**
   - Vercel-ல் `admin-web` folder-ஐ deploy செய்யவும்.
   - Environment Variable: `LEARNME_ADMIN_API_URL=https://learn-me-api.onrender.com/api`

---

## அட்மின் உள்நுழைவு & சோதனை (Admin Login & Test)

Deployment முடிந்ததும் உங்களது live URL-ஐ திறந்து பரிசோதிக்கலாம்:

- 🎓 **Student Web Portal:** `https://your-site.onrender.com/`
- 🛡️ **Admin Dashboard:** `https://your-site.onrender.com/admin/`
- 🗄️ **Live Database Explorer:** `https://your-site.onrender.com/database`
- 📡 **API Health Status:** `https://your-site.onrender.com/api/health`

### இயல்புநிலை அட்மின் சான்றுகள் (Default Admin Credentials):
- **Email:** `sumathiaz550@gmail.com`
- **Password:** `Sumathi@12345`
