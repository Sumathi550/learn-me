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
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'learn_me_super_secret_jwt_key_2026_production_grade');
        } catch (jwtErr) {
            if (process.env.SUPABASE_JWT_SECRET) {
                try {
                    decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
                } catch (e) {}
            }
            if (!decoded) {
                const unverified = jwt.decode(token);
                if (unverified && (unverified.iss?.includes('supabase') || unverified.role === 'authenticated')) {
                    const now = Math.floor(Date.now() / 1000);
                    if (unverified.exp && unverified.exp < now) {
                        return res.status(401).json({
                            success: false,
                            message: 'Session expired or invalid token.'
                        });
                    }
                    decoded = {
                        id: unverified.sub || unverified.id,
                        email: unverified.email,
                        user_metadata: unverified.user_metadata,
                        role: unverified.user_metadata?.role || (unverified.email === AUTHORIZED_ADMIN_EMAIL ? 'admin' : 'user')
                    };
                } else {
                    throw jwtErr;
                }
            }
        }

        const userId = decoded.id || decoded.sub;
        let user = await User.findById(userId);
        if (!user && decoded.email) {
            user = await User.findOne({ email: decoded.email });
        }

        // Auto-provision user profile if authenticated via Supabase
        if (!user && decoded.email && userId) {
            const userName = decoded.user_metadata?.name || decoded.user_metadata?.full_name || decoded.email.split('@')[0];
            const userRole = (decoded.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) ? 'admin' : 'user';
            user = await User.create({
                id: userId,
                email: decoded.email,
                name: userName,
                role: userRole,
                isActive: true
            });
        }

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
