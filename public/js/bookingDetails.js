document.addEventListener('DOMContentLoaded', () => {
    initVoucherActions();
});

function initVoucherActions() {
    const printBtn = document.getElementById("print-btn");
    if (printBtn) {
        printBtn.addEventListener("click", () => window.print());
    }

    const copyBtn = document.getElementById("copy-btn");
    if (copyBtn) {
        copyBtn.addEventListener("click", () => {
            const num = document.getElementById("voucher-number").textContent;
            navigator.clipboard.writeText(num);
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy ID', 2000);
        });
    }

    const accordionBtn = document.querySelector(".accordion-btn");
    const accordionContent = document.querySelector(".accordion-content");
    if (accordionBtn && accordionContent) {
        accordionBtn.addEventListener("click", () => {
            const isOpen = accordionContent.style.display === "block";
            accordionContent.style.display = isOpen ? "none" : "block";
            const arrow = accordionBtn.querySelector(".arrow");
            if (arrow) arrow.innerHTML = isOpen ? "&#9660;" : "&#9650;";
        });
    }

    function enforceLightModeColors() {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const textElements = document.querySelectorAll('.editorial-title, .editorial-title span, .editorial-subtitle, .card-title, .info-row .label, .info-row .value, .itinerary-list li, .accordion-btn, .concierge-box h4, .concierge-box p, .concierge-link');

        textElements.forEach(el => {
            if (isLight) {
                el.style.setProperty("color", "#111111", "important");
            } else {
                el.style.removeProperty("color");
            }
        });

        const accentElements = document.querySelectorAll('.info-row .label, .accordion-content strong');
        accentElements.forEach(el => {
            if (isLight) {
                el.style.setProperty("color", "#b88a44", "important");
            } else {
                el.style.removeProperty("color");
            }
        });
    }

    setTimeout(enforceLightModeColors, 100);

    const observer = new MutationObserver(enforceLightModeColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
}
