// Sample users with new fields
let users = [
    { 
        id: "1", name: "Ahmed Hassan", age: 28, type: "traveler", status: "active", 
        trips: [
            { tripId: "TRP001", trip: "Pyramids - Pending", accompanyingTravelers: "", 
              vehicleDriver: "Mohamed Ali", licensePlate: "XYZ789", 
              startDate: "2024-05-10", endDate: "2024-05-10" }
        ]
    },
    { 
        id: "2", name: "Sara Mahmoud", age: 34, type: "organizer", status: "active", 
        trips: [
            { tripId: "TRP002", trip: "Luxor Tour - Approved", accompanyingTravelers: "", 
              vehicleDriver: "Mohamed Ali", licensePlate: "XYZ789", 
              startDate: "2024-06-01", endDate: "2024-06-05" }
        ]
    },
    { 
        id: "3", name: "Omar El-Sayed", age: 42, type: "tour guide", status: "active", 
        trips: [
            { tripId: "TRP002", trip: "Valley of Kings", accompanyingTravelers: "", 
              vehicleDriver: "Mohamed Ali", licensePlate: "XYZ789", 
              startDate: "2024-06-01", endDate: "2024-06-05" }
        ]
    },
    { 
        id: "4", name: "Laila Ibrahim", age: 25, type: "traveler", status: "inactive", 
        trips: []
    },
    { 
        id: "5", name: "Mohamed Ali", age: 38, type: "driver", status: "active", 
        trips: [
            { tripId: "TRP003", trip: "Airport Transfers", accompanyingTravelers: "", 
              vehicleDriver: "", licensePlate: "XYZ789", 
              startDate: "2024-05-15", endDate: "2024-05-15" }
        ]
    },
    { 
        id: "6", name: "Nourhan Adel", age: 29, type: "traveler", status: "active", 
        trips: [
            { tripId: "TRP003", trip: "Nubian Village - Pending", accompanyingTravelers: "", 
              vehicleDriver: "Mohamed Ali", licensePlate: "XYZ789", 
              startDate: "2024-05-15", endDate: "2024-05-15" }
        ]
    },
    { 
        id: "7", name: "Khaled Youssef", age: 45, type: "tour guide", status: "inactive", 
        trips: []
    },
    { 
        id: "8", name: "Mona Said", age: 31, type: "organizer", status: "active", 
        trips: [
            { tripId: "TRP004", trip: "Cairo Food Tour", accompanyingTravelers: "", 
              vehicleDriver: "Mohamed Ali", licensePlate: "XYZ789", 
              startDate: "2024-07-10", endDate: "2024-07-10" }
        ]
    }
];

// DOM elements
const tbody = document.getElementById('usersList');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const tripIdFilter = document.getElementById('tripIdFilter');
const addBtn = document.getElementById('addUserBtn');
const userModal = document.getElementById('userModal');
const deleteModal = document.getElementById('deleteModal');
const modalTitle = document.getElementById('modalTitle');
const userId = document.getElementById('userId');
const userName = document.getElementById('userName');
const userAge = document.getElementById('userAge');
const userType = document.getElementById('userType');
const userStatus = document.getElementById('userStatus');

// Trip fields (can be multiple)
const tripsContainer = document.getElementById('tripsContainer');
let tripCounter = 0;

let editingId = null;
let deletingId = null;

// Check if two date ranges overlap
function datesOverlap(start1, end1, start2, end2) {
    return (start1 <= end2 && start2 <= end1);
}

// Check if a user has overlapping trips
function hasOverlappingTrips(userTrips, newTrip) {
    for (let trip of userTrips) {
        if (datesOverlap(trip.startDate, trip.endDate, newTrip.startDate, newTrip.endDate)) {
            return true;
        }
    }
    return false;
}

// Check if driver is available for new trip
function isDriverAvailable(driverName, newTrip, excludeUserId = null) {
    for (let user of users) {
        if (user.id === excludeUserId) continue;
        if (user.type === 'driver' && user.name === driverName) {
            for (let trip of user.trips) {
                if (datesOverlap(trip.startDate, trip.endDate, newTrip.startDate, newTrip.endDate)) {
                    return false;
                }
            }
        }
    }
    return true;
}

// Get all drivers for dropdown
function getDriverOptions() {
    let drivers = users.filter(u => u.type === 'driver' && u.status === 'active');
    return drivers.map(d => d.name);
}

// Add trip row to modal
function addTripRow(tripData = null) {
    let rowId = `trip-row-${tripCounter}`;
    let drivers = getDriverOptions();
    
    let driverOptions = '<option value="">Select Driver</option>';
    drivers.forEach(d => {
        driverOptions += `<option value="${d}">${d}</option>`;
    });
    
    let tripIdVal = tripData ? tripData.tripId : '';
    let tripNameVal = tripData ? tripData.trip : '';
    let accompanyingVal = tripData ? tripData.accompanyingTravelers : '';
    let driverVal = tripData ? tripData.vehicleDriver : '';
    let plateVal = tripData ? tripData.licensePlate : '';
    let startVal = tripData ? tripData.startDate : '';
    let endVal = tripData ? tripData.endDate : '';
    
    let html = `
        <div class="trip-row" id="${rowId}" style="border:1px solid #ccc; padding:10px; margin:10px 0;">
            <div style="display:flex; justify-content:space-between;">
                <strong>Trip ${tripCounter + 1}</strong>
                <button type="button" class="remove-trip-btn" onclick="removeTripRow('${rowId}')">Remove</button>
            </div>
            <input type="text" class="trip-id" placeholder="Trip ID (e.g., TRP001)" value="${tripIdVal}">
            <input type="text" class="trip-name" placeholder="Trip Name" value="${tripNameVal}">
            <input type="date" class="trip-start" placeholder="Start Date" value="${startVal}">
            <input type="date" class="trip-end" placeholder="End Date" value="${endVal}">
            <input type="text" class="accompanying-travelers" placeholder="Accompanying Travelers (comma separated)" value="${accompanyingVal}">
            <select class="vehicle-driver">${driverOptions}</select>
            <input type="text" class="license-plate" placeholder="License Plate" value="${plateVal}">
        </div>
    `;
    
    tripsContainer.insertAdjacentHTML('beforeend', html);
    
    // Set selected driver if exists
    if (driverVal) {
        let select = document.querySelector(`#${rowId} .vehicle-driver`);
        if (select) select.value = driverVal;
    }
    
    tripCounter++;
}

// Remove trip row
function removeTripRow(rowId) {
    document.getElementById(rowId).remove();
}

// Collect trips from modal
function collectTripsFromModal() {
    let trips = [];
    let rows = document.querySelectorAll('.trip-row');
    
    for (let row of rows) {
        let tripId = row.querySelector('.trip-id').value.trim();
        let tripName = row.querySelector('.trip-name').value.trim();
        let startDate = row.querySelector('.trip-start').value;
        let endDate = row.querySelector('.trip-end').value;
        let accompanying = row.querySelector('.accompanying-travelers').value.trim();
        let driver = row.querySelector('.vehicle-driver').value;
        let plate = row.querySelector('.license-plate').value.trim();
        
        if (tripId && tripName && startDate && endDate) {
            trips.push({
                tripId, trip: tripName, startDate, endDate,
                accompanyingTravelers: accompanying,
                vehicleDriver: driver, licensePlate: plate
            });
        }
    }
    return trips;
}

// Validate trips for conflicts
function validateTrips(userId, userType, userTrips, newTrips, isEdit = false) {
    let errors = [];
    
    // Check each new trip
    for (let i = 0; i < newTrips.length; i++) {
        let newTrip = newTrips[i];
        
        // Check required fields
        if (!newTrip.tripId || !newTrip.trip || !newTrip.startDate || !newTrip.endDate) {
            errors.push(`Trip ${i+1}: Missing required fields (ID, Name, Start Date, End Date)`);
            continue;
        }
        
        // Check date order
        if (newTrip.startDate > newTrip.endDate) {
            errors.push(`Trip ${i+1}: Start date cannot be after end date`);
        }
        
        // Check overlapping with user's existing trips
        let existingTrips = isEdit ? userTrips.filter(t => t.tripId !== newTrip.tripId) : userTrips;
        if (hasOverlappingTrips(existingTrips, newTrip)) {
            errors.push(`Trip ${i+1}: Overlaps with another trip for this user`);
        }
        
        // Check driver availability (if user is not a driver)
        if (userType !== 'driver' && newTrip.vehicleDriver) {
            if (!isDriverAvailable(newTrip.vehicleDriver, newTrip, isEdit ? userId : null)) {
                errors.push(`Trip ${i+1}: Driver ${newTrip.vehicleDriver} is not available during these dates`);
            }
        }
    }
    
    // Check for overlapping among new trips themselves
    for (let i = 0; i < newTrips.length; i++) {
        for (let j = i + 1; j < newTrips.length; j++) {
            if (datesOverlap(newTrips[i].startDate, newTrips[i].endDate, 
                            newTrips[j].startDate, newTrips[j].endDate)) {
                errors.push(`Trip ${i+1} and Trip ${j+1}: Cannot have overlapping trips for the same user`);
            }
        }
    }
    
    return errors;
}

// Update Trip ID dropdown options
function updateTripIdDropdown() {
    let allTrips = [];
    users.forEach(u => {
        u.trips.forEach(t => {
            if (t.tripId) allTrips.push(t.tripId);
        });
    });
    let tripIds = [...new Set(allTrips)];
    tripIdFilter.innerHTML = '<option value="all">All Trip IDs</option>';
    tripIds.forEach(id => {
        tripIdFilter.innerHTML += `<option value="${id}">${id}</option>`;
    });
}

// Display users in table (with multiple trip rows)
function displayUsers() {
    let search = searchInput.value.toLowerCase();
    let type = typeFilter.value;
    let tripId = tripIdFilter.value;
    
    let filtered = users.filter(u => 
        (search === '' || u.name.toLowerCase().includes(search)) &&
        (type === 'all' || u.type === type) &&
        (tripId === 'all' || u.trips.some(t => t.tripId === tripId))
    );
    
    if (filtered.length === 0) {
        document.getElementById('emptyState').style.display = 'block';
        tbody.innerHTML = '';
        return;
    }
    
    document.getElementById('emptyState').style.display = 'none';
    tbody.innerHTML = '';
    
    filtered.forEach(u => {
        if (u.trips.length === 0) {
            // User with no trips
            let row = tbody.insertRow();
            row.innerHTML = `
                <td>${u.name}</td>
                <td>${u.age}</td>
                <td><span class="type-${u.type.replace(' ', '-')}">${u.type}</span></td>
                <td><span class="status-${u.status}">${u.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                <td colspan="8" style="text-align:center;">No trips assigned</td>
                <td>
                    <button class="edit-btn" onclick="editUser('${u.id}')">Edit</button>
                    <button class="delete-btn" onclick="deletePrompt('${u.id}', '${u.name}')">Delete</button>
                </td>
            `;
        } else {
            // User with trips - each trip on a new line under same name
            u.trips.forEach((t, index) => {
                let row = tbody.insertRow();
                let showAccompanying = (u.type === 'traveler' && t.accompanyingTravelers) ? t.accompanyingTravelers : '-';
                let showDriver = (u.type === 'driver') ? '-' : (t.vehicleDriver || '-');
                let showPlate = (u.type === 'driver') ? '-' : (t.licensePlate || '-');
                
                if (index === 0) {
                    // First row shows user info
                    row.innerHTML = `
                        <td rowspan="${u.trips.length}">${u.name}</td>
                        <td rowspan="${u.trips.length}">${u.age}</td>
                        <td rowspan="${u.trips.length}"><span class="type-${u.type.replace(' ', '-')}">${u.type}</span></td>
                        <td rowspan="${u.trips.length}"><span class="status-${u.status}">${u.status === 'active' ? 'Active' : 'Inactive'}</span></td>
                        <td>${t.tripId || '-'}</td>
                        <td>${t.trip}</td>
                        <td>${showAccompanying}</td>
                        <td>${showDriver}</td>
                        <td>${showPlate}</td>
                        <td>${t.startDate || '-'}</td>
                        <td>${t.endDate || '-'}</td>
                        <td rowspan="${u.trips.length}">
                            <button class="edit-btn" onclick="editUser('${u.id}')">Edit</button>
                            <button class="delete-btn" onclick="deletePrompt('${u.id}', '${u.name}')">Delete</button>
                        </td>
                    `;
                } else {
                    // Subsequent rows only show trip info
                    row.innerHTML = `
                        <td>${t.tripId || '-'}</td>
                        <td>${t.trip}</td>
                        <td>${showAccompanying}</td>
                        <td>${showDriver}</td>
                        <td>${showPlate}</td>
                        <td>${t.startDate || '-'}</td>
                        <td>${t.endDate || '-'}</td>
                    `;
                }
            });
        }
    });
}

// Edit user
function editUser(id) {
    let user = users.find(u => u.id === id);
    if (!user) return;
    
    editingId = id;
    modalTitle.innerText = 'Edit User';
    userId.value = user.id;
    userName.value = user.name;
    userAge.value = user.age;
    userType.value = user.type;
    userStatus.value = user.status;
    
    // Clear and add trip rows
    tripsContainer.innerHTML = '';
    tripCounter = 0;
    
    if (user.trips.length === 0) {
        addTripRow();
    } else {
        user.trips.forEach(trip => {
            addTripRow(trip);
        });
    }
    
    userModal.style.display = 'block';
}

// Delete prompt
function deletePrompt(id, name) {
    deletingId = id;
    document.getElementById('deleteUserName').innerText = name;
    deleteModal.style.display = 'block';
}

// Remove inactive user from all references
function removeInactiveFromReferences(userId, userName, userType) {
    users.forEach(u => {
        u.trips.forEach(trip => {
            // Remove from accompanying travelers (ONLY if target is traveler AND current is also traveler)
            if (u.type === 'traveler' && trip.accompanyingTravelers) {
                let travelers = trip.accompanyingTravelers.split(',').map(t => t.trim());
                if (travelers.includes(userName)) {
                    travelers = travelers.filter(t => t !== userName);
                    trip.accompanyingTravelers = travelers.join(', ');
                }
            }
            // Remove as driver (for non-drivers)
            if (u.type !== 'driver' && trip.vehicleDriver === userName) {
                trip.vehicleDriver = '';
                trip.licensePlate = '';
            }
        });
    });
}

// Save user (add or edit)
function saveUser() {
    let name = userName.value.trim();
    let age = parseInt(userAge.value);
    let type = userType.value;
    let status = userStatus.value;
    let newTrips = collectTripsFromModal();
    
    if (!name || !age || !type) {
        alert('Fill all required fields');
        return;
    }
    
    if (newTrips.length === 0) {
        alert('At least one trip must be added');
        return;
    }
    
    let userTrips = [];
    if (editingId) {
        let existingUser = users.find(u => u.id === editingId);
        userTrips = existingUser.trips;
    }
    
    // Validate trips
    let errors = validateTrips(editingId, type, userTrips, newTrips, !!editingId);
    
    if (errors.length > 0) {
        alert('ERRORS:\n\n' + errors.join('\n'));
        return;
    }
    
    if (editingId) {
        // Edit existing user
        let oldUser = users.find(u => u.id === editingId);
        let oldStatus = oldUser.status;
        
        // If status changed to inactive, remove from all references
        if (oldStatus !== 'inactive' && status === 'inactive') {
            for (let trip of newTrips) {
                if (trip.trip !== 'None' && trip.trip !== '') {
                    trip.trip = trip.trip + " (cancelled)";
                }
            }
            removeInactiveFromReferences(editingId, oldUser.name, oldUser.type);
        }
        // If status changed from inactive to active, remove (cancelled)
        else if (oldStatus === 'inactive' && status === 'active') {
            for (let trip of newTrips) {
                if (trip.trip.includes("(cancelled)")) {
                    trip.trip = trip.trip.replace(" (cancelled)", "");
                }
            }
        }
        
        let index = users.findIndex(u => u.id === editingId);
        users[index] = { 
            id: editingId, name, age, type, status, trips: newTrips
        };
    } else {
        // Add new user
        let newId = String(users.length + 1);
        users.push({ 
            id: newId, name, age, type, status, trips: newTrips
        });
    }
    
    closeModals();
    updateTripIdDropdown();
    displayUsers();
}

// Delete user
function deleteUser() {
    let deletedUser = users.find(u => u.id === deletingId);
    if (deletedUser) {
        removeInactiveFromReferences(deletingId, deletedUser.name, deletedUser.type);
    }
    users = users.filter(u => u.id !== deletingId);
    closeModals();
    updateTripIdDropdown();
    displayUsers();
}

// Close modals
function closeModals() {
    userModal.style.display = 'none';
    deleteModal.style.display = 'none';
    editingId = null;
    deletingId = null;
}

// Open add modal
function openAddModal() {
    editingId = null;
    modalTitle.innerText = 'Add User';
    userId.value = '';
    userName.value = '';
    userAge.value = '';
    userType.value = '';
    userStatus.value = 'active';
    
    tripsContainer.innerHTML = '';
    tripCounter = 0;
    addTripRow();
    
    userModal.style.display = 'block';
}

// Handle user type change
userType.addEventListener('change', function() {
    let type = userType.value;
    let allRows = document.querySelectorAll('.trip-row');
    
    allRows.forEach(row => {
        let accompanyingInput = row.querySelector('.accompanying-travelers');
        let driverSelect = row.querySelector('.vehicle-driver');
        
        if (type === 'traveler') {
            accompanyingInput.disabled = false;
            accompanyingInput.placeholder = "Accompanying Travelers (comma separated)";
        } else {
            accompanyingInput.disabled = true;
            accompanyingInput.value = '';
            accompanyingInput.placeholder = "Only travelers can have accompanying travelers";
        }
        
        if (type === 'driver') {
            driverSelect.disabled = true;
            driverSelect.value = '';
        } else {
            driverSelect.disabled = false;
        }
    });
});

// Add trip button
document.getElementById('addTripBtn').onclick = function() {
    addTripRow();
};

// Event listeners
searchInput.oninput = displayUsers;
typeFilter.onchange = displayUsers;
tripIdFilter.onchange = displayUsers;
addBtn.onclick = openAddModal;
document.getElementById('saveUserBtn').onclick = saveUser;
document.getElementById('cancelModalBtn').onclick = closeModals;
document.getElementById('confirmDelete').onclick = deleteUser;
document.getElementById('cancelDelete').onclick = closeModals;
document.querySelector('.close-modal').onclick = closeModals;
document.querySelector('.close-delete').onclick = closeModals;

// Login check
function checkLogin() {
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let authLink = document.getElementById('authLink');
    if (isLoggedIn) {
        authLink.innerText = 'Logout';
        authLink.href = '#';
        authLink.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('beyondPyramids_currentUser');
            window.location.reload();
        };
    }
}

// Make functions global
window.editUser = editUser;
window.deletePrompt = deletePrompt;
window.removeTripRow = removeTripRow;

// Initialize
updateTripIdDropdown();
displayUsers();
checkLogin();