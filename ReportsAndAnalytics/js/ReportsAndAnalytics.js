let sampleData = {
    travelers: [
        { name: "Ahmed Hassan", joinDate: "2024-01-15", trips: 5 },
        { name: "Sara Mahmoud", joinDate: "2024-02-20", trips: 3 },
        { name: "Laila Ibrahim", joinDate: "2024-01-10", trips: 7 },
        { name: "Nourhan Adel", joinDate: "2024-03-05", trips: 2 },
        { name: "Omar El-Sayed", joinDate: "2023-12-01", trips: 12 },
        { name: "Mona Said", joinDate: "2024-04-10", trips: 4 },
        { name: "Khaled Youssef", joinDate: "2024-01-25", trips: 6 },
        { name: "Yasmin Ibrahim", joinDate: "2024-02-14", trips: 3 },
        { name: "Hany Mohamed", joinDate: "2024-03-20", trips: 8 },
        { name: "Reem Ali", joinDate: "2024-04-01", trips: 1 }
    ],
    employees: [
        { name: "Sara Mahmoud", type: "organizer", salary: 5000, trips: 8 },
        { name: "Omar El-Sayed", type: "tour guide", salary: 4000, trips: 12 },
        { name: "Mohamed Ali", type: "driver", salary: 3000, trips: 15 },
        { name: "Mona Said", type: "organizer", salary: 4800, trips: 6 },
        { name: "Khaled Youssef", type: "tour guide", salary: 4200, trips: 9 },
        { name: "Ahmed Hassan", type: "driver", salary: 3200, trips: 10 },
        { name: "Nourhan Adel", type: "organizer", salary: 5200, trips: 5 },
        { name: "Laila Ibrahim", type: "tour guide", salary: 4500, trips: 7 }
    ],
    trips: [
        { name: "Pyramids Tour", date: "2024-01-15", people: 10, revenue: 600, rating: 4.5, review: "Amazing experience!", status: "completed", package: "Day Package" },
        { name: "Luxor Tour", date: "2024-02-20", people: 8, revenue: 1200, rating: 4.8, review: "Beautiful temples!", status: "completed", package: "Week Package" },
        { name: "Alexandria Tour", date: "2024-01-28", people: 6, revenue: 360, rating: 4.2, review: "Great coastal views", status: "completed", package: "Day Package" },
        { name: "Nubian Village", date: "2024-03-10", people: 12, revenue: 720, rating: 4.9, review: "Cultural immersion!", status: "completed", package: "Day Package" },
        { name: "Sinai Adventure", date: "2024-02-05", people: 5, revenue: 300, rating: 4.0, review: "Good snorkeling", status: "completed", package: "Day Package" },
        { name: "Cairo Food Tour", date: "2024-03-15", people: 7, revenue: 420, rating: 4.6, review: "Delicious food", status: "completed", package: "Custom" },
        { name: "Aswan Temple Tour", date: "2024-04-05", people: 9, revenue: 540, rating: 4.7, review: "Incredible history", status: "completed", package: "Day Package" },
        { name: "White Desert Trip", date: "2024-04-12", people: 4, revenue: 800, rating: 5.0, review: "Magical landscape", status: "completed", package: "Week Package" },
        { name: "Islamic Cairo", date: "2024-01-08", people: 6, revenue: 360, rating: 4.3, review: "Beautiful mosques", status: "completed", package: "Day Package" },
        { name: "Coptic Cairo", date: "2024-02-18", people: 5, revenue: 300, rating: 4.1, review: "Rich history", status: "completed", package: "Day Package" }
    ],
    cancellations: [
        { tripName: "Pyramids Tour", date: "2024-01-10", approved: true, cancelledLastMinute: true },
        { tripName: "Luxor Tour", date: "2024-02-18", approved: true, cancelledLastMinute: false },
        { tripName: "Sinai Adventure", date: "2024-02-03", approved: true, cancelledLastMinute: true },
        { tripName: "Aswan Temple Tour", date: "2024-04-03", approved: true, cancelledLastMinute: false }
    ],
    websiteReviews: [
        { user: "Ahmed", rating: 5, review: "Excellent platform!", date: "2024-01-20" },
        { user: "Sara", rating: 4, review: "Very helpful guides", date: "2024-02-15" },
        { user: "Laila", rating: 5, review: "Best travel experience", date: "2024-01-30" },
        { user: "Omar", rating: 3, review: "Good but pricey", date: "2024-03-01" },
        { user: "Nourhan", rating: 5, review: "Seamless booking", date: "2024-03-15" },
        { user: "Khaled", rating: 4, review: "Would recommend", date: "2024-04-01" },
        { user: "Yasmin", rating: 5, review: "Amazing trips!", date: "2024-02-28" },
        { user: "Hany", rating: 4, review: "Great value", date: "2024-03-20" }
    ]
};

// Trip history data for activity charts
let tripHistory = {
    travelers: {
        "Ahmed Hassan": [
            { date: "2024-01-15", trip: "Pyramids Tour", type: "Day Package" },
            { date: "2024-02-20", trip: "Luxor Tour", type: "Week Package" },
            { date: "2024-03-10", trip: "Nubian Village", type: "Day Package" },
            { date: "2024-04-05", trip: "Aswan Temple Tour", type: "Day Package" },
            { date: "2024-01-28", trip: "Alexandria Tour", type: "Day Package" }
        ],
        "Sara Mahmoud": [
            { date: "2024-02-05", trip: "Sinai Adventure", type: "Day Package" },
            { date: "2024-03-15", trip: "Cairo Food Tour", type: "Custom" },
            { date: "2024-01-20", trip: "Islamic Cairo", type: "Day Package" }
        ],
        "Laila Ibrahim": [
            { date: "2024-01-10", trip: "Pyramids Tour", type: "Day Package" },
            { date: "2024-02-25", trip: "Luxor Tour", type: "Week Package" },
            { date: "2024-03-20", trip: "Nubian Village", type: "Day Package" },
            { date: "2024-04-12", trip: "White Desert Trip", type: "Week Package" },
            { date: "2024-01-05", trip: "Coptic Cairo", type: "Day Package" },
            { date: "2024-02-10", trip: "Alexandria Tour", type: "Day Package" },
            { date: "2024-03-05", trip: "Sinai Adventure", type: "Day Package" }
        ],
        "Nourhan Adel": [
            { date: "2024-03-01", trip: "Pyramids Tour", type: "Day Package" },
            { date: "2024-03-25", trip: "Cairo Food Tour", type: "Custom" }
        ],
        "Omar El-Sayed": [
            { date: "2023-12-05", trip: "Luxor Tour", type: "Week Package" },
            { date: "2024-01-15", trip: "Pyramids Tour", type: "Day Package" },
            { date: "2024-02-20", trip: "Nubian Village", type: "Day Package" },
            { date: "2024-03-10", trip: "White Desert Trip", type: "Week Package" },
            { date: "2024-04-01", trip: "Aswan Temple Tour", type: "Day Package" },
            { date: "2023-12-20", trip: "Alexandria Tour", type: "Day Package" },
            { date: "2024-01-30", trip: "Sinai Adventure", type: "Day Package" },
            { date: "2024-02-15", trip: "Islamic Cairo", type: "Day Package" },
            { date: "2024-03-20", trip: "Coptic Cairo", type: "Day Package" },
            { date: "2024-04-10", trip: "Cairo Food Tour", type: "Custom" }
        ],
        "Mona Said": [
            { date: "2024-04-10", trip: "Pyramids Tour", type: "Day Package" },
            { date: "2024-04-15", trip: "Nubian Village", type: "Day Package" },
            { date: "2024-04-20", trip: "Cairo Food Tour", type: "Custom" },
            { date: "2024-04-25", trip: "Alexandria Tour", type: "Day Package" }
        ],
        "Khaled Youssef": [
            { date: "2024-01-25", trip: "Luxor Tour", type: "Week Package" },
            { date: "2024-02-28", trip: "Pyramids Tour", type: "Day Package" },
            { date: "2024-03-15", trip: "White Desert Trip", type: "Week Package" },
            { date: "2024-01-10", trip: "Sinai Adventure", type: "Day Package" },
            { date: "2024-02-05", trip: "Nubian Village", type: "Day Package" },
            { date: "2024-03-25", trip: "Aswan Temple Tour", type: "Day Package" }
        ],
        "Yasmin Ibrahim": [
            { date: "2024-02-14", trip: "Pyramids Tour", type: "Day Package" },
            { date: "2024-03-01", trip: "Luxor Tour", type: "Week Package" },
            { date: "2024-03-20", trip: "Cairo Food Tour", type: "Custom" }
        ],
        "Hany Mohamed": [
            { date: "2024-03-20", trip: "Nubian Village", type: "Day Package" },
            { date: "2024-04-05", trip: "Pyramids Tour", type: "Day Package" },
            { date: "2024-02-10", trip: "White Desert Trip", type: "Week Package" },
            { date: "2024-01-15", trip: "Alexandria Tour", type: "Day Package" },
            { date: "2024-03-30", trip: "Sinai Adventure", type: "Day Package" },
            { date: "2024-04-12", trip: "Aswan Temple Tour", type: "Day Package" },
            { date: "2024-01-25", trip: "Luxor Tour", type: "Week Package" },
            { date: "2024-02-28", trip: "Cairo Food Tour", type: "Custom" }
        ],
        "Reem Ali": [
            { date: "2024-04-01", trip: "Pyramids Tour", type: "Day Package" }
        ]
    },
    employees: {
        "Sara Mahmoud": [
            { date: "2024-01-15", trip: "Pyramids Tour", role: "Organizer" },
            { date: "2024-02-20", trip: "Luxor Tour", role: "Organizer" },
            { date: "2024-03-10", trip: "Nubian Village", role: "Organizer" },
            { date: "2024-01-28", trip: "Alexandria Tour", role: "Organizer" },
            { date: "2024-03-15", trip: "Cairo Food Tour", role: "Organizer" },
            { date: "2024-04-05", trip: "Aswan Temple Tour", role: "Organizer" },
            { date: "2024-02-05", trip: "Sinai Adventure", role: "Organizer" },
            { date: "2024-04-12", trip: "White Desert Trip", role: "Organizer" }
        ],
        "Omar El-Sayed": [
            { date: "2024-01-15", trip: "Pyramids Tour", role: "Tour Guide" },
            { date: "2024-02-20", trip: "Luxor Tour", role: "Tour Guide" },
            { date: "2024-03-10", trip: "Nubian Village", role: "Tour Guide" },
            { date: "2024-01-28", trip: "Alexandria Tour", role: "Tour Guide" },
            { date: "2024-02-05", trip: "Sinai Adventure", role: "Tour Guide" },
            { date: "2024-03-15", trip: "Cairo Food Tour", role: "Tour Guide" },
            { date: "2024-04-05", trip: "Aswan Temple Tour", role: "Tour Guide" },
            { date: "2024-01-10", trip: "Islamic Cairo", role: "Tour Guide" },
            { date: "2024-02-18", trip: "Coptic Cairo", role: "Tour Guide" },
            { date: "2024-03-20", trip: "White Desert Trip", role: "Tour Guide" },
            { date: "2024-04-01", trip: "Cairo Food Tour", role: "Tour Guide" },
            { date: "2023-12-05", trip: "Luxor Tour", role: "Tour Guide" }
        ],
        "Mohamed Ali": [
            { date: "2024-01-15", trip: "Pyramids Tour", role: "Driver" },
            { date: "2024-02-20", trip: "Luxor Tour", role: "Driver" },
            { date: "2024-03-10", trip: "Nubian Village", role: "Driver" },
            { date: "2024-01-28", trip: "Alexandria Tour", role: "Driver" },
            { date: "2024-02-05", trip: "Sinai Adventure", role: "Driver" },
            { date: "2024-03-15", trip: "Cairo Food Tour", role: "Driver" },
            { date: "2024-04-05", trip: "Aswan Temple Tour", role: "Driver" },
            { date: "2024-01-10", trip: "Islamic Cairo", role: "Driver" },
            { date: "2024-02-18", trip: "Coptic Cairo", role: "Driver" },
            { date: "2024-03-20", trip: "White Desert Trip", role: "Driver" },
            { date: "2024-04-01", trip: "Cairo Food Tour", role: "Driver" },
            { date: "2024-04-12", trip: "White Desert Trip", role: "Driver" },
            { date: "2024-01-20", trip: "Islamic Cairo", role: "Driver" },
            { date: "2024-02-25", trip: "Luxor Tour", role: "Driver" },
            { date: "2024-03-30", trip: "Nubian Village", role: "Driver" }
        ],
        "Mona Said": [
            { date: "2024-01-20", trip: "Islamic Cairo", role: "Organizer" },
            { date: "2024-02-18", trip: "Coptic Cairo", role: "Organizer" },
            { date: "2024-03-20", trip: "White Desert Trip", role: "Organizer" },
            { date: "2024-04-01", trip: "Cairo Food Tour", role: "Organizer" },
            { date: "2024-01-25", trip: "Luxor Tour", role: "Organizer" },
            { date: "2024-02-28", trip: "Pyramids Tour", role: "Organizer" }
        ],
        "Khaled Youssef": [
            { date: "2024-01-15", trip: "Pyramids Tour", role: "Tour Guide" },
            { date: "2024-02-20", trip: "Luxor Tour", role: "Tour Guide" },
            { date: "2024-03-10", trip: "Nubian Village", role: "Tour Guide" },
            { date: "2024-01-28", trip: "Alexandria Tour", role: "Tour Guide" },
            { date: "2024-02-05", trip: "Sinai Adventure", role: "Tour Guide" },
            { date: "2024-03-15", trip: "Cairo Food Tour", role: "Tour Guide" },
            { date: "2024-04-05", trip: "Aswan Temple Tour", role: "Tour Guide" },
            { date: "2024-04-12", trip: "White Desert Trip", role: "Tour Guide" },
            { date: "2024-01-10", trip: "Islamic Cairo", role: "Tour Guide" }
        ],
        "Ahmed Hassan": [
            { date: "2024-01-15", trip: "Pyramids Tour", role: "Driver" },
            { date: "2024-02-20", trip: "Luxor Tour", role: "Driver" },
            { date: "2024-03-10", trip: "Nubian Village", role: "Driver" },
            { date: "2024-01-28", trip: "Alexandria Tour", role: "Driver" },
            { date: "2024-02-05", trip: "Sinai Adventure", role: "Driver" },
            { date: "2024-03-15", trip: "Cairo Food Tour", role: "Driver" },
            { date: "2024-04-05", trip: "Aswan Temple Tour", role: "Driver" },
            { date: "2024-01-20", trip: "Islamic Cairo", role: "Driver" },
            { date: "2024-02-25", trip: "Luxor Tour", role: "Driver" },
            { date: "2024-03-30", trip: "Nubian Village", role: "Driver" }
        ],
        "Nourhan Adel": [
            { date: "2024-01-15", trip: "Pyramids Tour", role: "Organizer" },
            { date: "2024-02-20", trip: "Luxor Tour", role: "Organizer" },
            { date: "2024-03-10", trip: "Nubian Village", role: "Organizer" },
            { date: "2024-04-05", trip: "Aswan Temple Tour", role: "Organizer" },
            { date: "2024-04-12", trip: "White Desert Trip", role: "Organizer" }
        ],
        "Laila Ibrahim": [
            { date: "2024-01-15", trip: "Pyramids Tour", role: "Tour Guide" },
            { date: "2024-02-20", trip: "Luxor Tour", role: "Tour Guide" },
            { date: "2024-03-10", trip: "Nubian Village", role: "Tour Guide" },
            { date: "2024-01-28", trip: "Alexandria Tour", role: "Tour Guide" },
            { date: "2024-02-05", trip: "Sinai Adventure", role: "Tour Guide" },
            { date: "2024-03-15", trip: "Cairo Food Tour", role: "Tour Guide" },
            { date: "2024-04-05", trip: "Aswan Temple Tour", role: "Tour Guide" }
        ]
    }
};

// Chart instances
let travelersChart, employeesChart, tripsChart, ratingChart;

// DOM Elements - Travelers Section
const travelerStartDate = document.getElementById('travelerStartDate');
const travelerEndDate = document.getElementById('travelerEndDate');
const travelerSelect = document.getElementById('travelerSelect');
const applyTravelerBtn = document.querySelector('.apply-traveler-btn');
const resetTravelerBtn = document.querySelector('.reset-traveler-btn');

// DOM Elements - Employees Section
const employeeTypeFilter = document.getElementById('employeeTypeFilter');
const applyEmployeeBtn = document.querySelector('.apply-employee-btn');
const resetEmployeeBtn = document.querySelector('.reset-employee-btn');

// DOM Elements - Trips Section
const tripStartDate = document.getElementById('tripStartDate');
const tripEndDate = document.getElementById('tripEndDate');
const applyTripBtn = document.querySelector('.apply-trip-btn');
const resetTripBtn = document.querySelector('.reset-trip-btn');

// DOM Elements - Reviews Section
const reviewStartDate = document.getElementById('reviewStartDate');
const reviewEndDate = document.getElementById('reviewEndDate');
const applyReviewBtn = document.querySelector('.apply-review-btn');
const resetReviewBtn = document.querySelector('.reset-review-btn');

// Current filter values
let travelerFilters = { startDate: '', endDate: '' };
let tripFilters = { startDate: '', endDate: '' };
let reviewFilters = { startDate: '', endDate: '' };
let currentEmployeeType = 'all';

// Activity chart variables
let travelerActivityChart, employeeActivityChart;

// DOM Elements - Activity Charts
const activityTravelerSelect = document.getElementById('activityTravelerSelect');
const activityEmployeeSelect = document.getElementById('activityEmployeeSelect');
const applyTravelerActivityBtn = document.getElementById('applyTravelerActivityBtn');
const applyEmployeeActivityBtn = document.getElementById('applyEmployeeActivityBtn');
const travelerActivityDetails = document.getElementById('travelerActivityDetails');
const employeeActivityDetails = document.getElementById('employeeActivityDetails');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setDefaultDates();
    populateTravelerDropdown();
    populateActivityDropdowns();
    loadAllData();
    attachEventListeners();
    checkAdminStatus();
});

function setDefaultDates() {
    // Traveler default dates (last 6 months)
    let travelerEnd = new Date();
    let travelerStart = new Date();
    travelerStart.setMonth(travelerStart.getMonth() - 6);
    travelerStartDate.value = travelerStart.toISOString().split('T')[0];
    travelerEndDate.value = travelerEnd.toISOString().split('T')[0];
    travelerFilters = { startDate: travelerStartDate.value, endDate: travelerEndDate.value };
    
    // Trip default dates (last 3 months)
    let tripEnd = new Date();
    let tripStart = new Date();
    tripStart.setMonth(tripStart.getMonth() - 3);
    tripStartDate.value = tripStart.toISOString().split('T')[0];
    tripEndDate.value = tripEnd.toISOString().split('T')[0];
    tripFilters = { startDate: tripStartDate.value, endDate: tripEndDate.value };
    
    // Review default dates (last 6 months)
    let reviewEnd = new Date();
    let reviewStart = new Date();
    reviewStart.setMonth(reviewStart.getMonth() - 6);
    reviewStartDate.value = reviewStart.toISOString().split('T')[0];
    reviewEndDate.value = reviewEnd.toISOString().split('T')[0];
    reviewFilters = { startDate: reviewStartDate.value, endDate: reviewEndDate.value };
}

function populateTravelerDropdown() {
    travelerSelect.innerHTML = '<option value="">Select a traveler</option>';
    sampleData.travelers.forEach(t => {
        travelerSelect.innerHTML += `<option value="${t.name}">${t.name}</option>`;
    });
}


function attachEventListeners() {
    // Traveler section
    applyTravelerBtn.addEventListener('click', applyTravelerFilter);
    resetTravelerBtn.addEventListener('click', resetTravelerFilter);
    travelerSelect.addEventListener('change', updateSelectedTravelerTrips);
    applyTravelerActivityBtn.addEventListener('click', showTravelerActivity);

    
    // Employee section
    applyEmployeeBtn.addEventListener('click', applyEmployeeFilter);
    resetEmployeeBtn.addEventListener('click', resetEmployeeFilter);
    applyEmployeeActivityBtn.addEventListener('click', showEmployeeActivity);
    
    // Trip section
    applyTripBtn.addEventListener('click', applyTripFilter);
    resetTripBtn.addEventListener('click', resetTripFilter);
    
    // Review section
    applyReviewBtn.addEventListener('click', applyReviewFilter);
    resetReviewBtn.addEventListener('click', resetReviewFilter);
}

// ============ TRAVELERS SECTION ============
function applyTravelerFilter() {
    travelerFilters = {
        startDate: travelerStartDate.value,
        endDate: travelerEndDate.value
    };
    updateTravelersSection();
}

function resetTravelerFilter() {
    let end = new Date();
    let start = new Date();
    start.setMonth(start.getMonth() - 6);
    travelerStartDate.value = start.toISOString().split('T')[0];
    travelerEndDate.value = end.toISOString().split('T')[0];
    travelerFilters = { startDate: travelerStartDate.value, endDate: travelerEndDate.value };
    updateTravelersSection();
}

function updateTravelersSection() {
    let travelers = sampleData.travelers;
    
    let filteredTravelers = travelers.filter(t => 
        (!travelerFilters.startDate || t.joinDate >= travelerFilters.startDate) &&
        (!travelerFilters.endDate || t.joinDate <= travelerFilters.endDate)
    );
    
    document.getElementById('totalTravelers').textContent = travelers.length;
    document.getElementById('newTravelers').textContent = filteredTravelers.length;
    
    renderTravelersChart(filteredTravelers);
    updateSelectedTravelerTrips();
}

function updateSelectedTravelerTrips() {
    let selectedName = travelerSelect.value;
    if (selectedName) {
        let traveler = sampleData.travelers.find(t => t.name === selectedName);
        if (traveler) {
            document.getElementById('selectedTravelerTrips').innerHTML = `${traveler.trips} trips booked`;
        } else {
            document.getElementById('selectedTravelerTrips').innerHTML = `0 trips booked`;
        }
    } else {
        document.getElementById('selectedTravelerTrips').innerHTML = `0 trips booked`;
    }
}

function renderTravelersChart(travelers) {
    let ctx = document.getElementById('travelersChart').getContext('2d');
    
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let counts = new Array(12).fill(0);
    
    travelers.forEach(t => {
        let month = new Date(t.joinDate).getMonth();
        counts[month]++;
    });
    
    if (travelersChart) travelersChart.destroy();
    
    travelersChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'New Travelers',
                data: counts,
                backgroundColor: '#3498db',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'top' } }
        }
    });
}

function populateActivityDropdowns() {
    // Populate traveler dropdown
    activityTravelerSelect.innerHTML = '<option value="">Select a traveler</option>';
    sampleData.travelers.forEach(t => {
        activityTravelerSelect.innerHTML += `<option value="${t.name}">${t.name}</option>`;
    });
    
    // Populate employee dropdown
    activityEmployeeSelect.innerHTML = '<option value="">Select an employee</option>';
    sampleData.employees.forEach(e => {
        activityEmployeeSelect.innerHTML += `<option value="${e.name}">${e.name} (${e.type})</option>`;
    });
}

function showTravelerActivity() {
    let selectedName = activityTravelerSelect.value;
    if (!selectedName) {
        alert('Please select a traveler');
        return;
    }
    
    let trips = tripHistory.travelers[selectedName] || [];
    
    if (trips.length === 0) {
        travelerActivityDetails.innerHTML = '<div class="activity-detail-item">No trips found for this traveler</div>';
        if (travelerActivityChart) travelerActivityChart.destroy();
        return;
    }
    
    // Group trips by month
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let tripCounts = new Array(12).fill(0);
    let tripDetails = [];
    
    trips.forEach(trip => {
        let month = new Date(trip.date).getMonth();
        tripCounts[month]++;
        tripDetails.push(`<div class="activity-detail-item"><span class="activity-detail-date">${trip.date}</span> - ${trip.trip} (${trip.type})</div>`);
    });
    
    // Render chart
    let ctx = document.getElementById('travelerActivityChart').getContext('2d');
    if (travelerActivityChart) travelerActivityChart.destroy();
    
    travelerActivityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: `Trips by ${selectedName}`,
                data: tripCounts,
                backgroundColor: '#3498db',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'top' } }
        }
    });
    
    // Show details
    travelerActivityDetails.innerHTML = `
        <strong>Total Trips: ${trips.length}</strong>
        ${tripDetails.join('')}
    `;
}

// ============ EMPLOYEES SECTION ============
function applyEmployeeFilter() {
    currentEmployeeType = employeeTypeFilter.value;
    updateEmployeesSection();
}

function resetEmployeeFilter() {
    employeeTypeFilter.value = 'all';
    currentEmployeeType = 'all';
    updateEmployeesSection();
}

function updateEmployeesSection() {
    let employees = sampleData.employees;
    
    let filtered = currentEmployeeType === 'all' ? employees : employees.filter(e => e.type === currentEmployeeType);
    
    document.getElementById('totalEmployees').textContent = employees.length;
    document.getElementById('filteredEmployeeCount').textContent = filtered.length;
    
    let avgSalary = filtered.length > 0 ? 
        filtered.reduce((sum, e) => sum + e.salary, 0) / filtered.length : 0;
    document.getElementById('avgSalary').textContent = '$' + avgSalary.toFixed(0);
    
    // Trips per employee with type badge
    let tripsHtml = '';
    filtered.forEach(e => {
        let typeClass = '';
        let typeDisplay = '';
        if (e.type === 'organizer') { typeClass = 'type-organizer'; typeDisplay = 'Organizer'; }
        else if (e.type === 'tour guide') { typeClass = 'type-tour-guide'; typeDisplay = 'Tour Guide'; }
        else if (e.type === 'driver') { typeClass = 'type-driver'; typeDisplay = 'Driver'; }
        
        tripsHtml += `<div class="employee-trip-item">
            <strong>${e.name}</strong>
            <span class="employee-type-badge ${typeClass}">${typeDisplay}</span>
            : ${e.trips} trips
        </div>`;
    });
    document.getElementById('employeeTripsList').innerHTML = tripsHtml || '<div>No employees found</div>';
    
    renderEmployeesChart(filtered);
}

function renderEmployeesChart(employees) {
    let ctx = document.getElementById('employeesChart').getContext('2d');
    
    let types = {};
    employees.forEach(e => {
        types[e.type] = (types[e.type] || 0) + 1;
    });
    
    if (employeesChart) employeesChart.destroy();
    
    employeesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(types).map(t => t === 'tour guide' ? 'Tour Guide' : t.charAt(0).toUpperCase() + t.slice(1)),
            datasets: [{
                data: Object.values(types),
                backgroundColor: ['#9b59b6', '#2ecc71', '#e67e22']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function showEmployeeActivity() {
    let selectedName = activityEmployeeSelect.value;
    if (!selectedName) {
        alert('Please select an employee');
        return;
    }
    
    let trips = tripHistory.employees[selectedName] || [];
    
    if (trips.length === 0) {
        employeeActivityDetails.innerHTML = '<div class="activity-detail-item">No trips found for this employee</div>';
        if (employeeActivityChart) employeeActivityChart.destroy();
        return;
    }
    
    // Group trips by month
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let tripCounts = new Array(12).fill(0);
    let tripDetails = [];
    
    trips.forEach(trip => {
        let month = new Date(trip.date).getMonth();
        tripCounts[month]++;
        tripDetails.push(`<div class="activity-detail-item"><span class="activity-detail-date">${trip.date}</span> - ${trip.trip} (${trip.role})</div>`);
    });
    
    // Render chart
    let ctx = document.getElementById('employeeActivityChart').getContext('2d');
    if (employeeActivityChart) employeeActivityChart.destroy();
    
    employeeActivityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: `Trips assisted by ${selectedName}`,
                data: tripCounts,
                backgroundColor: '#2ecc71',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'top' } }
        }
    });
    
    // Show details
    employeeActivityDetails.innerHTML = `
        <strong>Total Trips: ${trips.length}</strong>
        ${tripDetails.join('')}
    `;
}

// ============ TRIPS SECTION ============
function applyTripFilter() {
    tripFilters = {
        startDate: tripStartDate.value,
        endDate: tripEndDate.value
    };
    updateTripsSection();
}

function resetTripFilter() {
    let end = new Date();
    let start = new Date();
    start.setMonth(start.getMonth() - 3);
    tripStartDate.value = start.toISOString().split('T')[0];
    tripEndDate.value = end.toISOString().split('T')[0];
    tripFilters = { startDate: tripStartDate.value, endDate: tripEndDate.value };
    updateTripsSection();
}

function updateTripsSection() {
    let trips = sampleData.trips.filter(t => t.status === 'completed');
    
    let filteredTrips = trips.filter(t => 
        (!tripFilters.startDate || t.date >= tripFilters.startDate) &&
        (!tripFilters.endDate || t.date <= tripFilters.endDate)
    );
    
    document.getElementById('totalTrips').textContent = filteredTrips.length;
    
    let totalRevenue = filteredTrips.reduce((sum, t) => sum + t.revenue, 0);
    document.getElementById('totalRevenue').textContent = '$' + totalRevenue;
    
    // Last minute cancellations
    let lastMinute = sampleData.cancellations.filter(c => 
        c.cancelledLastMinute === true &&
        (!tripFilters.startDate || c.date >= tripFilters.startDate) &&
        (!tripFilters.endDate || c.date <= tripFilters.endDate)
    ).length;
    document.getElementById('lastMinuteCancellations').textContent = lastMinute;
    
    renderTripsTable(filteredTrips);
    updatePopularPackages(filteredTrips);
    renderTripsChart(filteredTrips);
}

function renderTripsTable(trips) {
    let tbody = document.getElementById('tripsTableBody');
    tbody.innerHTML = '';
    
    trips.forEach(t => {
        let row = tbody.insertRow();
        row.innerHTML = `
            <td>${t.name}</td>
            <td>${t.date}</td>
            <td>${t.people}</td>
            <td>$${t.revenue}</td>
            <td>${t.rating} ★ (${t.rating}/5)</td>
            <td>${t.review}</td>
        `;
    });
    
    if (trips.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No trips found</td></tr>';
    }
}

function updatePopularPackages(trips) {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    
    let thisMonthTrips = trips.filter(t => {
        let tripDate = new Date(t.date);
        return tripDate.getMonth() === currentMonth && tripDate.getFullYear() === currentYear;
    });
    
    let packageCount = {};
    thisMonthTrips.forEach(t => {
        packageCount[t.package] = (packageCount[t.package] || 0) + 1;
    });
    
    let entries = Object.entries(packageCount);
    if (entries.length === 0) {
        document.getElementById('mostPopular').textContent = 'No trips this month';
        document.getElementById('leastPopular').textContent = 'No trips this month';
        return;
    }
    
    entries.sort((a, b) => b[1] - a[1]);
    document.getElementById('mostPopular').textContent = `${entries[0][0]} (${entries[0][1]} trips)`;
    document.getElementById('leastPopular').textContent = `${entries[entries.length-1][0]} (${entries[entries.length-1][1]} trips)`;
}

function renderTripsChart(trips) {
    let ctx = document.getElementById('tripsChart').getContext('2d');
    
    let packageRevenue = {};
    trips.forEach(t => {
        packageRevenue[t.package] = (packageRevenue[t.package] || 0) + t.revenue;
    });
    
    if (tripsChart) tripsChart.destroy();
    
    tripsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(packageRevenue),
            datasets: [{
                label: 'Revenue by Package Type ($)',
                data: Object.values(packageRevenue),
                backgroundColor: '#e67e22',
                borderColor: 'black',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { position: 'top' } }
        }
    });
}

// ============ REVIEWS SECTION ============
function applyReviewFilter() {
    reviewFilters = {
        startDate: reviewStartDate.value,
        endDate: reviewEndDate.value
    };
    updateWebsiteReviews();
}

function resetReviewFilter() {
    let end = new Date();
    let start = new Date();
    start.setMonth(start.getMonth() - 6);
    reviewStartDate.value = start.toISOString().split('T')[0];
    reviewEndDate.value = end.toISOString().split('T')[0];
    reviewFilters = { startDate: reviewStartDate.value, endDate: reviewEndDate.value };
    updateWebsiteReviews();
}

function updateWebsiteReviews() {
    let reviews = sampleData.websiteReviews;
    
    let filteredReviews = reviews.filter(r => 
        (!reviewFilters.startDate || r.date >= reviewFilters.startDate) &&
        (!reviewFilters.endDate || r.date <= reviewFilters.endDate)
    );
    
    let avgRating = filteredReviews.length > 0 ?
        filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length : 0;
    document.getElementById('overallRating').textContent = avgRating.toFixed(1);
    
    // Star display
    let starsHtml = '';
    let fullStars = Math.floor(avgRating);
    let halfStar = avgRating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) starsHtml += '★';
    if (halfStar) starsHtml += '½';
    for (let i = starsHtml.length; i < 5; i++) starsHtml += '☆';
    document.getElementById('starDisplay').innerHTML = starsHtml;
    
    // Reviews list
    let reviewsHtml = '';
    filteredReviews.forEach(r => {
        reviewsHtml += `<div class="review-item">
            <strong>${r.user}</strong> - ${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}
            <br><small>"${r.review}" (${r.date})</small>
        </div>`;
    });
    document.getElementById('reviewsList').innerHTML = reviewsHtml || '<div>No reviews yet</div>';
    
    renderRatingChart(filteredReviews);
}

function renderRatingChart(reviews) {
    let ctx = document.getElementById('ratingChart').getContext('2d');
    
    let ratings = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) ratings[r.rating - 1]++;
    });
    
    if (ratingChart) ratingChart.destroy();
    
    ratingChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
            datasets: [{
                data: ratings,
                backgroundColor: ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#27ae60']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

function loadAllData() {
    updateTravelersSection();
    updateEmployeesSection();
    updateTripsSection();
    updateWebsiteReviews();
}

// ============ ADMIN ACCESS ============
function checkAdminStatus() {
    let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let authLink = document.getElementById('authLink');
    
    if (isLoggedIn) {
        let user = JSON.parse(localStorage.getItem('beyondPyramids_currentUser'));
        authLink.innerText = user ? `Logout (${user.firstName})` : 'Logout';
        authLink.href = '#';
        authLink.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('beyondPyramids_currentUser');
            window.location.href = '../index.html';
        };
    } else {
        authLink.innerText = 'Login';
        authLink.href = '../login.html';
    }
}