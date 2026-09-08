-- Learn Me relational database schema
-- Tested for MySQL 8.0+. Run this file before starting the API.

CREATE DATABASE IF NOT EXISTS learnme
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE learnme;

CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) NOT NULL PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login DATETIME NULL,
    last_logout DATETIME NULL,
    last_seen DATETIME NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
    id CHAR(36) NOT NULL PRIMARY KEY,
    category_id VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    icon VARCHAR(255) NOT NULL DEFAULT 'fa-folder',
    `order` INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS courses (
    id CHAR(36) NOT NULL PRIMARY KEY,
    course_id VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    subtitle VARCHAR(500) NOT NULL,
    icon VARCHAR(255) NOT NULL DEFAULT 'fa-book',
    icon_type ENUM('fas', 'fab') NOT NULL DEFAULT 'fas',
    duration VARCHAR(40) NOT NULL,
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced') NOT NULL,
    category VARCHAR(255) NOT NULL DEFAULT 'Programming',
    instructor VARCHAR(120) NOT NULL DEFAULT 'Learn Me Team',
    modules JSON NOT NULL,
    lessons JSON NOT NULL,
    questions JSON NOT NULL,
    questions_url VARCHAR(500) NULL,
    passing_score INT NOT NULL DEFAULT 70,
    certificate_price DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    has_final_assessment BOOLEAN NOT NULL DEFAULT TRUE,
    status ENUM('draft', 'published') NOT NULL DEFAULT 'published',
    `order` INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_courses_status_order (status, `order`),
    INDEX idx_courses_category (category)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lessons (
    id CHAR(36) NOT NULL PRIMARY KEY,
    course_id VARCHAR(100) NOT NULL,
    lesson_id VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NULL,
    video_url VARCHAR(500) NULL,
    duration VARCHAR(40) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_lessons_course_lesson (course_id, lesson_id),
    CONSTRAINT fk_lessons_course FOREIGN KEY (course_id) REFERENCES courses (course_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS questions (
    id CHAR(36) NOT NULL PRIMARY KEY,
    course_id VARCHAR(100) NOT NULL,
    q TEXT NOT NULL,
    options JSON NOT NULL,
    answer INT NOT NULL,
    explanation TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_questions_course FOREIGN KEY (course_id) REFERENCES courses (course_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS enrollments (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    course_id VARCHAR(100) NOT NULL,
    enrolled_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'completed', 'dropped') NOT NULL DEFAULT 'active',
    completed_at DATETIME NULL,
    UNIQUE KEY uq_enrollments_user_course (user_id, course_id),
    CONSTRAINT fk_enrollments_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_enrollments_course FOREIGN KEY (course_id) REFERENCES courses (course_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS progress (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    course_id VARCHAR(100) NOT NULL,
    completed_lessons INT NOT NULL DEFAULT 0,
    total_lessons INT NOT NULL DEFAULT 0,
    percentage DECIMAL(5, 2) NOT NULL DEFAULT 0,
    status ENUM('Not Started', 'In Progress', 'Completed') NOT NULL DEFAULT 'Not Started',
    quiz_score DECIMAL(5, 2) NULL,
    quiz_passed BOOLEAN NOT NULL DEFAULT FALSE,
    eligible_for_certificate BOOLEAN NOT NULL DEFAULT FALSE,
    course_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
    last_accessed DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_progress_user_course (user_id, course_id),
    CONSTRAINT fk_progress_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_progress_course FOREIGN KEY (course_id) REFERENCES courses (course_id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    course_id VARCHAR(100) NOT NULL,
    attempt_number INT NOT NULL DEFAULT 1,
    answers JSON NULL,
    score DECIMAL(7, 2) NOT NULL,
    total_questions INT NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    passed BOOLEAN NOT NULL,
    time_taken_seconds INT NOT NULL DEFAULT 0,
    started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_quiz_attempts_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_quiz_attempts_course FOREIGN KEY (course_id) REFERENCES courses (course_id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX idx_quiz_attempts_user_course (user_id, course_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS certificates (
    id CHAR(36) NOT NULL PRIMARY KEY,
    certificate_id VARCHAR(100) NOT NULL UNIQUE,
    user_id CHAR(36) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    course_id VARCHAR(100) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    score DECIMAL(7, 2) NOT NULL,
    percentage DECIMAL(5, 2) NOT NULL,
    completion_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verification_code VARCHAR(255) NOT NULL UNIQUE,
    status ENUM('valid', 'revoked') NOT NULL DEFAULT 'valid',
    payment_status ENUM('pending', 'paid') NOT NULL DEFAULT 'pending',
    download_count INT NOT NULL DEFAULT 0,
    issued_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_certificates_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_certificates_course FOREIGN KEY (course_id) REFERENCES courses (course_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_certificates_user (user_id),
    INDEX idx_certificates_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS certificate_payments (
    id CHAR(36) NOT NULL PRIMARY KEY,
    transaction_id VARCHAR(255) NOT NULL UNIQUE,
    user_id CHAR(36) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    certificate_id VARCHAR(100) NOT NULL,
    course_id VARCHAR(100) NOT NULL,
    course_title VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(255) NOT NULL DEFAULT 'General',
    payment_method ENUM('UPI_GATEWAY', 'UPI_QR_MANUAL') NOT NULL DEFAULT 'UPI_GATEWAY',
    purpose ENUM('CERTIFICATE', 'COURSE_ACCESS') NOT NULL DEFAULT 'CERTIFICATE',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    utr_number VARCHAR(255) NULL,
    payment_proof_url VARCHAR(500) NULL,
    verified_by_admin BOOLEAN NOT NULL DEFAULT FALSE,
    verified_at DATETIME NULL,
    admin_notes TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_payments_certificate FOREIGN KEY (certificate_id) REFERENCES certificates (certificate_id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    INDEX idx_payments_status (payment_status),
    INDEX idx_payments_user (user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS activities (
    id CHAR(36) NOT NULL PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    action ENUM('REGISTRATION', 'LOGIN', 'LOGOUT', 'COURSE_OPENED',
        'LESSON_OPENED', 'LESSON_COMPLETED', 'COURSE_ENROLLED', 'COURSE_COMPLETED',
        'QUIZ_STARTED', 'QUIZ_SUBMITTED',
        'ASSESSMENT_COMPLETED',
        'QUIZ_PASSED', 'QUIZ_FAILED', 'CERTIFICATE_ELIGIBLE', 'PAYMENT_INITIATED',
        'PAYMENT_SUCCESSFUL', 'CERTIFICATE_DOWNLOADED', 'CERTIFICATE_VERIFIED') NOT NULL,
    details VARCHAR(500) NULL,
    ip_address VARCHAR(64) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_activities_user FOREIGN KEY (user_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE CASCADE,
    INDEX idx_activities_user_created (user_id, created_at),
    INDEX idx_activities_action_created (action, created_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admin_audit_logs (
    id CHAR(36) NOT NULL PRIMARY KEY,
    admin_id CHAR(36) NULL,
    admin_email VARCHAR(255) NOT NULL,
    action ENUM('ADMIN_LOGIN', 'ADMIN_LOGOUT', 'COURSE_CREATED', 'COURSE_UPDATED',
        'COURSE_DELETED', 'CATEGORY_CREATED', 'CATEGORY_UPDATED', 'CATEGORY_DELETED',
        'USER_VIEWED', 'USER_DEACTIVATED', 'USER_REACTIVATED', 'USER_DELETED',
        'CERTIFICATE_REVOKED', 'CERTIFICATE_RESTORED', 'CERTIFICATE_VERIFIED',
        'PAYMENT_VERIFIED', 'PAYMENT_REJECTED', 'SETTINGS_UPDATED',
        'ADMIN_PROFILE_VIEWED') NOT NULL,
    resource_type VARCHAR(100) NULL,
    resource_id VARCHAR(255) NULL,
    resource_name VARCHAR(255) NULL,
    details VARCHAR(500) NULL,
    ip_address VARCHAR(64) NULL,
    user_agent VARCHAR(500) NULL,
    status ENUM('SUCCESS', 'FAILURE') NOT NULL DEFAULT 'SUCCESS',
    error_message VARCHAR(500) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES users (id)
        ON UPDATE CASCADE ON DELETE SET NULL,
    INDEX idx_audit_created (created_at),
    INDEX idx_audit_action (action)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS admin_settings (
    id CHAR(36) NOT NULL PRIMARY KEY,
    site_name VARCHAR(255) NOT NULL DEFAULT 'Learn Me Platform',
    normal_certificate_price DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    aptitude_certificate_price DECIMAL(10, 2) NOT NULL DEFAULT 100.00,
    upi_id VARCHAR(255) NOT NULL DEFAULT 'sumathiaz550@upi',
    qr_image_url VARCHAR(500) NOT NULL DEFAULT '',
    payment_instructions TEXT NULL,
    contact_email VARCHAR(255) NOT NULL DEFAULT 'sumathiaz550@gmail.com',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;
