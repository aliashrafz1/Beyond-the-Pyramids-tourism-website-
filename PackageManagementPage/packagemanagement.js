// Package Management - Demo JavaScript

// ==================== DATA ====================

let packages = [];
let currentEditId = null;
let currentDeleteId = null;
let currentPackageType = 'all';

// Default demo data
const demoPackages = [
    {
        id: 'p1',
        type: 'single',
        name: 'Pyramids of Giza',
        city: 'Giza',
        description: 'Visit the ancient wonders of the world',
        image: 'https://via.placeholder.com/300x150?text=Pyramids',
        price: 500,
        discountedPrice: null,
        status: 'active',
        rating: 4.8,
        reviews: 124,
        openingHours: '8:00 AM - 5:00 PM',
        closingDays: 'Friday',
        recommendedDuration: 3,
        guidedTour: 'yes'
    },
    {
        id: 'p2',
        type: 'single',
        name: 'Karnak Temple',
        city: 'Luxor',
        description: 'Largest religious complex in the world',
        image: 'https://via.placeholder.com/300x150?text=Karnak',
        price: 400,
        discountedPrice: 350,
        status: 'active',
        rating: 4.6,
        reviews: 89,
        openingHours: '6:00 AM - 6:00 PM',
        closingDays: 'None',
        recommendedDuration: 2,
        guidedTour: 'yes'
    },
    {
        id: 'p3',
        type: 'day',
        name: 'Cairo Highlights Tour',
        city: 'Cairo',
        description: 'Full day tour of Cairo\'s best attractions',
        image: 'https://via.placeholder.com/300x150?text=Cairo+Tour',
        price: 1200,
        discountedPrice: 999,
        status: 'active',
        rating: 4.9,
        reviews: 56,
        duration: 8,
        minGroup: 2,
        maxGroup: 15,
        languages: 'en, ar, fr',
        includedServices: 'Lunch, Guide, Entry Fees',
        itinerary: '[{"time":"08:00","activity":"Hotel Pickup"},{"time":"10:00","activity":"Egyptian Museum"}]'
    },
    {
        id: 'p4',
        type: 'week',
        name: 'Nile Cruise Luxor to Aswan',
        city: 'Luxor',
        description: '7 days Nile cruise between Luxor and Aswan',
        image: 'https://via.placeholder.com/300x150?text=Nile+Cruise',
        price: 8500,
        discountedPrice: 7500,
        status: 'active',
        rating: 4.7,
        reviews: 42,
        durationDays: 7,
        nights: 6,
        accommodationIncluded: 'yes',
        hotelName: 'MS Royal Nile Cruise',
        transportIncluded: 'yes',
        mealsIncluded: 'Breakfast, Lunch, Dinner',
        dailyItinerary: '[{"day":1,"title":"Arrival Luxor","description":"Board the cruise"}]'
    }
];

function loadData() {
    packages = [...demoPackages];
    updateStats();
    renderPackages();
}

// ==================== STATS ====================

function updateStats() {
    const total = packages.length;
    const active = packages.filter(p => p.status === 'active').length;

    let mostPopular = '--';
    if (packages.length > 0) {
        const sorted = [...packages].sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
        mostPopular = sorted[0].name.substring(0, 20);
    }

    const totalEl = document.getElementById('totalPackages');
    const activeEl = document.getElementById('activePackages');
    const popularEl = document.getElementById('mostPopular');

    if (totalEl) totalEl.textContent = total;
    if (activeEl) activeEl.textContent = active;
    if (popularEl) popularEl.textContent = mostPopular;
}

// ==================== RENDER PACKAGES ====================

function renderPackages() {
    const container = document.getElementById('packagesContainer');
    if (!container) return;

    container.innerHTML = '';

    let filtered = [...packages];

    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter && typeFilter.value !== 'all') {
        filtered = filtered.filter(p => p.type === typeFilter.value);
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter && statusFilter.value !== 'all') {
        filtered = filtered.filter(p => p.status === statusFilter.value);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value) {
        const search = searchInput.value.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(search) || p.city.toLowerCase().includes(search));
    }

    if (currentPackageType !== 'all') {
        filtered = filtered.filter(p => p.type === currentPackageType);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;">No packages found</p>';
        return;
    }

    filtered.forEach(pkg => {
        const card = createPackageCard(pkg);
        container.appendChild(card);
    });
}

function createPackageCard(pkg) {
    const template = document.getElementById('packageCardTemplate');
    if (!template) return document.createElement('div');

    const card = template.content.cloneNode(true);
    const article = card.querySelector('article');

    const img = article.querySelector('.package-image');
    if (img) img.src = pkg.image || 'https://via.placeholder.com/300x150?text=No+Image';

    const badge = article.querySelector('.package-badge');
    if (badge) {
        let badgeText = '';
        if (pkg.type === 'single') badgeText = '📍 Single Location';
        else if (pkg.type === 'day') badgeText = '☀️ Day Package';
        else badgeText = '📅 Week Package';
        badge.textContent = badgeText;
    }

    const nameEl = article.querySelector('.package-name');
    if (nameEl) nameEl.textContent = pkg.name;

    const locationEl = article.querySelector('.package-location');
    if (locationEl) locationEl.textContent = pkg.city;

    const currentPrice = article.querySelector('.current-price');
    const originalPrice = article.querySelector('.original-price');
    if (currentPrice) {
        if (pkg.discountedPrice) {
            currentPrice.innerHTML = `💰 ${pkg.discountedPrice} EGP`;
            if (originalPrice) originalPrice.innerHTML = `<span style="text-decoration:line-through;color:#999;">${pkg.price} EGP</span>`;
        } else {
            currentPrice.innerHTML = `💰 ${pkg.price} EGP`;
            if (originalPrice) originalPrice.innerHTML = '';
        }
    }

    const ratingEl = article.querySelector('.rating');
    if (ratingEl) ratingEl.textContent = `⭐ ${pkg.rating || '0.0'}`;

    const reviewsEl = article.querySelector('.reviews');
    if (reviewsEl) reviewsEl.textContent = `(${pkg.reviews || 0} reviews)`;

    const editBtn = article.querySelector('.edit-btn');
    if (editBtn) editBtn.onclick = (e) => {
        e.stopPropagation();
        openEditModal(pkg.id);
    };

    const duplicateBtn = article.querySelector('.duplicate-btn');
    if (duplicateBtn) duplicateBtn.onclick = (e) => {
        e.stopPropagation();
        duplicatePackage(pkg.id);
    };

    const deleteBtn = article.querySelector('.delete-btn');
    if (deleteBtn) deleteBtn.onclick = (e) => {
        e.stopPropagation();
        openDeleteModal(pkg.id, pkg.name);
    };

    return card;
}

// ==================== MODAL FUNCTIONS (Fixed for <dialog> elements) ====================

function openCreateModal() {
    const modal = document.getElementById('selectTypeModal');
    if (modal) {
        modal.showModal();  // Use showModal() for dialog elements
    }
}

function selectPackageType(type) {
    // Close the type selection dialog
    const selectModal = document.getElementById('selectTypeModal');
    if (selectModal) {
        selectModal.close();
    }

    // Set up the package form
    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.textContent = 'Create ' + type.toUpperCase() + ' Package';

    const idField = document.getElementById('packageId');
    if (idField) idField.value = '';

    const form = document.getElementById('packageForm');
    if (form) form.reset();

    const typeField = document.getElementById('pkgType');
    if (typeField) typeField.value = type;

    const singleFields = document.getElementById('singleFields');
    const dayFields = document.getElementById('dayFields');
    const weekFields = document.getElementById('weekFields');

    if (singleFields) singleFields.style.display = type === 'single' ? 'block' : 'none';
    if (dayFields) dayFields.style.display = type === 'day' ? 'block' : 'none';
    if (weekFields) weekFields.style.display = type === 'week' ? 'block' : 'none';

    // Open the package modal
    const packageModal = document.getElementById('packageModal');
    if (packageModal) {
        packageModal.showModal();
    }
}

function openEditModal(id) {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;

    currentEditId = id;

    const titleEl = document.getElementById('modalTitle');
    if (titleEl) titleEl.textContent = 'Edit ' + pkg.type.toUpperCase() + ' Package';

    const idField = document.getElementById('packageId');
    if (idField) idField.value = pkg.id;

    const nameField = document.getElementById('pkgName');
    if (nameField) nameField.value = pkg.name;

    const typeField = document.getElementById('pkgType');
    if (typeField) typeField.value = pkg.type;

    const cityField = document.getElementById('pkgCity');
    if (cityField) cityField.value = pkg.city;

    const descField = document.getElementById('pkgDescription');
    if (descField) descField.value = pkg.description || '';

    const imageField = document.getElementById('pkgImage');
    if (imageField) imageField.value = pkg.image || '';

    const priceField = document.getElementById('pkgPrice');
    if (priceField) priceField.value = pkg.price;

    const discField = document.getElementById('pkgDiscountedPrice');
    if (discField) discField.value = pkg.discountedPrice || '';

    const statusField = document.getElementById('pkgStatus');
    if (statusField) statusField.value = pkg.status;

    const singleFields = document.getElementById('singleFields');
    const dayFields = document.getElementById('dayFields');
    const weekFields = document.getElementById('weekFields');

    if (singleFields) singleFields.style.display = pkg.type === 'single' ? 'block' : 'none';
    if (dayFields) dayFields.style.display = pkg.type === 'day' ? 'block' : 'none';
    if (weekFields) weekFields.style.display = pkg.type === 'week' ? 'block' : 'none';

    if (pkg.type === 'single') {
        const ohField = document.getElementById('openingHours');
        const cdField = document.getElementById('closingDays');
        const rdField = document.getElementById('recommendedDuration');
        const gtField = document.getElementById('guidedTour');
        if (ohField) ohField.value = pkg.openingHours || '';
        if (cdField) cdField.value = pkg.closingDays || '';
        if (rdField) rdField.value = pkg.recommendedDuration || '';
        if (gtField) gtField.value = pkg.guidedTour || 'yes';
    }

    if (pkg.type === 'day') {
        const durField = document.getElementById('dayDuration');
        const minField = document.getElementById('minGroup');
        const maxField = document.getElementById('maxGroup');
        const langField = document.getElementById('languages');
        const incField = document.getElementById('includedServices');
        const itinField = document.getElementById('itinerary');
        if (durField) durField.value = pkg.duration || '';
        if (minField) minField.value = pkg.minGroup || '';
        if (maxField) maxField.value = pkg.maxGroup || '';
        if (langField) langField.value = pkg.languages || '';
        if (incField) incField.value = pkg.includedServices || '';
        if (itinField) itinField.value = pkg.itinerary || '';
    }

    if (pkg.type === 'week') {
        const durField = document.getElementById('weekDuration');
        const nightField = document.getElementById('nights');
        const accField = document.getElementById('accommodationIncluded');
        const hotelField = document.getElementById('hotelName');
        const transField = document.getElementById('transportIncluded');
        const mealsField = document.getElementById('mealsIncluded');
        const dailyField = document.getElementById('dailyItinerary');
        if (durField) durField.value = pkg.durationDays || '';
        if (nightField) nightField.value = pkg.nights || '';
        if (accField) accField.value = pkg.accommodationIncluded || 'yes';
        if (hotelField) hotelField.value = pkg.hotelName || '';
        if (transField) transField.value = pkg.transportIncluded || 'yes';
        if (mealsField) mealsField.value = pkg.mealsIncluded || '';
        if (dailyField) dailyField.value = pkg.dailyItinerary || '';
    }

    const packageModal = document.getElementById('packageModal');
    if (packageModal) {
        packageModal.showModal();
    }
}

function savePackage() {
    const idField = document.getElementById('packageId');
    const id = idField ? idField.value : '';

    const typeField = document.getElementById('pkgType');
    const type = typeField ? typeField.value : '';

    if (!type) {
        alert('Please select a package type first');
        return;
    }

    const nameField = document.getElementById('pkgName');
    const cityField = document.getElementById('pkgCity');
    const priceField = document.getElementById('pkgPrice');

    if (!nameField.value || !cityField.value || !priceField.value) {
        alert('Please fill all required fields');
        return;
    }

    const pkgData = {
        id: id || Date.now().toString(),
        type: type,
        name: nameField.value,
        city: cityField.value,
        description: document.getElementById('pkgDescription').value,
        image: document.getElementById('pkgImage').value || 'https://via.placeholder.com/300x150?text=Package',
        price: parseFloat(priceField.value),
        discountedPrice: parseFloat(document.getElementById('pkgDiscountedPrice').value) || null,
        status: document.getElementById('pkgStatus').value,
        rating: 0,
        reviews: 0
    };

    if (type === 'single') {
        pkgData.openingHours = document.getElementById('openingHours').value;
        pkgData.closingDays = document.getElementById('closingDays').value;
        pkgData.recommendedDuration = parseInt(document.getElementById('recommendedDuration').value) || null;
        pkgData.guidedTour = document.getElementById('guidedTour').value;
    }

    if (type === 'day') {
        pkgData.duration = parseInt(document.getElementById('dayDuration').value) || null;
        pkgData.minGroup = parseInt(document.getElementById('minGroup').value) || null;
        pkgData.maxGroup = parseInt(document.getElementById('maxGroup').value) || null;
        pkgData.languages = document.getElementById('languages').value;
        pkgData.includedServices = document.getElementById('includedServices').value;
        pkgData.itinerary = document.getElementById('itinerary').value;
    }

    if (type === 'week') {
        pkgData.durationDays = parseInt(document.getElementById('weekDuration').value) || null;
        pkgData.nights = parseInt(document.getElementById('nights').value) || null;
        pkgData.accommodationIncluded = document.getElementById('accommodationIncluded').value;
        pkgData.hotelName = document.getElementById('hotelName').value;
        pkgData.transportIncluded = document.getElementById('transportIncluded').value;
        pkgData.mealsIncluded = document.getElementById('mealsIncluded').value;
        pkgData.dailyItinerary = document.getElementById('dailyItinerary').value;
    }

    if (id) {
        const index = packages.findIndex(p => p.id === id);
        if (index !== -1) {
            packages[index] = { ...packages[index], ...pkgData };
        }
    } else {
        packages.push(pkgData);
    }

    closeAllModals();
    updateStats();
    renderPackages();
}

// ==================== DUPLICATE ====================

function duplicatePackage(id) {
    const original = packages.find(p => p.id === id);
    if (!original) return;

    const duplicate = JSON.parse(JSON.stringify(original));
    duplicate.id = Date.now().toString();
    duplicate.name = original.name + ' (Copy)';
    duplicate.rating = 0;
    duplicate.reviews = 0;

    packages.push(duplicate);
    updateStats();
    renderPackages();
}

// ==================== DELETE ====================

function openDeleteModal(id, name) {
    currentDeleteId = id;
    const nameSpan = document.getElementById('deletePackageName');
    if (nameSpan) nameSpan.textContent = name;

    const modal = document.getElementById('deleteModal');
    if (modal) {
        modal.showModal();
    }
}

function confirmDelete() {
    if (currentDeleteId) {
        packages = packages.filter(p => p.id !== currentDeleteId);
        updateStats();
        renderPackages();
        closeAllModals();
        currentDeleteId = null;
    }
}

// ==================== MODAL CONTROLS ====================

function closeAllModals() {
    const selectModal = document.getElementById('selectTypeModal');
    const packageModal = document.getElementById('packageModal');
    const deleteModal = document.getElementById('deleteModal');

    if (selectModal) selectModal.close();
    if (packageModal) packageModal.close();
    if (deleteModal) deleteModal.close();
}

// ==================== FILTERS & TABS ====================

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => renderPackages());
    }

    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', () => renderPackages());
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => renderPackages());
    }

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPackageType = btn.getAttribute('data-type');
            renderPackages();
        });
    });
}

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
    const createBtn = document.getElementById('createPackageBtn');
    if (createBtn) {
        createBtn.onclick = openCreateModal;
    }

    const typeOptions = document.querySelectorAll('.type-option');
    typeOptions.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            selectPackageType(btn.getAttribute('data-type'));
        };
    });

    const saveBtn = document.getElementById('savePackageBtn');
    if (saveBtn) saveBtn.onclick = savePackage;

    const cancelModalBtn = document.getElementById('cancelModalBtn');
    if (cancelModalBtn) cancelModalBtn.onclick = closeAllModals;

    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if (cancelDeleteBtn) cancelDeleteBtn.onclick = closeAllModals;

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) confirmDeleteBtn.onclick = confirmDelete;

    const closeBtns = document.querySelectorAll('.close');
    closeBtns.forEach(btn => {
        btn.onclick = closeAllModals;
    });
}

// ==================== INITIALIZE ====================

function init() {
    loadData();
    setupFilters();
    setupEventListeners();
}

document.addEventListener('DOMContentLoaded', init);