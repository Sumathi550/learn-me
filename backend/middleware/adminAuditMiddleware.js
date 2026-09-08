const { AdminAuditLog } = require('../models');

function logAdminAuditAction(action, getResourceDetailsFn = () => ({})) {
    return async (req, res, next) => {
        const originalSend = res.send;
        let responseBody;

        res.send = function (data) {
            responseBody = data;
            return originalSend.apply(res, arguments);
        };

        res.on('finish', async () => {
            if (!req.user || req.user.role !== 'admin') return;

            try {
                const isSuccess = res.statusCode >= 200 && res.statusCode < 400;
                let parsedBody = {};
                try {
                    parsedBody = typeof responseBody === 'string' ? JSON.parse(responseBody) : (responseBody || {});
                } catch (e) { }

                const dynamicDetails = getResourceDetailsFn(req, parsedBody) || {};

                await AdminAuditLog.create({
                    adminId: req.user._id,
                    adminEmail: req.user.email,
                    action,
                    resourceType: dynamicDetails.resourceType || 'SYSTEM',
                    resourceId: dynamicDetails.resourceId || req.params.id || req.params.courseId || req.params.userId || '',
                    resourceName: dynamicDetails.resourceName || '',
                    details: dynamicDetails.details || `${req.method} ${req.originalUrl}`,
                    ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1',
                    userAgent: req.headers['user-agent'] || 'Unknown',
                    status: isSuccess ? 'SUCCESS' : 'FAILURE',
                    errorMessage: isSuccess ? undefined : (parsedBody.message || `HTTP ${res.statusCode}`)
                });
            } catch (err) {
                console.error('Failed to record AdminAuditLog:', err.message);
            }
        });

        next();
    };
}

module.exports = { logAdminAuditAction };
