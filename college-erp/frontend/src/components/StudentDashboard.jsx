// Student Dashboard Component: View Attendance (<75% Warning) + View Fee Ledger (Remaining Balance & Due Warning)
const { useState, useEffect } = React;

function StudentDashboard({ user }) {
  const studentId = user.studentId || 1;
  const [attendance, setAttendance] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [showPayModal, setShowPayModal] = useState(false);
  const [toast, setToast] = useState('');

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3500);
  };

  const loadStudentData = async () => {
    const aRes = await window.ERPService.getAttendanceSummary(studentId);
    setAttendance(aRes.data);

    const fRes = await window.ERPService.getStudentFeeDetails(studentId);
    setFeeData(fRes);
  };

  useEffect(() => {
    loadStudentData();
  }, [studentId]);

  const handleStudentPayment = async (e) => {
    e.preventDefault();
    if (!payAmount || payAmount <= 0) return;
    const activeFee = feeData?.ledger?.find(f => f.status === 'due' || f.remaining_amount > 0);
    if (activeFee) {
      await window.ERPService.recordFeePayment(activeFee.id, payAmount);
      setShowPayModal(false);
      setPayAmount('');
      triggerToast(`Payment of $${payAmount} submitted successfully.`);
      loadStudentData();
    }
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

      {/* Student Profile Card */}
      <div className="bg-white border border-[#E6DFD1] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#121417] text-white flex items-center justify-center text-xl font-bold shadow-sm">
            <svg className="w-8 h-8 text-[#FFD233]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                Enrolled Student
              </span>
              <span className="font-mono text-xs font-bold text-gray-500">{user.rollNumber || 'STU-2024-0041'}</span>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mt-1">{user.displayName || 'Alex Johnson'}</h2>
            <p className="text-xs text-gray-500">{user.department || 'Computer Science & Engineering'} • Semester 3 • Academic Year 2024-2025</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {feeData?.summary?.hasDueFee && (
            <button
              onClick={() => { setPayAmount(feeData.summary.totalRemaining); setShowPayModal(true); }}
              className="btn-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              Pay Remaining Dues (${feeData.summary.totalRemaining.toLocaleString()})
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. CRITICAL ATTENDANCE WARNING BANNER (IF BELOW 75%) */}
      {/* ========================================================================= */}
      {attendance?.isBelow75Warning && (
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 border-2 border-amber-400 rounded-2xl p-5 shadow-md flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold text-xl shadow">
            ⚠️
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-amber-950 uppercase tracking-tight">
                Mandatory Attendance Warning • Current Rate: {attendance.attendancePercentage}%
              </h3>
              <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[10px] font-black uppercase rounded-full tracking-wider animate-pulse">
                Debarment Risk
              </span>
            </div>
            <p className="text-xs text-amber-900 mt-1 font-medium leading-relaxed">
              Your overall campus attendance is below the mandatory <strong className="font-bold underline">75.0% threshold</strong> prescribed under University Academic Regulation 4.2. Failure to attain 75% attendance will lead to disqualification from sitting for end-semester examinations.
            </p>
            <div className="mt-3 bg-white/80 border border-amber-300 rounded-lg p-2.5 text-xs text-gray-800 font-semibold flex items-center justify-between">
              <span>Required Recovery Action: Attend the next <strong className="text-rose-700 underline font-black">{attendance.classesNeededToRecover} consecutive lectures</strong> without absence.</span>
              <span className="text-[11px] text-gray-500 font-normal">Contact Dept Dean for medical review</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FEE DUE WARNING NOTIFICATION BANNER (IF FEE DUE) */}
      {/* ========================================================================= */}
      {feeData?.summary?.hasDueFee && (
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-[#FFD233] rounded-2xl p-5 shadow-md flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FFD233] text-black flex items-center justify-center shrink-0 font-bold text-xl shadow">
            🔔
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-gray-900 uppercase tracking-tight">
                Institutional Fee Due Alert • Pending Balance: ${feeData.summary.totalRemaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <span className="px-2.5 py-0.5 bg-amber-500 text-white text-[10px] font-black uppercase rounded-full tracking-wider">
                Action Required
              </span>
            </div>
            <p className="text-xs text-gray-700 mt-1 font-medium leading-relaxed">
              {feeData.summary.warningNotification.message}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-gray-600 font-medium">
                Due Date: <strong className="text-gray-900 font-bold">{feeData.ledger[0]?.due_date}</strong> (Fall 2024-2025 Tuition)
              </div>
              <button
                onClick={() => { setPayAmount(feeData.summary.totalRemaining); setShowPayModal(true); }}
                className="btn-primary px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase shadow-sm"
              >
                Clear Remaining Fee Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TWO COLUMN GRID: ATTENDANCE DETAILS & FEE MODULE DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ATTENDANCE MODULE (VIEW ONLY) */}
        <div className="lg:col-span-6 bg-white border border-[#E6DFD1] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Attendance Module</h3>
              <p className="text-xs text-gray-500">Subject-wise presence and institutional compliance monitor.</p>
            </div>
            <span className={`px-2.5 py-1 rounded text-xs font-black ${attendance?.isBelow75Warning ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {attendance?.attendancePercentage}%
            </span>
          </div>

          {attendance && (
            <>
              {/* Quick stats pills */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#FAF8F2] p-3 rounded-xl border border-gray-200">
                  <div className="text-xl font-black text-gray-900">{attendance.totalSessions}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Total Classes</div>
                </div>
                <div className="bg-[#FAF8F2] p-3 rounded-xl border border-gray-200">
                  <div className="text-xl font-black text-emerald-700">{attendance.attendedSessions}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Attended</div>
                </div>
                <div className="bg-[#FAF8F2] p-3 rounded-xl border border-gray-200">
                  <div className="text-xl font-black text-rose-700">{attendance.absentSessions}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Absences</div>
                </div>
              </div>

              {/* Course-wise breakdown */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Subject Breakdown</h4>
                <div className="space-y-2.5">
                  {attendance.courses.map((c) => (
                    <div key={c.course_code} className="bg-[#FAF8F2] border border-[#ECE5D5] rounded-xl p-3">
                      <div className="flex items-center justify-between mb-1 text-xs font-bold">
                        <span className="text-gray-900">{c.course_code}: {c.course_name}</span>
                        <span className={c.course_percentage < 75 ? 'text-rose-700 font-black' : 'text-emerald-700 font-black'}>
                          {c.course_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${c.course_percentage < 75 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                          style={{ width: `${Math.min(100, c.course_percentage)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                        <span>{c.course_attended} of {c.course_total} classes attended</span>
                        {c.course_percentage < 75 && (
                          <span className="text-rose-600 font-bold">Below 75% Warning</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* FEE MODULE (REMAINING BALANCE & STATUS) */}
        <div className="lg:col-span-6 bg-white border border-[#E6DFD1] rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-extrabold text-base text-gray-900">Fee Module</h3>
              <p className="text-xs text-gray-500">Tuition assessment, payments, and remaining balances.</p>
            </div>
            {feeData?.summary?.hasDueFee ? (
              <span className="px-2.5 py-1 rounded text-xs font-black bg-amber-100 text-amber-800">
                Payment Pending
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded text-xs font-black bg-emerald-100 text-emerald-800">
                Fully Paid
              </span>
            )}
          </div>

          {feeData && (
            <>
              {/* Balances Highlight */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#FAF8F2] p-3 rounded-xl border border-gray-200">
                  <div className="text-lg font-black text-gray-900">${feeData.summary.totalAssessed.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Total Assessed</div>
                </div>
                <div className="bg-[#FAF8F2] p-3 rounded-xl border border-gray-200">
                  <div className="text-lg font-black text-emerald-700">${feeData.summary.totalPaid.toLocaleString()}</div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Amount Paid</div>
                </div>
                <div className="bg-[#FAF8F2] p-3 rounded-xl border-2 border-amber-400 bg-amber-50/50">
                  <div className="text-lg font-black text-amber-800 font-mono">${feeData.summary.totalRemaining.toLocaleString()}</div>
                  <div className="text-[10px] text-amber-900 font-extrabold uppercase">Remaining Fee</div>
                </div>
              </div>

              {/* Fee Ledger Table */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Semester Fee Ledger</h4>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF8F2] border-b text-[10px] text-gray-600 font-bold uppercase">
                      <tr>
                        <th className="px-3 py-2">Semester</th>
                        <th className="px-3 py-2">Total</th>
                        <th className="px-3 py-2">Paid</th>
                        <th className="px-3 py-2">Remaining</th>
                        <th className="px-3 py-2">Due Date</th>
                        <th className="px-3 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {feeData.ledger.map((item) => (
                        <tr key={item.id}>
                          <td className="px-3 py-2 font-semibold">Sem {item.semester}</td>
                          <td className="px-3 py-2">${item.total_amount.toLocaleString()}</td>
                          <td className="px-3 py-2 text-emerald-700 font-medium">${item.paid_amount.toLocaleString()}</td>
                          <td className="px-3 py-2 font-mono font-bold text-amber-700">${item.remaining_amount.toLocaleString()}</td>
                          <td className="px-3 py-2 font-mono text-[11px] text-gray-600">{item.due_date}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-gray-200">
            <h3 className="font-bold text-base text-gray-900 pb-2 border-b">Submit Tuition Fee Payment</h3>
            <p className="text-xs text-gray-500 mt-2">
              Enter the amount to settle remaining fee dues for Fall 2024-2025.
            </p>
            <form onSubmit={handleStudentPayment} className="space-y-4 pt-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="input-portal w-full px-3 py-2 rounded-lg text-sm font-mono font-bold"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-3 py-1.5 border rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-1.5 rounded-lg text-xs font-bold"
                >
                  Authorize Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

window.StudentDashboard = StudentDashboard;
