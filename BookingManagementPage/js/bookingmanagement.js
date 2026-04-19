// Booking Management - Simple & Minimal

let bookings = [];
let currentBookingId = null;
let currentAction = null;

// Demo Data
const demoBookings = [
    {
        id: 'b1',
        bookingNumber: 'EG-2026-0001',
        userName: 'John Smith',
        userEmail: 'john@email.com',
        packageName: 'Pyramids of Giza',
        packageType: 'single',
        startDate: '2026-05-15',
        endDate: '2026-05-15',
        travelers: 2,
        totalPrice: 1000,
        status: 'pending',
        specialRequests: 'Need wheelchair access',
        createdAt: '2026-04-10'
    },
    {
        id: 'b2',
        bookingNumber: 'EG-2026-0002',
        userName: 'Sarah Ahmed',
        userEmail: 'sarah@email.com',
        packageName: 'Cairo Highlights Tour',
        packageType: 'day',
        startDate: '2026-06-01',
        endDate: '2026-06-01',
        travelers: 4,
        totalPrice: 3996,
        status: 'confirmed',
        specialRequests: '',
        createdAt: '2026-04-12'
    },
    {
        id: 'b3',
        bookingNumber: 'EG-2026-0003',
        userName: 'Michael Brown',
        userEmail: 'michael@email.com',
        packageName: 'Nile Cruise Luxor to Aswan',
        packageType: 'week',
        startDate: '2026-07-10',
        endDate: '2026-07-17',
        travelers: 2,
        totalPrice: 15000,
        status: 'pending',
        specialRequests: 'Vegetarian meals',
        createdAt: '2026-04-15'
    },
    {
        id: 'b4',
        bookingNumber: 'EG-2026-0004',
        userName: 'Emily Davis',
        userEmail: 'emily@email.com',
        packageName: 'Custom Egypt Tour',
        packageType: 'custom',
        startDate: '2026-08-05',
        endDate: '2026-08-12',
        travelers: 3,
        totalPrice: 12500,
        status: 'completed',
        specialRequests: '',
        createdAt: '2026-03-20'
    }
];

function loadData() {
    bookings = [...demoBookings];
    updateStats();
    renderBookings();
}

function updateStats() {
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('pendingCount').textContent = `Pending: ${bookings.filter(b => b.status === 'pending').length}`;
    document.getElementById('confirmedCount').textContent = `Confirmed: ${bookings.filter(b => b.status === 'confirmed').length}`;
    document.getElementById('completedCount').textContent = bookings.filter(b => b.status === 'completed').length;

    let revenue = bookings.reduce((sum, b) => {
        if (b.status === 'confirmed' || b.status === 'completed') {
            return sum + b.totalPrice;
        }
        return sum;
    }, 0);
    document.getElementById('totalRevenue').textContent = revenue + ' EGP';
}

function renderBookings() {
    let filtered = [...bookings];

    let search = document.getElementById('searchInput').value.toLowerCase();
    if (search) {
        filtered = filtered.filter(b =>
            b.bookingNumber.toLowerCase().includes(search) ||
            b.userName.toLowerCase().includes(search) ||
            b.packageName.toLowerCase().includes(search)
        );
    }

    let status = document.getElementById('statusFilter').value;
    if (status !== 'all') {
        filtered = filtered.filter(b => b.status === status);
    }

    let type = document.getElementById('typeFilter').value;
    if (type !== 'all') {
        filtered = filtered.filter(b => b.packageType === type);
    }

    let container = document.getElementById('bookingsContainer');
    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;">No bookings found</p>';
        return;
    }

    filtered.forEach(b => {
        let template = document.getElementById('bookingCardTemplate');
        let card = template.content.cloneNode(true);

        card.querySelector('.booking-number').textContent = b.bookingNumber;
        let statusSpan = card.querySelector('.booking-status');
        statusSpan.textContent = b.status.toUpperCase();
        statusSpan.classList.add(b.status);
        card.querySelector('.booking-package').textContent = b.packageName;
        card.querySelector('.booking-customer').textContent = `${b.userName} (${b.userEmail})`;
        card.querySelector('.booking-dates').textContent = `${b.startDate} to ${b.endDate}`;
        card.querySelector('.booking-price').textContent = `${b.totalPrice} EGP`;
        card.querySelector('.booking-travelers').textContent = `${b.travelers} traveler(s)`;

        let viewBtn = card.querySelector('.view-btn');
        let approveBtn = card.querySelector('.approve-btn');
        let rejectBtn = card.querySelector('.reject-btn');
        let completeBtn = card.querySelector('.complete-btn');

        viewBtn.onclick = () => viewBooking(b.id);

        if (b.status === 'pending') {
            approveBtn.style.display = 'inline-block';
            rejectBtn.style.display = 'inline-block';
            completeBtn.style.display = 'none';
            approveBtn.onclick = () => openApproveModal(b.id);
            rejectBtn.onclick = () => openRejectModal(b.id);
        } else if (b.status === 'confirmed') {
            approveBtn.style.display = 'none';
            rejectBtn.style.display = 'inline-block';
            completeBtn.style.display = 'inline-block';
            rejectBtn.onclick = () => openRejectModal(b.id);
            completeBtn.onclick = () => openCompleteModal(b.id);
        } else {
            approveBtn.style.display = 'none';
            rejectBtn.style.display = 'none';
            completeBtn.style.display = 'none';
        }

        container.appendChild(card);
    });
}

function viewBooking(id) {
    let b = bookings.find(b => b.id === id);
    let details = document.getElementById('viewDetails');
    details.innerHTML = `
        <p><strong>Booking #:</strong> ${b.bookingNumber}</p>
        <p><strong>Customer:</strong> ${b.userName}</p>
        <p><strong>Email:</strong> ${b.userEmail}</p>
        <p><strong>Package:</strong> ${b.packageName}</p>
        <p><strong>Type:</strong> ${b.packageType.toUpperCase()}</p>
        <p><strong>Dates:</strong> ${b.startDate} to ${b.endDate}</p>
        <p><strong>Travelers:</strong> ${b.travelers}</p>
        <p><strong>Total Price:</strong> ${b.totalPrice} EGP</p>
        <p><strong>Status:</strong> ${b.status.toUpperCase()}</p>
        <p><strong>Booked on:</strong> ${b.createdAt}</p>
        <p><strong>Special Requests:</strong> ${b.specialRequests || 'None'}</p>
    `;
    document.getElementById('viewModal').showModal();
}

function openApproveModal(id) {
    currentBookingId = id;
    let b = bookings.find(b => b.id === id);
    document.getElementById('approveBookingName').textContent = b.packageName;
    document.getElementById('approveNotes').value = '';
    document.getElementById('approveModal').showModal();
}

function openRejectModal(id) {
    currentBookingId = id;
    let b = bookings.find(b => b.id === id);
    document.getElementById('rejectBookingName').textContent = b.packageName;
    document.getElementById('rejectReason').value = '';
    document.getElementById('rejectModal').showModal();
}

function openCompleteModal(id) {
    currentBookingId = id;
    let b = bookings.find(b => b.id === id);
    document.getElementById('completeBookingName').textContent = b.packageName;
    document.getElementById('completeFeedback').value = '';
    document.getElementById('completeModal').showModal();
}

function approveBooking() {
    let b = bookings.find(b => b.id === currentBookingId);
    if (b) {
        b.status = 'confirmed';
        updateStats();
        renderBookings();
    }
    document.getElementById('approveModal').close();
}

function rejectBooking() {
    let reason = document.getElementById('rejectReason').value;
    if (!reason) {
        alert('Please provide a reason for cancellation');
        return;
    }
    let b = bookings.find(b => b.id === currentBookingId);
    if (b) {
        b.status = 'cancelled';
        updateStats();
        renderBookings();
    }
    document.getElementById('rejectModal').close();
}

function completeBooking() {
    let b = bookings.find(b => b.id === currentBookingId);
    if (b) {
        b.status = 'completed';
        updateStats();
        renderBookings();
    }
    document.getElementById('completeModal').close();
}

function closeAllModals() {
    let modals = ['viewModal', 'approveModal', 'rejectModal', 'completeModal'];
    modals.forEach(m => {
        let modal = document.getElementById(m);
        if (modal && modal.open) modal.close();
    });
}

function setupFilters() {
    document.getElementById('searchInput').addEventListener('input', () => renderBookings());
    document.getElementById('statusFilter').addEventListener('change', () => renderBookings());
    document.getElementById('typeFilter').addEventListener('change', () => renderBookings());
}

function setupEventListeners() {
    document.getElementById('confirmApproveBtn').onclick = approveBooking;
    document.getElementById('confirmRejectBtn').onclick = rejectBooking;
    document.getElementById('confirmCompleteBtn').onclick = completeBooking;

    let closeBtns = document.querySelectorAll('.close');
    closeBtns.forEach(btn => {
        btn.onclick = closeAllModals;
    });

    document.getElementById('cancelApproveBtn').onclick = () => document.getElementById('approveModal').close();
    document.getElementById('cancelRejectBtn').onclick = () => document.getElementById('rejectModal').close();
    document.getElementById('cancelCompleteBtn').onclick = () => document.getElementById('completeModal').close();
    document.getElementById('closeViewBtn').onclick = () => document.getElementById('viewModal').close();
}

function init() {
    loadData();
    setupFilters();
    setupEventListeners();
}

document.addEventListener('DOMContentLoaded', init);