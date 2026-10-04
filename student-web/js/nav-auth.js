/**
 * Learn Me - Zero-Database Navigation & Student Profile Controller
 * (student-web/js/nav-auth.js)
 * 
 * Provides unified navigation, interactive student name personalization
 * for certificates, and strict per-user session isolation.
 */
(function (global) {
    function getCurrentUser() {
        if (global.StudentAPI && typeof global.StudentAPI.getCurrentUser === 'function') {
            const u = global.StudentAPI.getCurrentUser();
            if (u && (u.id || u._id || u.email)) return u;
        }
        try {
            const raw = localStorage.getItem('learnMeCurrentUser');
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && (parsed.id || parsed._id || parsed.email)) return parsed;
            }
        } catch (e) {}
        return null;
    }

    function getToken() {
        try {
            return localStorage.getItem('learnMeAuthToken') || null;
        } catch (e) {
            return null;
        }
    }

    function getStudentName() {
        const u = getCurrentUser();
        if (u) {
            if (u.name && u.name.trim() && u.name !== 'Learner') return u.name.trim();
            const stored = localStorage.getItem('learnMeStudentName');
            if (stored && stored.trim() && stored !== 'Learner') return stored.trim();
            if (u.email) return u.email.split('@')[0];
            return 'Student';
        }
        return '';
    }

    function setStudentName(name) {
        if (!name || !name.trim()) return;
        const clean = name.trim();
        const u = getCurrentUser();
        if (!u) return;

        localStorage.setItem('learnMeStudentName', clean);
        u.name = clean;
        try {
            localStorage.setItem('learnMeCurrentUser', JSON.stringify(u));
        } catch(e) {}

        if (global.StudentAPI && typeof global.StudentAPI.setStudentName === 'function') {
            global.StudentAPI.setStudentName(clean);
        }
        renderNav();
    }

    function promptEditStudentName() {
        const u = getCurrentUser();
        if (!u) {
            window.location.href = 'login.html';
            return;
        }
        const current = getStudentName();
        let modal = document.getElementById('name-edit-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'name-edit-modal';
            modal.style.cssText = `
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(11, 23, 54, 0.75); backdrop-filter: blur(8px);
                display: flex; align-items: center; justify-content: center;
                z-index: 9999; padding: 16px; box-sizing: border-box;
            `;
            modal.innerHTML = `
                <div style="background: #ffffff; border-radius: 20px; max-width: 440px; width: 100%; padding: 30px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); text-align: center; position: relative;">
                    <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(37,99,235,0.1); color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 16px;">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <h3 style="font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 800; margin: 0 0 8px; color: #0d1b3d;">
                        Your Certificate Name
                    </h3>
                    <p style="font-size: 14px; color: #64748b; margin: 0 0 20px; line-height: 1.5;">
                        Enter your full legal name as it should appear on your official academic credentials and downloadable PDF certificates.
                    </p>
                    <input type="text" id="modal-name-input" style="width: 100%; padding: 12px 16px; border: 1.5px solid #cbd5e1; border-radius: 10px; font-size: 15px; margin-bottom: 20px; box-sizing: border-box; outline: none;" placeholder="e.g. John Doe, Sumathi R">
                    <div style="display: flex; gap: 10px;">
                        <button id="modal-name-cancel" style="flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #cbd5e1; background: transparent; font-weight: 600; cursor: pointer; color: #64748b;">
                            Cancel
                        </button>
                        <button id="modal-name-save" style="flex: 1.5; padding: 10px; border-radius: 10px; border: none; background: #2563eb; color: #ffffff; font-weight: 700; cursor: pointer;">
                            Save Name
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            document.getElementById('modal-name-cancel').onclick = () => {
                modal.style.display = 'none';
            };
            document.getElementById('modal-name-save').onclick = () => {
                const val = document.getElementById('modal-name-input').value;
                if (val && val.trim()) {
                    setStudentName(val);
                    modal.style.display = 'none';
                    if (window.showToast) window.showToast(`Certificate name updated to: ${val.trim()}`, 'success');
                }
            };
        }

        const input = document.getElementById('modal-name-input');
        if (input) input.value = current === 'Learner' ? '' : current;
        modal.style.display = 'flex';
        setTimeout(() => input?.focus(), 100);
    }

    async function logout() {
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (!confirmLogout) return;

        if (global.StudentAPI && typeof global.StudentAPI.clearSessionData === 'function') {
            global.StudentAPI.clearSessionData();
        }

        try {
            if (global.supabaseClient && global.supabaseClient.auth) {
                await global.supabaseClient.auth.signOut().catch(() => {});
            }
            if (global.SupabaseService && typeof global.SupabaseService.signOut === 'function') {
                await global.SupabaseService.signOut().catch(() => {});
            }
        } catch(e) {}

        const token = localStorage.getItem('learnMeAuthToken');
        if (token && global.AUTH_API_URL) {
            fetch(`${global.AUTH_API_URL}/logout`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
        }

        try {
            localStorage.removeItem('learnMeAuthToken');
            localStorage.removeItem('learnMeCurrentUser');
            localStorage.removeItem('learnMeStudentName');
            localStorage.removeItem('learnMeProgress_v2');
            localStorage.removeItem('learnMeEnrollments');
        } catch(e) {}

        if (global.appState) {
            global.appState.progress = {};
            global.appState.enrollments = {};
            global.appState.studentName = '';
            global.appState.user = null;
        }

        renderNav();

        const path = window.location.pathname.toLowerCase();
        if (path.includes('dashboard') || path.includes('certificate')) {
            window.location.href = 'login.html';
        } else {
            window.location.reload();
        }
    }

    function renderNav() {
        const navMenu = document.getElementById('nav-menu');
        if (navMenu) {
            navMenu.innerHTML = `
                <li><a href="index.html" class="nav-link" id="nav-link-home">Home</a></li>
                <li><a href="courses.html" class="nav-link" id="nav-link-courses">Courses</a></li>
                <li><a href="dashboard.html" class="nav-link" id="nav-link-dashboard">Dashboard</a></li>
                <li><a href="quiz.html" class="nav-link" id="nav-link-quiz">Quiz</a></li>
                <li><a href="verify.html" class="nav-link" id="nav-link-verify">Verify</a></li>
            `;

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
        const isLoggedIn = Boolean(user && (token || user.email));

        if (isLoggedIn) {
            const displayName = getStudentName() || 'Student';
            const initial = displayName.trim().charAt(0).toUpperCase() || 'S';

            authSection.innerHTML = `
                <div id="user-profile-widget" style="display: flex; align-items: center; gap: 8px;">
                    <button type="button" onclick="StudentAuth.promptEditStudentName()" style="background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25); color: #ffffff; padding: 6px 12px; border-radius: 99px; font-weight: 600; font-size: 13.5px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: all 0.2s ease;">
                        <span style="width: 24px; height: 24px; border-radius: 50%; background: #2563eb; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700;">
                            ${initial}
                        </span>
                        <span id="nav-user-name" style="max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${displayName}
                        </span>
                        <i class="fas fa-edit" style="font-size: 11px; opacity: 0.8;" title="Edit Certificate Name"></i>
                    </button>
                    <button type="button" onclick="StudentAuth.logout()" class="btn btn-sm btn-outline" style="padding: 6px 12px; font-size: 13px; color: #ffffff; border-color: rgba(255,255,255,0.3); border-radius: 8px;" title="Sign Out">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
                <div class="menu-btn" id="menu-btn" aria-label="Toggle Navigation">
                    <i class="fas fa-bars"></i>
                </div>
            `;
        } else {
            // Guest / Logged Out: Show Sign In & Sign Up
            authSection.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <a href="login.html" class="btn btn-sm btn-outline" style="padding: 6px 14px; font-size: 13.5px; color: #ffffff; border-color: rgba(255,255,255,0.3); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </a>
                    <a href="signup.html" class="btn btn-sm btn-primary" style="padding: 6px 14px; font-size: 13.5px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; border-radius: 8px;">
                        <i class="fas fa-user-plus"></i> Sign Up
                    </a>
                </div>
                <div class="menu-btn" id="menu-btn" aria-label="Toggle Navigation">
                    <i class="fas fa-bars"></i>
                </div>
            `;
        }

        // Mobile menu toggle
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

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderNav);
    } else {
        renderNav();
    }

    global.StudentAuth = {
        getStudentName,
        setStudentName,
        promptEditStudentName,
        renderNav,
        logout,
        getToken,
        getCurrentUser,
        setCurrentUser: (u) => {
            if (u && (u.id || u.email)) {
                try {
                    localStorage.setItem('learnMeCurrentUser', JSON.stringify(u));
                    if (u.name) localStorage.setItem('learnMeStudentName', u.name);
                } catch(e) {}
            }
            renderNav();
        }
    };
})(window);
