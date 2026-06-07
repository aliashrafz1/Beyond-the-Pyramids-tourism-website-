const allPackages = (window.SERVER_PACKAGES || []).filter(p => p.type === "day");
const packagesGrid = document.getElementById('packagesGrid');

renderPackages(allPackages);

function renderPackages(packagesToShow) {
    if (!packagesGrid) return;
    packagesGrid.innerHTML = '';

    packagesToShow.forEach(pkg => {
        const card = document.createElement('div');
        card.className = 'package-card glass-card';

        const typeDisplay = {
            coastal: 'Coastal Escape',
            historical: 'Ancient Merit',
            cultural: 'Heritage Soul',
            day: 'Day Package',
            single: 'Single Location',
            week: 'Weekly Package'
        };

        const pkgId = pkg._id || pkg.id;
        card.innerHTML = `
            <div class="package-meta">
                <span><i class="fas fa-location-dot"></i> ${pkg.city || 'Egypt'}</span>
                <span><i class="fas fa-bookmark"></i> ${typeDisplay[pkg.type] || 'Legacy Tour'}</span>
            </div>
            <div class="package-img-wrapper" style="margin: 1rem 0; aspect-ratio: 16/9; overflow: hidden; border-radius: 12px;">
                <img src="${pkg.image}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <h3>${pkg.name}</h3>
            <p class="package-description">${pkg.description}</p>
            <div class="package-price-tag">
                ${pkg.discountedPrice
                    ? `EGP ${pkg.discountedPrice.toLocaleString()} <small style="opacity:.6;">/ EGP ${pkg.price.toLocaleString()}</small>`
                    : `EGP ${(pkg.price || 0).toLocaleString()}`}
            </div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn--secondary btn--small" style="flex: 1; padding: 0.5rem;" onclick="selectPackage('${pkgId}', 'standard')">Standard</button>
                <button class="btn btn--primary btn--small" style="flex: 1; padding: 0.5rem;" onclick="selectPackage('${pkgId}', 'deluxe')">Deluxe</button>
            </div>
        `;

        packagesGrid.appendChild(card);
    });
}

function selectPackage(packageId, tier = 'standard') {
    window.location.href = `/packages/${packageId}?tier=${tier}`;
}
