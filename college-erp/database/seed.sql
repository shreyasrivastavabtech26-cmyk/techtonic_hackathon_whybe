-- ==========================================================
-- ERP-Based Student Management System
-- PostgreSQL Seed Data
-- ==========================================================

-- 1. Insert Initial Users
-- Password for all accounts in demo: 'password123'
-- ($2a$10$wNqVn5ZqXh5Qe1yC9Q8D4eGz8pX3uX9K6q2G1L7r5s4v3w2x1y0z is sample bcrypt hash)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@university.edu', '$2a$10$76gL4yQ3K0Xy0K.QW75UfePqN1V9xZqA3lJ9c2W3e4r5t6y7u8i9o', 'admin'),
('prof_alan', 'alan.turing@university.edu', '$2a$10$76gL4yQ3K0Xy0K.QW75UfePqN1V9xZqA3lJ9c2W3e4r5t6y7u8i9o', 'faculty'),
('prof_clara', 'clara.barton@university.edu', '$2a$10$76gL4yQ3K0Xy0K.QW75UfePqN1V9xZqA3lJ9c2W3e4r5t6y7u8i9o', 'faculty'),
('stu_alex', 'alex.johnson@student.edu', '$2a$10$76gL4yQ3K0Xy0K.QW75UfePqN1V9xZqA3lJ9c2W3e4r5t6y7u8i9o', 'student'),
('stu_sophia', 'sophia.martinez@student.edu', '$2a$10$76gL4yQ3K0Xy0K.QW75UfePqN1V9xZqA3lJ9c2W3e4r5t6y7u8i9o', 'student'),
('stu_david', 'david.lee@student.edu', '$2a$10$76gL4yQ3K0Xy0K.QW75UfePqN1V9xZqA3lJ9c2W3e4r5t6y7u8i9o', 'student');

-- 2. Insert Student Profiles
INSERT INTO students (user_id, roll_number, first_name, last_name, department, semester, contact_email, phone) VALUES
(4, 'STU-2024-0041', 'Alex', 'Johnson', 'Computer Science & Engineering', 3, 'alex.johnson@student.edu', '+1 (555) 234-5678'),
(5, 'STU-2024-0042', 'Sophia', 'Martinez', 'Electrical & Robotics Engineering', 3, 'sophia.martinez@student.edu', '+1 (555) 876-5432'),
(6, 'STU-2024-0043', 'David', 'Lee', 'Data Science & Artificial Intelligence', 2, 'david.lee@student.edu', '+1 (555) 345-6789');

-- 3. Insert Courses
INSERT INTO courses (course_code, course_name, department, credits) VALUES
('CS-301', 'Data Structures & Algorithms', 'Computer Science', 4),
('CS-302', 'Database Management Systems', 'Computer Science', 4),
('CS-303', 'Operating Systems & Architecture', 'Computer Science', 3),
('MATH-201', 'Discrete Mathematics & Logic', 'Mathematics', 3);

-- 4. Insert Attendance Records
-- Alex Johnson (id: 1) has 7 present out of 11 sessions = 63.6% (Triggers < 75% Warning!)
INSERT INTO attendance (student_id, course_code, session_date, status, marked_by, remarks) VALUES
(1, 'CS-301', '2024-11-01', 'present', 2, 'Regular session'),
(1, 'CS-301', '2024-11-03', 'present', 2, 'Regular session'),
(1, 'CS-301', '2024-11-05', 'absent', 2, 'Unexcused medical absence'),
(1, 'CS-301', '2024-11-08', 'absent', 2, 'Late arrival after 15 mins'),
(1, 'CS-301', '2024-11-10', 'present', 2, 'Regular session'),
(1, 'CS-302', '2024-11-02', 'present', 2, 'Lab practical session'),
(1, 'CS-302', '2024-11-04', 'absent', 2, 'Did not submit pre-lab'),
(1, 'CS-302', '2024-11-09', 'absent', 2, 'Absent'),
(1, 'CS-302', '2024-11-11', 'present', 2, 'Regular session'),
(1, 'MATH-201', '2024-11-06', 'present', 3, 'Regular session'),
(1, 'MATH-201', '2024-11-12', 'present', 3, 'Regular session');

-- Sophia Martinez (id: 2) has 9 present out of 10 sessions = 90.0% (Good Standing)
INSERT INTO attendance (student_id, course_code, session_date, status, marked_by, remarks) VALUES
(2, 'CS-301', '2024-11-01', 'present', 2, 'Regular session'),
(2, 'CS-301', '2024-11-03', 'present', 2, 'Regular session'),
(2, 'CS-301', '2024-11-05', 'present', 2, 'Regular session'),
(2, 'CS-301', '2024-11-08', 'present', 2, 'Regular session'),
(2, 'CS-301', '2024-11-10', 'present', 2, 'Regular session'),
(2, 'CS-302', '2024-11-02', 'present', 2, 'Lab session'),
(2, 'CS-302', '2024-11-04', 'present', 2, 'Lab session'),
(2, 'CS-302', '2024-11-09', 'absent', 2, 'Permitted university conference'),
(2, 'CS-302', '2024-11-11', 'present', 2, 'Regular session'),
(2, 'MATH-201', '2024-11-06', 'present', 3, 'Regular session');

-- David Lee (id: 3) has 5 present out of 7 sessions = 71.4% (Triggers < 75% Warning!)
INSERT INTO attendance (student_id, course_code, session_date, status, marked_by, remarks) VALUES
(3, 'CS-301', '2024-11-01', 'present', 2, 'Regular session'),
(3, 'CS-301', '2024-11-03', 'absent', 2, 'Absent'),
(3, 'CS-301', '2024-11-05', 'present', 2, 'Regular session'),
(3, 'CS-301', '2024-11-08', 'absent', 2, 'Unexcused absence'),
(3, 'CS-301', '2024-11-10', 'present', 2, 'Regular session'),
(3, 'MATH-201', '2024-11-06', 'present', 3, 'Regular session'),
(3, 'MATH-201', '2024-11-12', 'present', 3, 'Regular session');

-- 5. Insert Fee Records
-- Alex Johnson: Total $4,500, Paid $3,250, Remaining $1,250 (Status: 'due', Due: Nov 30, 2024 -> Triggers Due Warning Notification!)
INSERT INTO fees (student_id, semester, academic_year, total_amount, paid_amount, due_date, status, last_payment_date) VALUES
(1, 3, '2024-2025', 4500.00, 3250.00, '2024-11-30', 'due', '2024-09-15');

-- Sophia Martinez: Total $4,800, Paid $4,800, Remaining $0.00 (Status: 'paid' -> Clear)
INSERT INTO fees (student_id, semester, academic_year, total_amount, paid_amount, due_date, status, last_payment_date) VALUES
(2, 3, '2024-2025', 4800.00, 4800.00, '2024-11-30', 'paid', '2024-09-02');

-- David Lee: Total $4,200, Paid $2,100, Remaining $2,100 (Status: 'due', Due: Dec 05, 2024 -> Triggers Due Warning Notification!)
INSERT INTO fees (student_id, semester, academic_year, total_amount, paid_amount, due_date, status, last_payment_date) VALUES
(3, 2, '2024-2025', 4200.00, 2100.00, '2024-12-05', 'due', '2024-08-20');
