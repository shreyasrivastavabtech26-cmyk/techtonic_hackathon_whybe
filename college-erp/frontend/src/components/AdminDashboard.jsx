// Admin Dashboard Component: Full Access to Student Management, Attendance & Fees
const { useState, useEffect } = React;

function AdminDashboard({ user }) {
  const [activeTab, setActiveTab] = useState('students'); // 'students' | 'attendance' | 'fees'
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    roll_number: '',
    first_name: '',
    last_name: '',
    department: 'Computer Science & Engineering',
    semester: 1,
    contact_email: '',
    phone: '',
  });

  // Attendance State
  const [selectedStudentId, setSelectedStudentId] = useState(1);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [markData, setMarkData] = useState({
    courseCode: 'CS-301',
    sessionDate: new Date().toISOString().split('T')[0],
    status: 'present',
    remarks: 'Marked by Administrator',
  });

  // Fee State
  const [fees, setFees] = useState([]);
  const [paymentModal, setPaymentModal] = useState({ open: false, feeId: null, amount: '' });

  // Notifications
  const [toast, setToast] = useState('');

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadData = async () => {
    const sRes = await window.ERPService.getStudents(searchQuery);
    setStudents(sRes.students);

    if (selectedStudentId) {
      const aRes = await window.ERPService.getAttendanceSummary(selectedStudentId);
      setAttendanceSummary(aRes.data);
    }

    const fRes = await window.ERPService.getAllFees();
    setFees(fRes.fees);
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedStudentId]);

  // Handle Add Student (Admin only)
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.roll_number || !newStudent.first_name || !newStudent.contact_email) {
      alert('Please fill all required student details.');
      return;
    }
    await window.ERPService.createStudent(newStudent);
    setShowAddModal(false);
    setNewStudent({
      roll_number: '',
      first_name: '',
      last_name: '',
      department: 'Computer Science & Engineering',
      semester: 1,
      contact_email: '',
      phone: '',
    });
    triggerToast('New student record created successfully.');
    loadData();
  };

  // Handle Delete Student (Admin only)
  const handleDeleteStudent = async (id, roll) => {
    if (confirm(`Are you sure you want to delete student [${roll}]? This will remove all linked attendance and fee records.`)) {
      await window.ERPService.deleteStudent(id);
      triggerToast(`Student [${roll}] deleted.`);
      loadData();
    }
  };

  // Handle Mark Attendance
  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    await window.ERPService.markAttendance({
      studentId: selectedStudentId,
      ...markData,
    });
    triggerToast('Attendance marked successfully.');
    loadData();
  };

  // Handle Fee Payment
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!paymentModal.amount || paymentModal.amount <= 0) return;
    await window.ERPService.recordFeePayment(paymentModal.feeId, paymentModal.amount);
    setPaymentModal({ open: false, feeId: null, amount: '' });
    triggerToast('Fee payment recorded.');
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-black text-white px-4 py-2.5 rounded-lg text-xs font-semibold shadow-xl z-50 flex items-center gap-2 border border-gray-700">
          <span className="w-2 h-2 rounded-full bg-[#FFD233]"></span>
          {toast}
        </div>
      )}

      {/* Admin Module Banner */}
      <div className="bg-white border border-[#E6DFD1] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-red-100 text-red-800 border border-red-200">
            System Administrator Clearance
          </div>
          <h2 className="text-2xl font-black text-gray-900 mt-1">Enterprise Management Core</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Full unconstrained administrative privileges across Student Directory, Attendance Matrix, and Financial Fee Structures.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F5F1E6] p-1 rounded-xl border border-[#E4DFD3] text-xs font-bold">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === 'students' ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'}`}
          >
            Student Directory ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === 'attendance' ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'}`}
          >
            Attendance Master
          </button>
          <button
            onClick={() => setActiveTab('fees')}
            className={`px-3.5 py-1.5 rounded-lg transition ${activeTab === 'fees' ? 'bg-white text-black shadow-sm' : 'text-gray-600 hover:text-black'}`}
          >
            Fee Ledger ({fees.length})
          </button>
        </div>
      </div>

      {/* TAB 1: STUDENT MANAGEMENT (FULL CRUD) */}
      {activeTab === 'students' && (
        <div className="bg-white border border-[#E6DFD1] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-lg text-gray-900">Student Directory Management</h3>
              <p className="text-xs text-gray-500">Add, inspect, modify, and manage registered student profiles.</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search roll no, name, dept..."
                className="input-portal px-3 py-1.5 rounded-lg text-xs w-full sm:w-64"
              />
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0"
              >
                <span>+</span> Add Student
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F2] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Roll Number</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">Contact Email</th>
                  <th className="px-4 py-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">{s.roll_number}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{s.first_name} {s.last_name}</td>
                    <td className="px-4 py-3 text-gray-600">{s.department}</td>
                    <td className="px-4 py-3 text-gray-600">Sem {s.semester}</td>
                    <td className="px-4 py-3 text-gray-600">{s.contact_email}</td>
                    <td className="px-4 py-3 text-right space-x-1">
                      <button
                        onClick={() => { setSelectedStudentId(s.id); setActiveTab('attendance'); }}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[11px] font-semibold text-gray-800"
                      >
                        Attendance
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(s.id, s.roll_number)}
                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded text-[11px] font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ATTENDANCE MODULE */}
      {activeTab === 'attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Mark Attendance Form */}
          <div className="lg:col-span-5 bg-white border border-[#E6DFD1] rounded-2xl p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Mark / Edit Attendance</h3>
              <p className="text-xs text-gray-500">Record session attendance into the database.</p>
            </div>

            <form onSubmit={handleMarkAttendance} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Student</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(parseInt(e.target.value, 10))}
                  className="input-portal w-full px-3 py-2 rounded-lg text-xs font-medium"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.roll_number} - {s.first_name} {s.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Course Code</label>
                <select
                  value={markData.courseCode}
                  onChange={(e) => setMarkData({ ...markData, courseCode: e.target.value })}
                  className="input-portal w-full px-3 py-2 rounded-lg text-xs"
                >
                  <option value="CS-301">CS-301: Data Structures & Algorithms</option>
                  <option value="CS-302">CS-302: Database Management Systems</option>
                  <option value="MATH-201">MATH-201: Discrete Mathematics</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={markData.sessionDate}
                    onChange={(e) => setMarkData({ ...markData, sessionDate: e.target.value })}
                    className="input-portal w-full px-3 py-2 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Status</label>
                  <select
                    value={markData.status}
                    onChange={(e) => setMarkData({ ...markData, status: e.target.value })}
                    className="input-portal w-full px-3 py-2 rounded-lg text-xs"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="late">Late</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={markData.remarks}
                  onChange={(e) => setMarkData({ ...markData, remarks: e.target.value })}
                  className="input-portal w-full px-3 py-2 rounded-lg text-xs"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                Save Attendance Entry
              </button>
            </form>
          </div>

          {/* Right: Selected Student Attendance Summary */}
          <div className="lg:col-span-7 bg-white border border-[#E6DFD1] rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-extrabold text-base text-gray-900">Attendance Metrics & Thresholds</h3>
              {attendanceSummary?.isBelow75Warning && (
                <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                  ⚠️ Below 75% Threshold
                </span>
              )}
            </div>

            {attendanceSummary && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-[#FAF8F2] p-2.5 rounded-xl border border-gray-200">
                    <div className="text-xl font-black text-gray-900">{attendanceSummary.attendancePercentage}%</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Rate</div>
                  </div>
                  <div className="bg-[#FAF8F2] p-2.5 rounded-xl border border-gray-200">
                    <div className="text-xl font-black text-gray-900">{attendanceSummary.totalSessions}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Total</div>
                  </div>
                  <div className="bg-[#FAF8F2] p-2.5 rounded-xl border border-gray-200">
                    <div className="text-xl font-black text-emerald-700">{attendanceSummary.attendedSessions}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Present</div>
                  </div>
                  <div className="bg-[#FAF8F2] p-2.5 rounded-xl border border-gray-200">
                    <div className="text-xl font-black text-rose-700">{attendanceSummary.absentSessions}</div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Absent</div>
                  </div>
                </div>

                {attendanceSummary.isBelow75Warning && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900">
                    <strong>Notice:</strong> {attendanceSummary.warningMessage}
                  </div>
                )}

                {/* Session logs */}
                <div className="border border-gray-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F2] border-b text-[10px] text-gray-500 font-bold uppercase">
                      <tr>
                        <th className="px-3 py-2">Date</th>
                        <th className="px-3 py-2">Course</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {attendanceSummary.recentSessions.map((s) => (
                        <tr key={s.id}>
                          <td className="px-3 py-2 font-mono text-[11px]">{s.session_date}</td>
                          <td className="px-3 py-2 font-semibold">{s.course_code}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${s.status === 'present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              {s.status}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-gray-500 text-[11px]">{s.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: FEE MODULE */}
      {activeTab === 'fees' && (
        <div className="bg-white border border-[#E6DFD1] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-lg text-gray-900">Tuition & Institutional Fee Master</h3>
              <p className="text-xs text-gray-500">Record student payments, inspect remaining fee dues, and manage fee structures.</p>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F2] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Roll No</th>
                  <th className="px-4 py-3">Student</th>
                  <th className="px-4 py-3">Semester</th>
                  <th className="px-4 py-3">Total Fee</th>
                  <th className="px-4 py-3">Paid Amount</th>
                  <th className="px-4 py-3">Remaining Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fees.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-bold text-gray-900">{f.roll_number}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{f.student_name}</td>
                    <td className="px-4 py-3 text-gray-600">Sem {f.semester} ({f.academic_year})</td>
                    <td className="px-4 py-3 font-semibold text-gray-900">${f.total_amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-emerald-700 font-semibold">${f.paid_amount.toLocaleString()}</td>
                    <td className="px-4 py-3 font-bold text-amber-700 font-mono">
                      ${f.remaining_amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${f.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {f.remaining_amount > 0 && (
                        <button
                          onClick={() => setPaymentModal({ open: true, feeId: f.id, amount: f.remaining_amount })}
                          className="px-2.5 py-1 bg-[#FFD233] hover:bg-yellow-400 text-black rounded text-[11px] font-bold"
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Student */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-bold text-base text-gray-900">Register New Student</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black font-bold text-lg">&times;</button>
            </div>
            <form onSubmit={handleCreateStudent} className="space-y-3 pt-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. STU-2024-0044"
                  value={newStudent.roll_number}
                  onChange={(e) => setNewStudent({ ...newStudent, roll_number: e.target.value })}
                  className="input-portal w-full px-3 py-2 rounded-lg text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.first_name}
                    onChange={(e) => setNewStudent({ ...newStudent, first_name: e.target.value })}
                    className="input-portal w-full px-3 py-2 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={newStudent.last_name}
                    onChange={(e) => setNewStudent({ ...newStudent, last_name: e.target.value })}
                    className="input-portal w-full px-3 py-2 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Department</label>
                <select
                  value={newStudent.department}
                  onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
                  className="input-portal w-full px-3 py-2 rounded-lg text-xs"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Electrical & Robotics Engineering">Electrical & Robotics Engineering</option>
                  <option value="Data Science & Artificial Intelligence">Data Science & Artificial Intelligence</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newStudent.semester}
                    onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })}
                    className="input-portal w-full px-3 py-2 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={newStudent.contact_email}
                    onChange={(e) => setNewStudent({ ...newStudent, contact_email: e.target.value })}
                    className="input-portal w-full px-3 py-2 rounded-lg text-xs"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-xs font-semibold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-2 rounded-lg text-xs font-bold"
                >
                  Confirm Enrollment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Payment */}
      {paymentModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-gray-200">
            <h3 className="font-bold text-base text-gray-900 pb-2 border-b">Record Student Fee Payment</h3>
            <form onSubmit={handleRecordPayment} className="space-y-3 pt-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Payment Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={paymentModal.amount}
                  onChange={(e) => setPaymentModal({ ...paymentModal, amount: e.target.value })}
                  className="input-portal w-full px-3 py-2 rounded-lg text-xs font-mono font-bold"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModal({ open: false, feeId: null, amount: '' })}
                  className="px-3 py-1.5 border rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-3 py-1.5 rounded-lg text-xs font-bold"
                >
                  Apply Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

window.AdminDashboard = AdminDashboard;
