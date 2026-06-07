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

    function validate() {
        if (acceptBtn) {
            acceptBtn.disabled = !(termsCheck.checked && privacyCheck.checked);
        }
    }

    if (termsCheck) termsCheck.onchange = validate;
    if (privacyCheck) privacyCheck.onchange = validate;

    const loginError = document.getElementById('terms-login-error');

    if (acceptBtn) {
        acceptBtn.onclick = () => {
            const loggedIn = typeof SERVER_DATA !== 'undefined' && SERVER_DATA.user;
            if (!loggedIn) {
                if (loginError) loginError.textContent = 'You must be logged in to accept the terms.';
                return;
            }
            if (loginError) loginError.textContent = '';
            showSuccessState();
        };
    }

    function showSuccessState() {
        if (termsCheck) termsCheck.checked = true;
        if (privacyCheck) privacyCheck.checked = true;
        if (termsCheck) termsCheck.disabled = true;
        if (privacyCheck) privacyCheck.disabled = true;
        if (acceptBtn) {
            acceptBtn.disabled = true;
            acceptBtn.textContent = "Terms Accepted";
        }
        if (successMsg) successMsg.style.display = 'block';
    }

    window.addEventListener('scroll', () => {
        const top = window.scrollY;
        const bodyHeight = document.documentElement.scrollHeight - window.innerHeight;

        if (progressBar && progressText) {
            const percent = Math.min(Math.max(Math.round((top / bodyHeight) * 100), 0), 100);
            progressBar.style.width = percent + '%';
            progressText.innerText = percent + '%';
        }

        if (scrollToTopBtn) {
            scrollToTopBtn.style.display = top > 500 ? 'flex' : 'none';
        }

        let currentSectionId = "";
        sections.forEach(s => {
            const sectionTop = s.offsetTop;
            if (top >= sectionTop - 200) {
                currentSectionId = s.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(l => {
                l.classList.remove('active');
                if (l.getAttribute('href') === `#${currentSectionId}`) {
                    l.classList.add('active');
                }
            });
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
