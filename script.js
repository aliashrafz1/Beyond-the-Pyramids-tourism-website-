// Main JavaScript file for Beyond the Pyramids - All functions in one file

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
    initSmoothScroll();
    
    // Load testimonials
    loadTestimonials();
    
    // Handle contact form submission
    initContactForm();
    
    // Handle newsletter form submission
    initNewsletter();
    
    // Check if user is logged in (for navbar display)
    updateNavbarForUser();
    
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Handle registration form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Password validation for registration
    const passwordField = document.getElementById('regPassword');
    const confirmField = document.getElementById('confirmPassword');
    if (passwordField && confirmField) {
        passwordField.addEventListener('keyup', validatePasswordMatch);
        confirmField.addEventListener('keyup', validatePasswordMatch);
    }
    
    // Check if user is already logged in
    checkLoggedIn();
    
    // Add demo credentials filler for login page
    const demoNotice = document.querySelector('.demo-notice');
    if (demoNotice) {
        demoNotice.addEventListener('click', fillDemoCredentials);
    }
});

// ========== GENERAL FUNCTIONS ==========

// Smooth scroll function
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Load testimonials dynamically
function loadTestimonials() {
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    if (!testimonialsContainer) return;
    
    // Sample testimonials data
    const testimonials = [
        {
            name: "Sarah Johnson",
            country: "USA",
            text: "An unforgettable experience! The Pyramids at sunrise were magical. Our guide was knowledgeable and friendly.",
            rating: 5,
            image: "https://randomuser.me/api/portraits/women/1.jpg"
        },
        {
            name: "Ahmed Hassan",
            country: "UAE",
            text: "The Nile cruise package exceeded all expectations. Perfect organization and excellent service.",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        {
            name: "Emma Watson",
            country: "UK",
            text: "Booking was easy and the custom trip builder helped me create my dream itinerary.",
            rating: 4,
            image: "https://randomuser.me/api/portraits/women/2.jpg"
        },
        {
            name: "Michael Chen",
            country: "Canada",
            text: "Excellent guides and seamless transportation. Will definitely book again!",
            rating: 5,
            image: "https://randomuser.me/api/portraits/men/2.jpg"
        }
    ];
    
    // Build testimonials HTML
    let testimonialsHTML = '<div class="testimonials-grid">';
    testimonials.forEach(testimonial => {
        testimonialsHTML += `
            <div class="testimonial-card">
                <div class="testimonial-header">
                    <img src="${testimonial.image}" alt="${testimonial.name}">
                    <div>
                        <h4>${testimonial.name}</h4>
                        <p>${testimonial.country}</p>
                    </div>
                </div>
                <div class="testimonial-rating">
                    ${'★'.repeat(testimonial.rating)}${'☆'.repeat(5-testimonial.rating)}
                </div>
                <p class="testimonial-text">"${testimonial.text}"</p>
            </div>
        `;
    });
    testimonialsHTML += '</div>';
    
    testimonialsContainer.innerHTML = testimonialsHTML;
}

// Contact form handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Newsletter form handler
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        if (email) {
            alert(`Thank you for subscribing with ${email}!`);
            this.reset();
        } else {
            alert('Please enter an email address');
        }
    });
}

// Update navbar based on login status
function updateNavbarForUser() {
    const user = getCurrentUser();
    const navButtons = document.querySelector('.nav-buttons');
    
    if (user && navButtons) {
        // User is logged in, show different buttons
        const userName = user.name || user.email;
        navButtons.innerHTML = `
            <span class="welcome-text">Welcome, ${userName.split(' ')[0]}</span>
            <a href="dashboard.html" class="btn1btn">Dashboard</a>
            <button onclick="logout()" class="btn2btn">Logout</button>
        `;
    }
}

// Get current user from storage
function getCurrentUser() {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Logout function
function logout() {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// ========== AUTHENTICATION FUNCTIONS ==========

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.querySelector('input[name="remember"]')?.checked || false;
    
    // Demo authentication logic
    if (email === 'admin@demo.com' && password === 'admin123') {
        // Store user session
        const userData = {
            email: email,
            role: 'admin',
            name: 'Admin User',
            id: 'admin1'
        };
        
        if (remember) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('user', JSON.stringify(userData));
        }
        
        alert('Login successful! Redirecting to admin dashboard...');
        window.location.href = 'admin/dashboard.html';
        
    } else if (email === 'user@demo.com' && password === 'user123') {
        // Store user session
        const userData = {
            email: email,
            role: 'user',
            name: 'Demo User',
            id: 'user1'
        };
        
        if (remember) {
            localStorage.setItem('user', JSON.stringify(userData));
        } else {
            sessionStorage.setItem('user', JSON.stringify(userData));
        }
        
        alert('Login successful! Redirecting to dashboard...');
        window.location.href = 'dashboard.html';
        
    } else if (email === 'guide@demo.com' && password === 'guide123') {
        // Guide login
        const userData = {
            email: email,
            role: 'guide',
            name: 'Tour Guide',
            id: 'guide1'
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
        alert('Login successful! Redirecting to guide dashboard...');
        window.location.href = 'guide/dashboard.html';
        
    } else if (email === 'hotel@demo.com' && password === 'hotel123') {
        // Hotel manager login
        const userData = {
            email: email,
            role: 'hotel',
            name: 'Hotel Manager',
            id: 'hotel1'
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
        alert('Login successful! Redirecting to hotel dashboard...');
        window.location.href = 'hotel-manager/dashboard.html';
        
    } else if (email === 'transport@demo.com' && password === 'transport123') {
        // Transportation manager login
        const userData = {
            email: email,
            role: 'transport',
            name: 'Transport Manager',
            id: 'transport1'
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
        alert('Login successful! Redirecting to transport dashboard...');
        window.location.href = 'transport-manager/dashboard.html';
        
    } else if (email === 'planner@demo.com' && password === 'planner123') {
        // Planner login
        const userData = {
            email: email,
            role: 'planner',
            name: 'Trip Planner',
            id: 'planner1'
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
        alert('Login successful! Redirecting to planner dashboard...');
        window.location.href = 'planner/dashboard.html';
        
    } else if (email === 'booking@demo.com' && password === 'booking123') {
        // Booking manager login
        const userData = {
            email: email,
            role: 'booking',
            name: 'Booking Manager',
            id: 'booking1'
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
        alert('Login successful! Redirecting to booking manager dashboard...');
        window.location.href = 'booking-manager/dashboard.html';
        
    } else if (email === 'support@demo.com' && password === 'support123') {
        // Customer support login
        const userData = {
            email: email,
            role: 'support',
            name: 'Customer Support',
            id: 'support1'
        };
        sessionStorage.setItem('user', JSON.stringify(userData));
        alert('Login successful! Redirecting to support dashboard...');
        window.location.href = 'support/dashboard.html';
        
    } else {
        alert('Invalid credentials. Try:\n' +
              'Admin: admin@demo.com / admin123\n' +
              'User: user@demo.com / user123\n' +
              'Guide: guide@demo.com / guide123\n' +
              'Hotel: hotel@demo.com / hotel123\n' +
              'Transport: transport@demo.com / transport123\n' +
              'Planner: planner@demo.com / planner123\n' +
              'Booking: booking@demo.com / booking123\n' +
              'Support: support@demo.com / support123');
    }
}

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName')?.value || '';
    const lastName = document.getElementById('lastName')?.value || '';
    const email = document.getElementById('regEmail')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const language = document.getElementById('preferredLanguage')?.value || '';
    const password = document.getElementById('regPassword')?.value || '';
    const confirmPassword = document.getElementById('confirmPassword')?.value || '';
    const terms = document.querySelector('input[name="terms"]')?.checked || false;
    
    // Validate
    if (!firstName || !lastName || !email || !phone || !language || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    if (!terms) {
        alert('Please accept the Terms & Conditions');
        return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Validate phone (simple check)
    if (phone.length < 10) {
        alert('Please enter a valid phone number');
        return;
    }
    
    // For demo purposes, just show success and redirect
    alert(`Registration successful! Welcome ${firstName}!\n\nIn a real app, this would create an account in the database.`);
    
    // Store basic info for demo
    const userData = {
        name: firstName + ' ' + lastName,
        email: email,
        role: 'user',
        phone: phone,
        language: language
    };
    sessionStorage.setItem('user', JSON.stringify(userData));
    
    // Redirect to login
    window.location.href = 'login.html';
}

// Validate password match
function validatePasswordMatch() {
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    const confirmField = document.getElementById('confirmPassword');
    
    if (confirm === '') {
        confirmField.style.borderColor = '';
        confirmField.style.borderWidth = '';
    } else if (password !== confirm) {
        confirmField.style.borderColor = 'red';
        confirmField.style.borderWidth = '2px';
    } else {
        confirmField.style.borderColor = 'green';
        confirmField.style.borderWidth = '2px';
    }
}

// Check if user is logged in
function checkLoggedIn() {
    const user = sessionStorage.getItem('user') || localStorage.getItem('user');
    
    // If on login or register page and already logged in, redirect to dashboard
    const currentPage = window.location.pathname;
    if (user && (currentPage.includes('login.html') || currentPage.includes('register.html'))) {
        const userData = JSON.parse(user);
        if (userData.role === 'admin') {
            window.location.href = 'admin/dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    }
}

// Fill demo credentials when clicking on demo notice
function fillDemoCredentials() {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    if (emailField && passwordField) {
        emailField.value = 'user@demo.com';
        passwordField.value = 'user123';
    }
}