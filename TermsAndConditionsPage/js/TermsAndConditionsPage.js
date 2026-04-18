document.addEventListener('DOMContentLoaded', () => {
    const termsCheck = document.getElementById('terms-checkbox');
    const privacyCheck = document.getElementById('privacy-checkbox');
    const acceptBtn = document.getElementById('acceptBtn');
    const successMsg = document.getElementById('success-message');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    const navLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.legal-section');

    // Toggle accept button
    function validate() {
        acceptBtn.disabled = !(termsCheck.checked && privacyCheck.checked);
    }
    termsCheck.onchange = validate;
    privacyCheck.onchange = validate;

    // Handle acceptance
    acceptBtn.onclick = () => {
        termsCheck.disabled = privacyCheck.disabled = acceptBtn.disabled = true;
        successMsg.style.display = 'block';
    };

    // Scroll handlers
    window.onscroll = () => {
        const top = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        
        // Update progress
        const percent = Math.min(Math.max(Math.round((top / height) * 100), 0), 100);
        progressBar.style.width = percent + '%';
        progressText.innerText = percent + '%';

        // Scroll to top button
        scrollToTopBtn.style.display = top > 300 ? 'block' : 'none';

        // TOC active highlight
        sections.forEach(s => {
            if (top >= s.offsetTop - 120) {
                navLinks.forEach(l => l.classList.remove('active'));
                const link = document.querySelector(`.toc-link[href="#${s.id}"]`);
                if (link) link.classList.add('active');
            }
        });
    };

    scrollToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
});
