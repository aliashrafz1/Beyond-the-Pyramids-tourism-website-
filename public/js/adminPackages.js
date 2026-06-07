'use strict';

let packages = [];
let currentDeleteId = null;
let currentPackageType = 'all';

function loadData() {
    packages = (window.SERVER_DATA && window.SERVER_DATA.packages) ? window.SERVER_DATA.packages : [];
    updateStats();
    renderPackages();
}

function updateStats() {
    const total  = packages.length;
    const active = packages.filter(p => p.status === 'active').length;

    let mostPopular = '--';
    if (packages.length > 0) {
        const sorted = [...packages].sort((a, b) => (b.rating * b.reviews) - (a.rating * a.reviews));
        const name   = sorted[0].name;
        mostPopular  = name.length > 15 ? name.substring(0, 15) + '…' : name;
    }

    const el = id => document.getElementById(id);
    if (el('totalPackages'))  el('totalPackages').textContent  = total;
    if (el('activePackages')) el('activePackages').textContent = active;
    if (el('mostPopular'))    el('mostPopular').textContent    = mostPopular;
}

function renderPackages() {
    const container = document.getElementById('packagesContainer');
    if (!container) return;

    let filtered = [...packages];

    const typeVal   = document.getElementById('typeFilter').value;
    const statusVal = document.getElementById('statusFilter').value;
    const search    = (document.getElementById('searchInput')?.value || '').toLowerCase();

    if (typeVal   !== 'all') filtered = filtered.filter(p => p.type   === typeVal);
    if (statusVal !== 'all') filtered = filtered.filter(p => p.status === statusVal);
    if (search)              filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search) || (p.city || '').toLowerCase().includes(search));
    if (currentPackageType !== 'all') filtered = filtered.filter(p => p.type === currentPackageType);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px 0;">
                <i class="fas fa-box-open" style="font-size:3rem;color:var(--color-border);margin-bottom:20px;display:block;"></i>
                <p style="color:var(--color-text-muted);font-size:1.1rem;">No packages match your refinement criteria.</p>
            </div>`;
        return;
    }

    container.innerHTML = filtered.map(createPackageCard).join('');
}

function createPackageCard(pkg) {
    const typeLabel   = { single: 'Single Location', day: 'Day Package', week: 'Week Package' }[pkg.type] || pkg.type;
    const statusClass = pkg.status === 'active' ? 'status-active' : 'status-inactive';
    const safeName    = pkg.name.replace(/'/g, "\\'");
    return `
    <article class="package-card-refined">
        <div class="package-media">
            <img src="${pkg.image || '/images/WebsiteBanner.png'}" alt="${pkg.name}" onerror="this.src='/images/WebsiteBanner.png'">
            <span class="package-status-tag ${statusClass}">${pkg.status}</span>
        </div>
        <div class="package-content">
            <div class="package-meta">${typeLabel}</div>
            <h4 class="package-title">${pkg.name}</h4>
            <div class="package-location"><i class="fas fa-map-marker-alt" style="color:var(--gold-primary)"></i> ${pkg.city || '—'}</div>
            <p style="font-size:0.8rem;color:var(--color-text-muted);line-height:1.5;margin-bottom:20px;">
                ${(pkg.description || '').substring(0, 85)}${(pkg.description || '').length > 85 ? '…' : ''}
            </p>
            <div class="package-footer">
                <div class="price-display">
                    ${pkg.discountedPrice
                        ? `<span class="price-value">EGP ${pkg.discountedPrice.toLocaleString()} <span style="opacity:.6;font-size:.85em;">/ EGP ${pkg.price.toLocaleString()}</span></span>`
                        : `<span class="price-value">EGP ${pkg.price.toLocaleString()}</span>`}
                </div>
                <div class="action-buttons">
                    <button class="btn-ghost" onclick="openEditModal('${pkg.id}')">Edit</button>
                    <button class="btn-danger" onclick="openDeleteModal('${pkg.id}', '${safeName}')"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        </div>
    </article>`;
}

function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

function openCreateModal()    { openModal('selectTypeModal'); }
function selectPackageType(t) { closeModal('selectTypeModal'); setupForm(t); openModal('packageModal'); }

function addItinRow(builderId, time, activity, desc) {
    const container = document.getElementById(builderId);
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'itin-row';
    row.innerHTML = `
        <input type="text"  class="itin-time"     placeholder="09:00"               value="${esc(time)}">
        <input type="text"  class="itin-activity" placeholder="Activity name"        value="${esc(activity)}">
        <input type="text"  class="itin-desc"     placeholder="Brief description"    value="${esc(desc)}">
        <button type="button" class="itin-remove-btn" title="Remove" onclick="this.closest('.itin-row').remove()">
            <i class="fas fa-times"></i>
        </button>`;
    container.appendChild(row);
}

function addDailyRow(builderId, day, title, desc, meal) {
    const container = document.getElementById(builderId);
    if (!container) return;
    const nextDay = container.querySelectorAll('.daily-row').length + 1;
    const row = document.createElement('div');
    row.className = 'daily-row';
    row.innerHTML = `
        <div class="daily-row-top">
            <input type="number" class="daily-day"   placeholder="1"          value="${day || nextDay}" min="1">
            <input type="text"   class="daily-title" placeholder="Day title"  value="${esc(title)}">
            <button type="button" class="itin-remove-btn" title="Remove" onclick="this.closest('.daily-row').remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <textarea class="daily-desc" placeholder="What happens this day…" rows="2">${esc(desc)}</textarea>
        <input    class="daily-meal" type="text" placeholder="Meals included e.g. Breakfast, Dinner" value="${esc(meal)}">`;
    container.appendChild(row);
}

function clearBuilder(id) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
}

function collectItinRows(builderId) {
    return Array.from(document.querySelectorAll(`#${builderId} .itin-row`))
        .map(row => ({
            time:     row.querySelector('.itin-time').value.trim(),
            activity: row.querySelector('.itin-activity').value.trim(),
            desc:     row.querySelector('.itin-desc').value.trim(),
        }))
        .filter(r => r.activity);
}

function collectDailyRows(builderId) {
    return Array.from(document.querySelectorAll(`#${builderId} .daily-row`))
        .map(row => ({
            day:   parseInt(row.querySelector('.daily-day').value)   || 0,
            title: row.querySelector('.daily-title').value.trim(),
            desc:  row.querySelector('.daily-desc').value.trim(),
            meal:  row.querySelector('.daily-meal').value.trim(),
        }))
        .filter(r => r.title);
}

function esc(v) {
    return (v || '').toString().replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setupForm(type, pkg) {
    document.getElementById('packageForm').reset();
    document.getElementById('modalTitle').textContent = pkg
        ? 'Edit Package'
        : 'Create ' + { single: 'Single Location', day: 'Day Package', week: 'Week Package' }[type];
    document.getElementById('packageId').value = pkg ? (pkg.id || pkg._id) : '';
    document.getElementById('pkgType').value   = pkg ? pkg.type : type;
    document.getElementById('formError').style.display = 'none';

    const preview     = document.getElementById('imagePreview');
    const placeholder = document.getElementById('imageUploadPlaceholder');
    if (pkg && pkg.image) {
        preview.src = pkg.image; preview.style.display = 'block'; placeholder.style.display = 'none';
    } else {
        preview.src = '';        preview.style.display = 'none';  placeholder.style.display = 'block';
    }

    const t = pkg ? pkg.type : type;
    document.getElementById('singleFields').style.display = t === 'single' ? 'block' : 'none';
    document.getElementById('dayFields').style.display    = t === 'day'    ? 'block' : 'none';
    document.getElementById('weekFields').style.display   = t === 'week'   ? 'block' : 'none';

    clearBuilder('singleItinBuilder');
    clearBuilder('dayItinBuilder');
    clearBuilder('weekDailyBuilder');

    if (!pkg) return;

    document.getElementById('pkgName').value            = pkg.name            || '';
    document.getElementById('pkgCity').value            = pkg.city            || '';
    document.getElementById('pkgDescription').value     = pkg.description     || '';
    document.getElementById('pkgPrice').value           = pkg.price           || '';
    document.getElementById('pkgDiscountedPrice').value = pkg.discountedPrice || '';
    document.getElementById('pkgStatus').value          = pkg.status          || 'active';

    document.getElementById('minGroup').value           = pkg.minGroup         || '';
    document.getElementById('maxGroup').value           = pkg.maxGroup         || '';
    document.getElementById('includedServices').value   = pkg.includedServices || '';
    document.getElementById('deluxeExtras').value       = pkg.deluxeExtras     || '';

    if (t === 'single') {
        document.getElementById('openingHours').value        = pkg.openingHours        || '';
        document.getElementById('closingDays').value         = pkg.closingDays         || '';
        document.getElementById('recommendedDuration').value = pkg.recommendedDuration || '';
        document.getElementById('guidedTour').value          = pkg.guidedTour          || 'yes';
        (pkg.itinerary || []).forEach(r => addItinRow('singleItinBuilder', r.time, r.activity, r.desc));
        if (!pkg.itinerary || !pkg.itinerary.length) addItinRow('singleItinBuilder');

    } else if (t === 'day') {
        document.getElementById('openingHoursDay').value = pkg.openingHours || '';
        document.getElementById('closingDaysDay').value  = pkg.closingDays  || '';
        document.getElementById('dayDuration').value     = pkg.duration     || '';
        (pkg.itinerary || []).forEach(r => addItinRow('dayItinBuilder', r.time, r.activity, r.desc));
        if (!pkg.itinerary || !pkg.itinerary.length) addItinRow('dayItinBuilder');

    } else if (t === 'week') {
        document.getElementById('weekDuration').value          = pkg.durationDays          || '';
        document.getElementById('nights').value                = pkg.nights                || '';
        document.getElementById('accommodationIncluded').value = pkg.accommodationIncluded || 'yes';
        document.getElementById('hotelName').value             = pkg.hotelName             || '';
        (pkg.dailyItinerary || []).forEach(r =>
            addDailyRow('weekDailyBuilder', r.day, r.title, r.desc, r.meal));
        if (!pkg.dailyItinerary || !pkg.dailyItinerary.length) addDailyRow('weekDailyBuilder');
    }
}

function openEditModal(id) {
    const pkg = packages.find(p => p.id === id || p._id === id);
    if (!pkg) return;
    setupForm(pkg.type, pkg);
    openModal('packageModal');
}

async function savePackage() {
    const g    = id => document.getElementById(id);
    const id   = g('packageId').value;
    const type = g('pkgType').value;
    const name = g('pkgName').value.trim();
    const city = g('pkgCity').value;

    const deluxePrice   = parseFloat(g('pkgPrice').value);
    const standardRaw   = g('pkgDiscountedPrice').value.trim();
    const standardPrice = standardRaw !== '' ? parseFloat(standardRaw) : null;

    const errDiv = g('formError');
    const errMsg = g('formErrorMsg');
    function showErr(msg) { errMsg.textContent = msg; errDiv.style.display = 'block'; }

    if (!name)                              { showErr('Package name is required.');                          return; }
    if (name.length < 3)                    { showErr('Package name must be at least 3 characters.');       return; }
    if (!city)                              { showErr('Please select a city.');                              return; }
    if (isNaN(deluxePrice) || deluxePrice <= 0)  { showErr('Deluxe tier price must be a positive number.'); return; }
    if (standardPrice !== null) {
        if (isNaN(standardPrice) || standardPrice <= 0) { showErr('Standard tier price must be a positive number.'); return; }
        if (standardPrice >= deluxePrice) { showErr('Standard Tier price must be lower than Deluxe Tier price.'); return; }
    }

    const pkgData = {
        type, name, city,
        description:      g('pkgDescription').value,
        price:            deluxePrice,
        discountedPrice:  standardPrice,
        status:           g('pkgStatus').value,

        minGroup:         parseInt(g('minGroup').value) || 1,
        maxGroup:         parseInt(g('maxGroup').value) || 15,
        includedServices: g('includedServices').value.trim(),
        deluxeExtras:     g('deluxeExtras').value.trim(),
    };

    if (type === 'single') {
        pkgData.openingHours        = g('openingHours').value.trim();
        pkgData.closingDays         = g('closingDays').value.trim();
        pkgData.recommendedDuration = parseFloat(g('recommendedDuration').value) || null;
        pkgData.guidedTour          = g('guidedTour').value;
        pkgData.itinerary           = collectItinRows('singleItinBuilder');

    } else if (type === 'day') {
        pkgData.openingHours = g('openingHoursDay').value.trim();
        pkgData.closingDays  = g('closingDaysDay').value.trim();
        pkgData.duration     = parseInt(g('dayDuration').value) || null;
        pkgData.itinerary    = collectItinRows('dayItinBuilder');

    } else if (type === 'week') {
        pkgData.durationDays          = parseInt(g('weekDuration').value)         || null;
        pkgData.nights                = parseInt(g('nights').value)               || null;
        pkgData.accommodationIncluded = g('accommodationIncluded').value;
        pkgData.hotelName             = g('hotelName').value.trim();
        pkgData.dailyItinerary        = collectDailyRows('weekDailyBuilder');
    }

    const saveBtn = g('savePackageBtn');
    saveBtn.textContent = 'Saving…'; saveBtn.disabled = true;
    errDiv.style.display = 'none';

    try {
        const url    = id ? '/api/packages/' + id : '/api/packages';
        const method = id ? 'PUT' : 'POST';
        const res    = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(pkgData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Save failed');

        const pkgId    = id || data.data.package._id;
        const imageFile = g('pkgImageFile').files[0] || null;
        if (imageFile && pkgId) {
            const formData = new FormData();
            formData.append('image', imageFile);
            await fetch('/api/packages/' + pkgId + '/image', {
                method: 'POST', credentials: 'include', body: formData,
            });
        }

        window.location.reload();
    } catch (err) {
        showErr(err.message);
        saveBtn.textContent = 'Save Changes'; saveBtn.disabled = false;
    }
}

function openDeleteModal(id, name) {
    currentDeleteId = id;
    document.getElementById('deletePackageName').textContent = name;
    openModal('deleteModal');
}

async function confirmDelete() {
    if (!currentDeleteId) return;
    try {
        const res = await fetch('/api/packages/' + currentDeleteId, { method: 'DELETE', credentials: 'include' });
        if (res.ok || res.status === 204) { window.location.reload(); }
        else { const d = await res.json(); alert(d.message || 'Delete failed'); }
    } catch (err) { alert('An error occurred: ' + err.message); }
}

function initFilters() {
    document.getElementById('searchInput').addEventListener('input', renderPackages);
    document.getElementById('typeFilter').addEventListener('change', renderPackages);
    document.getElementById('statusFilter').addEventListener('change', renderPackages);

    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.tab-link').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentPackageType = this.dataset.type;
            renderPackages();
        });
    });
}

function init() {
    loadData();
    initFilters();

    document.getElementById('pkgImageFile').addEventListener('change', function () {
        const file = this.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            const preview     = document.getElementById('imagePreview');
            const placeholder = document.getElementById('imageUploadPlaceholder');
            preview.src = e.target.result; preview.style.display = 'block'; placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('createPackageBtn').onclick = openCreateModal;
    document.getElementById('savePackageBtn').onclick   = savePackage;
    document.getElementById('confirmDeleteBtn').onclick = confirmDelete;

    document.querySelectorAll('.type-btn').forEach(btn => {
        btn.onclick = () => selectPackageType(btn.dataset.type);
    });
}

window.openEditModal   = openEditModal;
window.openDeleteModal = openDeleteModal;
window.closeModal      = closeModal;
window.addItinRow      = addItinRow;
window.addDailyRow     = addDailyRow;

document.addEventListener('DOMContentLoaded', init);
