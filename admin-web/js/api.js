/**
 * Learn Me - Admin Centralized API Client (admin-web/js/api.js)
 * Enforces admin authorization headers, base URL handling, 401/403 auto-logout trap, and REST verbs.
 */
(function (global) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // Default to port 5000 if running admin-web on port 3001 or file: protocol
    const API_BASE = window.LEARNME_ADMIN_API_URL || (
        window.location.protocol === 'file:' || (isLocalhost && window.location.port !== '5000')
            ? 'http://localhost:5000/api'
            : `${window.location.origin}/api`
    );

    const ADMIN_TOKEN_KEY = 'learnMeAuthToken';
    const ADMIN_USER_KEY = 'learnMeAdminUser';

    function getToken() {
        try {
            return localStorage.getItem(ADMIN_TOKEN_KEY);
        } catch (e) {
            return null;
        }
    }

    function setToken(token) {
        try {
            if (token) localStorage.setItem(ADMIN_TOKEN_KEY, token);
            else localStorage.removeItem(ADMIN_TOKEN_KEY);
        } catch (e) {}
    }

    function getAdminUser() {
        try {
            const raw = localStorage.getItem(ADMIN_USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setAdminUser(user) {
        try {
            if (user) localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(user));
            else localStorage.removeItem(ADMIN_USER_KEY);
        } catch (e) {}
    }

    function logoutAdmin() {
        setToken(null);
        setAdminUser(null);
        if (!window.location.pathname.endsWith('login.html')) {
            window.location.href = 'login.html';
        }
    }

    async function request(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(options.headers || {})
        };

        const token = getToken();
        if (token && !headers['Authorization']) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            let data = null;

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                if ((response.status === 401 || response.status === 403) && !endpoint.includes('/auth/login')) {
                    console.warn(`[AdminAPI] Unauthorized or Forbidden (${response.status}). Redirecting to login.`);
                    setToken(null);
                    setAdminUser(null);
                    if (!window.location.pathname.endsWith('login.html')) {
                        window.location.href = 'login.html?error=unauthorized';
                    }
                }

                const errorMsg = (data && data.message) ? data.message : `Admin API failed with status ${response.status}`;
                const err = new Error(errorMsg);
                err.status = response.status;
                err.data = data;
                throw err;
            }

            return data;
        } catch (err) {
            console.error(`[AdminAPI Error] ${options.method || 'GET'} ${endpoint}:`, err.message);
            throw err;
        }
    }

    const AdminAPI = {
        baseUrl: API_BASE,
        getToken,
        setToken,
        getAdminUser,
        setAdminUser,
        logoutAdmin,
        get: (endpoint, headers) => request(endpoint, { method: 'GET', headers }),
        post: (endpoint, body, headers) => request(endpoint, { method: 'POST', body, headers }),
        put: (endpoint, body, headers) => request(endpoint, { method: 'PUT', body, headers }),
        patch: (endpoint, body, headers) => request(endpoint, { method: 'PATCH', body, headers }),
        delete: (endpoint, headers) => request(endpoint, { method: 'DELETE', headers })
    };

    global.AdminAPI = AdminAPI;
})(window);
