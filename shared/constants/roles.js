/**
 * Learn Me - User Roles Constants
 */
const ROLES = {
    STUDENT: 'user', // Default role in database for student learners
    ADMIN: 'admin'   // Administrative role with elevated management privileges
};

const ROLE_PERMISSIONS = {
    [ROLES.STUDENT]: [
        'courses:read',
        'quiz:submit',
        'progress:read',
        'progress:write',
        'certificates:read',
        'certificates:generate',
        'certificates:download'
    ],
    [ROLES.ADMIN]: [
        'courses:*',
        'quiz:*',
        'users:*',
        'progress:*',
        'certificates:*',
        'analytics:*',
        'settings:*',
        'audit:*'
    ]
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ROLES, ROLE_PERMISSIONS };
}
