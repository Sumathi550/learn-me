const jwt = require('jsonwebtoken');
const { User } = require('../models');

const AUTHORIZED_ADMIN_EMAIL = 'sumathiaz550@gmail.com';

async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Missing token.'
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'learn_me_super_secret_jwt_key_2026_production_grade');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid session or user no longer exists.'
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Session expired or invalid token.'
        });
    }
}

function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.'
        });
    }

    const userRole = (req.user.role || '').toLowerCase().trim();

    if (userRole !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Administrator privileges required to access this resource.'
        });
    }

    next();
}

module.exports = {
    requireAuth,
    requireAdmin,
    AUTHORIZED_ADMIN_EMAIL
};
