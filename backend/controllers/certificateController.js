/**
 * Learn Me - Certificate Controller
 */
const certificateService = require('../services/certificateService');
const { sendSuccess, sendError } = require('../utils/response');

async function generate(req, res) {
    try {
        const { courseId } = req.body;
        if (!courseId) {
            return sendError(res, 'courseId is required.', 400);
        }

        const cert = await certificateService.generateCertificate(
            req.user,
            courseId,
            req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        );

        return sendSuccess(res, cert, 'Certificate generated successfully');
    } catch (err) {
        return sendError(res, err.message, err.statusCode || 500, {
            reasons: err.reasons || undefined,
            metrics: err.metrics || undefined
        });
    }
}

async function getMyCertificates(req, res) {
    try {
        const certificates = await certificateService.getMyCertificates(req.user._id);
        return sendSuccess(res, certificates, 'User certificates retrieved');
    } catch (err) {
        return sendError(res, 'Failed to fetch certificates.', 500, { error: err.message });
    }
}

async function download(req, res) {
    try {
        const result = await certificateService.downloadCertificate(
            req.user,
            req.params.certificateId,
            req.ip || req.headers['x-forwarded-for'] || '127.0.0.1'
        );

        return sendSuccess(res, result, 'Download authorized');
    } catch (err) {
        return sendError(res, err.message, err.statusCode || 500);
    }
}

async function verify(req, res) {
    try {
        const result = await certificateService.verifyCertificate(req.params.certificateId);
        return sendSuccess(res, result, 'Certificate verified');
    } catch (err) {
        return sendError(res, err.message, err.statusCode || 500, {
            valid: err.valid !== undefined ? err.valid : false,
            isValid: err.isValid !== undefined ? err.isValid : false,
            status: err.status || 'invalid'
        });
    }
}

module.exports = {
    generate,
    getMyCertificates,
    download,
    verify
};
