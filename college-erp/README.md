# ERP-Based Student Management System

A full-stack, enterprise-grade Student Management System adhering to institutional Role-Based Access Control (RBAC) across **Student Management**, **Attendance**, and **Fee** modules.

Preserves the approved **Google Stitch design system** (warm sand `#FAF7EE`, academic yellow `#FFD233`, and modern typography) with full interactive ReactJS frontend, NodeJS backend, and PostgreSQL database.

---

## 🏛️ Roles & Permissions Matrix

| Capability / Module | Administrator | Faculty | Student |
| :--- | :---: | :---: | :---: |
| **Authentication** | Full Access | Faculty NetID | Student Roll No |
| **Student Management** | **Full CRUD** (Create, Update, Delete students) | **View-Only** (Search & browse directory) | **Self View** (View own profile) |
| **Attendance Module** | **Full Access** (Mark & edit any session) | **Edit Access** (Mark class attendance & edit) | **View-Only** + **Automatic Warning if < 75%** |
| **Fee Module** | **Full Access** (Structure fees & record payments) | **Edit Access** (Record payments & update status) | **View-Only** (Remaining Balance) + **Due Warning Notification** |

---

## 📁 Repository Structure

```
college-erp/
├── database/
│   ├── schema.sql              # PostgreSQL DDL for tables, triggers & views
│   └── seed.sql                # Seed data with <75% attendance & due fee cases
├── backend/
│   ├── package.json            # Node.js dependencies (express, pg, jwt, bcrypt)
│   ├── server.js               # Express server entrypoint
│   ├── config/
│   │   └── db.js               # PostgreSQL connection pool
│   ├── middleware/
│   │   └── auth.js             # RBAC and JWT verification middleware
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── attendanceController.js
│   │   └── feeController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── attendanceRoutes.js
│   │   └── feeRoutes.js
│   └── .env.example
├── frontend/
│   ├── package.json            # React dependencies
│   ├── index.html              # Runnable web entrypoint preserving Stitch design
│   └── src/
│       ├── App.jsx             # Main router and role state provider
│       ├── components/
│       │   ├── Navbar.jsx      # Header, branding & instant role simulator
│       │   ├── LoginView.jsx   # 1:1 Stitch campus portal login page
│       │   ├── AdminDashboard.jsx
│       │   ├── FacultyDashboard.jsx
│       │   └── StudentDashboard.jsx
│       └── services/
│           └── api.js          # Dual-mode API connector (live backend + mock)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Run the Frontend (Instant Experience)
Double-click or open:
```
C:\Users\Shreya\.gemini\antigravity\scratch\college-erp\frontend\index.html
```
No installation required! The frontend loads the exact Stitch login page, allows logging in as **Student**, **Faculty**, or **Admin**, and features an instant **Role Simulator** bar at the top to test all permissions seamlessly.

### 2. Set Up PostgreSQL Database
Open PowerShell or your terminal and run:
```bash
# Create database
createdb -U postgres college_erp

# Run schema and seed data
psql -U postgres -d college_erp -f database/schema.sql
psql -U postgres -d college_erp -f database/seed.sql
```

### 3. Start Node.js Backend Server
```bash
cd backend
npm install
npm start
```
The REST API will be available at `http://localhost:5000/api`.

---

## 🔍 Module Highlights & Test Scenarios

### 1. Attendance Warning (< 75%)
- Log in as **Alex Johnson** (`STU-2024-0041`).
- Alex has attended 7 out of 11 lectures = **63.6%**.
- **Result**: A prominent amber/red **Debarment Risk Warning Banner** appears informing the student of the 75% threshold violation and calculating that 5 consecutive classes must be attended to recover.

### 2. Fee Module Remaining Balance & Due Notification
- Alex Johnson has an assessed fee of **$4,500.00** and has paid **$3,250.00**.
- **Remaining Amount to be Submitted**: **$1,250.00**.
- **Result**: A prominent **Tuition Due Warning Notification** appears with a due date of Nov 30, 2024, and a "Clear Remaining Fee Now" button.

### 3. Role-Based Permissions
- **Admin**: Has buttons to Add Student, Delete Student, Edit Attendance, and Record Payments.
- **Faculty**: Student directory is strictly **Read-Only** (Add/Delete buttons are disabled/hidden). Faculty has full **Edit Access** to Mark Attendance and Record Fee Payments.
- **Student**: Strict **View-Only** access with automated compliance warnings.
