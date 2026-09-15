// Navbar Component: Preserves Stitch Design System & Role Switcher
const { useState } = React;

function Navbar({ currentUser, onSwitchRole, onSignOut }) {
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-red-100 text-red-800 border border-red-200">Admin</span>;
      case 'faculty':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">Faculty</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-300">Student</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7EE] border-b border-[#ECE5D5] shadow-xs">
      {/* Top Academic Banner */}
      <div className="bg-[#FFF8DF] border-b border-[#E9E0C8] px-4 sm:px-8 py-1.5 text-xs text-[#575D66] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold tracking-wider text-black text-[10px] uppercase">Academic Portal V4.2.1 Active</span>
          <span className="text-gray-300">•</span>
          <span className="text-[#33373D] text-[11px]">Fall Semester 2024-2025 ERP Core Operational</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-gray-500 text-[11px]">Simulate Role:</span>
          <div className="flex items-center gap-1 bg-[#F5EED9] p-0.5 rounded-lg border border-[#DECFA9]">
            <button
              onClick={() => onSwitchRole('admin')}
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase transition ${currentUser?.role === 'admin' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'}`}
            >
              Admin
            </button>
            <button
              onClick={() => onSwitchRole('faculty')}
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase transition ${currentUser?.role === 'faculty' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'}`}
            >
              Faculty
            </button>
            <button
              onClick={() => onSwitchRole('student')}
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase transition ${currentUser?.role === 'student' ? 'bg-black text-white' : 'text-gray-700 hover:text-black'}`}
            >
              Student
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#121417] text-white flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-[#FFD233]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-[#121417] leading-tight">Student Management System</h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">ERP Centralized Services</p>
          </div>
        </div>

        {/* Current User Info & Sign Out */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div className="flex items-center gap-2 text-right">
              <div>
                <div className="text-xs font-black text-gray-900 leading-none">{currentUser.displayName}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{getRoleBadge(currentUser.role)}</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#18191B] text-white flex items-center justify-center text-xs font-bold border border-gray-300">
                {currentUser.displayName.charAt(0)}
              </div>
            </div>
          )}

          <button
            onClick={onSignOut}
            className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 text-xs font-bold text-gray-700 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

window.Navbar = Navbar;
