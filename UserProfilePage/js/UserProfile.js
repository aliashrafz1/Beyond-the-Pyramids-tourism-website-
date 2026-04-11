let hasUnsavedChanges = false;

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initPersonalInfo();
    initModals();
    initSidebar();
    initAvatar();
    initGlobalSave();
});

// --- Tab Navigation ---
function initTabs() {
    const tabNavs = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabNavs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetTab = e.currentTarget.dataset.tab;

            tabNavs.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.add('hidden'));

            e.currentTarget.classList.add('active');
            document.getElementById(`tab-${targetTab}`).classList.remove('hidden');
        });
    });
}

// --- Personal Info Edit Toggle ---
function initPersonalInfo() {
    const editBtn = document.getElementById('editPersonalBtn');
    const saveBtn = document.getElementById('savePersonalBtn');
    const cancelBtn = document.getElementById('cancelPersonalBtn');
    const inputs = document.querySelectorAll('#personalInfoForm input, #personalInfoForm textarea');

    if (!editBtn) return;

    editBtn.addEventListener('click', () => toggleEdit(true));
    cancelBtn.addEventListener('click', () => toggleEdit(false));
    saveBtn.addEventListener('click', () => {
        toggleEdit(false);
        showAlert('Information saved!');
    });

    function toggleEdit(isEditing) {
        inputs.forEach(input => {
            if (input.id !== 'email') input.disabled = !isEditing;
        });

        if (isEditing) {
            editBtn.classList.add('hidden');
            saveBtn.classList.remove('hidden');
            cancelBtn.classList.remove('hidden');
        } else {
            editBtn.classList.remove('hidden');
            saveBtn.classList.add('hidden');
            cancelBtn.classList.add('hidden');
        }
    }
}

// --- Modals ---
function initModals() {
    const deleteBtn = document.getElementById('deleteAccountBtn');
    const deleteModal = document.getElementById('deleteModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    
    if (deleteBtn && deleteModal) {
        deleteBtn.addEventListener('click', () => deleteModal.classList.remove('hidden'));
        cancelDeleteBtn.addEventListener('click', () => deleteModal.classList.add('hidden'));
    }
}

// --- Mobile Sidebar ---
function initSidebar() {
    const mobileToggle = document.getElementById('mobileSidebarToggle');
    const sidebar = document.getElementById('sidebar');

    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('hidden');
        });
    }
}

// --- Avatar Upload ---
function initAvatar() {
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const userAvatar = document.getElementById('userAvatar');
    const photoUploadInput = document.getElementById('photoUploadInput');

    if (changePhotoBtn && photoUploadInput && userAvatar) {
        changePhotoBtn.addEventListener('click', () => photoUploadInput.click());

        photoUploadInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => userAvatar.src = event.target.result;
                reader.readAsDataURL(file);
            }
        });
    }
}

// --- Simple Alert System ---
function showAlert(message) {
    const container = document.getElementById('alertContainer');
    if (!container) return;

    container.textContent = message;
    container.classList.remove('hidden');

    setTimeout(() => {
        container.classList.add('hidden');
    }, 3000);
}

// --- Global Save Tracking ---
function initGlobalSave() {
    const inputs = document.querySelectorAll('input, textarea, select');
    const globalSaveBtn = document.getElementById('globalSaveBtn');

    inputs.forEach(input => {
        const markDirty = () => hasUnsavedChanges = true;
        input.addEventListener('change', markDirty);
        input.addEventListener('input', markDirty);
    });

    if (globalSaveBtn) {
        globalSaveBtn.addEventListener('click', () => {
            hasUnsavedChanges = false;
            showAlert('All profile changes saved successfully!');
        });
    }

    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}
