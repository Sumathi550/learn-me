# Learn Me Admin Panel - Setup & Security Guide

## 🎯 OVERVIEW

This admin panel is a **production-grade secure administration system** for the Learn Me learning platform. It includes comprehensive security measures, audit logging, and role-based access control.

---

## 🔒 SECURITY ARCHITECTURE

### Backend Security (Most Important)
Every admin endpoint is protected by **TWO layers of validation**:
1. **Authentication**: `requireAuth` middleware verifies the JWT token
2. **Authorization**: `requireAdmin` middleware verifies the user has the `admin` role

This happens on the **server-side for EVERY request** - frontend checks are only for UX.

### Key Security Features
✅ Admin role verified server-side on every request
✅ Comprehensive audit logging of all admin actions
✅ IDOR (Insecure Direct Object Reference) prevention
✅ Input validation and sanitization
✅ IP address and user agent tracking
✅ Failed login attempt logging
✅ Session-based authentication with JWT tokens
✅ Password hashing with bcrypt
✅ Prevents user self-promotion to admin

---

## 🚀 GETTING STARTED

### Step 1: Ensure Backend is Running
```bash
cd backend
npm install  # Install dependencies if not already done
node server.js
# Should output: "Learn Me API running on port 5000"
```

### Step 2: Access Admin Panel
1. Open your browser and go to: `http://localhost:5000/admin.html`
2. You should see the **Admin Sign In** page

### Step 3: Create Your First Admin Account

You have two options:

#### Option A: Database Update (Fastest)
1. Register as a regular user via `http://localhost:5000/index.html`
   - Email: your-email@example.com
   - Password: your-password
   - Name: Your Name

2. Update the user to admin role in MongoDB:
```javascript
// Using MongoDB CLI or MongoDB Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
);
```

3. Now login to the admin panel with your email and password

#### Option B: Manual Database Insert
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@learnme.com",
  password: "$2a$12$your-bcrypted-password-hash",
  role: "admin",
  isActive: true,
  lastLogin: new Date(),
  lastSeen: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});
```

---

## 📊 ADMIN PANEL FEATURES

### 1. Dashboard
- **Total Users**: Count of all registered users
- **Active Users**: Users who have been online in the last 15 minutes
- **Courses Completed**: Number of users who completed courses
- **Certificates Issued**: Count of valid certificates
- **Recent Certificates**: Latest 5 issued certificates
- **Recent Activity**: Latest 5 user actions

### 2. Course Management
**View**: List of all courses (draft + published)
**Create**: Add new course
**Edit**: Update course details
**Delete**: Remove course

Course details managed:
- Course ID (unique identifier)
- Title and subtitle
- Duration and difficulty
- Status (published/draft)
- Course modules

### 3. User Management
**Search**: Find users by name or email
**View**: See detailed user profile including:
  - Name, email, role, status, join date
  - Courses started and completed
  - All certificates earned with scores
  - Progress on each course (with percentage)
- **Edit**: Update user name or active status
- **Delete**: Remove user account and all associated data

### 4. Certificate Management
**View**: List all issued certificates
**Filter**: Search by student name, course, or certificate ID
**Details**: View certificate information
**Revoke**: Permanently invalidate a certificate (irreversible)

Certificate details tracked:
- Certificate ID
- Student name
- Course name
- Score and percentage
- Issue date
- Status (valid/revoked)

### 5. Activity Log
**User Activity**: Tracks all user actions
- Logins/logouts
- Course starts
- Course completions
- Quiz completions
- Certificate downloads

### 6. Audit Log
**Admin Activity**: Tracks all admin actions (compliance & security)
- Admin login/logout
- Courses created/edited/deleted
- Users viewed/updated/deleted
- Certificates revoked
- Profiles viewed

**Security**: Each admin can only view their own audit log

### 7. Profile
- View current admin name and email
- Update your name
- View account creation date

---

## 🔐 SECURITY BEST PRACTICES

### For Administrators
1. ✅ Use a **strong password** (12+ characters with mix of upper/lower/numbers/symbols)
2. ✅ **Don't share** your admin credentials
3. ✅ **Log out** when leaving your workstation
4. ✅ **Monitor** the audit log regularly for unauthorized access
5. ✅ **Review** user and certificate changes carefully

### API Security Notes
- All admin endpoints require valid JWT token
- Invalid/expired tokens return 401 Unauthorized
- Non-admin users attempting admin access return 403 Forbidden
- All admin actions are logged with timestamp, IP, and details
- Certificates can be revoked but not un-revoked
- Users cannot be promoted to admin via UI (security feature)

---

## 🧪 TESTING THE SECURITY

### Test 1: Unauthorized Access
```bash
# Try to access admin endpoint without token
curl http://localhost:5000/api/admin/users
# Expected: 401 Unauthorized
```

### Test 2: Regular User Access
```bash
# Login as regular user and try admin endpoint
# Expected: 403 Forbidden
```

### Test 3: Invalid Admin Role
```bash
# Register new user, change role to 'user', try to access admin
# Expected: 403 Forbidden on admin endpoints
```

### Test 4: Audit Logging
```bash
1. Login to admin panel
2. Go to "Audit Log" section
3. Should see "ADMIN_LOGIN" entry with:
   - Your email
   - Timestamp
   - IP address
   - User agent
```

### Test 5: IDOR Prevention
```bash
1. Get a user ID from the Users list
2. Try to access: /api/admin/users/invalid-id
3. Should return: 400 Bad Request (invalid format)
4. Try to access: /api/admin/users/507f1f77bcf86cd799439011
5. Should return: 404 Not Found (doesn't exist)
```

---

## 📱 RESPONSIVE DESIGN

The admin panel is fully responsive:
- **Desktop** (1024px+): Full sidebar, multi-column layout
- **Tablet** (768px-1023px): Compact sidebar, single column
- **Mobile** (< 768px): Hamburger menu, full-width layout

---

## 🐛 TROUBLESHOOTING

### Issue: "Admin access required" error
**Solution**: 
1. Check that your user account has `role: "admin"` in the database
2. Clear browser cache and localStorage
3. Log out and log back in

### Issue: "This account does not have admin access"
**Solution**: Your user doesn't have admin role. Update in database or ask another admin.

### Issue: Audit log not updating
**Solution**: 
1. Check backend console for errors
2. Ensure AdminAuditLog model is installed
3. Check MongoDB connection

### Issue: "Invalid token" when logging in
**Solution**:
1. Clear localStorage: Open DevTools → Application → LocalStorage → Clear
2. Clear browser cookies
3. Try logging in again

### Issue: Admin features not appearing
**Solution**:
1. Verify you're using correct admin credentials
2. Check browser console for error messages
3. Check that admin.js and admin.css are loading (F12 → Network tab)

---

## 📋 API DOCUMENTATION

### Authentication Endpoints
```
POST /api/auth/login
  Body: { email, password }
  Returns: { token, user: { id, name, email, role } }

POST /api/auth/logout
  Requires: Valid token
  Returns: { message: "Logged out successfully" }

GET /api/auth/me
  Requires: Valid token
  Returns: { id, name, email, role, isActive }
```

### Admin Dashboard
```
GET /api/admin/dashboard
  Returns: { totalUsers, activeUsers, completedCourses, certificatesIssued }
```

### User Management
```
GET /api/admin/users?search=john&limit=50&skip=0
  Returns: { users: [], total, limit, skip }

GET /api/admin/users/:userId
  Returns: { user, stats, progress, certificates }

PATCH /api/admin/users/:userId
  Body: { name?, isActive? }
  Returns: Updated user object

DELETE /api/admin/users/:userId
  Returns: { message: "User deleted successfully" }
```

### Certificate Management
```
GET /api/admin/certificates?limit=200&skip=0
  Returns: { certificates: [], total, limit, skip }

GET /api/admin/certificates/:certificateId
  Returns: Certificate object with populated user info

PATCH /api/admin/certificates/:certificateId/revoke
  Returns: { message, certificate }

GET /api/admin/certificates/user/:userId
  Returns: Array of user's certificates
```

### Activity & Audit
```
GET /api/admin/activity?limit=100&skip=0
  Returns: { activity: [], total, limit, skip }

GET /api/admin/audit-log?limit=100&skip=0
  Returns: { logs: [], total, limit, skip }

GET /api/admin/audit-log/:adminId
  Returns: { logs: [], total, limit, skip }
  Note: Admins can only view their own log
```

---

## 📚 MODELS & SCHEMA

### AdminAuditLog Schema
```javascript
{
  adminId: ObjectId,           // Reference to admin user
  adminEmail: String,          // Admin's email for reference
  action: String,              // LOGIN, LOGOUT, COURSE_CREATED, etc.
  resourceType: String,        // 'Course', 'User', 'Certificate', etc.
  resourceId: String,          // ID of affected resource
  resourceName: String,        // Name of affected resource
  details: String,             // Additional context
  ipAddress: String,           // Admin's IP address
  userAgent: String,           // Browser/client info
  status: 'success'|'failed',  // Operation result
  errorMessage: String,        // Error details if failed
  timestamp: Date,             // When action occurred
}
```

---

## 🎓 LEARNING RESOURCES

### Understand JWT Authentication
JWT (JSON Web Token) is a secure way to transmit user info:
1. User logs in with credentials
2. Server creates a token with user data
3. Client stores token and sends with each request
4. Server validates token before allowing access

### Understand IDOR Prevention
IDOR attacks happen when users access resources by changing IDs in URLs:
```
// Vulnerable: /admin/users/123 (attacker changes 123 to 456)
// Protected: Server validates ObjectId format AND user existence
```

### Understand Audit Logging
Audit logs create an immutable record of all actions for compliance:
- Security investigations
- User behavior analysis
- Compliance audits
- Troubleshooting issues

---

## 📞 SUPPORT

For issues or questions:
1. Check browser console (F12) for error messages
2. Check backend server logs for detailed errors
3. Verify MongoDB is running and accessible
4. Check that all files are in correct locations
5. Ensure `.env` file has correct API configuration

---

## 🔄 MAINTENANCE

### Regular Tasks
- Monitor audit log for suspicious activity
- Review user accounts (delete inactive users)
- Update course content as needed
- Verify certificate validity
- Check MongoDB storage usage

### Backup Strategy
- Regular MongoDB backups
- Document admin account credentials securely
- Keep audit logs for compliance (minimum 1-2 years)

---

**Last Updated**: 2024
**Version**: 1.0
**Status**: Production Ready ✅
