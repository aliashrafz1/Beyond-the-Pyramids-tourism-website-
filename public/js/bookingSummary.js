let activeBooking = null;

document.addEventListener('DOMContentLoaded', () => {
    const serverBooking = (typeof SERVER_DATA !== 'undefined') ? SERVER_DATA.booking : null;
    activeBooking = serverBooking;

    const cancelBtn = document.getElementById('cancel-booking');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => showCancelRequestModal());
    }
});

function showCancelRequestModal() {
    const existing = document.getElementById('cancel-request-modal');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'cancel-request-modal';
    overlay.className = 'modal-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'cancel-modal-title');

    overlay.innerHTML = `
        <div class="modal-content login-required-modal">
            <div class="modal-header">
                <h2 id="cancel-modal-title"><i class="fas fa-rotate-left"></i> Cancel Request</h2>
            </div>
            <p class="login-required-message">This will discard the current booking summary and return you to the package details page.</p>
            <div class="modal-actions">
                <button type="button" id="cancel-modal-keep-btn" class="btn btn--outline">Keep Booking</button>
                <button type="button" id="cancel-modal-confirm-btn" class="btn btn--primary">Return to Package</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const closeModal = () => {
        overlay.remove();
        document.body.style.overflow = '';
    };

    document.getElementById('cancel-modal-keep-btn')?.addEventListener('click', closeModal);
    document.getElementById('cancel-modal-confirm-btn')?.addEventListener('click', () => {
        window.location.href = getCancelReturnUrl();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
}

function getCancelReturnUrl() {
    if (!activeBooking) return '/packages/day';

    if (activeBooking.isCustom) return '/custom-trip';

    const pkgId = activeBooking.packageId?._id || activeBooking.packageId || activeBooking._packageId;
    if (pkgId) return '/packages/' + pkgId;

    return '/packages/day';
}
