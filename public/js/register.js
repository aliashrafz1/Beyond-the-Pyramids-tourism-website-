const showError = (id, msg) => { const el = document.getElementById(id); if (el) el.textContent = msg; };
const clearError = (id)       => { const el = document.getElementById(id); if (el) el.textContent = ''; };

const LETTERS_ONLY = /^[a-zA-Z\s'-]+$/;

function validateFirstname() {
  const val = (document.getElementById('firstname')?.value || '').trim();
  if (val.length < 2)             { showError('firstname_error', 'First name must be at least 2 characters'); return false; }
  if (!LETTERS_ONLY.test(val))    { showError('firstname_error', 'First name must contain letters only');     return false; }
  clearError('firstname_error'); return true;
}

function validateLastname() {
  const val = (document.getElementById('lastname')?.value || '').trim();
  if (val.length < 2)             { showError('lastname_error', 'Last name must be at least 2 characters'); return false; }
  if (!LETTERS_ONLY.test(val))    { showError('lastname_error', 'Last name must contain letters only');     return false; }
  clearError('lastname_error'); return true;
}

function validateDob() {
  const val = document.getElementById('dob')?.value || '';
  if (!val) { showError('dob_error', 'Date of birth is required'); return false; }
  const age = (Date.now() - new Date(val)) / (1000 * 60 * 60 * 24 * 365.25);
  if (age < 18)  { showError('dob_error', 'You must be at least 18 years old'); return false; }
  if (age > 100) { showError('dob_error', 'Age cannot exceed 100 years');       return false; }
  clearError('dob_error'); return true;
}

function validateNationality() {
  const val = document.getElementById('nationality')?.value || '';
  if (!val) { showError('nationality_error', 'Please select your nationality'); return false; }
  clearError('nationality_error'); return true;
}

function validatePhone() {
  const digits = (document.getElementById('phone')?.value || '').replace(/\D/g, '');
  if (digits.length < 7)  { showError('phone_error', 'Phone number must be at least 7 digits');      return false; }
  if (digits.length > 12) { showError('phone_error', 'Phone number cannot exceed 12 digits'); return false; }
  clearError('phone_error'); return true;
}

function validateEmail() {
  const val = (document.getElementById('email')?.value || '').trim();
  if (!/^[^\s@]+@egypt\.com$/i.test(val)) { showError('email_error', 'Email must be a valid @egypt.com address'); return false; }
  clearError('email_error'); return true;
}

function validatePassword() {
  const val = document.getElementById('password')?.value || '';
  if (val.length < 6)                        { showError('password_error', 'Password must be at least 6 characters');                        return false; }
  if (!/[a-zA-Z]/.test(val))                 { showError('password_error', 'Password must contain at least one letter');                     return false; }
  if (!/\d/.test(val))                       { showError('password_error', 'Password must contain at least one number');                     return false; }
  if (!/[!@#$%^&*()\-+_=]/.test(val))       { showError('password_error', 'Password must contain at least one special character (!@#$%^&*-+_=)'); return false; }
  clearError('password_error'); return true;
}

function validateConfirmPassword() {
  const pass = document.getElementById('password')?.value         || '';
  const conf = document.getElementById('confirm_password')?.value || '';
  if (pass !== conf) { showError('confirm_password_error', 'Passwords do not match'); return false; }
  clearError('confirm_password_error'); return true;
}

document.addEventListener('DOMContentLoaded', () => {
  initAtmosphericReveal();
  initGlowInputs();

  document.getElementById('firstname')?.addEventListener('input', validateFirstname);
  document.getElementById('lastname')?.addEventListener('input', validateLastname);
  document.getElementById('dob')?.addEventListener('change', validateDob);
  document.getElementById('nationality')?.addEventListener('change', validateNationality);
  const phoneInput = document.getElementById('phone');
  phoneInput?.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/[a-zA-Z]/g, '').slice(0, 12);
    validatePhone();
  });
  document.getElementById('email')?.addEventListener('input', validateEmail);
  document.getElementById('password')?.addEventListener('input', () => { validatePassword(); validateConfirmPassword(); });
  document.getElementById('confirm_password')?.addEventListener('input', validateConfirmPassword);

  const form   = document.getElementById('registrationForm');
  const errDiv = document.getElementById('register-error');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const allValid = [
      validateFirstname(), validateLastname(), validateDob(), validateNationality(),
      validatePhone(), validateEmail(), validatePassword(), validateConfirmPassword()
    ].every(Boolean);
    if (!allValid) return;

    const countryCode = document.getElementById('country_code')?.value || '';
    const phoneNum    = document.getElementById('phone')?.value        || '';
    const fd = {
      firstname:        document.getElementById('firstname')?.value.trim()        || '',
      lastname:         document.getElementById('lastname')?.value.trim()         || '',
      email:            document.getElementById('email')?.value.trim()            || '',
      password:         document.getElementById('password')?.value                || '',
      dob:              document.getElementById('dob')?.value                     || '',
      nationality:      document.getElementById('nationality')?.value             || '',
      phone:            countryCode ? `${countryCode} ${phoneNum}` : phoneNum,
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) { submitBtn.textContent = 'Creating account...'; submitBtn.disabled = true; }
    if (errDiv) errDiv.style.display = 'none';

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name: `${fd.firstname} ${fd.lastname}`, email: fd.email, password: fd.password, phone: fd.phone, nationality: fd.nationality, dob: fd.dob }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      window.location.href = '/dashboard';
    } catch (err) {
      if (errDiv) { errDiv.style.display = 'block'; errDiv.textContent = err.message; }
      if (submitBtn) { submitBtn.textContent = 'Create Account'; submitBtn.disabled = false; }
    }
  });
});

function initAtmosphericReveal() {
  document.querySelectorAll('.reveal-item').forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.1}s`;
    requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    });
  });
}

function initGlowInputs() {
  document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', () => input.parentElement.classList.add('glow-active'));
    input.addEventListener('blur',  () => input.parentElement.classList.remove('glow-active'));
  });
}
