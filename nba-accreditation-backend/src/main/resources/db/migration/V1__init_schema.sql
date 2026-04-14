-- ============================================================
-- NBA Accreditation System - MySQL Database Schema
-- Generated from existing frontend data models
-- ============================================================

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS compliance_rows;
DROP TABLE IF EXISTS sfr_program_rows;
DROP TABLE IF EXISTS sfr_data;
DROP TABLE IF EXISTS faculty_cadre_rows;
DROP TABLE IF EXISTS faculty_rows;
DROP TABLE IF EXISTS program_details;
DROP TABLE IF EXISTS allied_departments;
DROP TABLE IF EXISTS programs_for_accreditation;
DROP TABLE IF EXISTS programs_offered;
DROP TABLE IF EXISTS pre_qualifiers;
DROP TABLE IF EXISTS sub_section_data;
DROP TABLE IF EXISTS section_data;
DROP TABLE IF EXISTS criteria;
DROP TABLE IF EXISTS sar_applications;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS template_files;
DROP TABLE IF EXISTS email_notifications;
DROP TABLE IF EXISTS institutions;
DROP TABLE IF EXISTS users;

-- ============================================================
-- 1. USERS TABLE
-- ============================================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- BCrypt hashed
    role ENUM('ADMIN', 'INSTITUTE') NOT NULL DEFAULT 'INSTITUTE',
    institution_id BIGINT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_institution (institution_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 2. INSTITUTIONS TABLE
-- ============================================================
CREATE TABLE institutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    established_year INT,
    accreditation_status ENUM('PENDING', 'ACCREDITED', 'NOT_ACCREDITED') NOT NULL DEFAULT 'PENDING',
    website VARCHAR(500),
    city VARCHAR(200),
    state VARCHAR(200),
    pin_code VARCHAR(20),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_institutions_status (accreditation_status),
    INDEX idx_institutions_name (name(100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key for users -> institutions
ALTER TABLE users ADD CONSTRAINT fk_users_institution
    FOREIGN KEY (institution_id) REFERENCES institutions(id) ON DELETE SET NULL;

-- ============================================================
-- 3. PRE-QUALIFIERS TABLE
-- ============================================================
CREATE TABLE pre_qualifiers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT NOT NULL,
    status ENUM('DRAFT', 'IN_PROGRESS', 'SUBMITTED') NOT NULL DEFAULT 'DRAFT',
    completion_percentage INT NOT NULL DEFAULT 0,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP NULL,

    -- Part A - Institute Profile
    program_applied_for VARCHAR(500),
    institute_name VARCHAR(500),
    year_of_establishment VARCHAR(10),
    location VARCHAR(500),
    city VARCHAR(200),
    state VARCHAR(200),
    pin_code VARCHAR(20),
    website VARCHAR(500),
    email VARCHAR(255),
    phone VARCHAR(50),

    -- Head of Institution
    head_name VARCHAR(300),
    head_designation VARCHAR(200),
    head_appointment_status VARCHAR(200),
    head_mobile VARCHAR(50),
    head_telephone VARCHAR(50),
    head_email VARCHAR(255),

    -- University Details
    university_name VARCHAR(500),
    university_city VARCHAR(200),
    university_state VARCHAR(200),
    university_pin_code VARCHAR(20),

    -- Institution Type & Ownership
    institution_type VARCHAR(200),
    institution_type_other VARCHAR(500),
    ownership_status VARCHAR(200),
    ownership_status_other VARCHAR(500),

    -- Programs Count
    num_ug_programs VARCHAR(10),
    num_pg_programs VARCHAR(10),

    -- Part B - Faculty Department Info
    faculty_department_name VARCHAR(500),
    num_allied_departments VARCHAR(10),
    num_ug_engg_programs VARCHAR(10),
    num_pg_engg_programs VARCHAR(10),

    -- HOD Details
    hod_name VARCHAR(300),
    hod_appointment VARCHAR(200),
    hod_qualification VARCHAR(200),
    hod_qualification_other VARCHAR(500),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_pq_institution FOREIGN KEY (institution_id)
        REFERENCES institutions(id) ON DELETE CASCADE,
    INDEX idx_pq_institution (institution_id),
    INDEX idx_pq_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 4. PROGRAMS OFFERED (Pre-Qualifier A8)
-- ============================================================
CREATE TABLE programs_offered (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pre_qualifier_id BIGINT NOT NULL,
    level VARCHAR(50),
    name VARCHAR(500),
    year_of_start VARCHAR(10),
    year_of_close VARCHAR(10),
    department VARCHAR(500),
    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_po_prequalifier FOREIGN KEY (pre_qualifier_id)
        REFERENCES pre_qualifiers(id) ON DELETE CASCADE,
    INDEX idx_po_pq (pre_qualifier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 5. PROGRAMS FOR ACCREDITATION (Pre-Qualifier A9)
-- ============================================================
CREATE TABLE programs_for_accreditation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pre_qualifier_id BIGINT NOT NULL,
    department VARCHAR(500),
    program VARCHAR(500),
    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_pfa_prequalifier FOREIGN KEY (pre_qualifier_id)
        REFERENCES pre_qualifiers(id) ON DELETE CASCADE,
    INDEX idx_pfa_pq (pre_qualifier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 6. ALLIED DEPARTMENTS (Pre-Qualifier A9)
-- ============================================================
CREATE TABLE allied_departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pre_qualifier_id BIGINT NOT NULL,
    department VARCHAR(500),
    allied_department VARCHAR(500),
    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_ad_prequalifier FOREIGN KEY (pre_qualifier_id)
        REFERENCES pre_qualifiers(id) ON DELETE CASCADE,
    INDEX idx_ad_pq (pre_qualifier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 7. PROGRAM DETAILS (Pre-Qualifier Part B)
-- ============================================================
CREATE TABLE program_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pre_qualifier_id BIGINT NOT NULL,
    program_name VARCHAR(500),
    year_of_start VARCHAR(10),
    sanctioned_intake VARCHAR(20),
    intake_change VARCHAR(200),
    year_of_change VARCHAR(10),
    aicte_approval VARCHAR(200),
    accreditation_status VARCHAR(200),
    times_accredited VARCHAR(20),
    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_pd_prequalifier FOREIGN KEY (pre_qualifier_id)
        REFERENCES pre_qualifiers(id) ON DELETE CASCADE,
    INDEX idx_pd_pq (pre_qualifier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 8. FACULTY ROWS (Pre-Qualifier B2)
-- ============================================================
CREATE TABLE faculty_rows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pre_qualifier_id BIGINT NOT NULL,
    name VARCHAR(300),
    pan_no VARCHAR(20),
    apaar_id VARCHAR(50),
    highest_degree VARCHAR(100),
    university VARCHAR(500),
    specialization VARCHAR(500),
    date_of_joining DATE,
    designation_at_joining VARCHAR(200),
    date_of_joining_dept DATE,
    present_designation VARCHAR(200),
    date_designated DATE,
    association_nature VARCHAR(200),
    contract_type VARCHAR(200),
    currently_associated VARCHAR(10),
    date_of_leaving DATE,
    experience VARCHAR(100),
    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_fr_prequalifier FOREIGN KEY (pre_qualifier_id)
        REFERENCES pre_qualifiers(id) ON DELETE CASCADE,
    INDEX idx_fr_pq (pre_qualifier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 9. FACULTY CADRE ROWS (Pre-Qualifier B2.1)
-- ============================================================
CREATE TABLE faculty_cadre_rows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pre_qualifier_id BIGINT NOT NULL,
    designation VARCHAR(500),
    cay_regular VARCHAR(20),
    cay_contract VARCHAR(20),
    caym1_regular VARCHAR(20),
    caym1_contract VARCHAR(20),
    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_fcr_prequalifier FOREIGN KEY (pre_qualifier_id)
        REFERENCES pre_qualifiers(id) ON DELETE CASCADE,
    INDEX idx_fcr_pq (pre_qualifier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. SFR DATA (Pre-Qualifier B3)
-- ============================================================
CREATE TABLE sfr_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pre_qualifier_id BIGINT NOT NULL UNIQUE,

    -- Department Summary fields
    cay_ds VARCHAR(20),
    caym1_ds VARCHAR(20),
    caym2_ds VARCHAR(20),
    cay_as VARCHAR(20),
    caym1_as VARCHAR(20),
    caym2_as VARCHAR(20),
    cay_df VARCHAR(20),
    caym1_df VARCHAR(20),
    caym2_df VARCHAR(20),
    cay_af VARCHAR(20),
    caym1_af VARCHAR(20),
    caym2_af VARCHAR(20),
    cay_ff VARCHAR(20),
    caym1_ff VARCHAR(20),
    caym2_ff VARCHAR(20),

    CONSTRAINT fk_sfr_prequalifier FOREIGN KEY (pre_qualifier_id)
        REFERENCES pre_qualifiers(id) ON DELETE CASCADE,
    INDEX idx_sfr_pq (pre_qualifier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. SFR PROGRAM ROWS (Pre-Qualifier B3 sub-rows)
-- ============================================================
CREATE TABLE sfr_program_rows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sfr_data_id BIGINT NOT NULL,
    program_type ENUM('UG', 'PG') NOT NULL,
    program_name VARCHAR(500),
    cay_b VARCHAR(20),
    cay_c VARCHAR(20),
    cay_d VARCHAR(20),
    caym1_b VARCHAR(20),
    caym1_c VARCHAR(20),
    caym1_d VARCHAR(20),
    caym2_b VARCHAR(20),
    caym2_c VARCHAR(20),
    caym2_d VARCHAR(20),
    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_spr_sfr FOREIGN KEY (sfr_data_id)
        REFERENCES sfr_data(id) ON DELETE CASCADE,
    INDEX idx_spr_sfr (sfr_data_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. COMPLIANCE ROWS (Pre-Qualifier)
-- ============================================================
CREATE TABLE compliance_rows (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pre_qualifier_id BIGINT NOT NULL,
    qualifier TEXT NOT NULL,
    current_status VARCHAR(500),
    compliance_status VARCHAR(200),
    sort_order INT NOT NULL DEFAULT 0,

    CONSTRAINT fk_cr_prequalifier FOREIGN KEY (pre_qualifier_id)
        REFERENCES pre_qualifiers(id) ON DELETE CASCADE,
    INDEX idx_cr_pq (pre_qualifier_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. SAR APPLICATIONS TABLE
-- ============================================================
CREATE TABLE sar_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    application_id VARCHAR(100) NOT NULL UNIQUE,
    institution_id BIGINT NOT NULL,
    department_name VARCHAR(500) NOT NULL,
    application_start_date TIMESTAMP,
    application_end_date TIMESTAMP,
    status ENUM('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')
        NOT NULL DEFAULT 'DRAFT',
    completion_percentage INT NOT NULL DEFAULT 0,
    overall_marks DECIMAL(10,2) NOT NULL DEFAULT 0,
    max_overall_marks DECIMAL(10,2) NOT NULL DEFAULT 0,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP NULL,
    reviewed_at TIMESTAMP NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_sar_institution FOREIGN KEY (institution_id)
        REFERENCES institutions(id) ON DELETE CASCADE,
    INDEX idx_sar_institution (institution_id),
    INDEX idx_sar_status (status),
    INDEX idx_sar_app_id (application_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. CRITERIA TABLE
-- ============================================================
CREATE TABLE criteria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sar_application_id BIGINT NOT NULL,
    criteria_number INT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    max_marks DECIMAL(10,2) NOT NULL DEFAULT 0,
    completed_sections INT NOT NULL DEFAULT 0,
    total_marks DECIMAL(10,2) NOT NULL DEFAULT 0,
    obtained_marks DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT fk_criteria_sar FOREIGN KEY (sar_application_id)
        REFERENCES sar_applications(id) ON DELETE CASCADE,
    INDEX idx_criteria_sar (sar_application_id),
    UNIQUE KEY uk_criteria_sar_num (sar_application_id, criteria_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. SECTION DATA TABLE
-- ============================================================
CREATE TABLE section_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    criteria_id BIGINT NOT NULL,
    section_number VARCHAR(20) NOT NULL,
    title VARCHAR(500) NOT NULL,
    max_marks DECIMAL(10,2) NOT NULL DEFAULT 0,
    institute_marks DECIMAL(10,2) NOT NULL DEFAULT 0,
    content LONGTEXT,  -- Rich text content (HTML)
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_section_criteria FOREIGN KEY (criteria_id)
        REFERENCES criteria(id) ON DELETE CASCADE,
    INDEX idx_section_criteria (criteria_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. SUB-SECTION DATA TABLE
-- ============================================================
CREATE TABLE sub_section_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    section_id BIGINT NOT NULL,
    sub_section_number VARCHAR(20) NOT NULL,
    title VARCHAR(500) NOT NULL,
    max_marks DECIMAL(10,2) NOT NULL DEFAULT 0,
    institute_marks DECIMAL(10,2) NOT NULL DEFAULT 0,
    content LONGTEXT,  -- Rich text content (HTML)
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_subsection_section FOREIGN KEY (section_id)
        REFERENCES section_data(id) ON DELETE CASCADE,
    INDEX idx_subsection_section (section_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. ATTACHMENTS TABLE (for sections & sub-sections)
-- ============================================================
CREATE TABLE attachments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    entity_type ENUM('SECTION', 'SUB_SECTION') NOT NULL,
    entity_id BIGINT NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_path VARCHAR(1000) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_attachments_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. APPLICATIONS TABLE (General)
-- ============================================================
CREATE TABLE applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    institution_id BIGINT NOT NULL,
    type ENUM('INITIAL', 'RENEWAL') NOT NULL DEFAULT 'INITIAL',
    status ENUM('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')
        NOT NULL DEFAULT 'DRAFT',
    submitted_at TIMESTAMP NULL,
    reviewed_at TIMESTAMP NULL,
    approved_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_app_institution FOREIGN KEY (institution_id)
        REFERENCES institutions(id) ON DELETE CASCADE,
    INDEX idx_app_institution (institution_id),
    INDEX idx_app_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 19. TEMPLATE FILES TABLE
-- ============================================================
CREATE TABLE template_files (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(500) NOT NULL,
    file_name VARCHAR(500) NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    file_path VARCHAR(1000) NOT NULL,  -- stored on server filesystem or S3
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uploaded_by BIGINT NOT NULL,

    CONSTRAINT fk_template_user FOREIGN KEY (uploaded_by)
        REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_template_uploaded_by (uploaded_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 20. EMAIL NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE email_notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(300),
    subject VARCHAR(500) NOT NULL,
    body TEXT NOT NULL,
    notification_type ENUM(
        'REGISTRATION',
        'PASSWORD_RESET',
        'PQ_SUBMITTED',
        'PQ_APPROVED',
        'PQ_REJECTED',
        'SAR_SUBMITTED',
        'SAR_APPROVED',
        'SAR_REJECTED',
        'SAR_REVIEW_REMINDER',
        'APPLICATION_STATUS_CHANGE',
        'TEMPLATE_UPLOADED',
        'GENERAL'
    ) NOT NULL,
    status ENUM('PENDING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
    retry_count INT NOT NULL DEFAULT 0,
    max_retries INT NOT NULL DEFAULT 3,
    error_message TEXT,
    related_entity_type VARCHAR(100),  -- e.g., 'PRE_QUALIFIER', 'SAR_APPLICATION'
    related_entity_id BIGINT,
    sent_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_email_status (status),
    INDEX idx_email_type (notification_type),
    INDEX idx_email_recipient (recipient_email),
    INDEX idx_email_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 21. AUDIT LOG TABLE (for tracking changes)
-- ============================================================
CREATE TABLE audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_entity (entity_type, entity_id),
    INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED DATA - Default Admin User
-- ============================================================
INSERT INTO institutions (id, name, address, contact_email, contact_phone, established_year, accreditation_status, city, state)
VALUES
    (1, 'RGUKT Basar', 'Basar, Nirmal District, Telangana', 'admin@rguktbasar.ac.in', '+91-8734-123456', 2008, 'PENDING', 'Basar', 'Telangana'),
    (2, 'VIT University', 'Vellore, Tamil Nadu', 'admin@vit.ac.in', '+91-416-220-2020', 1984, 'ACCREDITED', 'Vellore', 'Tamil Nadu'),
    (3, 'IIT Hyderabad', 'Kandi, Sangareddy, Telangana', 'admin@iith.ac.in', '+91-40-2301-6000', 2008, 'ACCREDITED', 'Sangareddy', 'Telangana');

-- Password: admin123 (BCrypt hash placeholder - replace with actual hash in production)
INSERT INTO users (id, email, password, role, institution_id, first_name, last_name, is_active, email_verified)
VALUES
    (1, 'admin@compliedu.com', '$2a$10$PLACEHOLDER_HASH_admin123', 'ADMIN', NULL, 'System', 'Admin', TRUE, TRUE),
    (2, 'rgukt@example.com', '$2a$10$PLACEHOLDER_HASH_admin123', 'INSTITUTE', 1, 'RGUKT', 'Admin', TRUE, TRUE),
    (3, 'vit@example.com', '$2a$10$PLACEHOLDER_HASH_vit123', 'INSTITUTE', 2, 'VIT', 'Admin', TRUE, TRUE),
    (4, 'iit@example.com', '$2a$10$PLACEHOLDER_HASH_iit123', 'INSTITUTE', 3, 'IIT', 'Admin', TRUE, TRUE);