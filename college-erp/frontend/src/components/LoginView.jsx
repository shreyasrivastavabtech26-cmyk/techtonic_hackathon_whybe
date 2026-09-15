// LoginView Component: Exact Stitch Campus Login Frontier
const { useState } = React;

function LoginView({ onLoginSuccess }) {
  const [persona, setPersona] = useState('student'); // 'student' | 'faculty' | 'admin'
  const [identifier, setIdentifier] = useState('STU-2024-0041');
  const [password, setPassword] = useState('UniversityPass2024!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const personaConfig = {
    student: {
      label: 'Student Roll Number / User ID',
      defaultId: 'STU-2024-0041',
      placeholder: 'e.g. STU-2024-0041',
      help: '11-digit university-issued ID code provided during onboarding and on student ID card.',
      btn: 'Log in as Student →',
    },
    faculty: {
      label: 'Faculty Staff ID / Academic NetID',
      defaultId: 'FAC-BIO-8902',
      placeholder: 'e.g. FAC-BIO-8902',
      help: 'Authorized faculty identity credential provided by the Office of Academic Affairs.',
      btn: 'Log in as Faculty →',
    },
    admin: {
      label: 'Administrative Enterprise ID',
      defaultId: 'ADM-SEC-0112',
      placeholder: 'e.g. ADM-SEC-0112',
      help: 'Enterprise Active Directory identity code with elevated administrative clearance.',
      btn: 'Log in as Administrator →',
    },
  };

  const handlePersonaChange = (newPersona) => {
    setPersona(newPersona);
    setIdentifier(personaConfig[newPersona].defaultId);
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await window.ERPService.login(identifier, password, persona);
      if (response.success) {
        onLoginSuccess(response.user);
      } else {
        setErrorMessage(response.message || 'Authentication failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF7EE] text-[#18191B]">
      {/* 1. TOP BANNER */}
      <div className="bg-[#FFF8DF] border-b border-[#E9E0C8] px-4 sm:px-8 py-2 text-xs text-[#575D66] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold tracking-wider text-black text-[11px] uppercase">Academic Portal V4.2.1 Active</span>
          <span className="text-gray-300">•</span>
          <span className="text-[#33373D]">Fall Semester 2024-2025 Registration & Grading Open</span>
        </div>
        <a href="#help" className="inline-flex items-center gap-1 text-xs font-semibold text-gray-800 hover:text-black hover:underline">
          <span>Campus Info & Help Center</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
        </a>
      </div>

      {/* 2. HEADER */}
      <header className="bg-[#FAF7EE] border-b border-[#ECE5D5] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#121417] text-white flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-[#FFD233]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z"/>
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-[#121417] leading-tight">Student Management System</h1>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">Official University SIS Gateway</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          <span className="px-3 py-1.5 rounded-full bg-[#FFD233] text-black text-xs font-bold shadow-sm">Portal Access</span>
          <span className="px-3 py-1.5 rounded-full text-gray-600 text-xs font-medium">System Status</span>
          <span className="px-3 py-1.5 rounded-full text-gray-600 text-xs font-medium">Helpdesk & Support</span>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F2EDE1] text-[11px] font-semibold text-gray-700 border border-[#E3DC handle-gray]">
            AY 2024-2025
          </span>
          <span className="hidden sm:block text-xs font-semibold text-gray-700 underline">Support Contact</span>
          <div className="w-8 h-8 rounded-full bg-[#18191B] text-white flex items-center justify-center text-xs font-bold border border-gray-300">
            SIS
          </div>
        </div>
      </header>

      {/* 3. MAIN CONTENT GRID */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Hero & Academic Hub Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECE5D5] text-[11px] font-bold tracking-wider uppercase text-gray-800 border border-[#E0D8C6]">
              <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
              Official Campus Gateway
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Student Management System</p>
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black tracking-tight text-[#111315] leading-[1.15]">
                Welcome to your <br className="hidden sm:inline"/>Academic Hub.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#575D66] leading-relaxed max-w-xl">
                Sign in to access verified transcripts, syllabus tracking, real-time timetable changes, tuition portals, and research databases.
              </p>
            </div>

            {/* Metrics pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E4DFD3] text-xs font-semibold text-gray-700 shadow-sm">
                18,400 Enrolled Students
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E4DFD3] text-xs font-semibold text-gray-700 shadow-sm">
                7 Faculties & Labs
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-[#E4DFD3] text-xs font-semibold text-gray-700 shadow-sm">
                Accredited Academic Core
              </div>
            </div>

            {/* Campus Bulletin & Schedule */}
            <div className="portal-card p-5 bg-white border border-[#ECE6D8]">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FFD233]"></span>
                  <h3 className="font-extrabold text-sm tracking-tight text-gray-900">Campus Bulletin & Schedule</h3>
                </div>
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">Updated 24m Ago</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="bg-[#FAF8F2] border border-[#ECE5D5] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#B45309] uppercase">Campus Notice</span>
                      <span className="text-[11px] text-gray-500 font-medium">Nov 18, 2024</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">Mid-Semester Draft Schedule</h4>
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                      Timetable revision draft for all faculties is now open for review. Student revisions must be submitted by Friday 5:00 PM.
                    </p>
                  </div>
                  <div className="pt-3">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1">View Timetable Draft →</span>
                  </div>
                </div>

                <div className="bg-[#FAF8F2] border border-[#ECE5D5] rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] uppercase">Systems Operational</span>
                    </div>
                    <h4 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug">Moodle LMS & SIS Nodes</h4>
                    <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">
                      Cloud infrastructure running at 99.9% throughput. Library proxy authentication and research database synchronized without downtime.
                    </p>
                  </div>
                  <div className="pt-3 flex items-center gap-2 text-[11px] text-gray-500 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Latency 18ms | SSL Valid
                  </div>
                </div>
              </div>
            </div>

            {/* Need assistance logging in */}
            <div className="portal-card p-4 sm:p-5 bg-[#FAF8F2] border border-[#E9E1D2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900">Need assistance logging in?</h4>
                <p className="text-xs text-gray-600 mt-0.5">
                  Contact the 24/7 IT Campus Helpdesk: call <span className="font-semibold text-gray-900">(800) 555-0199</span> or visit the IT Desk in the Library, Room 204.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button type="button" onClick={() => alert('Launching Self-Recovery wizard...')} className="px-3 py-1.5 rounded-lg border border-gray-400 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 transition">Self-Recovery</button>
                <button type="button" onClick={() => alert('Opening Student Roll PIN activation...')} className="px-3 py-1.5 rounded-lg border border-gray-400 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-800 transition">Activate Student Roll</button>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Card */}
          <div className="lg:col-span-5">
            <div className="portal-card bg-white border border-[#E6DFD1] p-6 sm:p-7 shadow-lg rounded-2xl">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Identity & Access Security Core
                </span>
                <span className="bg-[#F2EDE1] px-2 py-0.5 rounded text-gray-700 font-mono">ID: 2024</span>
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tight text-[#111315]">Sign In</h3>
                <p className="text-xs text-gray-500 mt-1">Please authenticate using your university-issued credentials.</p>
              </div>

              {/* Persona Switcher */}
              <div className="mt-5">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-2">Select Portal Persona</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handlePersonaChange('student')}
                    className={`persona-pill py-2 px-2 text-center rounded-lg text-xs font-bold ${persona === 'student' ? 'active' : 'hover:bg-gray-50'}`}
                  >
                    {persona === 'student' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mr-1"></span>}
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePersonaChange('faculty')}
                    className={`persona-pill py-2 px-2 text-center rounded-lg text-xs font-bold ${persona === 'faculty' ? 'active' : 'hover:bg-gray-50'}`}
                  >
                    {persona === 'faculty' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mr-1"></span>}
                    Faculty
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePersonaChange('admin')}
                    className={`persona-pill py-2 px-2 text-center rounded-lg text-xs font-bold ${persona === 'admin' ? 'active' : 'hover:bg-gray-50'}`}
                  >
                    {persona === 'admin' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-black mr-1"></span>}
                    Admin / IT
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-800">{personaConfig[persona].label}</label>
                    <span className="text-[11px] font-bold text-gray-600 underline cursor-pointer" onClick={() => alert('Format syntax: STU-YYYY-XXXX for Students, FAC-DEPT-XXXX for Faculty, ADM-SEC-XXXX for Admins.')}>Format ID</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={personaConfig[persona].placeholder}
                    className="input-portal w-full px-3.5 py-2.5 rounded-lg text-xs font-mono font-medium text-gray-900"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">{personaConfig[persona].help}</p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-800">Institutional Password</label>
                    <span className="text-[11px] font-bold text-gray-600 underline cursor-pointer" onClick={() => alert('Password reset link sent to institutional inbox.')}>Forgot password?</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-portal w-full px-3.5 pr-10 py-2.5 rounded-lg text-xs text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 text-xs"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-black border-gray-300"
                    />
                    <span className="text-xs text-gray-700 font-medium">Remember on this workstation</span>
                  </label>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">30 days valid</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? 'Authenticating...' : personaConfig[persona].btn}
                </button>

                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => alert('Connecting to Microsoft Azure AD SSO...')}
                    className="w-full py-2.5 px-3 rounded-lg border border-[#DCD5C6] bg-white hover:bg-[#F9F7F1] text-xs font-bold text-gray-800 flex items-center justify-center gap-2"
                  >
                    Campus Single Sign-On (Azure AD / One-Credential)
                  </button>
                </div>

                <div className="bg-[#FAF8F2] border border-[#ECE5D5] rounded-xl p-3 text-[11px] text-gray-600">
                  <strong className="text-gray-800 block">Strict Multi-Factor Policy Enforced</strong>
                  Sign-in is logged on central servers. Unattended sessions automatically expire in 15 mins. Unauthorized access attempts are monitored and logged.
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-[#FAF7EE] border-t border-[#ECE5D5] px-4 sm:px-8 py-4 text-[11px] text-gray-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-gray-700 font-semibold bg-[#EFEAE0] px-2 py-0.5 rounded">
              Session Timeout: 15:00 inactive
            </span>
            <span className="font-semibold text-gray-800">Campus Directory</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-gray-500">
            <span>256-bit SSL Secure</span>
            <span>•</span>
            <span>FERPA Compliant Infrastructure</span>
            <span>•</span>
            <span>Identity Access Management</span>
            <span>•</span>
            <span>Security Policy</span>
          </div>
          <div className="text-gray-500">
            © 2024 Student Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

window.LoginView = LoginView;
