/**
 * Learn Me - Role-Based Access Control (RBAC) Middleware
 * Enforces role verification on protected routes.
 */

function requireRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please sign in.'
            });
        }

        const userRole = (req.user.role || '').toLowerCase().trim();
        const normalizedAllowed = allowedRoles.map(r => r.toLowerCase().trim());

        if (!normalizedAllowed.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}]. Your role is '${userRole}'.`
            });
        }

        next();
    };
}

module.exports = {
    requireRole
};
