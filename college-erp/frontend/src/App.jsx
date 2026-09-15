// App.jsx: Main ERP Application Router & Role Orchestration
const { useState, useEffect } = React;

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Initialize with student session by default, or read from storage
  useEffect(() => {
    const savedUser = localStorage.getItem('college_erp_active_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        // start clean
      }
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('college_erp_active_user', JSON.stringify(user));
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('college_erp_active_user');
  };

  // Instant Role Simulator Switcher
  const handleSwitchRole = (newRole) => {
    let mockUser = null;
    if (newRole === 'admin') {
      mockUser = { id: 1, username: 'admin', role: 'admin', displayName: 'Dr. Evelyn Vance (Administrator)' };
    } else if (newRole === 'faculty') {
      mockUser = { id: 2, username: 'prof_alan', role: 'faculty', displayName: 'Prof. Alan Turing (Faculty CS)' };
    } else {
      mockUser = {
        id: 4,
        username: 'STU-2024-0041',
        role: 'student',
        studentId: 1,
        rollNumber: 'STU-2024-0041',
        displayName: 'Alex Johnson',
        department: 'Computer Science & Engineering',
      };
    }
    setCurrentUser(mockUser);
    localStorage.setItem('college_erp_active_user', JSON.stringify(mockUser));
  };

  return (
    <div className="min-h-screen bg-[#FAF7EE] text-[#18191B] flex flex-col font-sans">
      {!currentUser ? (
        <window.LoginView onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <window.Navbar
            currentUser={currentUser}
            onSwitchRole={handleSwitchRole}
            onSignOut={handleSignOut}
          />
          <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-8 py-8">
            {currentUser.role === 'admin' && <window.AdminDashboard user={currentUser} />}
            {currentUser.role === 'faculty' && <window.FacultyDashboard user={currentUser} />}
            {currentUser.role === 'student' && <window.StudentDashboard user={currentUser} />}
          </main>
          <footer className="bg-[#FAF7EE] border-t border-[#ECE5D5] px-4 sm:px-8 py-4 text-[11px] text-gray-500 text-center">
            ERP-Based Student Management System • Powered by ReactJS, NodeJS & PostgreSQL • Design System 1:1
          </footer>
        </div>
      )}
    </div>
  );
}

window.App = App;
