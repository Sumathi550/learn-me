/**
 * Learn Me - Admin Auth Guardian (admin-web/js/admin-auth.js)
 * Checks session, verifies owner-admin role, and controls route access.
 */
(function (global) {
    async function checkAdminAuth(options = { redirectToLogin: true }) {
        const token = AdminAPI.getToken();
        if (!token) {
            if (options.redirectToLogin && !window.location.pathname.endsWith('login.html')) {
                window.location.href = 'login.html';
            }
            return null;
        }

        try {
            const res = await AdminAPI.get('/auth/me');
            const user = res.user || res.data?.user || res;

            if (!user || user.role !== 'admin') {
                console.warn('[AdminAuth] Non-admin user attempted to access admin portal.');
                AdminAPI.logoutAdmin();
                return null;
            }

            AdminAPI.setAdminUser(user);
            return user;
        } catch (err) {
            console.warn('[AdminAuth] Session validation failed:', err.message);
            AdminAPI.logoutAdmin();
            return null;
        }
    }

    global.AdminAuth = {
        checkAdminAuth
    };
})(window);
