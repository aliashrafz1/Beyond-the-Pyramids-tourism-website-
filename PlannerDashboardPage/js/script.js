let packages = [
    { id: 1, name: "Pyramids Tour", type: "single", price: 25, duration: "4 hours", bookings: 45, status: "active" },
    { id: 2, name: "Luxor Day Trip", type: "day", price: 89, duration: "1 day", bookings: 32, status: "active" },
    { id: 3, name: "Egypt Week", type: "week", price: 599, duration: "7 days", bookings: 18, status: "inactive" }
];

let discounts = [];
let nextId = 4;
let currentFilter = "all";

function displayPackages() {
    let filtered = packages;
    if (currentFilter !== "all") {
        filtered = packages.filter(p => p.type === currentFilter);
    }
    
    let container = document.getElementById("packages-list");
    
    if (filtered.length === 0) {
        container.innerHTML = "<p>No packages found</p>";
        return;
    }
    
    let html = '<table border="1" cellpadding="8" width="100%">';
    html += '<tr bgcolor="#f0f0f0"><th>Name</th><th>Type</th><th>Price</th><th>Duration</th><th>Bookings</th><th>Status</th><th>Actions</th></tr>';
    
    for (let i = 0; i < filtered.length; i++) {
        let p = filtered[i];
        
        let discountHtml = "";
        let activeDiscount = null;
        
        for (let d of discounts) {
            if (d.packageId === p.id && new Date(d.until) > new Date()) {
                activeDiscount = d;
                break;
            }
        }
        
        if (activeDiscount) {
            let newPrice;
            if (activeDiscount.type === "percentage") {
                newPrice = p.price * (1 - activeDiscount.value / 100);
            } else {
                newPrice = p.price - activeDiscount.value;
            }
            discountHtml = `<br><small style="color:green;">🔥 $${newPrice.toFixed(2)}</small>`;
        }
        
        let typeText = p.type;
        if (p.type === "single") typeText = "Single";
        if (p.type === "day") typeText = "Day";
        if (p.type === "week") typeText = "Week";
        
        html += `
            <tr>
                <td>${p.name}${discountHtml}</td>
                <td>${typeText}</td>
                <td>$${p.price}</td>
                <td>${p.duration}</td>
                <td>${p.bookings}</td>
                <td>
                    <select onchange="toggleStatus(${p.id}, this.value)">
                        <option value="active" ${p.status === "active" ? "selected" : ""}>Active</option>
                        <option value="inactive" ${p.status === "inactive" ? "selected" : ""}>Inactive</option>
                    </select>
                </td>
                <td>
                    <button onclick="editPackage(${p.id})">Edit</button>
                    <button onclick="deletePackage(${p.id})">Delete</button>
                </td>
            </tr>
        `;
    }
    html += '</table>';
    container.innerHTML = html;
    
    let options = '<option value="">Select Package</option>';
    for (let i = 0; i < packages.length; i++) {
        let p = packages[i];
        if (p.status === "active") {
            options += `<option value="${p.id}">${p.name} - $${p.price}</option>`;
        }
    }
    document.getElementById("discount-package").innerHTML = options;
}

function displayStats() {
    let total = packages.length;
    let active = 0;
    let bookings = 0;
    let revenue = 0;
    
    for (let i = 0; i < packages.length; i++) {
        let p = packages[i];
        if (p.status === "active") active++;
        bookings += p.bookings;
        revenue += p.price * p.bookings;
    }
    
    let inactive = total - active;
    
    document.getElementById("stats").innerHTML = `
        <p><strong>📦 Packages:</strong> Total: ${total} | Active: ${active} | Inactive: ${inactive}</p>
        <p><strong>📊 Performance:</strong> Total Bookings: ${bookings} | Revenue: $${revenue}</p>
    `;
}

function addPackage(e) {
    e.preventDefault();
    
    let name = document.getElementById("name").value;
    let type = document.getElementById("type").value;
    let price = parseFloat(document.getElementById("price").value);
    let duration = document.getElementById("duration").value;
    
    if (!name || !price) {
        alert("Please fill package name and price");
        return;
    }
    
    if (!duration) {
        duration = "Not specified";
    }
    
    let newPackage = {
        id: nextId,
        name: name,
        type: type,
        price: price,
        duration: duration,
        bookings: 0,
        status: "active"
    };
    
    packages.push(newPackage);
    nextId++;
    
    document.getElementById("add-form").reset();
    displayPackages();
    displayStats();
    alert(`Package "${name}" added!`);
}

function editPackage(id) {
    let p = null;
    for (let i = 0; i < packages.length; i++) {
        if (packages[i].id === id) {
            p = packages[i];
            break;
        }
    }
    
    if (!p) return;
    
    let newName = prompt("Enter new name:", p.name);
    if (newName && newName !== "") {
        p.name = newName;
    }
    
    let newPrice = prompt("Enter new price:", p.price);
    if (newPrice && newPrice !== "") {
        p.price = parseFloat(newPrice);
    }
    
    displayPackages();
    displayStats();
    alert("Package updated!");
}

function deletePackage(id) {
    let confirmDelete = confirm("Are you sure you want to delete this package?");
    
    if (confirmDelete) {
        let newPackages = [];
        for (let i = 0; i < packages.length; i++) {
            if (packages[i].id !== id) {
                newPackages.push(packages[i]);
            }
        }
        packages = newPackages;
        
        let newDiscounts = [];
        for (let i = 0; i < discounts.length; i++) {
            if (discounts[i].packageId !== id) {
                newDiscounts.push(discounts[i]);
            }
        }
        discounts = newDiscounts;
        
        displayPackages();
        displayStats();
        alert("Package deleted!");
    }
}

function toggleStatus(id, status) {
    for (let i = 0; i < packages.length; i++) {
        if (packages[i].id === id) {
            packages[i].status = status;
            break;
        }
    }
    displayPackages();
    displayStats();
}

function applyDiscount() {
    let packageId = parseInt(document.getElementById("discount-package").value);
    let type = document.getElementById("discount-type").value;
    let value = parseFloat(document.getElementById("discount-value").value);
    let until = document.getElementById("discount-until").value;
    
    if (!packageId || !value || !until) {
        alert("Please select a package and enter discount details");
        return;
    }
    
    let p = null;
    for (let i = 0; i < packages.length; i++) {
        if (packages[i].id === packageId) {
            p = packages[i];
            break;
        }
    }
    
    if (!p) return;
    
    let newPrice;
    if (type === "percentage") {
        newPrice = p.price * (1 - value / 100);
    } else {
        newPrice = p.price - value;
    }
    
    if (newPrice < 0) {
        alert("Discount cannot make price negative!");
        return;
    }
    
    let newDiscounts = [];
    for (let i = 0; i < discounts.length; i++) {
        if (discounts[i].packageId !== packageId) {
            newDiscounts.push(discounts[i]);
        }
    }
    discounts = newDiscounts;
    
    discounts.push({
        packageId: packageId,
        type: type,
        value: value,
        until: until
    });
    
    document.getElementById("discount-value").value = "";
    document.getElementById("discount-until").value = "";
    
    displayPackages();
    alert(`Discount applied! New price: $${newPrice.toFixed(2)}`);
}

function applyFilter() {
    currentFilter = document.getElementById("filter-type").value;
    displayPackages();
}

document.getElementById("add-form").addEventListener("submit", addPackage);
document.getElementById("apply-discount").addEventListener("click", applyDiscount);
document.getElementById("filter-type").addEventListener("change", applyFilter);

window.editPackage = editPackage;
window.deletePackage = deletePackage;
window.toggleStatus = toggleStatus;

displayPackages();
displayStats();