// Hotel Management - JS
// Data (populated externally)
var hotels = [];
var roomTypes = [];
var reservations = [];
var availability = {};
var settings = {};

// State
var editHotelId = null;
var editRoomId  = null;
var calDate     = new Date();

// ---- Utilities ----

function today() {
    var d = new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function pad(n) {
    return String(n).padStart(2, '0');
}

function fmtDate(s) {
    if (!s) return '-';
    var p = s.split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function hotelName(id) {
    var h = hotels.find(function(h) { return h.id === id; });
    return h ? h.name : '-';
}

function roomName(id) {
    var r = roomTypes.find(function(r) { return r.id === id; });
    return r ? r.name : '-';
}

function roomBed(id) {
    var r = roomTypes.find(function(r) { return r.id === id; });
    return r ? r.bedType : '-';
}

function badge(status) {
    return '<span class="badge badge-' + status + '">' + status.replace('-', ' ') + '</span>';
}

function nextId(arr) {
    return arr.length ? Math.max.apply(null, arr.map(function(x) { return x.id; })) + 1 : 1;
}

function toast(msg, type) {
    var c = document.getElementById('toastContainer');
    var t = document.createElement('div');
    t.className = 'toast ' + (type || 'success');
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(function() { t.remove(); }, 3000);
}

// ---- Auto-booking logic ----

// Returns true if the given date range overlaps with any confirmed reservation
// for the same room type (excluding the reservation with excludeId).
function isBooked(roomTypeId, checkIn, checkOut, excludeId) {
    return reservations.some(function(r) {
        if (r.id === excludeId) return false;
        if (r.roomTypeId !== roomTypeId) return false;
        if (r.status !== 'confirmed') return false;
        // Overlap: start1 < end2 AND end1 > start2
        return checkIn < r.checkOut && checkOut > r.checkIn;
    });
}

// Processes a single pending reservation:
// auto-confirms if the time frame is free, auto-rejects if it is occupied.
function processBooking(r) {
    if (r.status !== 'pending') return;
    r.status = isBooked(r.roomTypeId, r.checkIn, r.checkOut, r.id) ? 'rejected' : 'confirmed';
}

// Processes all pending reservations in arrival order (first-come, first-served).
function autoProcessAll() {
    // Auto-checkout confirmed reservations whose stay has ended
    var t = today();
    reservations.forEach(function(r) {
        if (r.status === 'confirmed' && r.checkOut < t) r.status = 'checked-out';
    });

    // Sort pending by createdAt ascending so earlier requests get priority
    var pending = reservations.filter(function(r) { return r.status === 'pending'; });
    pending.sort(function(a, b) { return new Date(a.createdAt) - new Date(b.createdAt); });
    pending.forEach(function(r) { processBooking(r); });
}

// ---- Navigation ----

function showSection(name) {
    document.querySelectorAll('.section').forEach(function(s) { s.classList.remove('active'); });
    document.querySelectorAll('.nav-item').forEach(function(n) { n.classList.remove('active'); });
    document.getElementById('section-' + name).classList.add('active');
    document.querySelector('[data-section="' + name + '"]').classList.add('active');
    document.getElementById('pageTitle').textContent = {
        overview: 'Overview', hotels: 'Hotels', rooms: 'Room Types',
        availability: 'Availability', reservations: 'Reservations',
        reports: 'Reports', settings: 'Settings'
    }[name];
    ({
        overview: renderOverview, hotels: renderHotels, rooms: renderRooms,
        availability: renderAvailability, reservations: renderReservations,
        reports: renderReports, settings: renderSettings
    })[name]();
}

// ---- Overview ----

function renderOverview() {
    autoProcessAll();
    document.getElementById('stat-hotels').textContent    = hotels.length;
    document.getElementById('stat-rooms').textContent     = roomTypes.reduce(function(s, r) { return s + r.count; }, 0);
    document.getElementById('stat-pending').textContent   = reservations.filter(function(r) { return r.status === 'rejected'; }).length;
    document.getElementById('stat-checkins').textContent  = reservations.filter(function(r) { return r.status === 'confirmed'; }).length;
    document.getElementById('stat-checkouts').textContent = reservations.filter(function(r) { return r.status === 'checked-out'; }).length;
    document.getElementById('stat-confirmed').textContent = reservations.length;

    var rows = reservations.slice().sort(function(a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt);
    }).slice(0, 5);

    document.getElementById('recentReservationsBody').innerHTML = rows.length
        ? rows.map(function(r) {
            return '<tr><td>' + r.id + '</td><td>' + r.guestName + '</td><td>' + hotelName(r.hotelId) +
                   '</td><td>' + fmtDate(r.checkIn) + '</td><td>' + fmtDate(r.checkOut) +
                   '</td><td>$' + r.totalPrice + '</td><td>' + badge(r.status) + '</td></tr>';
        }).join('')
        : '<tr><td colspan="7">No reservations.</td></tr>';
}

// ---- Hotels ----

function renderHotels() {
    var g = document.getElementById('hotelsGrid');
    g.innerHTML = hotels.length
        ? hotels.map(function(h) {
            return '<div class="hotel-card"><strong>' + h.name + '</strong> (' + h.stars + '★)<p>' + h.location +
                   '</p><p>' + h.phone + '</p><p>' + h.email + '</p><p>' + h.totalRooms + ' rooms</p>' +
                   '<div class="hotel-card-footer">' +
                   '<button onclick="openHotelModal(' + h.id + ')">Edit</button>' +
                   '<button onclick="deleteHotel(' + h.id + ')">Delete</button>' +
                   '<button onclick="goToRooms(' + h.id + ')">Rooms</button>' +
                   '</div></div>';
        }).join('')
        : '<p>No hotels yet.</p>';
}

function goToRooms(id) {
    showSection('rooms');
    document.getElementById('roomFilterHotel').value = id;
    renderRooms();
}

function openHotelModal(id) {
    editHotelId = id || null;
    document.getElementById('hotelForm').reset();
    document.getElementById('hotelModalTitle').textContent = id ? 'Edit Hotel' : 'Add Hotel';
    if (id) {
        var h = hotels.find(function(h) { return h.id === id; });
        document.getElementById('hName').value     = h.name;
        document.getElementById('hStars').value    = h.stars;
        document.getElementById('hLocation').value = h.location;
        document.getElementById('hPhone').value    = h.phone;
        document.getElementById('hEmail').value    = h.email;
        document.getElementById('hRooms').value    = h.totalRooms;
    }
    document.getElementById('hotelModal').classList.add('open');
}

function saveHotel() {
    var name = document.getElementById('hName').value.trim();
    var loc  = document.getElementById('hLocation').value.trim();
    if (!name || !loc) { toast('Name and location required.', 'error'); return; }
    var entry = {
        id: editHotelId || nextId(hotels),
        name: name,
        stars: +document.getElementById('hStars').value,
        location: loc,
        phone: document.getElementById('hPhone').value.trim(),
        email: document.getElementById('hEmail').value.trim(),
        totalRooms: +document.getElementById('hRooms').value || 0
    };
    if (editHotelId) {
        hotels = hotels.map(function(h) { return h.id === editHotelId ? entry : h; });
    } else {
        hotels.push(entry);
    }
    toast(editHotelId ? 'Hotel updated.' : 'Hotel added.');
    closeModal('hotelModal');
    renderHotels();
}

function deleteHotel(id) {
    if (!confirm('Delete hotel and its room types?')) return;
    hotels    = hotels.filter(function(h) { return h.id !== id; });
    roomTypes = roomTypes.filter(function(r) { return r.hotelId !== id; });
    toast('Deleted.');
    renderHotels();
}

// ---- Room Types ----

function renderRooms() {
    var sel  = document.getElementById('roomFilterHotel');
    var prev = sel.value;
    sel.innerHTML = '<option value="">All Hotels</option>' +
        hotels.map(function(h) { return '<option value="' + h.id + '">' + h.name + '</option>'; }).join('');
    sel.value = prev;
    var hid  = sel.value ? +sel.value : null;
    var list = hid ? roomTypes.filter(function(r) { return r.hotelId === hid; }) : roomTypes;
    document.getElementById('roomsTableBody').innerHTML = list.length
        ? list.map(function(r) {
            return '<tr><td>' + hotelName(r.hotelId) + '</td><td>' + r.category + '</td><td>' + r.name +
                   '</td><td>' + r.adults + 'A/' + r.children + 'C</td><td>' + r.bedType + '</td><td>$' +
                   r.pricePerNight + '</td><td>' + r.count + '</td><td>' +
                   '<button onclick="openRoomModal(' + r.id + ')">Edit</button> ' +
                   '<button onclick="deleteRoom(' + r.id + ')">Delete</button></td></tr>';
        }).join('')
        : '<tr><td colspan="8">No room types.</td></tr>';
}

function openRoomModal(id) {
    editRoomId = id || null;
    document.getElementById('roomForm').reset();
    document.getElementById('rHotel').innerHTML =
        hotels.map(function(h) { return '<option value="' + h.id + '">' + h.name + '</option>'; }).join('');
    document.getElementById('roomModalTitle').textContent = id ? 'Edit Room Type' : 'Add Room Type';
    if (id) {
        var r = roomTypes.find(function(r) { return r.id === id; });
        document.getElementById('rHotel').value     = r.hotelId;
        document.getElementById('rCategory').value  = r.category;
        document.getElementById('rName').value      = r.name;
        document.getElementById('rAdults').value    = r.adults;
        document.getElementById('rChildren').value  = r.children;
        document.getElementById('rBedType').value   = r.bedType;
        document.getElementById('rPrice').value     = r.pricePerNight;
        document.getElementById('rCount').value     = r.count;
        document.getElementById('rAmenities').value = r.amenities;
    }
    document.getElementById('roomModal').classList.add('open');
}

function saveRoom() {
    var name = document.getElementById('rName').value.trim();
    var hid  = +document.getElementById('rHotel').value;
    if (!name || !hid) { toast('Hotel and room name required.', 'error'); return; }
    var entry = {
        id: editRoomId || nextId(roomTypes),
        hotelId: hid,
        category: document.getElementById('rCategory').value,
        name: name,
        adults: +document.getElementById('rAdults').value || 1,
        children: +document.getElementById('rChildren').value || 0,
        bedType: document.getElementById('rBedType').value.trim(),
        pricePerNight: +document.getElementById('rPrice').value || 0,
        count: +document.getElementById('rCount').value || 0,
        amenities: document.getElementById('rAmenities').value.trim()
    };
    if (editRoomId) {
        roomTypes = roomTypes.map(function(r) { return r.id === editRoomId ? entry : r; });
    } else {
        roomTypes.push(entry);
    }
    toast(editRoomId ? 'Room updated.' : 'Room added.');
    closeModal('roomModal');
    renderRooms();
}

function deleteRoom(id) {
    if (!confirm('Delete this room type?')) return;
    roomTypes = roomTypes.filter(function(r) { return r.id !== id; });
    toast('Deleted.');
    renderRooms();
}

// ---- Availability ----

function renderAvailability() {
    var opts = hotels.map(function(h) { return '<option value="' + h.id + '">' + h.name + '</option>'; }).join('');
    document.getElementById('availHotel').innerHTML     = opts;
    document.getElementById('availFormHotel').innerHTML = opts;
    renderCalendar();
}

function renderCalendar() {
    var y   = calDate.getFullYear();
    var m   = calDate.getMonth();
    var hid = document.getElementById('availHotel').value;
    var t   = today();
    document.getElementById('calMonthLabel').textContent =
        new Date(y, m, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    var days  = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    var html  = days.map(function(d) { return '<div class="cal-day-header">' + d + '</div>'; }).join('');
    var first = new Date(y, m, 1).getDay();
    var total = new Date(y, m + 1, 0).getDate();
    for (var i = 0; i < first; i++) html += '<div class="cal-day empty"></div>';
    for (var d = 1; d <= total; d++) {
        var ds  = y + '-' + pad(m + 1) + '-' + pad(d);
        var st  = availability[hid + '_' + ds];
        var cls = 'cal-day' + (ds === t ? ' today' : '') +
                  (st === 'available' ? ' available' : st === 'blocked' ? ' blocked' : '');
        html += '<div class="' + cls + '">' + d + '</div>';
    }
    document.getElementById('calGrid').innerHTML = html;
}

function saveAvailability() {
    var hid   = document.getElementById('availFormHotel').value;
    var start = document.getElementById('availStart').value;
    var end   = document.getElementById('availEnd').value;
    var st    = document.getElementById('availStatus').value;
    if (!hid || !start || !end) { toast('All fields required.', 'error'); return; }
    if (start > end) { toast('Start must be before end.', 'error'); return; }
    var cur = new Date(start);
    var fin = new Date(end);
    while (cur <= fin) {
        var ds = cur.getFullYear() + '-' + pad(cur.getMonth() + 1) + '-' + pad(cur.getDate());
        availability[hid + '_' + ds] = st;
        cur.setDate(cur.getDate() + 1);
    }
    document.getElementById('availHotel').value = hid;
    renderCalendar();
    toast('Availability updated.');
}

// ---- Reservations ----

function renderReservations() {
    document.getElementById('resFilterHotel').innerHTML =
        '<option value="">All Hotels</option>' +
        hotels.map(function(h) { return '<option value="' + h.id + '">' + h.name + '</option>'; }).join('');
    applyFilters();
}

function applyFilters() {
    autoProcessAll();
    var sf   = document.getElementById('resFilterStatus').value;
    var hf   = document.getElementById('resFilterHotel').value ? +document.getElementById('resFilterHotel').value : null;
    var list = reservations.filter(function(r) {
        return (!sf || r.status === sf) && (!hf || r.hotelId === hf);
    });
    document.getElementById('reservationsTableBody').innerHTML = list.length
        ? list.map(function(r) {
            return '<tr><td>' + r.id + '</td><td>' + r.guestName + '</td><td>' + hotelName(r.hotelId) +
                   '</td><td>' + roomName(r.roomTypeId) + '</td><td>' + fmtDate(r.checkIn) +
                   '</td><td>' + fmtDate(r.checkOut) + '</td><td>' + (r.adults + r.children) +
                   '</td><td>$' + r.totalPrice + '</td><td>' + badge(r.status) + '</td>' +
                   '<td><button onclick="viewRes(\'' + r.id + '\')">View</button></td></tr>';
        }).join('')
        : '<tr><td colspan="10">No reservations found.</td></tr>';
}

function viewRes(id) {
    var r = reservations.find(function(r) { return r.id === id; });
    if (!r) return;
    var nights = Math.round((new Date(r.checkOut) - new Date(r.checkIn)) / 86400000);
    document.getElementById('resDetailContent').innerHTML =
        '<div class="detail-grid">' +
        '<div class="detail-item"><label>Booking ID</label>'  + r.id + '</div>' +
        '<div class="detail-item"><label>Status</label>'      + badge(r.status) + '</div>' +
        '<div class="detail-item"><label>Guest</label>'       + r.guestName + '</div>' +
        '<div class="detail-item"><label>Email</label>'       + r.guestEmail + '</div>' +
        '<div class="detail-item"><label>Phone</label>'       + r.guestPhone + '</div>' +
        '<div class="detail-item"><label>Hotel</label>'       + hotelName(r.hotelId) + '</div>' +
        '<div class="detail-item"><label>Room</label>'        + roomName(r.roomTypeId) + '</div>' +
        '<div class="detail-item"><label>Bed</label>'         + roomBed(r.roomTypeId) + '</div>' +
        '<div class="detail-item"><label>Check-In</label>'    + fmtDate(r.checkIn) + '</div>' +
        '<div class="detail-item"><label>Check-Out</label>'   + fmtDate(r.checkOut) + '</div>' +
        '<div class="detail-item"><label>Nights</label>'      + nights + '</div>' +
        '<div class="detail-item"><label>Guests</label>'      + r.adults + 'A / ' + r.children + 'C</div>' +
        '<div class="detail-item"><label>Total</label>$'      + r.totalPrice + '</div>' +
        '<div class="detail-item"><label>Booked</label>'      + fmtDate(r.createdAt) + '</div>' +
        '</div>' +
        (r.notes ? '<p><strong>Notes:</strong> ' + r.notes + '</p>' : '');
    document.getElementById('reservationModal').classList.add('open');
}

// ---- Reports ----

function renderReports() {
    var rev = reservations.reduce(function(s, r) { return r.status === 'confirmed' || r.status === 'checked-out' ? s + r.totalPrice : s; }, 0);
    document.getElementById('rep-revenue').textContent  = '$' + rev;
    document.getElementById('rep-bookings').textContent = reservations.length;
    document.getElementById('rep-active').textContent   = reservations.filter(function(r) { return r.status === 'confirmed'; }).length;

    var byMonth = {};
    reservations.forEach(function(r) {
        var m = (r.createdAt || '').slice(0, 7) || '?';
        if (!byMonth[m]) byMonth[m] = { count: 0, rev: 0 };
        byMonth[m].count++;
        if (r.status === 'confirmed' || r.status === 'checked-out') byMonth[m].rev += r.totalPrice;
    });
    document.getElementById('monthlyTableBody').innerHTML =
        Object.keys(byMonth).sort(function(a, b) { return b.localeCompare(a); }).map(function(m) {
            return '<tr><td>' + m + '</td><td>' + byMonth[m].count + '</td><td>$' + byMonth[m].rev + '</td></tr>';
        }).join('') || '<tr><td colspan="3">No data.</td></tr>';

    document.getElementById('hotelPerfTableBody').innerHTML = hotels.map(function(h) {
        var hr  = reservations.filter(function(r) { return r.hotelId === h.id; });
        var rev = hr.reduce(function(s, r) { return r.status === 'confirmed' || r.status === 'checked-out' ? s + r.totalPrice : s; }, 0);
        return '<tr><td>' + h.name + '</td><td>' + hr.length + '</td><td>$' + rev + '</td><td>' +
               hr.filter(function(r) { return r.status === 'confirmed'; }).length + '</td></tr>';
    }).join('') || '<tr><td colspan="4">No data.</td></tr>';
}

// ---- Settings ----

function renderSettings() {
    document.getElementById('sManagerName').value  = settings.managerName        || '';
    document.getElementById('sManagerEmail').value = settings.managerEmail       || '';
    document.getElementById('sManagerPhone').value = settings.managerPhone       || '';
    document.getElementById('sCheckIn').value      = settings.checkInTime        || '14:00';
    document.getElementById('sCheckOut').value     = settings.checkOutTime       || '11:00';
    document.getElementById('sCancellation').value = settings.cancellationPolicy || '';
}

function saveSettings() {
    settings = {
        managerName:        document.getElementById('sManagerName').value.trim(),
        managerEmail:       document.getElementById('sManagerEmail').value.trim(),
        managerPhone:       document.getElementById('sManagerPhone').value.trim(),
        checkInTime:        document.getElementById('sCheckIn').value,
        checkOutTime:       document.getElementById('sCheckOut').value,
        cancellationPolicy: document.getElementById('sCancellation').value.trim()
    };
    toast('Settings saved.');
}

// ---- Modals ----

function closeModal(id) {
    document.getElementById(id).classList.remove('open');
}

// ---- Init ----

document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('currentDate').textContent = new Date().toLocaleDateString('en-GB');

    document.querySelectorAll('.nav-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(this.dataset.section);
        });
    });

    document.getElementById('sidebarToggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('collapsed');
    });

    document.querySelectorAll('.modal-close').forEach(function(btn) {
        btn.addEventListener('click', function() { closeModal(this.dataset.close); });
    });

    document.querySelectorAll('.modal-overlay').forEach(function(o) {
        o.addEventListener('click', function(e) { if (e.target === this) this.classList.remove('open'); });
    });

    document.getElementById('addHotelBtn').addEventListener('click', function() { openHotelModal(null); });
    document.getElementById('saveHotelBtn').addEventListener('click', saveHotel);
    document.getElementById('addRoomBtn').addEventListener('click', function() { openRoomModal(null); });
    document.getElementById('saveRoomBtn').addEventListener('click', saveRoom);
    document.getElementById('roomFilterHotel').addEventListener('change', renderRooms);
    document.getElementById('availHotel').addEventListener('change', renderCalendar);
    document.getElementById('calPrev').addEventListener('click', function() { calDate.setMonth(calDate.getMonth() - 1); renderCalendar(); });
    document.getElementById('calNext').addEventListener('click', function() { calDate.setMonth(calDate.getMonth() + 1); renderCalendar(); });
    document.getElementById('saveAvailBtn').addEventListener('click', saveAvailability);
    document.getElementById('resFilterStatus').addEventListener('change', applyFilters);
    document.getElementById('resFilterHotel').addEventListener('change', applyFilters);
    document.getElementById('saveSettingsBtn').addEventListener('click', saveSettings);

    showSection('overview');
});
