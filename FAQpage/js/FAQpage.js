// FAQ Data
const faqData = [
    // General Questions
    {
        id: 1,
        category: "general",
        question: "What is Beyond the Pyramids?",
        answer: "Beyond the Pyramids is a comprehensive tourism platform that offers curated trips, day packages, week packages, and custom tours across Egypt. We connect travelers with local guides, hotels, and transportation services to create unforgettable experiences."
    },
    {
        id: 2,
        category: "general",
        question: "Is Beyond the Pyramids a travel agency?",
        answer: "Yes, we are a full-service travel platform that partners with local guides, hotels, and transportation providers across Egypt to offer you the best travel experiences."
    },
    {
        id: 3,
        category: "general",
        question: "Do I need to create an account?",
        answer: "Yes, you need to create an account to book trips. Registration is free and allows you to manage your bookings, save preferences, and receive personalized recommendations."
    },
    {
        id: 4,
        category: "general",
        question: "Is the website free to use?",
        answer: "Yes, browsing and searching for trips is completely free. You only pay when you book a trip."
    },
    {
        id: 5,
        category: "general",
        question: "What makes Beyond the Pyramids different?",
        answer: "We offer authentic Egyptian experiences with local experts, flexible customization options, and 24/7 customer support to ensure you have the best possible journey."
    },
    
    // Booking & Payment
    {
        id: 6,
        category: "booking",
        question: "How do I book a trip?",
        answer: "Browse our packages, select your desired trip, customize your options (overnight, meal, translator, group size), and click 'Book Now'. You'll receive a confirmation immediately."
    },
    {
        id: 7,
        category: "booking",
        question: "What payment methods are accepted?",
        answer: "We accept credit cards, debit cards, and bank transfer. All payments are processed securely. (Note: This is a demo project, so no actual payment is processed.)"
    },
    {
        id: 8,
        category: "booking",
        question: "Will I receive a booking confirmation?",
        answer: "Yes, you will receive an instant confirmation on screen and the booking will appear in your 'My Bookings' page. You'll also receive a booking ID for reference."
    },
    {
        id: 9,
        category: "booking",
        question: "Can I book for someone else?",
        answer: "Yes, you can book trips for friends and family. Just provide their details during the booking process or add them as accompanying travelers."
    },
    
    // Trips & Packages
    {
        id: 10,
        category: "trips",
        question: "What types of trips do you offer?",
        answer: "We offer Day Packages, Week Packages, Single Location visits, and fully Custom Trips. Each can be customized with options like overnight stays, meals, translators, and group size preferences."
    },
    {
        id: 11,
        category: "trips",
        question: "Can I customize my trip?",
        answer: "Absolutely! Use our Custom Trip Builder to create your perfect itinerary. You can choose destinations, duration, accommodation, transportation, and add special requests."
    },
    {
        id: 12,
        category: "trips",
        question: "Are meals included in the packages?",
        answer: "Some packages include meals, others offer it as an optional add-on. Check each package's details to see what's included and what can be added."
    },
    {
        id: 13,
        category: "trips",
        question: "Can I request a specific tour guide?",
        answer: "Yes, you can request specific guides during booking. We'll do our best to accommodate your request based on availability."
    },
    
    // Account & Profile
    {
        id: 14,
        category: "account",
        question: "How do I create an account?",
        answer: "Click 'Sign Up' on the homepage, fill in your name, email, password, and other details. It takes less than 2 minutes!"
    },
    {
        id: 15,
        category: "account",
        question: "How do I reset my password?",
        answer: "Click 'Forgot Password' on the login page and follow the instructions. You'll receive an email with a reset link."
    },
    {
        id: 16,
        category: "account",
        question: "Can I delete my account?",
        answer: "Yes, contact our customer support team to request account deletion. Please note that this action is permanent."
    },
    
    // Cancellation & Refunds
    {
        id: 17,
        category: "cancel",
        question: "What is your cancellation policy?",
        answer: "You can cancel up to 7 days before the trip for a full refund. Cancellations within 7 days may incur a fee depending on the package."
    },
    {
        id: 18,
        category: "cancel",
        question: "How do I cancel a booking?",
        answer: "Go to 'My Bookings', find your booking, and click 'Cancel'. Follow the confirmation steps. You'll receive a cancellation confirmation."
    },
    {
        id: 19,
        category: "cancel",
        question: "What if the trip is cancelled by the provider?",
        answer: "If we need to cancel your trip, you will receive a full refund and we'll help you find an alternative experience."
    },
    
    // Support & Contact
    {
        id: 20,
        category: "support",
        question: "How do I contact customer support?",
        answer: "You can email us at support@beyondpyramids.com, use the Contact page, or call our hotline at +20 123 456 789."
    },
    {
        id: 21,
        category: "support",
        question: "What are your support hours?",
        answer: "Our customer support team is available 24/7, 365 days a year. We're always here to help!"
    },
    {
        id: 22,
        category: "support",
        question: "Who do I contact for emergencies during a trip?",
        answer: "Call our emergency hotline: +20 123 456 789. This number is active 24/7 for active travelers."
    }
];

// Current selected category (null means show all)
let selectedCategory = null;

// DOM Elements
const faqContainer = document.getElementById('faqContainer');
const tabBtns = document.querySelectorAll('.tab-btn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderFAQs();
    attachEventListeners();
    checkLoginStatus();
});

// Render FAQs based on selected category
function renderFAQs() {
    let filteredFAQs = faqData;
    
    // If a category is selected, filter by that category
    if (selectedCategory !== null) {
        filteredFAQs = faqData.filter(faq => faq.category === selectedCategory);
    }
    
    if (filteredFAQs.length === 0) {
        faqContainer.innerHTML = `<div class="no-results">No questions found in this category.</div>`;
        return;
    }
    
    faqContainer.innerHTML = '';
    
    filteredFAQs.forEach(faq => {
        const faqItem = createFAQItem(faq);
        faqContainer.appendChild(faqItem);
    });
}

// Create a single FAQ item
function createFAQItem(faq) {
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.setAttribute('data-id', faq.id);
    
    item.innerHTML = `
        <div class="faq-question">
            <span>${faq.question}</span>
            <span class="faq-icon">▶</span>
        </div>
        <div class="faq-answer">
            ${faq.answer}
        </div>
    `;
    
    // Add click event to toggle answer
    const questionDiv = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');
    const icon = item.querySelector('.faq-icon');
    
    questionDiv.addEventListener('click', function() {
        if (answerDiv.classList.contains('show')) {
            answerDiv.classList.remove('show');
            icon.textContent = '▶';
        } else {
            answerDiv.classList.add('show');
            icon.textContent = '▼';
        }
    });
    
    return item;
}

// Handle tab click (select/deselect)
function handleTabClick(clickedBtn, category) {
    const isCurrentlySelected = clickedBtn.classList.contains('active');
    
    if (isCurrentlySelected) {
        // DESELECT: Remove active class and show all FAQs
        clickedBtn.classList.remove('active');
        selectedCategory = null;
    } else {
        // SELECT: Remove active from all tabs, then add to clicked one
        tabBtns.forEach(btn => btn.classList.remove('active'));
        clickedBtn.classList.add('active');
        selectedCategory = category;
    }
    
    renderFAQs();
}

// Attach event listeners
function attachEventListeners() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            handleTabClick(this, category);
        });
    });
}

// Check login status for header
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authLink = document.getElementById('authLink');
    
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('beyondPyramids_currentUser'));
        authLink.innerText = user ? `Logout (${user.firstName})` : 'Logout';
        authLink.href = '#';
        authLink.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('beyondPyramids_currentUser');
            alert('Logged out successfully!');
            window.location.href = 'index.html';
        };
    } else {
        authLink.innerText = 'Login';
        authLink.href = 'login.html';
    }
}