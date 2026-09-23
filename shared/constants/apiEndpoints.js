/**
 * Learn Me - Canonical REST API Endpoints
 */
const API_ENDPOINTS = {
    // Health & System
    HEALTH: '/api/health',

    // Authentication
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        ME: '/api/auth/me',
        LOGOUT: '/api/auth/logout',
        UPDATE_PROFILE: '/api/auth/update-profile',
        CHANGE_PASSWORD: '/api/auth/change-password'
    },

    // Student Course Catalog & Content
    COURSES: {
        LIST: '/api/courses',
        SEARCH: '/api/courses/search',
        DETAILS: (courseId) => `/api/courses/${courseId}`,
        CATEGORIES: '/api/courses/categories',
        QUIZ_QUESTIONS: (courseId) => `/api/courses/${courseId}/quiz`
    },

    // Quiz Engine
    QUIZ: {
        QUESTIONS: (courseId) => `/api/quiz/questions/${courseId}`,
        SUBMIT: '/api/quiz/submit'
    },

    // Progress Tracking
    PROGRESS: {
        LIST: '/api/progress',
        GET_COURSE: (courseId) => `/api/progress/${courseId}`,
        UPDATE_LESSON: (courseId) => `/api/progress/${courseId}/lesson`,
        UPDATE_MODULE: (courseId) => `/api/progress/${courseId}/module`
    },

    // Certificates
    CERTIFICATES: {
        GENERATE: '/api/certificates/generate',
        MY_CERTIFICATES: '/api/certificates/my-certificates',
        DOWNLOAD: (certificateId) => `/api/certificates/download/${certificateId}`,
        VERIFY: (certificateId) => `/api/certificates/verify/${certificateId}`
    },

    // Enrollments
    ENROLLMENTS: {
        LIST: '/api/enrollments',
        ENROLL: '/api/enrollments'
    },

    // Admin APIs (Protected by requireAuth + requireRole('admin'))
    ADMIN: {
        DASHBOARD: '/api/admin/dashboard',
        SYSTEM_HEALTH: '/api/admin/system-health',
        USERS: {
            LIST: '/api/admin/users',
            GET: (userId) => `/api/admin/users/${userId}`,
            TOGGLE_STATUS: (userId) => `/api/admin/users/${userId}/status`,
            DELETE: (userId) => `/api/admin/users/${userId}`
        },
        COURSES: {
            LIST: '/api/admin/courses',
            GET: (courseId) => `/api/admin/courses/${courseId}`,
            CREATE: '/api/admin/courses',
            UPDATE: (courseId) => `/api/admin/courses/${courseId}`,
            DELETE: (courseId) => `/api/admin/courses/${courseId}`,
            TOGGLE_STATUS: (courseId) => `/api/admin/courses/${courseId}/status`,
            QUESTIONS: {
                LIST: (courseId) => `/api/admin/courses/${courseId}/questions`,
                ADD: (courseId) => `/api/admin/courses/${courseId}/questions`,
                UPDATE: (courseId, index) => `/api/admin/courses/${courseId}/questions/${index}`,
                DELETE: (courseId, index) => `/api/admin/courses/${courseId}/questions/${index}`
            }
        },
        CERTIFICATES: {
            LIST: '/api/admin/certificates',
            REVOKE: (certificateId) => `/api/admin/certificates/${certificateId}/revoke`,
            RESTORE: (certificateId) => `/api/admin/certificates/${certificateId}/restore`
        },
        ANALYTICS: '/api/admin/analytics',
        ACTIVITY: '/api/admin/activity',
        AUDIT_LOG: '/api/admin/audit-log',
        SETTINGS: '/api/admin/settings'
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_ENDPOINTS };
}
