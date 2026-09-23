/**
 * Learn Me - Unified Navigation & Authentication Handler (student-web/js/nav-auth.js)
 * Ensures 100% consistent UI styling, header structure, and navigation flexibility
 * across all authentication states (logged in, logged out, login, logout, sign-in, sign-up).
 */
(function (global) {
    const TOKEN_KEY = 'learnMeAuthToken';
    const USER_KEY = 'learnMeCurrentUser';

    function getToken() {
        try {
            return localStorage.getItem(TOKEN_KEY);
        } catch (e) {
            return null;
        }
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

    function setToken(token) {
        try {
            if (token) localStorage.setItem(TOKEN_KEY, token);
            else localStorage.removeItem(TOKEN_KEY);
        } catch (e) {}
    }

    function logout() {
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (!confirmLogout) return;

        setToken(null);
        setCurrentUser(null);

        // If on dashboard, reload to display clean guest dashboard without kicking user out to external screen
        if (window.location.pathname.endsWith('dashboard.html')) {
            window.location.reload();
        } else if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('signup.html')) {
            window.location.href = 'index.html';
        } else {
            // Smoothly update navbar in place
            renderNav();
            window.location.reload();
        }
    }

    function renderNav() {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            // Standardize nav links across all pages
            navMenu.innerHTML = `
                <li><a href="index.html" class="nav-link" id="nav-link-home">Home</a></li>
                <li><a href="courses.html" class="nav-link" id="nav-link-courses">Courses</a></li>
                <li><a href="dashboard.html" class="nav-link" id="nav-link-dashboard">Dashboard</a></li>
                <li><a href="quiz.html" class="nav-link" id="nav-link-quiz">Quiz</a></li>
                <li><a href="verify.html" class="nav-link" id="nav-link-verify">Verify</a></li>
            `;

            // Detect current page to set active link
            const pathname = window.location.pathname.toLowerCase();
            let activeId = 'nav-link-home';

            if (pathname.includes('courses') || pathname.includes('course-details')) {
                activeId = 'nav-link-courses';
            } else if (pathname.includes('dashboard')) {
                activeId = 'nav-link-dashboard';
            } else if (pathname.includes('quiz') || pathname.includes('quize')) {
                activeId = 'nav-link-quiz';
            } else if (pathname.includes('verify') || pathname.includes('certificate')) {
                activeId = 'nav-link-verify';
            } else if (pathname.includes('index') || pathname === '/' || pathname.endsWith('/')) {
                activeId = 'nav-link-home';
            }

            document.querySelectorAll('#nav-menu .nav-link').forEach(link => {
                link.classList.remove('active');
            });
            const activeEl = document.getElementById(activeId);
            if (activeEl) activeEl.classList.add('active');
        }

        const authSection = document.getElementById('user-auth-section');
        if (!authSection) return;

        const user = getCurrentUser();
        const token = getToken();

        if (token && user) {
            const displayName = user.name || 'Learner';
            const initial = displayName.trim().charAt(0).toUpperCase() || 'U';

            authSection.innerHTML = `
                <div id="user-profile-widget" style="display: flex; align-items: center; gap: 10px;">
                    <div id="user-avatar" style="width: 38px; height: 38px; border-radius: 50%; background: #2563eb; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; box-shadow: 0 2px 8px rgba(37,99,235,0.3); user-select: none;">
                        ${initial}
                    </div>
                    <span id="nav-user-name" style="font-weight: 600; font-size: 14px; color: #ffffff; white-space: nowrap;">
                        ${displayName}
                    </span>
                    <button onclick="StudentAuth.logout()" class="btn btn-sm btn-outline" style="padding: 6px 12px; font-size: 13px; color: #ffffff; border-color: rgba(255,255,255,0.25); display: inline-flex; align-items: center; gap: 6px; cursor: pointer; background: transparent; border-radius: 8px;">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
                <div class="menu-btn" id="menu-btn" aria-label="Toggle Navigation">
                    <i class="fas fa-bars"></i>
                </div>
            `;
        } else {
            authSection.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <a href="login.html" id="nav-login-btn" class="btn btn-sm btn-outline" style="padding: 6px 14px; font-size: 13.5px; color: #ffffff; border-color: rgba(255,255,255,0.3); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </a>
                    <a href="signup.html" id="nav-signup-btn" class="btn btn-sm btn-primary" style="padding: 6px 14px; font-size: 13.5px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;">
                        <i class="fas fa-user-plus"></i> Sign Up
                    </a>
                </div>
                <div class="menu-btn" id="menu-btn" aria-label="Toggle Navigation">
                    <i class="fas fa-bars"></i>
                </div>
            `;
        }

        // Initialize mobile menu trigger
        const menuBtn = document.getElementById('menu-btn');
        const menu = document.getElementById('nav-menu');
        const backdrop = document.getElementById('nav-backdrop');

        if (menuBtn && menu) {
            menuBtn.onclick = function (e) {
                e.stopPropagation();
                menu.classList.toggle('active');
                if (backdrop) backdrop.classList.toggle('active');
            };
        }

        if (backdrop && menu) {
            backdrop.onclick = function () {
                menu.classList.remove('active');
                backdrop.classList.remove('active');
            };
        }
    }

    // Auto-run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNav);
    } else {
        renderNav();
    }

    // Export API
    global.StudentAuth = {
        getToken,
        setToken,
        getCurrentUser,
        setCurrentUser,
        logout,
        renderNav
    };

    // Keep compatibility with StudentAPI.logout
    if (global.StudentAPI) {
        global.StudentAPI.logout = logout;
    }
})(window);
