/**
 * Learn Me - Role-Based Access Control (RBAC) & Route Security Tests
 */
process.env.NODE_ENV = 'test';
const app = require('../app');
const { sequelize, User, Course } = require('../models');
const seedDatabase = require('../utils/seedData');

async function runRBACTests() {
    console.log('====================================================');
    console.log('      LEARN ME - RBAC SECURITY VERIFICATION         ');
    console.log('====================================================\n');

    let passedTests = 0;
    let totalTests = 0;

    function assert(condition, message) {
        totalTests++;
        if (condition) {
            console.log(`  ✅ PASS: ${message}`);
            passedTests++;
        } else {
            console.error(`  ❌ FAIL: ${message}`);
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    const server = await new Promise(resolve => {
        const s = app.listen(0, () => resolve(s));
    });
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    async function api(path, options = {}) {
        const url = `${baseUrl}${path}`;
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        const res = await fetch(url, {
            ...options,
            headers,
            body: options.body ? JSON.stringify(options.body) : undefined
        });
        let json = null;
        try {
            json = await res.json();
        } catch (e) {}
        return { status: res.status, body: json };
    }

    try {
        await sequelize.authenticate();
        await sequelize.sync();
        await seedDatabase();

        // 1. Authenticate Owner Admin
        console.log('--- TEST GROUP 1: Authentication & Token Issuance ---');
        const adminLogin = await api('/api/auth/login', {
            method: 'POST',
            body: { email: 'sumathiaz550@gmail.com', password: 'Sumathi@12345' }
        });
        assert(adminLogin.status === 200, 'Admin login succeeds with 200 OK');
        assert(adminLogin.body.token, 'Admin receives JWT token');
        assert(adminLogin.body.user.role === 'admin', 'Admin role is "admin"');
        const adminToken = adminLogin.body.token;

        // Register a pure student
        const studentEmail = `student_rbac_${Date.now()}@example.com`;
        const studentRegister = await api('/api/auth/register', {
            method: 'POST',
            body: { name: 'RBAC Student', email: studentEmail, password: 'StudentPass@123' }
        });
        assert(studentRegister.status === 201, 'Student registered with 201 Created');
        assert(studentRegister.body.user.role === 'user', 'Student role is strictly "user"');
        const studentToken = studentRegister.body.token;
        const studentId = studentRegister.body.user.id;

        // 2. Test Admin Endpoint Isolation - Student Access MUST return 403 Forbidden
        console.log('\n--- TEST GROUP 2: Student Calling Admin APIs MUST Return 403 Forbidden ---');

        const adminEndpointsToTest = [
            { method: 'GET', path: '/api/admin/dashboard', desc: 'Admin Dashboard' },
            { method: 'GET', path: '/api/admin/users', desc: 'Admin User List' },
            { method: 'GET', path: '/api/admin/courses', desc: 'Admin Courses View' },
            { method: 'POST', path: '/api/admin/courses', body: { title: 'Hack Course' }, desc: 'Admin Create Course' },
            { method: 'GET', path: '/api/admin/certificates', desc: 'Admin Certificates View' },
            { method: 'GET', path: '/api/admin/audit-log', desc: 'Admin Audit Log' },
            { method: 'GET', path: '/api/admin/settings', desc: 'Admin Settings' }
        ];

        for (const endpoint of adminEndpointsToTest) {
            const res = await api(endpoint.path, {
                method: endpoint.method,
                headers: { Authorization: `Bearer ${studentToken}` },
                body: endpoint.body
            });
            assert(res.status === 403, `Student access to ${endpoint.desc} (${endpoint.path}) returns 403 Forbidden`);
            assert(res.body.success === false, `Response success is false`);
        }

        // 3. Test Unauthenticated Access - MUST return 401 Unauthorized
        console.log('\n--- TEST GROUP 3: Unauthenticated Access MUST Return 401 Unauthorized ---');
        for (const endpoint of adminEndpointsToTest.slice(0, 3)) {
            const res = await api(endpoint.path, { method: endpoint.method });
            assert(res.status === 401, `Unauthenticated request to ${endpoint.desc} returns 401 Unauthorized`);
        }

        // 4. Test Authorized Admin Access - Admin MUST return 200 OK
        console.log('\n--- TEST GROUP 4: Admin Access to Admin APIs Returns 200 OK ---');
        const adminDashRes = await api('/api/admin/dashboard', {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        assert(adminDashRes.status === 200, 'Admin can access /api/admin/dashboard (200 OK)');
        assert(adminDashRes.body.stats !== undefined, 'Admin dashboard returns stats object');

        const adminUsersRes = await api('/api/admin/users', {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        assert(adminUsersRes.status === 200, 'Admin can access /api/admin/users (200 OK)');
        assert(Array.isArray(adminUsersRes.body) || Array.isArray(adminUsersRes.body.data), 'Admin user list returned');

        // Clean up test student
        await User.destroy({ where: { id: studentId } });

        server.close();
        console.log(`\n====================================================`);
        console.log(`🎉 ALL ${totalTests} RBAC TESTS PASSED SUCCESSFULLY!`);
        console.log(`====================================================\n`);
        return true;
    } catch (err) {
        console.error('RBAC Test Failure:', err);
        if (server) server.close();
        process.exit(1);
    }
}

if (require.main === module) {
    runRBACTests();
}

module.exports = runRBACTests;
