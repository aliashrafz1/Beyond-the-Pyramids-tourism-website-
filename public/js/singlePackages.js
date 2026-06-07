document.addEventListener('DOMContentLoaded', function () {
    renderSingleLocations();
    initFilters();
});

function renderSingleLocations() {
    const container = document.querySelector('.packages-container');
    if (!container) return;

    const allPkgs = window.SERVER_PACKAGES || [];
    if (!allPkgs.length) {
        container.innerHTML = '<p style="color:var(--text-muted);padding:2rem;">No locations available.</p>';
        return;
    }

    const singles = allPkgs.filter(p => p.type === 'single' && p.status !== 'inactive');

    if (singles.length === 0) {
        container.innerHTML = '<p style="color:var(--text-muted);padding:2rem;">No single locations available right now.</p>';
        return;
    }

    container.innerHTML = '';

    singles.forEach(pkg => {
        const price       = pkg.discountedPrice || pkg.price || 0;
        const hasDiscount = pkg.discountedPrice && pkg.discountedPrice < pkg.price;
        const cityLower   = (pkg.city || '').toLowerCase();
        const regionKey   = cityLower.includes('cairo') || cityLower.includes('giza') ? 'cairo'
                          : cityLower.includes('luxor') ? 'luxor'
                          : cityLower.includes('aswan') ? 'aswan'
                          : cityLower.includes('alex')  ? 'alex'
                          : 'other';
        const priceRange  = price >= 1000 ? 'premium' : 'budget';

        const card = document.createElement('article');
        card.className = 'card glass-card reveal-up';
        card.dataset.pkgId  = pkg._id || pkg.id;
        card.dataset.region = regionKey;
        card.dataset.price  = priceRange;

        card.innerHTML = `
            <div class="package-img-wrapper">
                <img src="${pkg.image}" alt="${pkg.name}">
            </div>
            <div style="padding:1.25rem;">
                <h3>${pkg.name}</h3>
                <p class="duration"><strong>Location:</strong> ${pkg.city || 'Egypt'}</p>
                <p class="highlights">${pkg.description}</p>
                ${hasDiscount
                    ? `<p class="price">EGP ${pkg.discountedPrice.toLocaleString()} <span style="opacity:.6;font-size:.85em;">/ EGP ${pkg.price.toLocaleString()}</span></p>`
                    : `<p class="price">EGP ${price.toLocaleString()}</p>`
                }
                ${pkg.openingHours  ? `<p style="font-size:.8rem;opacity:.7;margin:.25rem 0;"><i class="fas fa-clock"></i> ${pkg.openingHours}</p>` : ''}
                ${pkg.recommendedDuration ? `<p style="font-size:.8rem;opacity:.7;margin:.25rem 0;"><i class="fas fa-hourglass-half"></i> Recommended: ${pkg.recommendedDuration}h</p>` : ''}
                ${pkg.guidedTour === 'yes' ? `<p style="font-size:.8rem;opacity:.7;margin:.25rem 0;"><i class="fas fa-user-tie"></i> Guided tours available</p>` : ''}
                <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                    <button class="details-btn btn btn--secondary btn--small" data-id="${pkg._id || pkg.id}" data-tier="standard" style="flex: 1; padding: 0.5rem;">Standard</button>
                    <button class="details-btn btn btn--primary btn--small" data-id="${pkg._id || pkg.id}" data-tier="deluxe" style="flex: 1; padding: 0.5rem;">Deluxe</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const pkgId = this.closest('.card').dataset.pkgId;
            const tier = this.dataset.tier || 'standard';
            window.location.href = `/packages/${pkgId}?tier=${tier}`;
        });
    });

    document.querySelectorAll('.reveal-up').forEach(el => {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); } });
        }, { threshold: 0.1 });
        obs.observe(el);
    });
}

function initFilters() {
    const regionFilter = document.getElementById('filter-region');
    const priceFilter  = document.getElementById('filter-price');
    if (!regionFilter) return;

    function applyFilters() {
        const selRegion = regionFilter.value;
        const selPrice  = priceFilter.value;

        document.querySelectorAll('.card').forEach(card => {
            const matchRegion = selRegion === 'all' || selRegion === card.dataset.region;
            const matchPrice  = selPrice  === 'all' || selPrice  === card.dataset.price;
            card.style.display = (matchRegion && matchPrice) ? '' : 'none';
        });
    }

    regionFilter.addEventListener('change', applyFilters);
    priceFilter.addEventListener('change', applyFilters);

    const typeFilter = document.getElementById('filter-type');
    if (typeFilter) typeFilter.addEventListener('change', applyFilters);
}
