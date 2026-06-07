let selectedPkg = null;
let currentBooking = {
    packageId: null,
    tier: new URLSearchParams(window.location.search).get('tier') || 'standard',
    travelers: 2,
    date: null,
    basePrice: 0,
    totalPrice: 0
};

const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

document.addEventListener('DOMContentLoaded', () => {
    resolvePackage();
});

function resolvePackage() {
    if (!window.SERVER_PACKAGE) { renderNotFound(); return; }

    selectedPkg = normalise(window.SERVER_PACKAGE);
    if (window.SERVER_REVIEWS && window.SERVER_REVIEWS.length) {
        selectedPkg._serverReviews = window.SERVER_REVIEWS;
    }
    renderPage();
    highlightSidebarItem(selectedPkg);
}

function highlightSidebarItem(pkg) {
    const type = (pkg._category || pkg.category || '').toLowerCase();
    const sidebarLinks = document.querySelectorAll('.sidebar-nav ul li');

    sidebarLinks.forEach(li => li.classList.remove('active'));

    let targetHref = null;
    if (type.includes('week')) targetHref = '/packages/week';
    else if (type.includes('single')) targetHref = '/packages/single';
    else targetHref = '/packages/day';

    sidebarLinks.forEach(li => {
        const a = li.querySelector('a');
        if (a && a.href && a.href.includes(targetHref)) {
            li.classList.add('active');
        }
    });
}

function normalise(p) {
    let basePrice = parsePackageMoney(p.basePrice ?? p.discountedPrice ?? p.price ?? 0);
    let fullPrice = p.price ? parsePackageMoney(p.price) : Math.round(basePrice * 1.3);

    let duration = p.duration ||
        (p.durationDays ? `${p.durationDays} Days` : null) ||
        (p.recommendedDuration ? `${p.recommendedDuration} hrs` : '—');

    let category = p.category || (p.type === 'single' ? 'Single Location'
        : p.type === 'day' ? 'Day Package'
            : p.type === 'week' ? 'Week Package'
                : 'Package');

    let itinerary = (p.itinerary && p.itinerary.length ? p.itinerary : null)
                 || (p.dailyItinerary && p.dailyItinerary.length ? p.dailyItinerary : null)
                 || [];
    if (typeof itinerary === 'string') {
        try { itinerary = JSON.parse(itinerary); } catch { itinerary = []; }
    }

    let included = [];
    if (p.includedServices) {
        included = p.includedServices.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (p.accommodationIncluded === 'yes' && p.hotelName) {
        included.push(`Hotel: ${p.hotelName}`);
    } else if (category.includes('Week')) {
        included.push('Accommodation Included');
    }

    if (category.includes('Day') && !included.some(i => i.toLowerCase().includes('transport'))) {
        included.push('Transportation Included');
    }

    const rating  = p.rating ?? 4.7;
    const reviews = p.reviews ?? 0;
    const lead    = p.lead || p.fullDesc || p.description || '';

    let highlights = [];
    if (p.description && p.description.includes('|')) {
        highlights = p.description.split('|').map(s => s.trim()).filter(Boolean);
    } else if (included.length) {
        highlights = included.slice(0, 4);
    }

    return {
        ...p,
        _basePrice: basePrice,
        _fullPrice: fullPrice,
        _duration: duration,
        _category: category,
        _itinerary: itinerary,
        _included: included,
        _rating: rating,
        _reviews: reviews,
        _lead: lead,
        _highlights: highlights,
    };
}

function renderPage() {
    const pkg = selectedPkg;
    document.title = `${pkg.name} — Beyond the Pyramids`;

    const root = document.getElementById('pkg-root');
    root.innerHTML = buildPageHTML(pkg);

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            document.querySelector('.pkg-hero')?.classList.add('is-visible');
        });
    });

    initTimelineReveal();
    initTierSelection();
    initCalendar();
    initTravellerCounter();
    initBookingAction();
    updateTotalDisplay();
    initWeatherWidget(pkg.city || pkg.location);
}

function buildPageHTML(pkg) {
    return `
    <section class="pkg-hero" role="banner">
        <div class="pkg-hero__bg" style="background-image: url('${pkg.image}');"></div>
        <div class="pkg-hero__overlay"></div>

        <div class="pkg-hero__tear">
            <svg viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,40 C120,80 200,0 360,40 C520,80 600,20 720,40 C840,60 920,10 1080,40 C1200,65 1350,15 1440,35 L1440,80 L0,80 Z"/>
            </svg>
        </div>

        <div class="pkg-hero__content">
            <div class="pkg-hero__eyebrow">
                <span class="pkg-badge"><i class="fas fa-crown"></i> ${pkg._category}</span>
                <span class="pkg-badge"><i class="fas fa-clock"></i> ${pkg._duration}</span>
                ${pkg.location || pkg.city ? `<span class="pkg-badge"><i class="fas fa-map-pin"></i> ${pkg.location || pkg.city}</span>` : ''}
            </div>

            <h1 class="pkg-hero__title">${pkg.name}</h1>

            <div class="pkg-hero__meta">
                <div class="pkg-meta-item">
                    <div class="pkg-rating-stars">
                        ${buildStars(pkg._rating)}
                    </div>
                    <span>${pkg._rating.toFixed(1)}</span>
                </div>
                ${pkg._reviews ? `<span class="pkg-meta-item"><i class="fas fa-comment"></i> ${pkg._reviews.toLocaleString()} Reviews</span>` : ''}
            </div>
        </div>
    </section>

    <div class="pkg-layout">
        <article class="pkg-content">

            ${pkg._lead ? `
            <div class="pkg-section">
                <p class="pkg-lead">${pkg._lead}</p>
                ${pkg._highlights.length ? `
                <div class="pkg-highlights">
                    ${pkg._highlights.map(h => `<span class="pkg-highlight-pill"><i class="fas fa-check"></i> ${h}</span>`).join('')}
                </div>` : ''}
            </div>` : ''}

            ${pkg._itinerary.length ? `
            <section class="pkg-section" aria-label="Itinerary">
                <h2 class="pkg-section-title"><i class="fas fa-map-location-dot"></i> Your Itinerary</h2>
                <div class="pkg-timeline">
                    ${buildItinerary(pkg._itinerary)}
                </div>
            </section>` : ''}
            ${buildServices(pkg)}
            ${buildReviews(pkg)}
        </article>

        <aside class="pkg-rail" aria-label="Booking panel">
            <div class="pkg-rail__body">
                <h2 class="pkg-rail__title">Reserve Your Journey</h2>
                <p class="pkg-rail__subtitle">Select tier • Choose date • Confirm</p>

                <div class="pkg-tiers" id="pkg-tiers">
                    <div class="pkg-tier ${currentBooking.tier === 'standard' ? 'active' : ''}" data-type="standard" tabindex="0" role="button" aria-pressed="${currentBooking.tier === 'standard' ? 'true' : 'false'}">
                        <div class="pkg-tier__header">
                            <span class="pkg-tier__name"><i class="fas fa-compass"></i> Standard</span>
                            <span class="pkg-tier__price" id="price-tour">${formatPrice(pkg._basePrice)}</span>
                        </div>
                        <p class="pkg-tier__desc">Self-guided, entrance fees only ${pkg._category.includes('Day') ? '&amp; transportation' : ''} ${pkg._category.includes('Week') ? '(accommodation included)' : ''}</p>
                    </div>
                    <div class="pkg-tier ${currentBooking.tier === 'deluxe' ? 'active' : ''}" data-type="deluxe" tabindex="0" role="button" aria-pressed="${currentBooking.tier === 'deluxe' ? 'true' : 'false'}">
                        <div class="pkg-tier__header">
                            <span class="pkg-tier__name"><i class="fas fa-crown"></i> Deluxe</span>
                            <span class="pkg-tier__price" id="price-full">${formatPrice(pkg._fullPrice)}</span>
                        </div>
                        <p class="pkg-tier__desc">${pkg.deluxeExtras
                            ? pkg.deluxeExtras.split('|').slice(0, 2).map(e => e.trim()).join(' &middot; ')
                            : 'Private Egyptologist guide &middot; luxury transport &middot; premium inclusions'}</p>
                    </div>
                </div>

                <div class="pkg-rail__divider"></div>
                <p class="pkg-rail__label"><i class="fas fa-calendar-days"></i> Select Departure Date</p>
                <div class="pkg-calendar-header">
                    <button class="pkg-cal-nav" id="cal-prev" aria-label="Previous month"><i class="fas fa-chevron-left"></i></button>
                    <span class="pkg-cal-month" id="cal-month-label"></span>
                    <button class="pkg-cal-nav" id="cal-next" aria-label="Next month"><i class="fas fa-chevron-right"></i></button>
                </div>
                <div class="pkg-calendar-grid" id="pkg-calendar"></div>
                <div class="pkg-cal-legend">
                    <div class="pkg-leg-item"><span class="pkg-leg-dot available"></span> Available</div>
                    <div class="pkg-leg-item"><span class="pkg-leg-dot booked"></span> Unavailable</div>
                    <div class="pkg-leg-item"><span class="pkg-leg-dot selected"></span> Selected</div>
                </div>

                <div class="pkg-rail__divider"></div>
                <p class="pkg-rail__label"><i class="fas fa-users"></i> Travellers</p>
                <div class="pkg-counter">
                    <button class="pkg-counter-btn" id="traveller-minus" aria-label="Decrease"><i class="fas fa-minus"></i></button>
                    <span class="pkg-counter-val" id="traveller-count">2</span>
                    <button class="pkg-counter-btn" id="traveller-plus" aria-label="Increase"><i class="fas fa-plus"></i></button>
                </div>

                <div class="pkg-rail__divider"></div>
                <div class="pkg-total-line">
                    Total: <strong id="total-display">—</strong>
                    <span id="total-note" style="display:none; font-size:0.7rem; color: var(--text-secondary);"> · Select a date to enable booking</span>
                </div>

                <button class="pkg-book-btn" id="book-now-btn" disabled>
                    <i class="fas fa-lock"></i> Select a Date to Continue
                </button>
                <div class="pkg-guarantees">
                    <div class="pkg-guarantee-item"><i class="fas fa-shield-halved"></i> Best Price Guarantee</div>
                    <div class="pkg-guarantee-item"><i class="fas fa-headset"></i> 24/7 Concierge Support</div>
                    <div class="pkg-guarantee-item"><i class="fas fa-rotate-left"></i> Free Cancellation &lt; 48hrs</div>
                </div>
            </div>
        </aside>

    </div>
    `;
}

function buildItinerary(items) {
    return items.map((step, idx) => {
        const dayLabel = step.day ? `Day ${step.day}` : step.time ? step.time : `Step ${idx + 1}`;
        const stepTitle = step.title || step.activity || `—`;
        const stepDesc = step.desc || '';
        const meal = step.meal || '';

        return `
        <div class="pkg-day reveal-timeline" style="transition-delay: ${idx * 80}ms">
            <div class="pkg-day__number">${dayLabel}</div>
            <h3 class="pkg-day__title">${stepTitle}</h3>
            ${stepDesc ? `<p class="pkg-day__desc">${stepDesc}</p>` : ''}
            ${meal ? `<span class="pkg-day__meal"><i class="fas fa-utensils"></i> ${meal}</span>` : ''}
        </div>`;
    }).join('');
}

function buildServices(pkg) {
    const included = pkg._included.length ? pkg._included : ['Expert Guide', 'Entrance Fees', 'A/C Transport'];
    const excluded = ['International Flights', 'Egypt Entry Visa', 'Beverages with Meals', 'Personal Insurance'];
    const deluxeItems = pkg.deluxeExtras
        ? pkg.deluxeExtras.split('|').map(e => e.trim()).filter(Boolean)
        : [];

    return `
    <section class="pkg-section" aria-label="What's included">
        <h2 class="pkg-section-title"><i class="fas fa-circle-check"></i> Included &amp; Excluded</h2>
        <div class="pkg-services">
            <div class="pkg-services-box included">
                <h3><i class="fas fa-check-circle"></i> Standard Includes</h3>
                <ul>${included.map(i => `<li><i class="fas fa-check"></i> ${i}</li>`).join('')}</ul>
            </div>
            <div class="pkg-services-box excluded">
                <h3><i class="fas fa-times-circle"></i> Not Included</h3>
                <ul>${excluded.map(e => `<li><i class="fas fa-xmark"></i> ${e}</li>`).join('')}</ul>
            </div>
        </div>
        ${deluxeItems.length ? `
        <div class="pkg-deluxe-extras">
            <h3><i class="fas fa-crown"></i> Deluxe Tier Adds</h3>
            <ul class="pkg-deluxe-list">
                ${deluxeItems.map(e => `<li><i class="fas fa-plus-circle"></i> ${e}</li>`).join('')}
            </ul>
        </div>` : ''}
    </section>`;
}

function buildReviews(pkg) {
    if (pkg._serverReviews && pkg._serverReviews.length) {
        const serverReviews = pkg._serverReviews;
        const avgRating = serverReviews.length
            ? (serverReviews.reduce((s, r) => s + r.rating, 0) / serverReviews.length).toFixed(1)
            : (pkg._rating || 4.8).toFixed(1);

        return `
    <section class="pkg-section" aria-label="Traveler reviews">
        <h2 class="pkg-section-title"><i class="fas fa-comment-dots"></i> Traveler Stories</h2>
        <div class="pkg-review-header">
            <div class="pkg-score">${avgRating}</div>
            <div>
                <div class="pkg-review-stars">${buildStars(parseFloat(avgRating))}</div>
                <div class="pkg-review-count">Based on ${serverReviews.length} featured review${serverReviews.length !== 1 ? 's' : ''}</div>
            </div>
        </div>
        <div class="pkg-reviews-list">
            ${serverReviews.map(r => `
            <article class="pkg-review-card">
                <div class="pkg-review-card__top">
                    <span class="pkg-reviewer">${r.userId ? r.userId.name : 'Verified Traveler'}</span>
                    <span class="pkg-review-date">${new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <div class="pkg-review-stars" style="font-size:0.8rem; margin-bottom:0.5rem;">${buildStars(r.rating)}</div>
                <p class="pkg-review-text">"${r.text || r.title || ''}"</p>
                ${r.photos && r.photos.length ? `
                <div class="review-photos">
                    ${r.photos.slice(0, 4).map(p => `
                    <a href="${p}" target="_blank" rel="noopener">
                        <img src="${p}" alt="Review photo" class="review-photo-thumb" loading="lazy">
                    </a>`).join('')}
                </div>` : ''}
            </article>`).join('')}
        </div>
    </section>`;
    }

    return `
    <section class="pkg-section" aria-label="Traveler reviews">
        <h2 class="pkg-section-title"><i class="fas fa-comment-dots"></i> Traveler Stories</h2>
        <p style="color:var(--color-text-muted);padding:1rem 0;">No reviews yet for this package.</p>
    </section>`;
}

function buildStars(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) html += '<i class="fas fa-star"></i>';
        else if (rating >= i - 0.5) html += '<i class="fas fa-star-half-stroke"></i>';
        else html += '<i class="far fa-star"></i>';
    }
    return html;
}

function formatPrice(n) {
    if (!n) return '—';
    return `${Number(n).toLocaleString()} <small>EGP</small>`;
}

function renderNotFound() {
    document.getElementById('pkg-root').innerHTML = `
    <div class="pkg-not-found">
        <i class="fas fa-magnifying-glass"></i>
        <h2>Package Not Found</h2>
        <p>We couldn't locate this journey. Please choose a package from our catalogue.</p>
        <br>
        <a href="/packages/day" class="btn btn--primary" style="margin-top:1rem;">Browse Packages</a>
    </div>`;
}

function initTierSelection() {
    const tiers = document.querySelectorAll('.pkg-tier');
    tiers.forEach(tier => {
        tier.addEventListener('click', () => selectTier(tier, tiers));
        tier.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') selectTier(tier, tiers);
        });
    });
}

function selectTier(chosen, all) {
    all.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-pressed', 'false'); });
    chosen.classList.add('active');
    chosen.setAttribute('aria-pressed', 'true');
    currentBooking.tier = chosen.dataset.type;
    updateTotalDisplay();
}

function initCalendar() {
    renderCalendar();
    document.getElementById('cal-prev')?.addEventListener('click', () => {
        calMonth--;
        if (calMonth < 0) { calMonth = 11; calYear--; }
        renderCalendar();
    });
    document.getElementById('cal-next')?.addEventListener('click', () => {
        calMonth++;
        if (calMonth > 11) { calMonth = 0; calYear++; }
        renderCalendar();
    });
}

function renderCalendar() {
    const grid = document.getElementById('pkg-calendar');
    const label = document.getElementById('cal-month-label');
    if (!grid || !label) return;

    label.textContent = `${MONTH_NAMES[calMonth]} ${calYear}`;
    grid.innerHTML = '';

    const today = new Date();
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(d => {
        const h = document.createElement('div');
        h.className = 'pkg-cal-day header';
        h.textContent = d;
        grid.appendChild(h);
    });

    for (let i = 0; i < firstDay; i++) {
        const e = document.createElement('div');
        e.className = 'pkg-cal-day empty';
        grid.appendChild(e);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const d = document.createElement('div');
        const thisDate = new Date(calYear, calMonth, i);
        const isPast = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

        d.className = 'pkg-cal-day ' + (isPast ? 'past' : 'available');
        d.textContent = i;

        if (!isPast) {
            d.addEventListener('click', () => {
                document.querySelectorAll('.pkg-cal-day.selected').forEach(el => el.classList.remove('selected'));
                d.classList.add('selected');
                currentBooking.date = `${MONTH_NAMES[calMonth]} ${i}, ${calYear}`;
                enableBookingBtn();
                updateTotalDisplay();
            });
        }
        grid.appendChild(d);
    }
}

function initTravellerCounter() {
    const minus = document.getElementById('traveller-minus');
    const plus = document.getElementById('traveller-plus');
    const display = document.getElementById('traveller-count');
    if (!minus || !plus) return;

    minus.addEventListener('click', () => {
        if (currentBooking.travelers > 1) {
            currentBooking.travelers--;
            display.textContent = currentBooking.travelers;
            minus.disabled = currentBooking.travelers <= 1;
            updateTotalDisplay();
        }
    });

    plus.addEventListener('click', () => {
        if (currentBooking.travelers < 15) {
            currentBooking.travelers++;
            display.textContent = currentBooking.travelers;
            minus.disabled = false;
            updateTotalDisplay();
        }
    });
}

function updateTotalDisplay() {
    const pkg = selectedPkg;
    if (!pkg) return;

    const perPerson = currentBooking.tier === 'deluxe' ? pkg._fullPrice : pkg._basePrice;
    const total = perPerson * currentBooking.travelers;
    currentBooking.totalPrice = total;
    currentBooking.basePrice = perPerson;

    const totalEl = document.getElementById('total-display');
    if (totalEl) {
        totalEl.innerHTML = `EGP ${total.toLocaleString()}`;
    }

    if (currentBooking.date) {
        enableBookingBtn();
    }
}

function enableBookingBtn() {
    const btn = document.getElementById('book-now-btn');
    if (!btn) return;
    btn.disabled = false;
    btn.innerHTML = `<i class="fas fa-suitcase-rolling"></i> Confirm — EGP ${currentBooking.totalPrice.toLocaleString()}`;
}

function initBookingAction() {
    const btn = document.getElementById('book-now-btn');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        if (!currentBooking.date) return;

        const session = window.SERVER_USER;

        if (!session || !(session.email || session._id)) {
            document.getElementById('login-gate-msg')?.remove();

            const toast = document.createElement('div');
            toast.id = 'login-gate-msg';
            toast.className = 'login-gate-toast';
            toast.innerHTML = `
                <i class="fas fa-lock"></i>
                <span>You must be <a href="/login">logged in</a> to complete your booking.</span>
            `;
            btn.parentNode.insertBefore(toast, btn);
            setTimeout(() => toast.remove(), 6000);
            return;
        }

        if (window.SERVER_PACKAGE) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing Summary…';
            btn.disabled = true;

            try {
                const pkg = selectedPkg;
                const res = await fetch('/api/bookings/draft', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        packageId: pkg._id || pkg.id,
                        date: currentBooking.date,
                        tier: currentBooking.tier,
                        travelers: currentBooking.travelers,
                        totalPrice: currentBooking.totalPrice,
                        basePrice: currentBooking.basePrice
                    })
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Booking failed');

                const draftId = data.data.draftId;

                if (currentBooking.travelers > 1) {
                    window.location.href = '/booking/travellers?draftId=' + draftId;
                } else {
                    window.location.href = '/booking/summary?draftId=' + draftId;
                }
            } catch (err) {
                btn.innerHTML = '<i class="fas fa-suitcase-rolling"></i> Try Again';
                btn.disabled = false;

                document.getElementById('login-gate-msg')?.remove();
                const errToast = document.createElement('div');
                errToast.id = 'login-gate-msg';
                errToast.className = 'login-gate-toast';
                errToast.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>${err.message}</span>`;
                btn.parentNode.insertBefore(errToast, btn);
                setTimeout(() => errToast.remove(), 6000);
            }
            return;
        }

        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Booking unavailable';
        btn.disabled = true;
    });
}

function initTimelineReveal() {
    const items = document.querySelectorAll('.reveal-timeline');
    if (!items.length) return;

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    items.forEach(el => obs.observe(el));
}

function parsePackageMoney(value) {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
    const parsed = parseFloat(String(value).replace(/[^0-9.-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
}

async function initWeatherWidget(city) {
    if (!city) return;

    const tiers = document.getElementById('pkg-tiers');
    if (!tiers) return;

    const widget = document.createElement('div');
    widget.id = 'weather-widget';
    widget.className = 'pkg-weather-widget';
    widget.innerHTML = '<span class="weather-loading"><i class="fas fa-spinner fa-spin"></i> Checking weather…</span>';
    tiers.insertAdjacentElement('afterend', widget);

    try {
        const res = await fetch('/api/external/weather?city=' + encodeURIComponent(city));
        const data = await res.json();

        if (!res.ok || data.status !== 'success') { widget.remove(); return; }

        const w = data.data;
        widget.innerHTML = `
            <div class="weather-content">
                <img src="https://openweathermap.org/img/wn/${w.icon}@2x.png" alt="${w.description}" class="weather-icon">
                <div class="weather-info">
                    <span class="weather-city"><i class="fas fa-map-pin"></i> ${w.city}</span>
                    <span class="weather-temp">${w.temp}&deg;C</span>
                    <span class="weather-desc">${w.description}</span>
                </div>
            </div>
        `;
    } catch (e) {
        widget.remove();
    }
}
