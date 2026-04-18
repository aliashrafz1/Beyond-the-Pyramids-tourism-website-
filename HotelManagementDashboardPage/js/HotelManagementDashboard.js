// --- Mock Data ---
let appData = {
    manager: "Ahmed Mansour",
    hotelId: "H001",
    hotelName: "Marriott Mena House",
    address: "6 Pyramids Road, Giza, Egypt",
    phone: "+20 2 33773222",
    email: "info@marriottmenahouse.com",
    checkInTime: "15:00",
    checkOutTime: "12:00",
    policy: "Free cancellation 24 hours prior to arrival.",
    rooms: [], // Populated below
    reservations: [
        { id: "RES-001", guestName: "John Doe", contact: "john@example.com", roomType: "Deluxe", roomNumber: null, guests: 2, total: 350, status: "Pending", checkIn: "2026-04-20", checkOut: "2026-04-22" },
        { id: "RES-002", guestName: "Sarah Smith", contact: "sarah@example.com", roomType: "Standard", roomNumber: "105", guests: 1, total: 150, status: "Confirmed", checkIn: "2026-04-18", checkOut: "2026-04-20" },
        { id: "RES-003", guestName: "Michael Brown", contact: "mike@example.com", roomType: "Suite", roomNumber: null, guests: 4, total: 800, status: "Cancelled", checkIn: "2026-04-21", checkOut: "2026-04-25" }
    ],
    checkedIn: [
        { guestName: "Emma Wilson", roomNumber: "201", checkIn: "2026-04-15", checkOut: "2026-04-20" },
        { guestName: "David Lee", roomNumber: "305", checkIn: "2026-04-18", checkOut: "2026-04-25" }
    ],
    staff: [
        { name: "Youssef Ali", role: "Receptionist" },
        { name: "Fatima Hassan", role: "Housekeeping" },
        { name: "Kareem Mostafa", role: "Maintenance" }
    ]
};

// Generate 45 rooms mock
for (let i = 1; i <= 45; i++) {
    let floor = Math.ceil(i / 15);
    let num = (floor * 100) + (i % 15 === 0 ? 15 : i % 15);
    let type = i % 10 === 0 ? "Suite" : (i % 3 === 0 ? "Deluxe" : "Standard");
    let price = type === "Suite" ? 400 : (type === "Deluxe" ? 250 : 150);
    let status = "Available";
    
    if (i === 5) status = "Booked"; // Mock Standard room 105
    if (i === 12 || i === 25) status = "Maintenance";
    
    appData.rooms.push({ roomNumber: num.toString(), type: type, floor: floor, capacity: type === "Suite" ? 4 : 2, price: price, status: status });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    autoCheckoutGuests();
    autoCheckInGuests();
    setupNavigation();
    setupModals();
    
    document.getElementById('hotel-name-display').textContent = appData.hotelName;
    document.getElementById('manager-welcome').textContent = `Welcome back, ${appData.manager}`;
    document.getElementById('current-date-display').textContent = new Date().toLocaleDateString();

    renderOverview();
});

// --- Automation Logic ---
function autoCheckoutGuests() {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    for(let i = appData.checkedIn.length - 1; i >= 0; i--) {
        const guest = appData.checkedIn[i];
        const checkoutDate = new Date(guest.checkOut);
        checkoutDate.setHours(0,0,0,0);
        
        if (checkoutDate <= today) {
            const room = appData.rooms.find(r => r.roomNumber === guest.roomNumber);
            if (room) room.status = 'Available';
            appData.checkedIn.splice(i, 1);
        }
    }
}

function autoCheckInGuests() {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    appData.reservations.forEach(res => {
        if (res.status === 'Confirmed' && res.roomNumber && res.checkIn) {
            const checkInDate = new Date(res.checkIn);
            checkInDate.setHours(0,0,0,0);
            
            if (checkInDate <= today) {
                const alreadyCheckedIn = appData.checkedIn.some(g => g.roomNumber === res.roomNumber && g.guestName === res.guestName);
                if (!alreadyCheckedIn) {
                    appData.checkedIn.push({
                        guestName: res.guestName,
                        roomNumber: res.roomNumber,
                        checkIn: res.checkIn,
                        checkOut: res.checkOut || ''
                    });
                }
            }
        }
    });
}

// --- Navigation Logic ---
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(sec => sec.classList.remove('active-section'));

            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active-section');

            switch (targetId) {
                case 'overview-section': renderOverview(); break;
                case 'rooms-section': renderRooms(); break;
                case 'reservations-section': renderReservations(); break;
                case 'guests-section': renderGuests(); break;
                case 'staff-section': renderStaff(); break;
                case 'reports-section': renderReports(); break;
                case 'settings-section': renderSettings(); break;
            }
        });
    });
}

// --- Render Functions ---

function renderOverview() {
    const total = appData.rooms.length;
    const available = appData.rooms.filter(r => r.status === 'Available').length;
    const booked = appData.rooms.filter(r => r.status === 'Booked').length;
    const maintenance = appData.rooms.filter(r => r.status === 'Maintenance').length;
    const occupancy = total > 0 ? Math.round(((booked) / total) * 100) : 0;

    document.getElementById('metric-total-rooms').textContent = total;
    document.getElementById('metric-available-rooms').textContent = available;
    document.getElementById('metric-booked-rooms').textContent = booked;
    document.getElementById('metric-occupancy').textContent = occupancy + '%';
    document.getElementById('metric-maintenance').textContent = maintenance;

    const tbody = document.querySelector('#recent-reservations-table tbody');
    tbody.innerHTML = '';
    [...appData.reservations].reverse().slice(0, 5).forEach(res => {
        tbody.innerHTML += `<tr><td>${res.id}</td><td>${res.guestName}</td><td>${res.roomNumber || 'None'}</td><td>${res.status}</td></tr>`;
    });
}

function renderRooms() {
    const container = document.getElementById('rooms-grid-container');
    const searchVal = document.getElementById('room-search').value.toLowerCase();
    const typeVal = document.getElementById('room-type-filter').value;
    const statusVal = document.getElementById('room-status-filter').value;

    container.innerHTML = '';
    appData.rooms.forEach(room => {
        if (searchVal && !room.roomNumber.toLowerCase().includes(searchVal)) return;
        if (typeVal !== 'all' && room.type !== typeVal) return;
        if (statusVal !== 'all' && room.status !== statusVal) return;

        container.innerHTML += `
            <div class="room-card">
                <div class="room-header">
                    <strong>Room ${room.roomNumber}</strong> <span>${room.status}</span>
                </div>
                <div>
                    <p>Type: ${room.type} | Floor: ${room.floor}</p>
                    <p>Capacity: ${room.capacity} | Base Price: $${room.price}</p>
                </div>
                <div class="room-actions">
                    <button onclick="openEditRoom('${room.roomNumber}')">Edit</button>
                    ${room.status === 'Maintenance' ? `<button onclick="toggleMaintenance('${room.roomNumber}', false)">Make Available</button>` : `<button onclick="toggleMaintenance('${room.roomNumber}', true)">Set Maintenance</button>`}
                </div>
            </div>`;
    });

    document.getElementById('room-search').addEventListener('input', renderRooms, { once: true });
    document.getElementById('room-type-filter').addEventListener('change', renderRooms, { once: true });
    document.getElementById('room-status-filter').addEventListener('change', renderRooms, { once: true });
}

window.toggleMaintenance = function(roomNumber, toMaintenance) {
    const room = appData.rooms.find(r => r.roomNumber === roomNumber);
    if(room) {
        if(toMaintenance && room.status === 'Booked') return alert('Cannot set a booked room to maintenance.');
        room.status = toMaintenance ? 'Maintenance' : 'Available';
        renderRooms();
    }
}

function renderReservations() {
    const tbody = document.querySelector('#reservations-table tbody');
    const filter = document.getElementById('reservation-status-filter').value;
    tbody.innerHTML = '';

    appData.reservations.forEach(res => {
        if (filter !== 'all' && res.status !== filter) return;
        tbody.innerHTML += `
            <tr>
                <td>${res.id}</td>
                <td>${res.guestName}</td>
                <td>${res.contact}</td>
                <td>${res.roomType}</td>
                <td>${res.roomNumber || 'None'}</td>
                <td>${res.checkIn || 'N/A'} - ${res.checkOut || 'N/A'}</td>
                <td>${res.guests}</td>
                <td>$${res.total}</td>
                <td>${res.status}</td>
                <td><button onclick="viewReservation('${res.id}')">View</button></td>
            </tr>`;
    });

    document.getElementById('reservation-status-filter').addEventListener('change', renderReservations, { once: true });
}

window.viewReservation = function(id) {
    const res = appData.reservations.find(r => r.id === id);
    if (!res) return;

    document.getElementById('reservation-details-body').innerHTML = `
        <p><strong>Booking ID:</strong> ${res.id}</p>
        <p><strong>Guest:</strong> ${res.guestName} (${res.contact})</p>
        <p><strong>Type:</strong> ${res.roomType} | <strong>Room:</strong> ${res.roomNumber || 'None'}</p>
        <p><strong>Dates:</strong> ${res.checkIn || 'N/A'} to ${res.checkOut || 'N/A'}</p>
        <p><strong>Status:</strong> ${res.status}</p>
    `;

    let actionsHtml = '';
    if (res.status === 'Confirmed') {
        actionsHtml += `<button onclick="cancelReservation('${res.id}')">Cancel Booking</button>`;
    }
    actionsHtml += `<button onclick="closeAllModals()">Close</button>`;
    document.getElementById('reservation-modal-actions').innerHTML = actionsHtml;
    
    openModal('reservation-modal');
}

window.cancelReservation = function(id) {
    const res = appData.reservations.find(r => r.id === id);
    if(res) {
        if(res.roomNumber) {
            const room = appData.rooms.find(r => r.roomNumber === res.roomNumber);
            if(room) room.status = 'Available';
        }
        res.status = 'Cancelled';
        res.roomNumber = null;
        renderReservations();
        closeAllModals();
    }
}

function renderGuests() {
    const tbody = document.querySelector('#checked-in-table tbody');
    tbody.innerHTML = '';
    appData.checkedIn.forEach(g => {
        tbody.innerHTML += `<tr><td>${g.guestName}</td><td>${g.roomNumber}</td><td>${g.checkIn}</td><td>${g.checkOut}</td></tr>`;
    });
}

function renderStaff() {
    const tbody = document.querySelector('#staff-table tbody');
    tbody.innerHTML = '';
    appData.staff.forEach((s, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${s.name}</td>
                <td>${s.role}</td>
                <td>
                    <button onclick="editStaff(${index})">Edit</button>
                    <button onclick="removeStaff(${index})">Remove</button>
                </td>
            </tr>`;
    });
}

window.editStaff = function(index) {
    const s = appData.staff[index];
    if (s) {
        document.getElementById('staff-modal-title').textContent = 'Edit Staff Member';
        document.getElementById('staff-index').value = index;
        document.getElementById('staff-name').value = s.name;
        document.getElementById('staff-role').value = s.role;
        openModal('staff-modal');
    }
}

window.removeStaff = function(index) {
    appData.staff.splice(index, 1);
    renderStaff();
}

function renderReports() {
    const rev = appData.reservations.filter(r => r.status !== 'Cancelled').reduce((sum, r) => sum + r.total, 0);
    const bookedRooms = appData.rooms.filter(r => r.status === 'Booked');
    const adr = bookedRooms.length > 0 ? Math.round(bookedRooms.reduce((sum, r) => sum + r.price, 0) / bookedRooms.length) : 0;
    const occ = appData.rooms.length > 0 ? Math.round((bookedRooms.length / appData.rooms.length) * 100) : 0;

    document.getElementById('report-total-revenue').textContent = '$' + rev;
    document.getElementById('report-adr').textContent = '$' + adr;
    document.getElementById('report-occupancy').textContent = occ + '%';

    const tbody = document.querySelector('#report-room-type-table tbody');
    tbody.innerHTML = '';
    ['Standard', 'Deluxe', 'Suite'].forEach(type => {
        const typeRooms = appData.rooms.filter(r => r.type === type);
        const typeOcc = typeRooms.filter(r => r.status === 'Booked');
        const pct = typeRooms.length > 0 ? Math.round((typeOcc.length / typeRooms.length) * 100) : 0;
        tbody.innerHTML += `<tr><td>${type}</td><td>${typeRooms.length}</td><td>${typeOcc.length}</td><td>${pct}%</td></tr>`;
    });

    document.getElementById('export-report-btn').onclick = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData));
        const a = document.createElement('a');
        a.href = dataStr;
        a.download = "hotel_reports.json";
        a.click();
    };
}

function renderSettings() {
    document.getElementById('setting-hotel-name').value = appData.hotelName;
    document.getElementById('setting-address').value = appData.address;
    document.getElementById('setting-phone').value = appData.phone;
    document.getElementById('setting-email').value = appData.email;
    document.getElementById('setting-checkin').value = appData.checkInTime;
    document.getElementById('setting-checkout').value = appData.checkOutTime;
    document.getElementById('setting-policy').value = appData.policy;

    document.getElementById('hotel-settings-form').onsubmit = (e) => {
        e.preventDefault();
        appData.hotelName = document.getElementById('setting-hotel-name').value;
        appData.address = document.getElementById('setting-address').value;
        appData.phone = document.getElementById('setting-phone').value;
        appData.email = document.getElementById('setting-email').value;
        document.getElementById('hotel-name-display').textContent = appData.hotelName;
        alert('Settings applied locally (No Storage).');
    };
}

// --- Modals Logic ---

function setupModals() {
    document.querySelectorAll('.close-modal, .close-modal-btn').forEach(btn => btn.addEventListener('click', closeAllModals));
    
    document.getElementById('room-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const mode = document.getElementById('room-form-mode').value;
        const number = document.getElementById('modal-room-number').value;
        
        if (mode === 'add') {
            appData.rooms.push({
                roomNumber: number,
                type: document.getElementById('modal-room-type').value,
                floor: parseInt(document.getElementById('modal-room-floor').value),
                capacity: parseInt(document.getElementById('modal-room-capacity').value),
                price: parseInt(document.getElementById('modal-room-price').value),
                status: 'Available'
            });
        } else {
            const room = appData.rooms.find(r => r.roomNumber === number);
            if(room) {
                room.type = document.getElementById('modal-room-type').value;
                room.floor = parseInt(document.getElementById('modal-room-floor').value);
                room.capacity = parseInt(document.getElementById('modal-room-capacity').value);
                room.price = parseInt(document.getElementById('modal-room-price').value);
                if(document.getElementById('modal-room-status')) room.status = document.getElementById('modal-room-status').value;
            }
        }
        closeAllModals();
        renderRooms();
    });

    const addBookingForm = document.getElementById('add-booking-form');
    if(addBookingForm) {
        addBookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('booking-room-type').value;
            const checkIn = document.getElementById('booking-checkin').value;
            const checkOut = document.getElementById('booking-checkout').value;
            
            const room = appData.rooms.find(r => r.status === 'Available' && r.type === type);
            if (!room) return alert(`No ${type} available.`);
            
            room.status = 'Booked';
            appData.reservations.push({
                id: "RES-" + Math.floor(1000 + Math.random() * 9000),
                guestName: document.getElementById('booking-guest-name').value,
                contact: document.getElementById('booking-contact').value,
                roomType: type,
                roomNumber: room.roomNumber,
                guests: parseInt(document.getElementById('booking-guests').value),
                total: room.price * Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)),
                status: "Confirmed",
                checkIn: checkIn,
                checkOut: checkOut
            });
            
            closeAllModals();
            renderReservations();
        });
    }

    const staffForm = document.getElementById('staff-form');
    if(staffForm) {
        staffForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const index = document.getElementById('staff-index').value;
            const item = { name: document.getElementById('staff-name').value, role: document.getElementById('staff-role').value };
            index === '' ? appData.staff.push(item) : appData.staff[index] = item;
            closeAllModals();
            renderStaff();
        });
    }

    document.getElementById('add-booking-btn')?.addEventListener('click', () => { document.getElementById('add-booking-form').reset(); openModal('add-booking-modal'); });
    document.getElementById('add-staff-btn')?.addEventListener('click', () => { document.getElementById('staff-form').reset(); document.getElementById('staff-index').value = ''; document.getElementById('staff-modal-title').textContent = 'Add Staff Member'; openModal('staff-modal'); });
    document.getElementById('add-room-btn')?.addEventListener('click', () => { document.getElementById('room-form').reset(); document.getElementById('room-form-mode').value = 'add'; document.getElementById('modal-room-number').readOnly = false; document.getElementById('modal-status-group').style.display = 'none'; openModal('room-modal'); });
}

function openModal(id) { document.getElementById(id).classList.remove('hidden-modal'); }
window.closeAllModals = function() { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden-modal')); }

window.openEditRoom = function(roomNumber) {
    const room = appData.rooms.find(r => r.roomNumber === roomNumber);
    if (!room) return;
    document.getElementById('room-form-mode').value = 'edit';
    document.getElementById('modal-room-number').value = room.roomNumber;
    document.getElementById('modal-room-number').readOnly = true; 
    document.getElementById('modal-room-type').value = room.type;
    document.getElementById('modal-room-floor').value = room.floor;
    document.getElementById('modal-room-capacity').value = room.capacity;
    document.getElementById('modal-room-price').value = room.price;
    document.getElementById('modal-status-group').style.display = 'block';
    
    // Status is readonly if currently booked
    const statusSelect = document.getElementById('modal-room-status');
    statusSelect.value = room.status;
    statusSelect.disabled = (room.status === 'Booked');

    openModal('room-modal');
}
