'use strict';

let hasUnsavedChanges = false;

function showAlert(message, type = 'success') {
    const container = document.getElementById('alertContainer');
    if (!container) return;
    container.textContent = message;
    container.style.background = type === 'success' ? '#C5A059' : '#dc3545';
    container.style.color = '#fff';
    container.style.padding = '12px 20px';
    container.style.borderRadius = '8px';
    container.style.position = 'fixed';
    container.style.top = '20px';
    container.style.right = '20px';
    container.style.zIndex = '9999';
    container.style.fontWeight = '600';
    container.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    container.classList.remove('hidden');
    setTimeout(() => container.classList.add('hidden'), 3500);
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.tagName === 'TEXTAREA') el.textContent = value || '';
    else el.value = value || '';
}

function getSession() {
    return window.SERVER_USER || null;
}

function populatePersonalInfo(session, userRecord) {
    const name  = userRecord?.name  || session?.name  || '';
    const email = userRecord?.email || session?.email || '';
    const phone = userRecord?.phone || userRecord?.phoneNumber || '';
    const dob   = userRecord?.dob   || userRecord?.dateOfBirth || '';
    const nat   = userRecord?.nationality || '';

    const nameDisplay  = document.getElementById('userNameDisplay');
    const emailDisplay = document.getElementById('userEmailDisplay');
    if (nameDisplay)  nameDisplay.textContent  = name  || '—';
    if (emailDisplay) emailDisplay.textContent = email || '—';

    const imgEl  = document.getElementById('profileAvatarImg');
    const iconEl = document.getElementById('profileAvatarIcon');
    const photoUrl = userRecord?.image || null;
    if (imgEl && photoUrl) {
        imgEl.src = photoUrl;
        imgEl.alt = name;
        imgEl.style.display = 'block';
        if (iconEl) iconEl.style.display = 'none';
    }

    setVal('fullName',    name);
    setVal('email',       email);
    setVal('phoneNumber', phone);
    setVal('nationality', nat);

    if (dob) {
        const dobInput = document.getElementById('dob');
        if (dobInput) dobInput.value = dob.substring(0, 10);
    }

    const joinDate = userRecord?.joinDate || session?.loginTime?.substring(0, 10) || '';
    const memberSince = document.getElementById('memberSince');
    if (memberSince && joinDate) {
        memberSince.textContent = new Date(joinDate).toLocaleDateString('en-GB', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }
}

function savePersonalInfo(session) {
    const name  = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phoneNumber')?.value.trim();
    const dob   = document.getElementById('dob')?.value;
    const nat   = document.getElementById('nationality')?.value.trim();

    if (!name) { showAlert('Full name is required.', 'error'); return false; }

    const updates = { name, phone, dob, nationality: nat };

    fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updates),
    }).catch(() => {});

    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) nameDisplay.textContent = name;

    return true;
}

const PI_LETTERS_ONLY = /^[a-zA-Z\s'-]+$/;

function piErr(id, msg) {
    const inp = document.getElementById(id);
    const span = inp?.nextElementSibling;
    if (span?.classList.contains('error-msg')) { span.textContent = msg; span.classList.add('visible'); }
    inp?.classList.add('invalid');
}
function piClear(id) {
    const inp = document.getElementById(id);
    const span = inp?.nextElementSibling;
    if (span?.classList.contains('error-msg')) { span.textContent = ''; span.classList.remove('visible'); }
    inp?.classList.remove('invalid');
}

function piValidateName() {
    const val = (document.getElementById('fullName')?.value || '').trim();
    if (val.length < 2)             { piErr('fullName', 'Name must be at least 2 characters'); return false; }
    if (!PI_LETTERS_ONLY.test(val)) { piErr('fullName', 'Name must contain letters only');     return false; }
    piClear('fullName'); return true;
}

function piValidatePhone() {
    const digits = (document.getElementById('phoneNumber')?.value || '').replace(/\D/g, '');
    if (digits.length < 7) { piErr('phoneNumber', 'Phone number must be at least 7 digits'); return false; }
    piClear('phoneNumber'); return true;
}

function piValidateDob() {
    const val = document.getElementById('dob')?.value || '';
    if (!val) { piClear('dob'); return true; }
    const age = (Date.now() - new Date(val)) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18)  { piErr('dob', 'You must be at least 18 years old'); return false; }
    if (age > 100) { piErr('dob', 'Age cannot exceed 100 years');       return false; }
    piClear('dob'); return true;
}

function piValidateNationality() {
    const val = document.getElementById('nationality')?.value || '';
    if (!val) { piErr('nationality', 'Please select your nationality'); return false; }
    piClear('nationality'); return true;
}

function piValidateAll() {
    return [piValidateName(), piValidatePhone(), piValidateDob(), piValidateNationality()].every(Boolean);
}

function initPersonalInfo(session) {
    const editBtn   = document.getElementById('editPersonalBtn');
    const saveBtn   = document.getElementById('savePersonalBtn');
    const cancelBtn = document.getElementById('cancelPersonalBtn');
    const allFields = document.querySelectorAll('#personalInfoForm input:not(#email), #personalInfoForm select, #personalInfoForm textarea');

    if (!editBtn) return;

    let snapshot = {};

    const nameEl   = document.getElementById('fullName');
    const phoneEl  = document.getElementById('phoneNumber');
    const dobEl    = document.getElementById('dob');
    const natEl    = document.getElementById('nationality');

    nameEl?.addEventListener('input', () => piValidateName());
    phoneEl?.addEventListener('input', () => {
        phoneEl.value = phoneEl.value.replace(/[a-zA-Z]/g, '');
        piValidatePhone();
    });
    dobEl?.addEventListener('change', () => piValidateDob());
    natEl?.addEventListener('change', () => piValidateNationality());

    editBtn.addEventListener('click', () => {
        allFields.forEach(f => { snapshot[f.id] = f.value; f.disabled = false; });
        editBtn.classList.add('hidden');
        saveBtn.classList.remove('hidden');
        cancelBtn.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        allFields.forEach(f => {
            if (snapshot[f.id] !== undefined) f.value = snapshot[f.id];
            f.disabled = true;
        });
        ['fullName', 'phoneNumber', 'dob', 'nationality'].forEach(piClear);
        editBtn.classList.remove('hidden');
        saveBtn.classList.add('hidden');
        cancelBtn.classList.add('hidden');
    });

    saveBtn.addEventListener('click', () => {
        if (!piValidateAll()) return;
        if (savePersonalInfo(session)) {
            allFields.forEach(f => { f.disabled = true; });
            editBtn.classList.remove('hidden');
            saveBtn.classList.add('hidden');
            cancelBtn.classList.add('hidden');
            showAlert('Profile updated successfully!', 'success');
            hasUnsavedChanges = false;
        }
    });
}

function initProfilePhotoUpload(session) {
    const uploadBtn  = document.getElementById('uploadPhotoBtn');
    const removeBtn  = document.getElementById('removePhotoBtn');
    const fileInput  = document.getElementById('profilePhotoInput');
    const imgEl      = document.getElementById('profileAvatarImg');
    const iconEl     = document.getElementById('profileAvatarIcon');

    if (!uploadBtn || !fileInput) return;
    if (uploadBtn.dataset.photoInit) return;

    uploadBtn.addEventListener('click', () => fileInput.click());

    if (removeBtn) {
        removeBtn.addEventListener('click', async () => {
            if (!confirm('Remove your profile photo?')) return;
            try {
                const res = await fetch('/api/users/avatar', { method: 'DELETE', credentials: 'include' });
                if (!res.ok) throw new Error();
                if (imgEl) { imgEl.src = ''; imgEl.style.display = 'none'; }
                if (iconEl) iconEl.style.display = 'block';
                removeBtn.classList.add('hidden');
                showAlert('Profile photo removed.', 'success');
            } catch {
                showAlert('Failed to remove photo.', 'error');
            }
        });
    }

    fileInput.addEventListener('change', () => {
        const file = fileInput.files && fileInput.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showAlert('Please choose an image file.', 'error');
            fileInput.value = '';
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            showAlert('Profile photo must be smaller than 2 MB.', 'error');
            fileInput.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            if (imgEl) {
                imgEl.src = reader.result;
                imgEl.alt = document.getElementById('fullName')?.value || 'Profile photo';
                imgEl.style.display = 'block';
            }
            if (iconEl) iconEl.style.display = 'none';
        };
        reader.readAsDataURL(file);

        const formData = new FormData();
        formData.append('avatar', file);
        fetch('/api/users/avatar', { method: 'PUT', credentials: 'include', body: formData })
            .then(r => r.json())
            .then(data => {
                if (data.status === 'success') {
                    if (imgEl) { imgEl.src = data.data.imageUrl; imgEl.style.display = 'block'; }
                    if (iconEl) iconEl.style.display = 'none';
                    if (removeBtn) removeBtn.classList.remove('hidden');
                    showAlert('Profile photo updated successfully!', 'success');
                } else {
                    showAlert('Failed to upload photo.', 'error');
                }
            })
            .catch(() => showAlert('Failed to upload photo.', 'error'));

        fileInput.value = '';
    });
}

function initTabs(email) {
    const tabNavs   = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabNavs.forEach(btn => {
        btn.addEventListener('click', e => {
            const targetTab = e.currentTarget.dataset.tab;
            tabNavs.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.add('hidden'));
            e.currentTarget.classList.add('active');
            document.getElementById(`tab-${targetTab}`)?.classList.remove('hidden');
        });
    });
}

function initModals(session) {
    const deleteBtn    = document.getElementById('deleteAccountBtn');
    const deleteModal  = document.getElementById('deleteModal');
    const cancelDelete = document.getElementById('cancelDeleteBtn');
    const confirmDel   = document.getElementById('confirmDeleteBtn');

    if (deleteBtn && deleteModal) {
        deleteBtn.addEventListener('click', () => deleteModal.classList.remove('hidden'));
        cancelDelete?.addEventListener('click', () => deleteModal.classList.add('hidden'));
        confirmDel?.addEventListener('click', async () => {
            try {
                await fetch('/api/users/account', { method: 'DELETE', credentials: 'include' });
            } catch (e) {}
            window.location.href = '/';
        });
    }
}

function initSidebar() {
    const toggle  = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => sidebar.classList.toggle('active'));
    }
}

function showFieldError(inputEl, msg) {
    const span = inputEl?.nextElementSibling;
    if (span?.classList.contains('error-msg')) {
        span.textContent = msg;
        span.classList.add('visible');
        inputEl.classList.add('invalid');
    }
}
function clearFieldError(inputEl) {
    const span = inputEl?.nextElementSibling;
    if (span?.classList.contains('error-msg')) {
        span.textContent = '';
        span.classList.remove('visible');
        inputEl.classList.remove('invalid');
    }
}

function validateNewPassword(val) {
    if (val.length < 6)                    return 'Password must be at least 6 characters.';
    if (!/[a-zA-Z]/.test(val))             return 'Password must contain at least one letter.';
    if (!/\d/.test(val))                   return 'Password must contain at least one number.';
    if (!/[!@#$%^&*()\-+_=]/.test(val))   return 'Password must contain at least one special character (!@#$%^&*-+_=).';
    return '';
}

function initSecurity(session) {
    const updateBtn  = document.getElementById('updatePasswordBtn');
    const newPassEl  = document.getElementById('newPassword');
    const confPassEl = document.getElementById('confirmPassword');
    if (!updateBtn) return;

    newPassEl?.addEventListener('input', () => {
        const err = validateNewPassword(newPassEl.value);
        if (err) showFieldError(newPassEl, err);
        else     clearFieldError(newPassEl);
        if (confPassEl.value) {
            if (confPassEl.value !== newPassEl.value) showFieldError(confPassEl, 'Passwords do not match.');
            else clearFieldError(confPassEl);
        }
    });

    confPassEl?.addEventListener('input', () => {
        if (confPassEl.value !== newPassEl.value) showFieldError(confPassEl, 'Passwords do not match.');
        else clearFieldError(confPassEl);
    });

    updateBtn.addEventListener('click', async () => {
        const currPassEl = document.getElementById('currPassword');

        if (!currPassEl?.value) { showAlert('Please enter your current password.', 'error'); return; }

        const newErr = validateNewPassword(newPassEl.value);
        if (newErr) { showFieldError(newPassEl, newErr); return; }

        if (newPassEl.value !== confPassEl.value) {
            showFieldError(confPassEl, 'Passwords do not match.'); return;
        }

        updateBtn.disabled = true;
        try {
            const res = await fetch('/api/auth/update-password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ currentPassword: currPassEl.value, newPassword: newPassEl.value }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Password update failed');
            document.getElementById('securityForm')?.reset();
            clearFieldError(newPassEl);
            clearFieldError(confPassEl);
            showAlert('Password updated successfully!', 'success');
        } catch (err) {
            showAlert(err.message, 'error');
        } finally {
            updateBtn.disabled = false;
        }
    });
}

function initGlobalSave(session) {
    const btn = document.getElementById('globalSaveBtn');
    if (!btn) return;

    document.querySelectorAll('input:not([type="password"]):not([type="file"]), textarea, select').forEach(inp => {
        inp.addEventListener('input', () => { hasUnsavedChanges = true; });
        inp.addEventListener('change', () => { hasUnsavedChanges = true; });
    });

    btn.addEventListener('click', () => {
        if (savePersonalInfo(session)) {
            hasUnsavedChanges = false;
            showAlert('All changes saved!', 'success');
        }
    });

    window.addEventListener('beforeunload', e => {
        if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = ''; }
    });
}

function validateField(input) {
    const errorSpan = input.nextElementSibling;
    let isValid = input.checkValidity();
    let message = '';

    if (!isValid) {
        if (input.validity.valueMissing)  message = 'This field is required.';
        else if (input.validity.typeMismatch) message = `Please enter a valid ${input.type}.`;
        else if (input.validity.tooShort) message = `Minimum ${input.getAttribute('minlength')} characters required.`;
        else if (input.validity.patternMismatch) message = 'Invalid format. (Example: +20 100 123 4567)';
        input.classList.add('invalid');
        if (errorSpan?.classList.contains('error-msg')) {
            errorSpan.textContent = message;
            errorSpan.classList.add('visible');
        }
    } else {
        if (input.id === 'confirmPassword') {
            const newPass = document.getElementById('newPassword');
            if (newPass && input.value !== newPass.value) {
                input.classList.add('invalid');
                if (errorSpan) { errorSpan.textContent = 'Passwords do not match.'; errorSpan.classList.add('visible'); }
                return false;
            }
        }
        input.classList.remove('invalid');
        if (errorSpan?.classList.contains('error-msg')) {
            errorSpan.textContent = '';
            errorSpan.classList.remove('visible');
        }
    }
    return isValid;
}

function initValidation() {
    const customValidated = new Set(['fullName', 'phoneNumber', 'dob', 'nationality']);
    document.querySelectorAll('input, textarea').forEach(inp => {
        if (customValidated.has(inp.id)) return;
        inp.addEventListener('blur', () => validateField(inp));
        inp.addEventListener('input', () => {
            if (inp.classList.contains('invalid')) validateField(inp);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.LoginGate && !LoginGate.requireLogin({ message: 'You must be logged in to view profile settings.' })) {
        return;
    }

    const session = getSession();
    if (!session) return;

    const userRecord = getSession();

    populatePersonalInfo(session, userRecord);
    initTabs(session.email);
    initPersonalInfo(session);
    initProfilePhotoUpload(session);
    initSecurity(session);
    initModals(session);
    initSidebar();
    initValidation();
});
