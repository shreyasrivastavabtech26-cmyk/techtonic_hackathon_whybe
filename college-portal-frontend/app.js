// College Portal Frontend Interactions & Logic

document.addEventListener('DOMContentLoaded', () => {
  // 1. Persona Configuration
  const personaData = {
    student: {
      idLabel: 'Student Roll Number / User ID',
      formatHint: 'STU-2024-0041',
      placeholder: 'e.g. STU-2024-0041',
      helpText: '11-digit university-issued ID code provided during onboarding and on student ID card.',
      buttonText: 'Log in as Student',
      badgeText: 'Student (Enrolled)'
    },
    faculty: {
      idLabel: 'Faculty Staff ID / Academic NetID',
      formatHint: 'FAC-BIO-8902',
      placeholder: 'e.g. FAC-BIO-8902',
      helpText: 'Authorized faculty identity credential provided by the Office of Academic Affairs.',
      buttonText: 'Log in as Faculty',
      badgeText: 'Faculty / Instructor'
    },
    admin: {
      idLabel: 'Administrative Enterprise ID',
      formatHint: 'ADM-SEC-0112',
      placeholder: 'e.g. ADM-SEC-0112',
      helpText: 'Enterprise Active Directory identity code with elevated administrative clearance.',
      buttonText: 'Log in as Administrator',
      badgeText: 'Admin / IT Staff'
    }
  };

  let activePersona = 'student';

  const personaButtons = document.querySelectorAll('[data-persona]');
  const idLabelEl = document.getElementById('personaIdLabel');
  const idInputEl = document.getElementById('userIdInput');
  const idHelpTextEl = document.getElementById('personaHelpText');
  const submitBtnTextEl = document.getElementById('submitBtnText');

  function updatePersona(personaKey) {
    if (!personaData[personaKey]) return;
    activePersona = personaKey;
    const config = personaData[personaKey];

    // Update active pill classes
    personaButtons.forEach(btn => {
      const isTarget = btn.getAttribute('data-persona') === personaKey;
      if (isTarget) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Update form elements
    if (idLabelEl) idLabelEl.textContent = config.idLabel;
    if (idInputEl) {
      idInputEl.placeholder = config.placeholder;
      idInputEl.value = config.formatHint;
    }
    if (idHelpTextEl) idHelpTextEl.textContent = config.helpText;
    if (submitBtnTextEl) submitBtnTextEl.textContent = `${config.buttonText} →`;
  }

  personaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const persona = btn.getAttribute('data-persona');
      updatePersona(persona);
    });
  });

  // 2. Password Visibility Toggle
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('passwordInput');
  const eyeIcon = document.getElementById('eyeIcon');
  const eyeOffIcon = document.getElementById('eyeOffIcon');

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      if (eyeIcon && eyeOffIcon) {
        eyeIcon.classList.toggle('hidden', isPassword);
        eyeOffIcon.classList.toggle('hidden', !isPassword);
      }
    });
  }

  // 3. Session Timeout Countdown (15 minutes)
  let timeRemainingSeconds = 15 * 60;
  const timeoutDisplay = document.getElementById('sessionTimeoutDisplay');

  function updateTimer() {
    if (!timeoutDisplay) return;
    const minutes = Math.floor(timeRemainingSeconds / 60);
    const seconds = timeRemainingSeconds % 60;
    timeoutDisplay.textContent = `Session Timeout: ${minutes}:${seconds < 10 ? '0' : ''}${seconds} inactive`;
    if (timeRemainingSeconds > 0) {
      timeRemainingSeconds--;
    } else {
      timeoutDisplay.textContent = 'Session Timed Out (Please refresh)';
    }
  }
  setInterval(updateTimer, 1000);
  updateTimer();

  // 4. Interactive Modals (Format ID, Helpdesk, Self-Recovery)
  const modal = document.getElementById('infoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const closeModalBtn = document.getElementById('closeModalBtn');

  function showModal(title, htmlContent) {
    if (!modal) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = htmlContent;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function hideModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideModal);
  }
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) hideModal();
    });
  }

  // Format ID trigger
  const formatIdBtn = document.getElementById('formatIdBtn');
  if (formatIdBtn) {
    formatIdBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('University ID Card Formatting', `
        <div class="space-y-3 text-sm text-gray-700">
          <p>Your institutional ID follows the standard campus identity syntax:</p>
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-3 font-mono text-xs text-gray-800 space-y-1">
            <div><strong>Students:</strong> <span class="text-amber-700">STU-YYYY-XXXX</span> (e.g. STU-2024-0041)</div>
            <div><strong>Faculty:</strong> <span class="text-amber-700">FAC-DEPT-XXXX</span> (e.g. FAC-BIO-8902)</div>
            <div><strong>Admin/Staff:</strong> <span class="text-amber-700">ADM-UNIT-XXXX</span> (e.g. ADM-SEC-0112)</div>
          </div>
          <p>This code is printed directly on your physical RFID Campus Card below the barcode.</p>
        </div>
      `);
    });
  }

  // Forgot password trigger
  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('Password Reset & Recovery', `
        <div class="space-y-4 text-sm text-gray-700">
          <p>Please enter your registered student or institutional email to receive an instant authentication token reset link.</p>
          <input type="email" placeholder="student@university.edu" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm" />
          <div class="flex justify-end gap-2 pt-2">
            <button onclick="document.getElementById('infoModal').classList.add('hidden')" class="px-4 py-2 bg-[#FFD233] font-semibold text-black rounded-lg hover:bg-yellow-400">Send Recovery Link</button>
          </div>
        </div>
      `);
    });
  }

  // Self-Recovery trigger
  const selfRecoveryBtn = document.getElementById('selfRecoveryBtn');
  if (selfRecoveryBtn) {
    selfRecoveryBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('Self-Service Account Recovery', `
        <div class="space-y-3 text-sm text-gray-700">
          <p>Automated self-service recovery handles locked accounts, expired passwords, and hardware token re-synchronization.</p>
          <ul class="list-disc pl-5 space-y-1 text-xs text-gray-600">
            <li>Verify identity with registered 2FA SMS or Authenticator app</li>
            <li>Biometric or photo ID verification if 2FA device is lost</li>
            <li>Re-issue of matriculation barcode token</li>
          </ul>
          <div class="pt-2">
            <button onclick="alert('Redirecting to 2FA Self-Recovery portal...'); document.getElementById('infoModal').classList.add('hidden')" class="w-full py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800">Launch Automated Recovery</button>
          </div>
        </div>
      `);
    });
  }

  // Activate Student Roll trigger
  const activateRollBtn = document.getElementById('activateRollBtn');
  if (activateRollBtn) {
    activateRollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showModal('Activate New Student Roll', `
        <div class="space-y-3 text-sm text-gray-700">
          <p>Newly enrolled for Fall 2024-2025? Activate your institutional account using your temporary enrollment PIN.</p>
          <input type="text" placeholder="Enrollment PIN (6-digits)" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-black text-sm" />
          <button onclick="alert('Verification code dispatched to your admission contact.'); document.getElementById('infoModal').classList.add('hidden')" class="w-full py-2 bg-[#FFD233] font-semibold text-black rounded-lg hover:bg-yellow-400">Validate Enrollment PIN</button>
        </div>
      `);
    });
  }

  // 5. Login Form Submission Simulation
  const loginForm = document.getElementById('loginForm');
  const notificationBanner = document.getElementById('statusToast');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtnTextEl.textContent;
      
      // Visual loading state
      submitBtnTextEl.textContent = 'Authenticating with SIS...';
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-80');

      setTimeout(() => {
        submitBtnTextEl.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-80');

        // Show success alert toast
        if (notificationBanner) {
          notificationBanner.classList.remove('hidden');
          setTimeout(() => {
            notificationBanner.classList.add('hidden');
          }, 4500);
        }
      }, 1000);
    });
  }

  // 6. View Mode Switcher (Desktop Preview / Mobile Preview / Responsive)
  const viewModes = document.querySelectorAll('[data-view-mode]');
  const mainWrapper = document.getElementById('mainPortalWrapper');

  viewModes.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-view-mode');
      viewModes.forEach(b => b.classList.remove('bg-black', 'text-white', 'font-semibold'));
      btn.classList.add('bg-black', 'text-white', 'font-semibold');

      if (mode === 'mobile') {
        mainWrapper.classList.add('mobile-preview');
      } else {
        mainWrapper.classList.remove('mobile-preview');
      }
    });
  });
});
