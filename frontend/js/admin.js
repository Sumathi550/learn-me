/* ==========================================================================
   LEARN ME - OWNER ADMIN PANEL (admin.js)
   Enforces Owner Access (sumathiaz550@gmail.com), Dashboard Metrics,
   Course & Quiz Editor, Student Management, Certificate Revocation,
   Payment Verification & Audit Logging
   ========================================================================== */

const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_BASE = window.location.protocol === 'file:' || (isLocalhost && window.location.port !== '5000')
    ? 'http://localhost:5000/api'
    : `${window.location.origin}/api`;

let currentAdmin = null;
let currentView = 'dashboard';

document.addEventListener('DOMContentLoaded', initAdminPanel);

async function initAdminPanel() {
    setupEventListeners();
    const token = localStorage.getItem('learnMeAuthToken');
    if (!token) {
        showView('login-panel');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Session expired.');

        const data = await response.json();
        const user = data.user;

        if (user.role !== 'admin' || user.email.toLowerCase() !== 'sumathiaz550@gmail.com') {
            alert('Access Denied: Only sumathiaz550@gmail.com has owner-admin access.');
            logoutAdmin();
            return;
        }

        currentAdmin = user;
        updateAdminHeader(user);
        switchNav('dashboard');
        loadDashboardData();
    } catch (error) {
        console.warn('Admin auth verification failed:', error.message);
        logoutAdmin();
    }
}

function setupEventListeners() {
    // Admin login form
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) loginForm.addEventListener('submit', handleAdminLogin);

    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (href && href !== '#') return; // Allow external links like index.html, quize.html, verify.html
            e.preventDefault();

            if (!currentAdmin) {
                alert('Please sign in as Owner Admin first.');
                return showView('login-panel');
            }

            const view = item.getAttribute('data-view');
            if (view) switchNav(view);
        });
    });

    // Header actions
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', logoutAdmin);

    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) refreshBtn.addEventListener('click', refreshCurrentView);

    const toggleSidebar = document.getElementById('toggle-sidebar');
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            document.getElementById('admin-sidebar').classList.toggle('collapsed');
        });
    }

    // User menu toggle
    const userMenuBtn = document.getElementById('user-menu-btn');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = document.getElementById('user-menu-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('show');
                dropdown.classList.toggle('open');
            }
        });
    }

    document.addEventListener('click', () => {
        const dropdown = document.getElementById('user-menu-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            dropdown.classList.remove('open');
        }
    });

    // Course management form toggle
    const newCourseBtn = document.getElementById('new-course-btn');
    if (newCourseBtn) {
        newCourseBtn.addEventListener('click', () => {
            const form = document.getElementById('course-form');
            form.reset();
            form.removeAttribute('data-edit-id');
            document.getElementById('course-form-title').textContent = 'Create New Course';
            form.hidden = false;
        });
    }

    const cancelCourseBtn = document.getElementById('cancel-course-btn');
    if (cancelCourseBtn) {
        cancelCourseBtn.addEventListener('click', () => {
            document.getElementById('course-form').hidden = true;
        });
    }

    const courseForm = document.getElementById('course-form');
    if (courseForm) courseForm.addEventListener('submit', handleCourseSubmit);

    // Profile form submit
    const profileForm = document.getElementById('profile-form');
    if (profileForm) profileForm.addEventListener('submit', handleProfileSubmit);

    // Settings form submit
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) settingsForm.addEventListener('submit', handleSettingsSubmit);

    // User search
    const userSearch = document.getElementById('user-search');
    if (userSearch) {
        userSearch.addEventListener('input', (e) => filterUsersTable(e.target.value));
    }

    // Cert search
    const certSearch = document.getElementById('cert-search');
    if (certSearch) {
        certSearch.addEventListener('input', (e) => filterCertificatesTable(e.target.value));
    }
}

async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('admin-email').value.trim().toLowerCase();
    const password = document.getElementById('admin-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';
    errorEl.classList.remove('show');

    if (email !== 'sumathiaz550@gmail.com') {
        errorEl.textContent = 'Forbidden: Only the owner email (sumathiaz550@gmail.com) can access this Admin Panel.';
        errorEl.classList.add('show');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed.');

        localStorage.setItem('learnMeAuthToken', data.token);
        localStorage.setItem('learnMeCurrentUser', JSON.stringify(data.user));
        currentAdmin = data.user;

        updateAdminHeader(data.user);
        switchNav('dashboard');
    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.add('show');
    }
}

function logoutAdmin() {
    const token = localStorage.getItem('learnMeAuthToken');
    if (token) {
        fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
        }).catch(() => {});
    }
    localStorage.removeItem('learnMeAuthToken');
    localStorage.removeItem('learnMeCurrentUser');
    currentAdmin = null;
    showView('login-panel');
}

function updateAdminHeader(user) {
    document.getElementById('admin-name').textContent = `${user.name} (Owner Admin)`;
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    if (profileName) profileName.value = user.name;
    if (profileEmail) profileEmail.value = user.email;
}

function switchNav(viewName) {
    currentView = viewName;
    document.querySelectorAll('.sidebar-nav .nav-item').forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-view') === viewName);
    });
    showView(`${viewName}-view`);
    refreshCurrentView();
}

function showView(viewId) {
    const targetId = (viewId.endsWith('-view') || viewId.endsWith('-panel')) ? viewId : `${viewId}-view`;

    document.querySelectorAll('.view-panel').forEach(panel => {
        panel.classList.remove('active');
    });

    const target = document.getElementById(targetId) || document.getElementById(viewId);
    if (target) {
        target.classList.add('active');
    }

    const titles = {
        'dashboard-view': ['Owner Dashboard', 'System metrics and platform overview'],
        'database-view': ['Database Explorer', 'Inspect live tables, records & schema stored in SQLite database'],
        'courses-view': ['Course Management', 'Create, edit, publish courses & manage quiz answer keys'],
        'categories-view': ['Categories', 'Manage course learning tracks'],
        'users-view': ['User Management', 'Monitor student progress, scores & account statuses'],
        'certificates-view': ['Certificate Registry', 'Review issued certificates & handle revocations'],
        'activity-view': ['Student Activity Log', 'Real-time feed of student actions'],
        'audit-log-view': ['Admin Audit Log', 'Security logs of administrative operations'],
        'settings-view': ['Platform Settings', 'Configure platform details & branding'],
        'profile-view': ['Admin Profile', 'Owner admin security settings']
    };

    if (titles[targetId]) {
        const titleEl = document.getElementById('page-title');
        const subEl = document.getElementById('page-subtitle');
        if (titleEl) titleEl.textContent = titles[targetId][0];
        if (subEl) subEl.textContent = titles[targetId][1];
    }
}

function refreshCurrentView() {
    switch (currentView) {
        case 'dashboard': loadDashboardData(); break;
        case 'database': loadAdminDatabase(); break;
        case 'courses': loadAdminCourses(); break;
        case 'categories': loadAdminCategories(); break;
        case 'users': loadAdminUsers(); break;
        case 'certificates': loadAdminCertificates(); break;
        case 'activity': loadAdminActivity(); break;
        case 'audit-log': loadAdminAuditLog(); break;
        case 'settings': loadAdminSettings(); break;
    }
}

function getAuthHeaders() {
    const token = localStorage.getItem('learnMeAuthToken');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    };
}

// ==========================================================================
// DASHBOARD VIEW
// ==========================================================================

async function loadDashboardData() {
    try {
        const response = await fetch(`${API_BASE}/admin/dashboard`, { headers: getAuthHeaders() });
        if (!response.ok) return;
        const data = await response.json();

        const stats = data.stats || {};
        const metricGrid = document.getElementById('metric-grid');

        metricGrid.innerHTML = `
            <div class="metric-card" style="border-left:4px solid #2563eb;">
                <div class="metric-title">Total Students</div>
                <div class="metric-value">${stats.totalStudents || 0}</div>
                <div class="metric-sub">${stats.activeStudents || 0} active accounts</div>
            </div>
            <div class="metric-card" style="border-left:4px solid #16a34a;">
                <div class="metric-title">Free Access Platform</div>
                <div class="metric-value" style="color:#16a34a;">100% Free</div>
                <div class="metric-sub">Instant certificates for all tracks</div>
            </div>
            <div class="metric-card" style="border-left:4px solid #f59e0b;">
                <div class="metric-title">Certificates Issued</div>
                <div class="metric-value">${stats.totalCertificates || 0}</div>
                <div class="metric-sub">${stats.certificatesDownloaded || 0} downloaded</div>
            </div>
            <div class="metric-card" style="border-left:4px solid #8b5cf6;">
                <div class="metric-title">Total Courses</div>
                <div class="metric-value">${stats.totalCourses || 0}</div>
                <div class="metric-sub">${stats.publishedCourses || 0} published · ${stats.draftCourses || 0} draft</div>
            </div>
            <div class="metric-card" style="border-left:4px solid #ec4899;">
                <div class="metric-title">Course Enrollments</div>
                <div class="metric-value">${stats.totalEnrollments || 0}</div>
                <div class="metric-sub">${stats.completedCourses || 0} completed</div>
            </div>
        `;

        // Render Recent Activity
        const recentActivityEl = document.getElementById('recent-activity');
        const activities = data.recentActivity || [];
        if (activities.length === 0) {
            recentActivityEl.innerHTML = '<p class="empty-state">No recent activity recorded.</p>';
        } else {
            recentActivityEl.innerHTML = activities.map(act => `
                <div class="list-item" style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:13px;">
                    <div><strong>${act.userId?.name || 'Student'}</strong> (${act.userId?.email || 'N/A'})</div>
                    <div style="color:#64748b; margin-top:2px;">${act.details}</div>
                    <small style="color:#94a3b8;">${new Date(act.createdAt).toLocaleString()}</small>
                </div>
            `).join('');
        }

        // Render Recent Certificates
        const recentCertEl = document.getElementById('recent-certificates');
        const auditLogs = data.recentAuditLogs || [];
        if (auditLogs.length === 0) {
            recentCertEl.innerHTML = '<p class="empty-state">No admin actions logged yet.</p>';
        } else {
            recentCertEl.innerHTML = auditLogs.map(log => `
                <div class="list-item" style="padding:12px; border-bottom:1px solid #e2e8f0; font-size:13px;">
                    <div><strong style="color:#2563eb;">${log.action}</strong> by ${log.adminEmail}</div>
                    <div style="color:#64748b;">${log.details}</div>
                    <small style="color:#94a3b8;">${new Date(log.createdAt).toLocaleString()}</small>
                </div>
            `).join('');
        }

    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

// ==========================================================================
// DATABASE VIEWER VIEW
// ==========================================================================

let adminDbData = {
    users: [],
    courses: [],
    enrollments: [],
    certificates: [],
    payments: [],
    activities: [],
    auditLogs: [],
    categories: [],
    quizAttempts: [],
    progress: []
};
let currentDbTab = 'users';
let currentDbFilteredRows = [];
let currentInspectedRow = null;

async function loadAdminDatabase() {
    const refreshBtn = document.getElementById('db-refresh-btn');
    if (refreshBtn) refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';

    try {
        const dbApiUrl = `${API_BASE.replace(/\/api\/?$/, '')}/api/db-explorer`;
        const res = await fetch(dbApiUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        adminDbData = data;

        // Header Metadata
        const dialectEl = document.getElementById('admin-db-dialect');
        if (dialectEl) dialectEl.textContent = (data.dialect || 'SQLITE').toUpperCase();

        const storageEl = document.getElementById('admin-db-storage');
        if (storageEl) storageEl.textContent = data.storage || 'backend/data/learnme.sqlite';

        const sizeEl = document.getElementById('admin-db-size');
        if (sizeEl) sizeEl.textContent = data.fileSize || 'Connected';

        const statusBadge = document.getElementById('admin-db-status');
        if (statusBadge) {
            statusBadge.className = 'badge-status online';
            statusBadge.innerHTML = '<i class="fas fa-circle-check"></i> Connected';
        }

        // Quick Stats
        const counts = data.counts || {};
        const statUsers = document.getElementById('db-stat-users');
        if (statUsers) statUsers.textContent = counts.users ?? (data.users || []).length;
        const statCourses = document.getElementById('db-stat-courses');
        if (statCourses) statCourses.textContent = counts.courses ?? (data.courses || []).length;
        const statEnrollments = document.getElementById('db-stat-enrollments');
        if (statEnrollments) statEnrollments.textContent = counts.enrollments ?? (data.enrollments || []).length;
        const statCerts = document.getElementById('db-stat-certificates');
        if (statCerts) statCerts.textContent = counts.certificates ?? (data.certificates || []).length;
        const statPayments = document.getElementById('db-stat-payments');
        if (statPayments) statPayments.textContent = counts.payments ?? (data.payments || []).length;
        const statAudit = document.getElementById('db-stat-audit');
        if (statAudit) statAudit.textContent = counts.auditLogs ?? (data.auditLogs || []).length;

        // Tab count badges
        const tableKeys = ['users', 'courses', 'enrollments', 'certificates', 'payments', 'activities', 'auditLogs', 'categories'];
        tableKeys.forEach(key => {
            const badge = document.getElementById(`dbtab-count-${key}`);
            if (badge) {
                const count = (data[key] || []).length;
                badge.textContent = count;
            }
        });

        if (refreshBtn) refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
        renderCurrentDbTab();
        showToast('Live database records synced successfully', 'info');
    } catch (err) {
        console.error('Failed to load database explorer data:', err);
        const statusBadge = document.getElementById('admin-db-status');
        if (statusBadge) {
            statusBadge.className = 'badge-status error';
            statusBadge.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error';
        }
        showToast('Database connection failed', 'error');
        if (refreshBtn) refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Refresh Data';
    }
}

function switchDbTable(tabKey) {
    currentDbTab = tabKey;
    document.querySelectorAll('.db-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-dbtab') === tabKey);
    });
    const searchInput = document.getElementById('db-search-input');
    if (searchInput) searchInput.value = '';
    renderCurrentDbTab();
}

function renderCurrentDbTab() {
    const rows = adminDbData[currentDbTab] || [];
    currentDbFilteredRows = rows;
    renderDbTable(rows);
}

function handleDbSearch(term) {
    const q = (term || '').toLowerCase().trim();
    const rows = adminDbData[currentDbTab] || [];
    if (!q) {
        currentDbFilteredRows = rows;
    } else {
        currentDbFilteredRows = rows.filter(item => {
            return Object.values(item).some(v => String(v || '').toLowerCase().includes(q));
        });
    }
    renderDbTable(currentDbFilteredRows);
}

function renderDbTable(rows) {
    const thead = document.getElementById('admin-db-thead');
    const tbody = document.getElementById('admin-db-tbody');
    const counter = document.getElementById('db-row-counter');

    if (counter) counter.textContent = `Showing ${rows.length} records`;

    if (!thead || !tbody) return;

    if (rows.length === 0) {
        thead.innerHTML = '';
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="empty-state">
                    <i class="fas fa-folder-open"></i>
                    <p>No records found in table "${currentDbTab}".</p>
                </td>
            </tr>
        `;
        return;
    }

    if (currentDbTab === 'users') {
        thead.innerHTML = `<tr><th>ID / UUID</th><th>Full Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr>`;
        tbody.innerHTML = rows.map((u, i) => `
            <tr>
                <td><span class="id-pill">${u.id || u._id}</span></td>
                <td><strong>${u.name}</strong></td>
                <td>${u.email}</td>
                <td><span class="badge ${u.role === 'admin' ? 'badge-danger' : 'badge-primary'}">${(u.role || 'user').toUpperCase()}</span></td>
                <td><span class="badge ${u.isActive !== false ? 'badge-success' : 'badge-danger'}">${u.isActive !== false ? 'ACTIVE' : 'INACTIVE'}</span></td>
                <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="viewDbRow(${i})"><i class="fas fa-eye"></i> View</button>
                </td>
            </tr>
        `).join('');
    } else if (currentDbTab === 'courses') {
        thead.innerHTML = `<tr><th>Course ID</th><th>Title</th><th>Category</th><th>Difficulty</th><th>Price</th><th>Status</th><th>Actions</th></tr>`;
        tbody.innerHTML = rows.map((c, i) => `
            <tr>
                <td><span class="id-pill">${c.courseId}</span></td>
                <td><strong>${c.title}</strong></td>
                <td><span class="badge badge-primary">${c.category || 'General'}</span></td>
                <td>${c.difficulty || 'Beginner'}</td>
                <td><strong style="color:#34d399;">₹${c.certificatePrice || 10}</strong></td>
                <td><span class="badge ${c.status === 'published' ? 'badge-success' : 'badge-warning'}">${(c.status || 'published').toUpperCase()}</span></td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button class="btn btn-sm btn-outline" onclick="viewDbRow(${i})"><i class="fas fa-eye"></i></button>
                        <button class="btn btn-sm btn-secondary" onclick="editCourse('${c.courseId}'); switchNav('courses');" title="Edit Course"><i class="fas fa-edit"></i></button>
                    </div>
                </td>
            </tr>
        `).join('');
    } else if (currentDbTab === 'enrollments') {
        thead.innerHTML = `<tr><th>Enrollment ID</th><th>User ID</th><th>Course ID</th><th>Status</th><th>Date</th><th>Actions</th></tr>`;
        tbody.innerHTML = rows.map((e, i) => `
            <tr>
                <td><span class="id-pill">${e.id}</span></td>
                <td><span class="id-pill">${e.userId}</span></td>
                <td><strong>${(e.courseId || '').toUpperCase()}</strong></td>
                <td><span class="badge badge-primary">${(e.status || 'ACTIVE').toUpperCase()}</span></td>
                <td>${new Date(e.enrolledAt || e.createdAt).toLocaleDateString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="viewDbRow(${i})"><i class="fas fa-eye"></i> View</button>
                </td>
            </tr>
        `).join('');
    } else if (currentDbTab === 'certificates') {
        thead.innerHTML = `<tr><th>Certificate ID</th><th>Student Name</th><th>Course Name</th><th>Score</th><th>Status</th><th>Payment</th><th>Actions</th></tr>`;
        tbody.innerHTML = rows.map((c, i) => `
            <tr>
                <td><span class="id-pill" style="color:var(--accent); font-weight:700;">${c.certificateId}</span></td>
                <td><strong>${c.userName}</strong></td>
                <td>${c.courseName}</td>
                <td><strong style="color:#34d399;">${c.score}%</strong></td>
                <td><span class="badge ${c.status === 'valid' ? 'badge-success' : 'badge-danger'}">${(c.status || 'valid').toUpperCase()}</span></td>
                <td><span class="badge ${c.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}">${(c.paymentStatus || 'pending').toUpperCase()}</span></td>
                <td>
                    <div style="display:flex; gap:6px;">
                        <button class="btn btn-sm btn-outline" onclick="viewDbRow(${i})"><i class="fas fa-eye"></i></button>
                        <a class="btn btn-sm btn-secondary" href="verify.html?certificate=${encodeURIComponent(c.certificateId)}" target="_blank" title="Verify Certificate"><i class="fas fa-external-link-alt"></i></a>
                    </div>
                </td>
            </tr>
        `).join('');
    } else if (currentDbTab === 'payments') {
        thead.innerHTML = `<tr><th>Transaction ID</th><th>Student / Email</th><th>Course</th><th>Amount</th><th>Status</th><th>Method</th><th>Actions</th></tr>`;
        tbody.innerHTML = rows.map((p, i) => `
            <tr>
                <td><span class="id-pill">${p.transactionId}</span></td>
                <td><strong>${p.userName || 'Student'}</strong><br><small style="color:var(--text-muted);">${p.userEmail || ''}</small></td>
                <td>${p.courseTitle || p.courseId}</td>
                <td><strong style="color:#34d399; font-size:14px;">₹${p.amount}</strong></td>
                <td><span class="badge ${p.paymentStatus === 'PAID' ? 'badge-success' : (p.paymentStatus === 'FAILED' ? 'badge-danger' : 'badge-warning')}">${p.paymentStatus}</span></td>
                <td>${p.paymentMethod || 'UPI'}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="viewDbRow(${i})"><i class="fas fa-eye"></i> View</button>
                </td>
            </tr>
        `).join('');
    } else if (currentDbTab === 'activities') {
        thead.innerHTML = `<tr><th>Action</th><th>Details</th><th>User / Context</th><th>Timestamp</th><th>Actions</th></tr>`;
        tbody.innerHTML = rows.map((a, i) => `
            <tr>
                <td><span class="badge badge-primary">${a.action}</span></td>
                <td>${a.details || '-'}</td>
                <td><span class="id-pill">${a.userId || a.ipAddress || 'System'}</span></td>
                <td style="color:var(--text-muted); font-size:12px;">${new Date(a.createdAt).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="viewDbRow(${i})"><i class="fas fa-eye"></i> View</button>
                </td>
            </tr>
        `).join('');
    } else if (currentDbTab === 'auditLogs') {
        thead.innerHTML = `<tr><th>Action</th><th>Admin Email</th><th>Status</th><th>Details</th><th>Timestamp</th><th>Actions</th></tr>`;
        tbody.innerHTML = rows.map((l, i) => `
            <tr>
                <td><strong style="color:var(--accent);">${l.action}</strong></td>
                <td>${l.adminEmail}</td>
                <td><span class="badge ${l.status === 'SUCCESS' ? 'badge-success' : 'badge-danger'}">${l.status}</span></td>
                <td>${l.details || '-'}</td>
                <td style="color:var(--text-muted); font-size:12px;">${new Date(l.createdAt).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="viewDbRow(${i})"><i class="fas fa-eye"></i> View</button>
                </td>
            </tr>
        `).join('');
    } else if (currentDbTab === 'categories') {
        thead.innerHTML = `<tr><th>Category ID</th><th>Name</th><th>Description</th><th>Icon</th><th>Actions</th></tr>`;
        tbody.innerHTML = rows.map((cat, i) => `
            <tr>
                <td><span class="id-pill">${cat.categoryId}</span></td>
                <td><strong>${cat.name}</strong></td>
                <td>${cat.description || '-'}</td>
                <td><i class="fas ${cat.icon || 'fa-folder'}"></i> ${cat.icon}</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="viewDbRow(${i})"><i class="fas fa-eye"></i> View</button>
                </td>
            </tr>
        `).join('');
    }
}

function viewDbRow(index) {
    const row = currentDbFilteredRows[index];
    if (!row) return;
    currentInspectedRow = row;

    const modal = document.getElementById('db-row-modal');
    const body = document.getElementById('db-row-modal-body');

    body.innerHTML = `
        <div style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <span class="badge badge-primary">${currentDbTab.toUpperCase()} TABLE</span>
                <span class="id-pill" style="margin-left:8px;">Row #${index + 1}</span>
            </div>
            <small style="color:var(--text-muted);">Database: SQLite</small>
        </div>
        <pre class="json-viewer">${escapeHtml(JSON.stringify(row, null, 2))}</pre>
    `;

    modal.hidden = false;
}

function closeDbRowModal() {
    const modal = document.getElementById('db-row-modal');
    if (modal) modal.hidden = true;
}

function copyDbRowJson() {
    if (!currentInspectedRow) return;
    navigator.clipboard.writeText(JSON.stringify(currentInspectedRow, null, 2))
        .then(() => showToast('Record JSON copied to clipboard!', 'success'))
        .catch(() => showToast('Could not copy to clipboard', 'error'));
}

function exportCurrentDbTable() {
    const rows = adminDbData[currentDbTab] || [];
    if (rows.length === 0) {
        showToast('No records available to export', 'info');
        return;
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rows, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `learnme_${currentDbTab}_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showToast(`Exported ${rows.length} records from ${currentDbTab} table`, 'success');
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// ==========================================================================
// COURSE MANAGEMENT VIEW
// ==========================================================================

let cachedAdminCourses = [];

async function loadAdminCourses() {
    try {
        const response = await fetch(`${API_BASE}/admin/courses`, { headers: getAuthHeaders() });
        if (!response.ok) return;
        cachedAdminCourses = await response.json();
        renderAdminCoursesTable(cachedAdminCourses);
    } catch (error) {
        console.error('Failed to load courses:', error);
    }
}

function renderAdminCoursesTable(courses) {
    const tableContainer = document.getElementById('courses-table');
    if (courses.length === 0) {
        tableContainer.innerHTML = '<p class="empty-state">No courses found. Click "Add New Course" to create one.</p>';
        return;
    }

    tableContainer.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Course ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Difficulty</th>
                    <th>Duration</th>
                    <th>Cert Price</th>
                    <th>Pass Score</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${courses.map(c => `
                    <tr>
                        <td><code>${c.courseId}</code></td>
                        <td><strong>${c.title}</strong></td>
                        <td><span class="badge" style="background:#e0e7ff; color:#3730a3;">${c.category || 'Programming'}</span></td>
                        <td>${c.difficulty}</td>
                        <td>${c.duration}</td>
                        <td><strong style="color:#16a34a;">₹${c.certificatePrice || (c.category === 'Aptitude' || c.courseId.includes('aptitude') ? 100 : 10)}</strong></td>
                        <td>${c.passingScore || 70}%</td>
                        <td>
                            <span class="badge ${c.status === 'published' ? 'badge-success' : 'badge-warning'}">
                                ${c.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                        </td>
                        <td>
                            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                                <button class="btn btn-sm btn-primary" onclick="openCourseQuestionsModal('${c.courseId}')" title="Manage Questions">
                                    <i class="fas fa-question-circle"></i> Questions (${(c.questions || []).length})
                                </button>
                                <button class="btn btn-sm btn-secondary" onclick="editCourse('${c.courseId}')" title="Edit"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-sm ${c.status === 'published' ? 'btn-warning' : 'btn-success'}" onclick="toggleCourseStatus('${c.courseId}', '${c.status === 'published' ? 'draft' : 'published'}')" title="Toggle Status">
                                    <i class="fas ${c.status === 'published' ? 'fa-eye-slash' : 'fa-check'}"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteCourse('${c.courseId}')" title="Delete"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function editCourse(courseId) {
    const course = cachedAdminCourses.find(c => c.courseId === courseId);
    if (!course) return;

    const form = document.getElementById('course-form');
    document.getElementById('course-form-title').textContent = `Edit Course (${course.courseId})`;
    form.setAttribute('data-edit-id', course.courseId);

    document.getElementById('course-id').value = course.courseId;
    document.getElementById('course-id').disabled = true;
    document.getElementById('course-title').value = course.title;
    document.getElementById('course-subtitle').value = course.subtitle;
    document.getElementById('course-duration').value = course.duration;
    document.getElementById('course-difficulty').value = course.difficulty;
    document.getElementById('course-category').value = course.category || 'Programming';
    document.getElementById('course-cert-price').value = course.certificatePrice || (course.category === 'Aptitude' || course.courseId.includes('aptitude') ? 100 : 10);
    document.getElementById('course-passing-score').value = course.passingScore || 70;
    document.getElementById('course-status').value = course.status || 'published';

    const manageQBtn = document.getElementById('form-manage-questions-btn');
    const qCountSpan = document.getElementById('form-questions-count');
    if (manageQBtn) {
        manageQBtn.style.display = 'inline-flex';
        if (qCountSpan) qCountSpan.textContent = (course.questions || []).length;
    }

    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth' });
}

function openActiveCourseQuestions() {
    const form = document.getElementById('course-form');
    const editId = form.getAttribute('data-edit-id');
    if (editId) {
        openCourseQuestionsModal(editId);
    }
}

async function handleCourseSubmit(e) {
    e.preventDefault();
    const form = e.target;
    
    // Clear previous errors
    const errorEl = document.getElementById('course-error');
    if (errorEl) {
        errorEl.classList.remove('show');
        errorEl.textContent = '';
    }

    const editId = form.getAttribute('data-edit-id');
    const isEdit = Boolean(editId);

    const courseData = {
        courseId: document.getElementById('course-id').value.trim().toLowerCase(),
        title: document.getElementById('course-title').value.trim(),
        subtitle: document.getElementById('course-subtitle').value.trim(),
        duration: document.getElementById('course-duration').value.trim(),
        difficulty: document.getElementById('course-difficulty').value,
        category: document.getElementById('course-category').value.trim(),
        certificatePrice: Number(document.getElementById('course-cert-price').value),
        passingScore: Number(document.getElementById('course-passing-score').value),
        status: document.getElementById('course-status').value
    };

    const url = isEdit ? `${API_BASE}/admin/courses/${editId}` : `${API_BASE}/admin/courses`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(courseData)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Operation failed.');

        showToast(`Course ${isEdit ? 'updated' : 'created'} successfully!`, 'success');
        form.reset();
        document.getElementById('course-id').disabled = false;
        form.hidden = true;
        document.getElementById('course-error').classList.remove('show');
        loadAdminCourses();
    } catch (error) {
        const errEl = document.getElementById('course-error');
        errEl.textContent = error.message;
        errEl.classList.add('show');
    }
}

async function toggleCourseStatus(courseId, newStatus) {
    try {
        const response = await fetch(`${API_BASE}/admin/courses/${courseId}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error('Failed to change course status.');
        showToast(`Course status changed to ${newStatus}`, 'success');
        loadAdminCourses();
    } catch (error) {
        alert(error.message);
    }
}

async function deleteCourse(courseId) {
    if (!confirm(`Are you sure you want to delete course "${courseId}"? This action cannot be undone.`)) return;

    try {
        const response = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to delete course.');
        showToast('Course deleted successfully.', 'info');
        loadAdminCourses();
    } catch (error) {
        alert(error.message);
    }
}

// ==========================================================================
// COURSE QUESTIONS MANAGEMENT
// ==========================================================================

let activeQuestionCourseId = null;
let activeCourseQuestions = [];
let activeQuestionCourseTitle = '';

async function openCourseQuestionsModal(courseId) {
    activeQuestionCourseId = courseId;
    toggleAddQuestionForm(false);

    try {
        const response = await fetch(`${API_BASE}/admin/courses/${courseId}/questions`, {
            headers: getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch course questions.');
        const data = await response.json();

        activeCourseQuestions = Array.isArray(data.questions) ? data.questions : [];
        activeQuestionCourseTitle = data.title || courseId;

        document.getElementById('q-modal-course-name').textContent = activeQuestionCourseTitle;
        document.getElementById('q-modal-course-id').textContent = courseId;
        document.getElementById('q-modal-count-badge').textContent = `${activeCourseQuestions.length} Questions`;

        renderCourseQuestionsList();

        document.getElementById('course-questions-modal').hidden = false;
    } catch (error) {
        console.error('Error loading questions:', error);
        showToast(error.message, 'error');
    }
}

function closeCourseQuestionsModal() {
    document.getElementById('course-questions-modal').hidden = true;
    activeQuestionCourseId = null;
    activeCourseQuestions = [];
    loadAdminCourses(); // Refresh courses table to update question counts
}

function toggleAddQuestionForm(forceOpen) {
    const card = document.getElementById('question-editor-card');
    const form = document.getElementById('question-editor-form');
    if (!card) return;

    const shouldShow = (typeof forceOpen === 'boolean') ? forceOpen : (card.style.display === 'none');
    card.style.display = shouldShow ? 'block' : 'none';

    if (shouldShow) {
        form.reset();
        document.getElementById('q-editor-edit-index').value = '-1';
        document.getElementById('question-editor-title').innerHTML = '<i class="fas fa-plus-circle"></i> Add New Question';
        document.getElementById('q-editor-save-btn').innerHTML = '<i class="fas fa-plus"></i> Add Question to Course';
        document.getElementById('q-editor-text').focus();
    }
}

function renderCourseQuestionsList() {
    const list = document.getElementById('course-questions-list');
    document.getElementById('q-modal-count-badge').textContent = `${activeCourseQuestions.length} Questions`;

    const countSpan = document.getElementById('form-questions-count');
    if (countSpan) countSpan.textContent = activeCourseQuestions.length;

    if (!activeCourseQuestions || activeCourseQuestions.length === 0) {
        list.innerHTML = `
            <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
                <i class="fas fa-question-circle" style="font-size:36px; margin-bottom:10px; color:rgba(255,255,255,0.2);"></i>
                <p style="font-size:15px; margin-bottom:12px;">No quiz questions in this course yet.</p>
                <button class="btn btn-primary btn-sm" onclick="toggleAddQuestionForm(true)">
                    <i class="fas fa-plus"></i> Add the First Question
                </button>
            </div>
        `;
        return;
    }

    list.innerHTML = activeCourseQuestions.map((q, idx) => {
        const qText = q.q || q.question || `Question ${idx + 1}`;
        const options = Array.isArray(q.options) ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'];
        const correctIdx = typeof q.answer === 'number' ? q.answer : (typeof q.correctAnswer === 'number' ? q.correctAnswer : 0);

        return `
            <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:16px; transition:border-color 0.2s;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;">
                    <div style="display:flex; gap:10px; align-items:flex-start;">
                        <span style="display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:6px; background:rgba(56,189,248,0.15); color:var(--accent); font-weight:800; font-size:12px; flex-shrink:0;">
                            ${idx + 1}
                        </span>
                        <h4 style="margin:0; font-size:15px; color:var(--text-main); font-weight:600; line-height:1.4;">
                            ${escapeHtml(qText)}
                        </h4>
                    </div>
                    <div style="display:flex; gap:6px; flex-shrink:0;">
                        <button class="btn btn-sm btn-outline" onclick="editCourseQuestion(${idx})" title="Edit Question">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCourseQuestion(${idx})" title="Delete Question">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>

                <!-- Options Grid -->
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:8px; margin-bottom:10px;">
                    ${options.map((opt, oi) => {
                        const isCorrect = (oi === correctIdx);
                        const optLetter = ['A', 'B', 'C', 'D', 'E'][oi] || String(oi + 1);
                        return `
                            <div style="display:flex; align-items:center; gap:8px; padding:8px 12px; border-radius:6px; font-size:13px; border:1px solid ${isCorrect ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.06)'}; background:${isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.02)'}; color:${isCorrect ? '#4ade80' : 'var(--text-muted)'};">
                                <span style="font-weight:700; font-size:11px; padding:2px 6px; border-radius:4px; background:${isCorrect ? '#22c55e' : 'rgba(255,255,255,0.1)'}; color:${isCorrect ? '#fff' : 'inherit'};">
                                    ${optLetter}
                                </span>
                                <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(opt)}</span>
                                ${isCorrect ? '<i class="fas fa-check-circle" style="margin-left:auto; font-size:12px;"></i>' : ''}
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Explanation -->
                ${q.explanation ? `
                    <div style="font-size:12px; color:var(--text-muted); background:rgba(255,255,255,0.02); padding:6px 10px; border-radius:6px; border-left:3px solid var(--accent); display:flex; align-items:center; gap:6px;">
                        <i class="fas fa-lightbulb" style="color:var(--accent);"></i>
                        <span><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</span>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function editCourseQuestion(index) {
    const q = activeCourseQuestions[index];
    if (!q) return;

    toggleAddQuestionForm(true);

    document.getElementById('q-editor-edit-index').value = index;
    document.getElementById('question-editor-title').innerHTML = `<i class="fas fa-edit"></i> Edit Question #${index + 1}`;
    document.getElementById('q-editor-save-btn').innerHTML = '<i class="fas fa-save"></i> Update Question';

    document.getElementById('q-editor-text').value = q.q || q.question || '';

    const options = Array.isArray(q.options) ? q.options : [];
    document.getElementById('q-editor-opt-0').value = options[0] || '';
    document.getElementById('q-editor-opt-1').value = options[1] || '';
    document.getElementById('q-editor-opt-2').value = options[2] || '';
    document.getElementById('q-editor-opt-3').value = options[3] || '';

    const correctIdx = typeof q.answer === 'number' ? q.answer : (typeof q.correctAnswer === 'number' ? q.correctAnswer : 0);
    document.getElementById('q-editor-correct').value = String(correctIdx);

    document.getElementById('q-editor-explanation').value = q.explanation || '';
    document.getElementById('question-editor-card').scrollIntoView({ behavior: 'smooth' });
}

async function handleSaveCourseQuestion(event) {
    event.preventDefault();
    if (!activeQuestionCourseId) return;

    const editIndex = parseInt(document.getElementById('q-editor-edit-index').value, 10);
    const isEdit = (editIndex >= 0);

    const qText = document.getElementById('q-editor-text').value.trim();
    const opt0 = document.getElementById('q-editor-opt-0').value.trim();
    const opt1 = document.getElementById('q-editor-opt-1').value.trim();
    const opt2 = document.getElementById('q-editor-opt-2').value.trim();
    const opt3 = document.getElementById('q-editor-opt-3').value.trim();
    const correctIdx = parseInt(document.getElementById('q-editor-correct').value, 10);
    const explanation = document.getElementById('q-editor-explanation').value.trim();

    if (!qText) return alert('Please enter question text.');
    if (!opt0 || !opt1) return alert('At least Option A and Option B are required.');

    const options = [opt0, opt1];
    if (opt2) options.push(opt2);
    if (opt3) options.push(opt3);

    const questionPayload = {
        q: qText,
        question: qText,
        options: options,
        answer: correctIdx,
        correctAnswer: correctIdx,
        explanation: explanation || `The correct answer is "${options[correctIdx]}".`
    };

    const url = isEdit
        ? `${API_BASE}/admin/courses/${activeQuestionCourseId}/questions/${editIndex}`
        : `${API_BASE}/admin/courses/${activeQuestionCourseId}/questions`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(questionPayload)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to save question.');

        showToast(isEdit ? 'Question updated successfully!' : 'New question added to course!', 'success');

        if (isEdit) {
            activeCourseQuestions[editIndex] = data.question || questionPayload;
        } else {
            activeCourseQuestions.push(data.question || questionPayload);
        }

        renderCourseQuestionsList();
        toggleAddQuestionForm(false);
    } catch (error) {
        console.error('Error saving question:', error);
        alert(error.message);
    }
}

async function deleteCourseQuestion(index) {
    if (!activeQuestionCourseId) return;
    if (!confirm(`Are you sure you want to delete Question #${index + 1}?`)) return;

    try {
        const response = await fetch(`${API_BASE}/admin/courses/${activeQuestionCourseId}/questions/${index}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to delete question.');

        showToast('Question removed from course.', 'info');
        activeCourseQuestions.splice(index, 1);
        renderCourseQuestionsList();
    } catch (error) {
        console.error('Error deleting question:', error);
        alert(error.message);
    }
}

// ==========================================================================
// CATEGORIES VIEW
// ==========================================================================

let cachedAdminCategories = [];

async function loadAdminCategories() {
    try {
        const response = await fetch(`${API_BASE}/admin/categories`, { headers: getAuthHeaders() });
        if (!response.ok) return;
        cachedAdminCategories = await response.json();
        renderAdminCategories(cachedAdminCategories);
    } catch (error) {
        console.error('Failed to load categories:', error);
    }
}

function renderAdminCategories(categories) {
    const container = document.getElementById('categories-container');
    if (!container) return;

    if (categories.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <p>No learning categories created yet. Click "Add Category" to get started.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="categories-grid">
            ${categories.map(cat => `
                <div class="category-card">
                    <div class="category-card-top">
                        <div class="cat-icon-box">
                            <i class="fas ${cat.icon || 'fa-folder'}"></i>
                        </div>
                        <div style="flex:1; min-width:0;">
                            <h3 style="font-size:15px; font-weight:800; color:#fff; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${cat.name}</h3>
                            <span class="id-pill" style="margin-top:4px;">${cat.categoryId}</span>
                        </div>
                    </div>
                    <p style="font-size:12.5px; color:var(--text-muted); min-height:36px; line-height:1.4;">${cat.description || 'No description provided.'}</p>
                    <div class="category-card-actions">
                        <button class="btn btn-sm btn-secondary" onclick="openCategoryModal('${cat.categoryId}')" title="Edit Category" style="flex:1;">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCategory('${cat.categoryId}')" title="Delete Category">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function openCategoryModal(catId = null) {
    const modal = document.getElementById('category-modal');
    const titleEl = document.getElementById('category-modal-title');
    const saveBtn = document.getElementById('save-cat-btn');
    const editIdInput = document.getElementById('category-edit-id');
    const nameInput = document.getElementById('cat-name');
    const slugInput = document.getElementById('cat-id');
    const descInput = document.getElementById('cat-desc');
    const iconInput = document.getElementById('cat-icon');

    if (catId) {
        const cat = cachedAdminCategories.find(c => c.categoryId === catId);
        if (!cat) return;
        editIdInput.value = cat.categoryId;
        nameInput.value = cat.name;
        slugInput.value = cat.categoryId;
        slugInput.disabled = true;
        descInput.value = cat.description || '';
        iconInput.value = cat.icon || 'fa-folder';
        titleEl.innerHTML = `<i class="fas fa-folder-open"></i> Edit Category (${cat.name})`;
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Update Category';
    } else {
        editIdInput.value = '';
        nameInput.value = '';
        slugInput.value = '';
        slugInput.disabled = false;
        descInput.value = '';
        iconInput.value = 'fa-folder';
        titleEl.innerHTML = `<i class="fas fa-folder-plus"></i> Add New Category`;
        saveBtn.innerHTML = '<i class="fas fa-plus"></i> Create Category';
    }

    updateCatIconPreview(iconInput.value);
    modal.hidden = false;
}

function closeCategoryModal() {
    const modal = document.getElementById('category-modal');
    if (modal) modal.hidden = true;
}

function autoGenerateCategorySlug(name) {
    const editId = document.getElementById('category-edit-id').value;
    if (!editId) {
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        document.getElementById('cat-id').value = slug;
    }
}

function updateCatIconPreview(icon) {
    const preview = document.getElementById('cat-icon-preview');
    if (preview) {
        const cleanIcon = (icon || 'fa-folder').trim();
        preview.innerHTML = `<i class="fas ${cleanIcon}"></i>`;
    }
}

async function handleCategoryFormSubmit(e) {
    e.preventDefault();
    const editId = document.getElementById('category-edit-id').value;
    const name = document.getElementById('cat-name').value.trim();
    const categoryId = document.getElementById('cat-id').value.trim().toLowerCase();
    const description = document.getElementById('cat-desc').value.trim();
    const icon = document.getElementById('cat-icon').value.trim() || 'fa-folder';

    const url = editId ? `${API_BASE}/admin/categories/${editId}` : `${API_BASE}/admin/categories`;
    const method = editId ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify({ categoryId, name, description, icon })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Operation failed');

        closeCategoryModal();
        showToast(`Category "${name}" ${editId ? 'updated' : 'created'} successfully!`, 'success');
        loadAdminCategories();
    } catch (err) {
        alert(err.message);
    }
}

async function deleteCategory(catId) {
    if (!confirm(`Are you sure you want to delete category "${catId}"? Courses in this category will keep their tags.`)) return;

    try {
        const res = await fetch(`${API_BASE}/admin/categories/${catId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Delete failed');

        showToast(`Category ${catId} deleted`, 'info');
        loadAdminCategories();
    } catch (err) {
        alert(err.message);
    }
}

// ==========================================================================
// USER MANAGEMENT VIEW
// ==========================================================================

let cachedAdminUsers = [];

async function loadAdminUsers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`, { headers: getAuthHeaders() });
        if (!response.ok) return;
        cachedAdminUsers = await response.json();
        renderAdminUsersTable(cachedAdminUsers);
    } catch (error) {
        console.error('Failed to load users:', error);
    }
}

function renderAdminUsersTable(users) {
    const tableContainer = document.getElementById('users-table');
    if (users.length === 0) {
        tableContainer.innerHTML = '<p class="empty-state">No student accounts registered yet.</p>';
        return;
    }

    tableContainer.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Joined Date</th>
                    <th>Progress / Stats</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(u => `
                    <tr>
                        <td><strong>${u.name}</strong></td>
                        <td>${u.email}</td>
                        <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                            <small>
                                🎓 ${u.stats?.enrollments || 0} Enrolled ·
                                ✓ ${u.stats?.completed || 0} Completed ·
                                📜 ${u.stats?.certificates || 0} Certs
                            </small>
                        </td>
                        <td>
                            <span class="badge ${u.isActive !== false ? 'badge-success' : 'badge-danger'}">
                                ${u.isActive !== false ? 'Active' : 'Deactivated'}
                            </span>
                        </td>
                        <td>
                            <div style="display:flex; gap:6px;">
                                <button class="btn btn-sm btn-primary" onclick="viewUserDetails('${u.id || u._id}')" title="View Full Activity & Details"><i class="fas fa-eye"></i> Details</button>
                                <button class="btn btn-sm ${u.isActive !== false ? 'btn-warning' : 'btn-success'}" onclick="toggleUserStatus('${u.id || u._id}', ${u.isActive === false})" title="Toggle Active Status">
                                    <i class="fas ${u.isActive !== false ? 'fa-user-slash' : 'fa-user-check'}"></i>
                                </button>
                                <button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id || u._id}')" title="Delete User"><i class="fas fa-trash"></i></button>
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterUsersTable(searchTerm) {
    const term = searchTerm.toLowerCase();
    const filtered = cachedAdminUsers.filter(u =>
        u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)
    );
    renderAdminUsersTable(filtered);
}

async function viewUserDetails(userId) {
    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}`, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error('Failed to fetch user details.');
        const data = await response.json();
        const { user, progress, quizAttempts, certificates, payments, activities } = data;

        const bodyEl = document.getElementById('user-modal-body');
        bodyEl.innerHTML = `
            <div style="margin-bottom:20px; border-bottom:1px solid #e2e8f0; padding-bottom:14px;">
                <h3 style="font-size:22px; color:#1e293b;">${user.name}</h3>
                <p style="color:#64748b; margin:4px 0;">Email: <strong>${user.email}</strong> | Role: ${user.role} | Status: <span style="color:${user.isActive ? '#16a34a' : '#dc2626'}">${user.isActive ? 'Active' : 'Deactivated'}</span></p>
                <small style="color:#94a3b8;">Joined: ${new Date(user.createdAt).toLocaleString()} | Last Login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A'}</small>
            </div>

            <div style="margin-bottom:20px;">
                <h4 style="font-size:16px; color:#2563eb; margin-bottom:10px;"><i class="fas fa-chart-line"></i> Course Progress (${progress.length})</h4>
                ${progress.length === 0 ? '<p style="color:#94a3b8;">No course progress yet.</p>' : `
                    <div style="display:grid; gap:8px;">
                        ${progress.map(p => `
                            <div style="background:#f8fafc; padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                                <span><strong>${p.courseId.toUpperCase()}</strong> - ${p.status}</span>
                                <span>Score: ${p.quizScore ?? 'N/A'}% ${p.quizPassed ? '✓ Passed' : ''}</span>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>

            <div style="margin-bottom:20px;">
                <h4 style="font-size:16px; color:#16a34a; margin-bottom:10px;"><i class="fas fa-certificate"></i> Certificates Earned (${certificates.length})</h4>
                ${certificates.length === 0 ? '<p style="color:#94a3b8;">No certificates issued.</p>' : `
                    <div style="display:grid; gap:8px;">
                        ${certificates.map(c => `
                            <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                                <div><strong>${c.courseName}</strong> (${c.certificateId})</div>
                                <div>Status: <span style="font-weight:bold; color:${c.status === 'valid' ? '#16a34a' : '#dc2626'}">${c.status.toUpperCase()}</span> | Payment: ${c.paymentStatus.toUpperCase()}</div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>

            <div style="margin-bottom:20px;">
                <h4 style="font-size:16px; color:#8b5cf6; margin-bottom:10px;"><i class="fas fa-credit-card"></i> Payments (${payments.length})</h4>
                ${payments.length === 0 ? '<p style="color:#94a3b8;">No payments recorded.</p>' : `
                    <div style="display:grid; gap:8px;">
                        ${payments.map(pay => `
                            <div style="background:#f3e8ff; padding:10px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                                <div><strong>Txn:</strong> ${pay.transactionId} (${pay.courseTitle})</div>
                                <div>₹${pay.amount} | Status: <strong>${pay.paymentStatus}</strong></div>
                            </div>
                        `).join('')}
                    </div>
                `}
            </div>
        `;

        document.getElementById('user-details-modal').hidden = false;
    } catch (error) {
        alert(error.message);
    }
}

function closeUserModal() {
    document.getElementById('user-details-modal').hidden = true;
}

async function toggleUserStatus(userId, newActiveState) {
    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({ isActive: newActiveState })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Operation failed.');
        alert(data.message);
        loadAdminUsers();
    } catch (error) {
        alert(error.message);
    }
}

async function deleteUser(userId) {
    if (!confirm('Are you sure you want to permanently delete this user account? All associated progress and certificates will be removed.')) return;

    try {
        const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Deletion failed.');
        alert('User deleted.');
        loadAdminUsers();
    } catch (error) {
        alert(error.message);
    }
}

// ==========================================================================
// CERTIFICATE MANAGEMENT VIEW
// ==========================================================================

let cachedAdminCerts = [];

async function loadAdminCertificates() {
    try {
        const response = await fetch(`${API_BASE}/admin/certificates`, { headers: getAuthHeaders() });
        if (!response.ok) return;
        cachedAdminCerts = await response.json();
        renderAdminCertificatesTable(cachedAdminCerts);
    } catch (error) {
        console.error('Failed to load certificates:', error);
    }
}

function renderAdminCertificatesTable(certificates) {
    const tableContainer = document.getElementById('certificates-table');
    if (certificates.length === 0) {
        tableContainer.innerHTML = '<p class="empty-state">No certificates generated yet.</p>';
        return;
    }

    tableContainer.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Certificate ID</th>
                    <th>Student Name</th>
                    <th>Course Name</th>
                    <th>Score</th>
                    <th>Issued Date</th>
                    <th>Payment Status</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${certificates.map(c => `
                    <tr>
                        <td><code>${c.certificateId}</code></td>
                        <td><strong>${c.userName}</strong></td>
                        <td>${c.courseName}</td>
                        <td>${c.score}%</td>
                        <td>${new Date(c.issuedAt || c.completionDate).toLocaleDateString()}</td>
                        <td>
                            <span class="badge ${c.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}">
                                ${c.paymentStatus.toUpperCase()}
                            </span>
                        </td>
                        <td>
                            <span class="badge ${c.status === 'valid' ? 'badge-success' : 'badge-danger'}">
                                ${c.status.toUpperCase()}
                            </span>
                        </td>
                        <td>
                            <div style="display:flex; gap:6px;">
                                <a class="btn btn-sm btn-secondary" href="verify.html?certificate=${encodeURIComponent(c.certificateId)}" target="_blank" title="Verify Link"><i class="fas fa-external-link-alt"></i> Verify</a>
                                ${c.status === 'valid'
                                    ? `<button class="btn btn-sm btn-danger" onclick="revokeCertificate('${c.certificateId}')" title="Revoke Certificate"><i class="fas fa-ban"></i> Revoke</button>`
                                    : `<button class="btn btn-sm btn-success" onclick="restoreCertificate('${c.certificateId}')" title="Restore Certificate"><i class="fas fa-undo"></i> Restore</button>`
                                }
                            </div>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function filterCertificatesTable(term) {
    const query = term.toLowerCase();
    const filtered = cachedAdminCerts.filter(c =>
        c.certificateId.toLowerCase().includes(query) ||
        c.userName.toLowerCase().includes(query) ||
        c.courseName.toLowerCase().includes(query)
    );
    renderAdminCertificatesTable(filtered);
}

async function revokeCertificate(certId) {
    if (!confirm(`Are you sure you want to REVOKE certificate ${certId}? Public verification will mark this certificate as INVALID.`)) return;

    try {
        const response = await fetch(`${API_BASE}/admin/certificates/${certId}/revoke`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to revoke certificate.');
        alert(`Certificate ${certId} revoked.`);
        loadAdminCertificates();
    } catch (error) {
        alert(error.message);
    }
}

async function restoreCertificate(certId) {
    try {
        const response = await fetch(`${API_BASE}/admin/certificates/${certId}/restore`, {
            method: 'PATCH',
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to restore certificate.');
        alert(`Certificate ${certId} restored to valid status.`);
        loadAdminCertificates();
    } catch (error) {
        alert(error.message);
    }
}

// ==========================================================================
// PAYMENT MANAGEMENT VIEW
// ==========================================================================

async function loadAdminPayments() {
    try {
        const response = await fetch(`${API_BASE}/admin/payments`, { headers: getAuthHeaders() });
        if (!response.ok) return;
        const payments = await response.json();
        const filter = document.getElementById('payment-status-filter')?.value;
        const filtered = filter ? payments.filter(p => p.paymentStatus === filter) : payments;

        const tb = document.getElementById('payments-table-body');
        if (filtered.length === 0) {
            tb.innerHTML = '<tr><td colspan="8" style="text-align:center;">No payment records match this filter.</td></tr>';
            return;
        }

        tb.innerHTML = filtered.map(p => `
            <tr>
                <td><code>${p.transactionId}</code></td>
                <td><strong>${p.userName}</strong><br><small style="color:#64748b;">${p.userEmail}</small></td>
                <td>${p.courseTitle}</td>
                <td><strong style="color:#16a34a; font-size:16px;">₹${p.amount}</strong></td>
                <td>
                    <span class="badge ${p.paymentStatus === 'PAID' ? 'badge-success' : p.paymentStatus === 'FAILED' ? 'badge-danger' : 'badge-warning'}">
                        ${p.paymentStatus}
                    </span>
                </td>
                <td>${p.paymentMethod}</td>
                <td><span class="badge ${p.purpose === 'COURSE_ACCESS' ? 'badge-warning' : 'badge-primary'}">${p.purpose || 'CERTIFICATE'}</span></td>
                <td>${new Date(p.createdAt).toLocaleDateString()}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Failed to load payments:', error);
    }
}

// ==========================================================================
// USER ACTIVITY & AUDIT LOGS
// ==========================================================================

async function loadAdminActivity() {
    try {
        const response = await fetch(`${API_BASE}/admin/activity`, { headers: getAuthHeaders() });
        if (!response.ok) return;
        const activities = await response.json();
        const container = document.getElementById('activity-list');

        if (activities.length === 0) {
            container.innerHTML = '<p class="empty-state">No student activity logged.</p>';
            return;
        }

        container.innerHTML = activities.map(act => `
            <div style="padding:14px; border-bottom:1px solid #e2e8f0; font-size:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="color:#2563eb;">${act.action}</strong>
                    <small style="color:#94a3b8;">${new Date(act.createdAt).toLocaleString()}</small>
                </div>
                <div>User: <strong>${act.userId?.name || 'Student'}</strong> (${act.userId?.email || 'N/A'})</div>
                <div style="color:#475569; margin-top:2px;">${act.details}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load activity:', error);
    }
}

async function loadAdminAuditLog() {
    try {
        const response = await fetch(`${API_BASE}/admin/audit-log`, { headers: getAuthHeaders() });
        if (!response.ok) return;
        const logs = await response.json();
        const container = document.getElementById('audit-log-list');

        if (logs.length === 0) {
            container.innerHTML = '<p class="empty-state">No admin audit logs available.</p>';
            return;
        }

        container.innerHTML = logs.map(l => `
            <div style="padding:14px; border-bottom:1px solid #e2e8f0; font-size:14px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                    <strong style="color:${l.status === 'SUCCESS' ? '#16a34a' : '#dc2626'};">${l.action}</strong>
                    <small style="color:#94a3b8;">${new Date(l.createdAt).toLocaleString()}</small>
                </div>
                <div>Admin: <strong>${l.adminEmail}</strong> | IP: ${l.ipAddress || '127.0.0.1'}</div>
                <div style="color:#475569; margin-top:2px;">${l.details}</div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load audit logs:', error);
    }
}

// ==========================================================================
// SETTINGS VIEW
// ==========================================================================

async function loadAdminSettings() {
    try {
        const response = await fetch(`${API_BASE}/admin/settings`, { headers: getAuthHeaders() });
        if (!response.ok) return;
        const settings = await response.json();

        document.getElementById('settings-site-name').value = settings.siteName || 'Learn Me Platform';
        document.getElementById('settings-upi').value = settings.upiId || 'sumathiaz550@upi';
        document.getElementById('settings-normal-price').value = settings.normalCertificatePrice ?? 10;
        document.getElementById('settings-aptitude-price').value = settings.aptitudeCertificatePrice ?? 100;
        document.getElementById('settings-instructions').value = settings.paymentInstructions || '';
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
}

async function handleSettingsSubmit(e) {
    e.preventDefault();
    const settingsData = {
        siteName: document.getElementById('settings-site-name').value.trim(),
        upiId: document.getElementById('settings-upi').value.trim(),
        normalCertificatePrice: Number(document.getElementById('settings-normal-price').value),
        aptitudeCertificatePrice: Number(document.getElementById('settings-aptitude-price').value),
        paymentInstructions: document.getElementById('settings-instructions').value.trim()
    };

    try {
        const response = await fetch(`${API_BASE}/admin/settings`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(settingsData)
        });

        if (!response.ok) throw new Error('Failed to update settings.');
        showToast('Platform pricing & settings updated successfully!', 'success');
        loadAdminSettings();
    } catch (error) {
        alert(error.message);
    }
}

// ==========================================================================
// PROFILE VIEW
// ==========================================================================

async function handleProfileSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('profile-name').value.trim();
    if (!name) return;

    try {
        const response = await fetch(`${API_BASE}/auth/me`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ name })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update profile');

        if (currentAdmin) currentAdmin.name = name;
        updateAdminHeader(currentAdmin);
        showToast('Profile information updated successfully!', 'success');
    } catch (error) {
        alert(error.message);
    }
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

function showToast(message, type = 'info') {
    const container = document.getElementById('admin-toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : (type === 'error' ? 'fa-circle-exclamation' : 'fa-info-circle');
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
