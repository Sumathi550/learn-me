/**
 * Learn Me - Status Constants
 */
const COURSE_STATUS = {
    DRAFT: 'draft',
    PUBLISHED: 'published'
};

const CERTIFICATE_STATUS = {
    VALID: 'valid',
    REVOKED: 'revoked'
};

const ENROLLMENT_STATUS = {
    ACTIVE: 'active',
    COMPLETED: 'completed'
};

const PROGRESS_STATUS = {
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed'
};

const DEFAULT_PASSING_SCORE = 70; // 70% threshold

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COURSE_STATUS,
        CERTIFICATE_STATUS,
        ENROLLMENT_STATUS,
        PROGRESS_STATUS,
        DEFAULT_PASSING_SCORE
    };
}
