let employees = [];

const ROLE_PERMISSIONS = {
    'Planner': ['Create trips & itineraries', 'Modify package details', 'Assign guides', 'View tourist feedback'],
    'Booking Manager': ['Approve/Reject bookings', 'Manage payment status', 'Process refunds', 'View overall capacity'],
    'Tourist Guide': ['View assigned trips', 'Access customer list', 'Submit trip reports', 'Update live status'],
    'Customer Support': ['Respond to queries', 'Manage complaints', 'Access basic user info', 'Escalate issues'],
    'Hotel Manager': ['Manage room inventory', 'Update hotel rates', 'View check-ins/outs', 'Report maintenance logs'],
    'Transportation Manager': ['Schedule drivers/vehicles', 'Track fleet status', 'Manage transport bookings', 'Log maintenance']
};

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const views = document.querySelectorAll('.view-section');

for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function(e) {
        e.preventDefault();
        
        for (let j = 0; j < navLinks.length; j++) {
            navLinks[j].classList.remove('active');
        }
        for (let k = 0; k < views.length; k++) {
            views[k].classList.remove('active');
        }

        this.classList.add('active');
        document.getElementById(this.getAttribute('data-target')).classList.add('active');
        document.getElementById('pageTitle').innerText = this.innerText;
    });
}

// Modals
const employeeModal = document.getElementById('employeeModal');
const viewModal = document.getElementById('viewModal');

document.getElementById('addEmployeeBtn').addEventListener('click', function() {
    document.getElementById('employeeForm').reset();
    document.getElementById('empId').value = '';
    document.getElementById('roleSpecificSection').classList.add('hidden');
    employeeModal.classList.remove('hidden');
});

document.getElementById('closeModalBtn')?.addEventListener('click', function() {
    employeeModal.classList.add('hidden');
});

document.getElementById('cancelModalBtn').addEventListener('click', function() {
    employeeModal.classList.add('hidden');
});

document.getElementById('closeViewModalBtn').addEventListener('click', function() {
    viewModal.classList.add('hidden');
});

// Form Dynamic fields
document.getElementById('empRole').addEventListener('change', function() {
    document.getElementById('roleSpecificSection').classList.remove('hidden');
    
    if (this.value === 'Tourist Guide') {
        document.getElementById('languagesGroup').classList.remove('hidden');
        document.getElementById('specializationGroup').classList.add('hidden');
    } else {
        document.getElementById('languagesGroup').classList.add('hidden');
        document.getElementById('specializationGroup').classList.remove('hidden');
    }
});

// Save Data
document.getElementById('employeeForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const empId = document.getElementById('empId').value;
    const empData = {
        name: document.getElementById('empName').value,
        email: document.getElementById('empEmail').value,
        phone: document.getElementById('empPhone').value,
        dob: document.getElementById('empDob').value,
        address: document.getElementById('empAddress').value,
        role: document.getElementById('empRole').value,
        hireDate: document.getElementById('empHireDate').value,
        username: document.getElementById('empUsername').value,
        password: document.getElementById('empPassword').value,
        languages: document.getElementById('empLanguages').value,
        specialization: document.getElementById('empSpecialization').value
    };

    if (empId === '') {
        empData.id = 'EMP-' + Math.floor(Math.random() * 10000);
        employees.push(empData);
    } else {
        empData.id = empId;
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].id === empId) {
                employees[i] = empData;
                break;
            }
        }
    }

    renderEmployeesTable();
    employeeModal.classList.add('hidden');
});

// Create Global Functions for onclick in HTML
window.deleteEmployee = function(id) {
    if (confirm('Delete this employee?')) {
        for (let i = 0; i < employees.length; i++) {
            if (employees[i].id === id) {
                employees.splice(i, 1);
                break;
            }
        }
        renderEmployeesTable();
    }
};

window.editEmployee = function(id) {
    let emp = null;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id === id) {
            emp = employees[i];
            break;
        }
    }

    if (emp) {
        document.getElementById('empId').value = emp.id;
        document.getElementById('empName').value = emp.name;
        document.getElementById('empEmail').value = emp.email;
        document.getElementById('empPhone').value = emp.phone;
        document.getElementById('empDob').value = emp.dob;
        document.getElementById('empAddress').value = emp.address;
        document.getElementById('empRole').value = emp.role;
        document.getElementById('empHireDate').value = emp.hireDate;
        document.getElementById('empUsername').value = emp.username;
        document.getElementById('empPassword').value = emp.password;
        document.getElementById('empLanguages').value = emp.languages;
        document.getElementById('empSpecialization').value = emp.specialization;

        document.getElementById('empRole').dispatchEvent(new Event('change'));
        employeeModal.classList.remove('hidden');
    }
};

window.viewEmployee = function(id) {
    let emp = null;
    for (let i = 0; i < employees.length; i++) {
        if (employees[i].id === id) {
            emp = employees[i];
            break;
        }
    }

    if (emp) {
        let text = '<p><strong>ID:</strong> ' + emp.id + '</p>';
        text += '<p><strong>Name:</strong> ' + emp.name + '</p>';
        text += '<p><strong>Role:</strong> ' + emp.role + '</p>';
        text += '<p><strong>Email:</strong> ' + emp.email + '</p>';
        text += '<p><strong>Phone:</strong> ' + emp.phone + '</p>';
        text += '<p><strong>DOB:</strong> ' + emp.dob + '</p>';
        text += '<p><strong>Address:</strong> ' + emp.address + '</p>';
        text += '<p><strong>Hire Date:</strong> ' + emp.hireDate + '</p>';
        text += '<p><strong>Username:</strong> ' + emp.username + '</p>';

        if (emp.role === 'Tourist Guide') {
            text += '<p><strong>Languages:</strong> ' + emp.languages + '</p>';
        } else {
            text += '<p><strong>Specialization:</strong> ' + emp.specialization + '</p>';
        }

        document.getElementById('viewModalContent').innerHTML = text;
        viewModal.classList.remove('hidden');
    }
};

function renderEmployeesTable() {
    const tbody = document.getElementById('employeesTable').querySelector('tbody');
    const recentTbody = document.getElementById('recentHiresTable').querySelector('tbody');
    
    tbody.innerHTML = '';
    recentTbody.innerHTML = '';
    document.getElementById('totalEmpCount').innerText = employees.length;

    if (employees.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7">No employees added yet.</td></tr>';
        renderRolesAndPermissions();
        return;
    }

    for (let i = 0; i < employees.length; i++) {
        const emp = employees[i];
        
        let tr = document.createElement('tr');
        tr.innerHTML = '<td>' + emp.id + '</td>';
        tr.innerHTML += '<td>' + emp.name + '</td>';
        tr.innerHTML += '<td>' + emp.role + '</td>';
        tr.innerHTML += '<td>' + emp.email + '</td>';
        tr.innerHTML += '<td>' + emp.phone + '</td>';
        tr.innerHTML += '<td>' + emp.hireDate + '</td>';
        tr.innerHTML += '<td><button onclick="viewEmployee(\'' + emp.id + '\')">View</button> <button onclick="editEmployee(\'' + emp.id + '\')">Edit</button> <button onclick="deleteEmployee(\'' + emp.id + '\')">Delete</button></td>';
        tbody.appendChild(tr);

        let recentTr = document.createElement('tr');
        recentTr.innerHTML = '<td>' + emp.name + '</td>';
        recentTr.innerHTML += '<td>' + emp.role + '</td>';
        recentTr.innerHTML += '<td>' + emp.hireDate + '</td>';
        recentTbody.appendChild(recentTr);
    }

    renderRolesAndPermissions();
}

function renderRolesAndPermissions() {
    const rolesGrid = document.getElementById('rolesGridContainer');
    rolesGrid.innerHTML = '';

    const roleKeys = Object.keys(ROLE_PERMISSIONS);
    for (let i = 0; i < roleKeys.length; i++) {
        const role = roleKeys[i];
        const perms = ROLE_PERMISSIONS[role];
        
        let count = 0;
        for (let j = 0; j < employees.length; j++) {
            if (employees[j].role === role) {
                count++;
            }
        }
        
        let liHTML = '';
        for (let j = 0; j < perms.length; j++) {
            liHTML += '<li>' + perms[j] + '</li>';
        }

        const card = document.createElement('div');
        card.className = 'role-perm-card';
        card.innerHTML = '<h3>' + role + '</h3><p>' + count + ' Employees</p><ul>' + liHTML + '</ul>';
        
        rolesGrid.appendChild(card);
    }
}

// Initial render
renderEmployeesTable();
