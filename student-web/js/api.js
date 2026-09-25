/**
 * Learn Me - Student Centralized API Client (student-web/js/api.js)
 * Handles Base URL, Token Injection, Error Handling, and REST verbs.
 */
(function (global) {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    // Default to port 5000 if running student-web on port 3000 or file: protocol
    const API_BASE = window.LEARNME_API_URL || (
        window.location.protocol === 'file:' || (isLocalhost && window.location.port !== '5000')
            ? 'http://localhost:5000/api'
            : `${window.location.origin}/api`
    );

    const TOKEN_KEY = 'learnMeAuthToken';
    const USER_KEY = 'learnMeCurrentUser';

    function getToken() {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch (e) {
            return null;
        }
    }

    function setToken(token) {
        try {
            if (token) localStorage.setItem(TOKEN_KEY, token);
            else localStorage.removeItem(TOKEN_KEY);
        } catch (e) {}
    }

    function getCurrentUser() {
        try {
            const raw = localStorage.getItem(USER_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    }

    function setCurrentUser(user) {
        try {
            if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
            else localStorage.removeItem(USER_KEY);
        } catch (e) {}
    }

    async function logout() {
        if (window.SupabaseService) {
            try { await window.SupabaseService.signOut(); } catch (e) {}
        } else if (window.supabaseClient && window.supabaseClient.auth) {
            try { await window.supabaseClient.auth.signOut(); } catch (e) {}
        }
        setToken(null);
        setCurrentUser(null);
        window.location.href = 'login.html';
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
                // If token expired, clear and prompt login
                if (response.status === 401 && !endpoint.includes('/auth/login')) {
                    setToken(null);
                    setCurrentUser(null);
                }

                const errorMsg = (data && data.message) ? data.message : `Request failed with status ${response.status}`;
                const err = new Error(errorMsg);
                err.status = response.status;
                err.data = data;
                err.reasons = data?.reasons || [];
                err.metrics = data?.metrics || null;
                throw err;
            }

            return data;
        } catch (err) {
            console.error(`[StudentAPI Error] ${options.method || 'GET'} ${endpoint}:`, err.message);
            throw err;
        }
    }

    /**
     * Universal Navigation & Responsive Menu Controller for student-web
     */
    function initSharedNav() {
        const menuBtn = document.getElementById('menu-btn');
        const navMenu = document.getElementById('nav-menu');
        let backdrop = document.getElementById('nav-backdrop');

        // Create backdrop if missing
        if (!backdrop && navMenu) {
            backdrop = document.createElement('div');
            backdrop.id = 'nav-backdrop';
            backdrop.className = 'nav-backdrop';
            document.body.appendChild(backdrop);
        }

        function closeNav() {
            if (navMenu) navMenu.classList.remove('active');
            if (backdrop) backdrop.classList.remove('active');
            if (menuBtn) menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }

        if (menuBtn && navMenu && !menuBtn.dataset.bound) {
            menuBtn.dataset.bound = 'true';
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = navMenu.classList.toggle('active');
                if (backdrop) backdrop.classList.toggle('active', isOpen);
                menuBtn.innerHTML = isOpen
                    ? '<i class="fas fa-times"></i>'
                    : '<i class="fas fa-bars"></i>';
            });
        }

        if (backdrop && !backdrop.dataset.bound) {
            backdrop.dataset.bound = 'true';
            backdrop.addEventListener('click', closeNav);
        }

        if (navMenu && !navMenu.dataset.bound) {
            navMenu.dataset.bound = 'true';
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 991) closeNav();
                });
            });
        }

        // Keep active link highlighting consistent
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        if (navMenu) {
            navMenu.querySelectorAll('a.nav-link').forEach(link => {
                const href = link.getAttribute('href');
                if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
                    link.classList.add('active');
                } else if (href && href.includes('.html') && !href.startsWith('#')) {
                    if (href !== currentPath) link.classList.remove('active');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSharedNav);
    } else {
        initSharedNav();
    }

    const StudentAPI = {
        baseUrl: API_BASE,
        getToken,
        setToken,
        getCurrentUser,
        setCurrentUser,
        logout,
        initSharedNav,
        get: (endpoint, headers) => request(endpoint, { method: 'GET', headers }),
        post: (endpoint, body, headers) => request(endpoint, { method: 'POST', body, headers }),
        put: (endpoint, body, headers) => request(endpoint, { method: 'PUT', body, headers }),
        patch: (endpoint, body, headers) => request(endpoint, { method: 'PATCH', body, headers }),
        delete: (endpoint, headers) => request(endpoint, { method: 'DELETE', headers })
    };

    global.StudentAPI = StudentAPI;
})(window);

