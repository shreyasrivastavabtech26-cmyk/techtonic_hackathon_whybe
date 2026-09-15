-- ==========================================================
-- ERP-Based Student Management System
-- PostgreSQL Database Schema
-- Modules: Auth & Roles, Student Management, Attendance, Fee
-- ==========================================================

-- Clean up previous tables if rebuilding
DROP VIEW IF EXISTS view_student_attendance_summary;
DROP TABLE IF EXISTS fees;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

-- 1. USERS & ROLES TABLE
-- Roles: 'admin', 'faculty', 'student'
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'faculty', 'student')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. STUDENTS TABLE (Linked to users)
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    roll_number VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 12),
    contact_email VARCHAR(100),
    phone VARCHAR(25),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. COURSES TABLE
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(120) NOT NULL,
    department VARCHAR(100) NOT NULL,
    credits INT NOT NULL DEFAULT 3
);

-- 4. ATTENDANCE MODULE TABLE
-- Records daily/session-wise attendance for students
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_code VARCHAR(20) NOT NULL,
    session_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late')),
    marked_by INT REFERENCES users(id),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_session UNIQUE (student_id, course_code, session_date)
);

-- 5. FEE MODULE TABLE
-- Records total fee, paid amount, and auto-computed remaining fee balance
CREATE TABLE fees (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL DEFAULT '2024-2025',
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (paid_amount >= 0),
    remaining_amount NUMERIC(10, 2) GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'due' CHECK (status IN ('paid', 'partial', 'due')),
    last_payment_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. INDEXES FOR HIGH-PERFORMANCE QUERYING
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_students_roll ON students(roll_number);
CREATE INDEX idx_students_dept ON students(department);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(session_date);
CREATE INDEX idx_fees_student ON fees(student_id);
CREATE INDEX idx_fees_status ON fees(status);
CREATE INDEX idx_fees_due_date ON fees(due_date);

-- 7. ATTENDANCE SUMMARY VIEW (Auto calculates percentage & 75% threshold warning)
CREATE OR REPLACE VIEW view_student_attendance_summary AS
SELECT 
    s.id AS student_id,
    s.roll_number,
    s.first_name || ' ' || s.last_name AS student_name,
    COUNT(a.id) AS total_sessions,
    COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS attended_sessions,
    COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent_sessions,
    COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS late_sessions,
    ROUND(
        CASE 
            WHEN COUNT(a.id) = 0 THEN 0.00 
            ELSE (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::NUMERIC / COUNT(a.id)::NUMERIC) * 100 
        END, 
        2
    ) AS attendance_percentage,
    CASE 
        WHEN COUNT(a.id) > 0 AND (COUNT(CASE WHEN a.status = 'present' THEN 1 END)::NUMERIC / COUNT(a.id)::NUMERIC) * 100 < 75.00 THEN TRUE
        ELSE FALSE
    END AS warning_below_75
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
GROUP BY s.id, s.roll_number, s.first_name, s.last_name;
