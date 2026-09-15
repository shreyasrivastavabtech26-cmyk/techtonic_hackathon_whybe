// API Client with Dual Mode: Live Node.js/PostgreSQL Backend + Interactive Offline Bridge
const API_BASE_URL = 'http://localhost:5000/api';

// Initial Mock State seeded with database/seed.sql
const initialDatabase = {
  students: [
    {
      id: 1,
      roll_number: 'STU-2024-0041',
      first_name: 'Alex',
      last_name: 'Johnson',
      department: 'Computer Science & Engineering',
      semester: 3,
      contact_email: 'alex.johnson@student.edu',
      phone: '+1 (555) 234-5678',
      enrollment_date: '2024-08-15',
    },
    {
      id: 2,
      roll_number: 'STU-2024-0042',
      first_name: 'Sophia',
      last_name: 'Martinez',
      department: 'Electrical & Robotics Engineering',
      semester: 3,
      contact_email: 'sophia.martinez@student.edu',
      phone: '+1 (555) 876-5432',
      enrollment_date: '2024-08-15',
    },
    {
      id: 3,
      roll_number: 'STU-2024-0043',
      first_name: 'David',
      last_name: 'Lee',
      department: 'Data Science & Artificial Intelligence',
      semester: 2,
      contact_email: 'david.lee@student.edu',
      phone: '+1 (555) 345-6789',
      enrollment_date: '2024-08-15',
    }
  ],
  attendance: [
    { id: 1, student_id: 1, course_code: 'CS-301', session_date: '2024-11-01', status: 'present', remarks: 'Regular session' },
    { id: 2, student_id: 1, course_code: 'CS-301', session_date: '2024-11-03', status: 'present', remarks: 'Regular session' },
    { id: 3, student_id: 1, course_code: 'CS-301', session_date: '2024-11-05', status: 'absent', remarks: 'Unexcused absence' },
    { id: 4, student_id: 1, course_code: 'CS-301', session_date: '2024-11-08', status: 'absent', remarks: 'Late arrival after 15m' },
    { id: 5, student_id: 1, course_code: 'CS-301', session_date: '2024-11-10', status: 'present', remarks: 'Regular session' },
    { id: 6, student_id: 1, course_code: 'CS-302', session_date: '2024-11-02', status: 'present', remarks: 'Lab practical' },
    { id: 7, student_id: 1, course_code: 'CS-302', session_date: '2024-11-04', status: 'absent', remarks: 'Pre-lab missing' },
    { id: 8, student_id: 1, course_code: 'CS-302', session_date: '2024-11-09', status: 'absent', remarks: 'Absent' },
    { id: 9, student_id: 1, course_code: 'CS-302', session_date: '2024-11-11', status: 'present', remarks: 'Regular session' },
    { id: 10, student_id: 1, course_code: 'MATH-201', session_date: '2024-11-06', status: 'present', remarks: 'Regular session' },
    { id: 11, student_id: 1, course_code: 'MATH-201', session_date: '2024-11-12', status: 'present', remarks: 'Regular session' },

    { id: 12, student_id: 2, course_code: 'CS-301', session_date: '2024-11-01', status: 'present', remarks: 'Regular session' },
    { id: 13, student_id: 2, course_code: 'CS-301', session_date: '2024-11-03', status: 'present', remarks: 'Regular session' },
    { id: 14, student_id: 2, course_code: 'CS-301', session_date: '2024-11-05', status: 'present', remarks: 'Regular session' },
    { id: 15, student_id: 2, course_code: 'CS-301', session_date: '2024-11-08', status: 'present', remarks: 'Regular session' },
    { id: 16, student_id: 2, course_code: 'CS-301', session_date: '2024-11-10', status: 'present', remarks: 'Regular session' },
    { id: 17, student_id: 2, course_code: 'CS-302', session_date: '2024-11-02', status: 'present', remarks: 'Lab session' },
    { id: 18, student_id: 2, course_code: 'CS-302', session_date: '2024-11-04', status: 'present', remarks: 'Lab session' },
    { id: 19, student_id: 2, course_code: 'CS-302', session_date: '2024-11-09', status: 'absent', remarks: 'University conference' },
    { id: 20, student_id: 2, course_code: 'CS-302', session_date: '2024-11-11', status: 'present', remarks: 'Regular session' },
    { id: 21, student_id: 2, course_code: 'MATH-201', session_date: '2024-11-06', status: 'present', remarks: 'Regular session' },

    { id: 22, student_id: 3, course_code: 'CS-301', session_date: '2024-11-01', status: 'present', remarks: 'Regular session' },
    { id: 23, student_id: 3, course_code: 'CS-301', session_date: '2024-11-03', status: 'absent', remarks: 'Absent' },
    { id: 24, student_id: 3, course_code: 'CS-301', session_date: '2024-11-05', status: 'present', remarks: 'Regular session' },
    { id: 25, student_id: 3, course_code: 'CS-301', session_date: '2024-11-08', status: 'absent', remarks: 'Absent' },
    { id: 26, student_id: 3, course_code: 'CS-301', session_date: '2024-11-10', status: 'present', remarks: 'Regular session' },
    { id: 27, student_id: 3, course_code: 'MATH-201', session_date: '2024-11-06', status: 'present', remarks: 'Regular session' },
    { id: 28, student_id: 3, course_code: 'MATH-201', session_date: '2024-11-12', status: 'present', remarks: 'Regular session' }
  ],
  fees: [
    {
      id: 1,
      student_id: 1,
      semester: 3,
      academic_year: '2024-2025',
      total_amount: 4500.00,
      paid_amount: 3250.00,
      remaining_amount: 1250.00,
      due_date: '2024-11-30',
      status: 'due',
      last_payment_date: '2024-09-15'
    },
    {
      id: 2,
      student_id: 2,
      semester: 3,
      academic_year: '2024-2025',
      total_amount: 4800.00,
      paid_amount: 4800.00,
      remaining_amount: 0.00,
      due_date: '2024-11-30',
      status: 'paid',
      last_payment_date: '2024-09-02'
    },
    {
      id: 3,
      student_id: 3,
      semester: 2,
      academic_year: '2024-2025',
      total_amount: 4200.00,
      paid_amount: 2100.00,
      remaining_amount: 2100.00,
      due_date: '2024-12-05',
      status: 'due',
      last_payment_date: '2024-08-20'
    }
  ]
};

// Retrieve persisted state from localStorage or load seed
function getStoredState() {
  const saved = localStorage.getItem('college_erp_db');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn('Resetting corrupt state to seed');
    }
  }
  localStorage.setItem('college_erp_db', JSON.stringify(initialDatabase));
  return JSON.parse(JSON.stringify(initialDatabase));
}

function saveState(state) {
  localStorage.setItem('college_erp_db', JSON.stringify(state));
}

// API Service Interface
const ERPService = {
  // Auth Login
  async login(identifier, password, role) {
    // Attempt backend first if available
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, role }),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('college_erp_token', data.token);
        return data;
      }
    } catch (err) {
      // Backend not running; fallback seamlessly to interactive client-side logic
    }

    // Offline simulation
    const state = getStoredState();
    let userObj = null;

    if (role === 'admin') {
      userObj = { id: 1, username: 'admin', role: 'admin', displayName: 'Dr. Evelyn Vance (Dean/Admin)' };
    } else if (role === 'faculty') {
      userObj = { id: 2, username: 'prof_alan', role: 'faculty', displayName: 'Prof. Alan Turing (CS Dept)' };
    } else {
      // Student
      const matched = state.students.find(s => s.roll_number.toLowerCase() === identifier.toLowerCase()) || state.students[0];
      userObj = {
        id: matched.id + 3,
        username: matched.roll_number,
        role: 'student',
        studentId: matched.id,
        rollNumber: matched.roll_number,
        displayName: `${matched.first_name} ${matched.last_name}`,
        department: matched.department,
      };
    }

    return {
      success: true,
      token: 'mock-jwt-token-erp-campus-2024',
      user: userObj,
    };
  },

  // Student Management API
  async getStudents(searchQuery = '') {
    const state = getStoredState();
    let list = state.students;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.roll_number.toLowerCase().includes(q) ||
        s.first_name.toLowerCase().includes(q) ||
        s.last_name.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q)
      );
    }
    return { success: true, count: list.length, students: list };
  },

  async createStudent(data) {
    const state = getStoredState();
    const newId = (state.students.length > 0 ? Math.max(...state.students.map(s => s.id)) : 0) + 1;
    const newStudent = {
      id: newId,
      roll_number: data.roll_number,
      first_name: data.first_name,
      last_name: data.last_name,
      department: data.department,
      semester: parseInt(data.semester, 10) || 1,
      contact_email: data.contact_email,
      phone: data.phone || '+1 (555) 000-0000',
      enrollment_date: new Date().toISOString().split('T')[0],
    };
    state.students.push(newStudent);

    // Initial fee record
    state.fees.push({
      id: state.fees.length + 1,
      student_id: newId,
      semester: newStudent.semester,
      academic_year: '2024-2025',
      total_amount: 4500.00,
      paid_amount: 0.00,
      remaining_amount: 4500.00,
      due_date: '2024-12-15',
      status: 'due',
      last_payment_date: null,
    });

    saveState(state);
    return { success: true, student: newStudent };
  },

  async updateStudent(id, data) {
    const state = getStoredState();
    const index = state.students.findIndex(s => s.id === parseInt(id, 10));
    if (index === -1) throw new Error('Student not found.');
    state.students[index] = { ...state.students[index], ...data };
    saveState(state);
    return { success: true, student: state.students[index] };
  },

  async deleteStudent(id) {
    const state = getStoredState();
    state.students = state.students.filter(s => s.id !== parseInt(id, 10));
    state.attendance = state.attendance.filter(a => a.student_id !== parseInt(id, 10));
    state.fees = state.fees.filter(f => f.student_id !== parseInt(id, 10));
    saveState(state);
    return { success: true };
  },

  // Attendance Module API
  async getAttendanceSummary(studentId) {
    const state = getStoredState();
    const records = state.attendance.filter(a => a.student_id === parseInt(studentId, 10));
    const total = records.length;
    const attended = records.filter(a => a.status === 'present').length;
    const absent = records.filter(a => a.status === 'absent').length;
    const late = records.filter(a => a.status === 'late').length;

    const percentage = total > 0 ? parseFloat(((attended / total) * 100).toFixed(1)) : 0;
    const isBelow75 = total > 0 && percentage < 75.0;
    const needed = isBelow75 ? Math.max(0, Math.ceil((0.75 * total - attended) / 0.25)) : 0;

    // Course breakdown
    const courses = ['CS-301', 'CS-302', 'MATH-201'].map(code => {
      const cRecords = records.filter(r => r.course_code === code);
      const cTotal = cRecords.length;
      const cAttended = cRecords.filter(r => r.status === 'present').length;
      const cPct = cTotal > 0 ? parseFloat(((cAttended / cTotal) * 100).toFixed(1)) : 0;
      return {
        course_code: code,
        course_name: code === 'CS-301' ? 'Data Structures & Algorithms' : (code === 'CS-302' ? 'Database Management Systems' : 'Discrete Mathematics'),
        course_total: cTotal,
        course_attended: cAttended,
        course_percentage: cPct,
      };
    });

    return {
      success: true,
      data: {
        studentId: parseInt(studentId, 10),
        totalSessions: total,
        attendedSessions: attended,
        absentSessions: absent,
        lateSessions: late,
        attendancePercentage: percentage,
        isBelow75Warning: isBelow75,
        warningMessage: isBelow75
          ? `CRITICAL ATTENDANCE WARNING: Your overall attendance is ${percentage}%, which is below the mandatory 75% university requirement. You risk examination debarment! You must attend the next ${needed} consecutive class(es) without absence to restore your standing.`
          : 'Attendance Good: Above the mandatory 75% university requirement.',
        classesNeededToRecover: needed,
        courses,
        recentSessions: records.slice().reverse(),
      },
    };
  },

  async markAttendance(data) {
    const state = getStoredState();
    const newRecord = {
      id: state.attendance.length + 1,
      student_id: parseInt(data.studentId, 10),
      course_code: data.courseCode,
      session_date: data.sessionDate,
      status: data.status,
      remarks: data.remarks || 'Recorded via Portal',
    };
    // Replace if already exists on same day/course
    const existingIndex = state.attendance.findIndex(
      a => a.student_id === newRecord.student_id && a.course_code === newRecord.course_code && a.session_date === newRecord.session_date
    );
    if (existingIndex >= 0) {
      state.attendance[existingIndex] = newRecord;
    } else {
      state.attendance.push(newRecord);
    }
    saveState(state);
    return { success: true, record: newRecord };
  },

  // Fee Module API
  async getStudentFeeDetails(studentId) {
    const state = getStoredState();
    const records = state.fees.filter(f => f.student_id === parseInt(studentId, 10));

    let totalAssessed = 0;
    let totalPaid = 0;
    let totalRemaining = 0;
    let hasDueFee = false;
    let dueDetails = [];

    records.forEach(r => {
      totalAssessed += r.total_amount;
      totalPaid += r.paid_amount;
      const rem = r.total_amount - r.paid_amount;
      totalRemaining += rem;
      if (rem > 0 && r.status === 'due') {
        hasDueFee = true;
        dueDetails.push(r);
      }
    });

    const warningNotification = hasDueFee
      ? {
          active: true,
          message: `FEE PAYMENT ALERT: Remaining balance of $${totalRemaining.toLocaleString('en-US', { minimumFractionDigits: 2 })} is due on ${dueDetails[0]?.due_date || 'designated due date'}. Please clear payment to avoid registration holds.`,
          totalDue: totalRemaining,
          dueDate: dueDetails[0]?.due_date,
        }
      : {
          active: false,
          message: 'All semester tuition and institutional fees are fully cleared. No dues pending.',
          totalDue: 0,
        };

    return {
      success: true,
      summary: {
        totalAssessed,
        totalPaid,
        totalRemaining,
        hasDueFee,
        warningNotification,
      },
      ledger: records,
    };
  },

  async getAllFees() {
    const state = getStoredState();
    const feesWithStudent = state.fees.map(f => {
      const stu = state.students.find(s => s.id === f.student_id) || {};
      return {
        ...f,
        roll_number: stu.roll_number || 'N/A',
        student_name: stu.first_name ? `${stu.first_name} ${stu.last_name}` : 'Unknown',
        department: stu.department || 'N/A',
      };
    });
    return { success: true, count: feesWithStudent.length, fees: feesWithStudent };
  },

  async recordFeePayment(feeId, amount) {
    const state = getStoredState();
    const fee = state.fees.find(f => f.id === parseInt(feeId, 10));
    if (!fee) throw new Error('Fee record not found.');

    fee.paid_amount = Math.min(fee.total_amount, fee.paid_amount + parseFloat(amount));
    fee.remaining_amount = fee.total_amount - fee.paid_amount;
    fee.status = fee.remaining_amount <= 0 ? 'paid' : 'due';
    fee.last_payment_date = new Date().toISOString().split('T')[0];

    saveState(state);
    return { success: true, fee };
  },

  resetDemoData() {
    localStorage.removeItem('college_erp_db');
    return getStoredState();
  }
};

window.ERPService = ERPService;
