// ============================================
// DATA STORAGE (Mock Data Only - No localStorage)
// ============================================

const LocationData = {
    currentLocation: {
        id: 1,
        name: "The Great Pyramids of Giza",
        description: "The last surviving wonder of the ancient world, these monumental tombs have stood for over 4,500 years. Located on the Giza plateau, these pyramids continue to amaze visitors from around the world.",
        basePricePerPerson: 25,
        rating: 4.8,
        historicalFacts: [
            "Built around 2560 BCE",
            "Originally stood at 146.5 meters tall",
            "Made of approximately 2.3 million stone blocks",
            "Each block weighs between 2.5 to 15 tons",
            "The Great Pyramid is the oldest of the Seven Wonders"
        ],
        highlights: [
            "View the Sphinx",
            "Enter the King's Chamber",
            "Camel riding experience",
            "Sound and light show at sunset",
            "Solar Boat Museum"
        ],
        images: {
            main: "📸 Main Image: Pyramids at Sunset",
            thumbnails: [
                "📸 Pyramids Aerial View",
                "📸 Sphinx Close-up",
                "📸 Camel Ride Experience"
            ]
        }
    },
    
    timeSlots: [
        { id: 1, time: "08:00 AM", available: true },
        { id: 2, time: "10:00 AM", available: true },
        { id: 3, time: "01:00 PM", available: true },
        { id: 4, time: "03:00 PM", available: false },
        { id: 5, time: "05:00 PM", available: true }
    ],
    
    guides: [
        { id: 101, name: "John Sturgis", languages: ["English", "Spanish"], fee: 50, rating: 4.9 },
        { id: 102, name: "Maria Ghattas", languages: ["English", "French", "Arabic"], fee: 60, rating: 4.7 },
        { id: 103, name: "George Derek", languages: ["Japanese", "English"], fee: 55, rating: 4.8 },
        { id: 104, name: "Marco Rossi", languages: ["Italian", "English"], fee: 50, rating: 4.6 }
    ],
    
    reviews: [
        { id: 1, user: "John D.", rating: 5, comment: "Absolutely breathtaking experience! The guides were very knowledgeable.", date: "2024-01-15" },
        { id: 2, user: "Sarah L.", rating: 4, comment: "Very informative guides, highly recommend the early morning tour.", date: "2024-01-20" },
        { id: 3, user: "Carlos M.", rating: 5, comment: "The sound and light show is magical. A must-see!", date: "2024-02-01" }
    ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getStars(rating) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
        stars += i < rating ? "★" : "☆";
    }
    return stars;
}

// ============================================
// PAGE DISPLAY FUNCTIONS
// ============================================

function displayLocationInfo() {
    const loc = LocationData.currentLocation;
    
    document.title = loc.name + " | Egypt Tourism Hub";
    document.getElementById("location-name").textContent = loc.name;
    document.getElementById("location-rating").innerHTML = `${loc.rating}/5 ${getStars(loc.rating)}`;
    document.getElementById("location-description").textContent = loc.description;
    
    // Display highlights
    const highlightsHtml = "<ul>" + loc.highlights.map(h => `<li>${h}</li>`).join("") + "</ul>";
    document.getElementById("location-highlights").innerHTML = highlightsHtml;
    
    // Display facts
    const factsHtml = loc.historicalFacts.map(f => `<li>${f}</li>`).join("");
    document.getElementById("facts-list").innerHTML = factsHtml;
    
    // Display images
    document.getElementById("main-image").innerHTML = `<strong>${loc.images.main}</strong>`;
    const thumbsHtml = loc.images.thumbnails.map((img, i) => `<p><strong>${img}</strong></p>`).join("");
    document.getElementById("thumbnail-list").innerHTML = thumbsHtml;
}

function displayTimeSlots() {
    const container = document.getElementById("time-slots-container");
    let html = "";
    
    LocationData.timeSlots.forEach((slot, index) => {
        const isDisabled = !slot.available;
        const isChecked = (!isDisabled && index === 0) ? "checked" : "";
        
        html += `
            <div>
                <label>
                    <input type="radio" 
                           name="time-slot" 
                           value="${slot.id}"
                           ${isDisabled ? "disabled" : ""}
                           ${isChecked}>
                    ${slot.time}
                    ${!slot.available ? " (Not Available)" : ""}
                </label>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function displayGuides() {
    const select = document.getElementById("guide-select");
    let html = '<option value="">No Guide Needed</option>';
    
    LocationData.guides.forEach(guide => {
        const languages = guide.languages.join(" / ");
        html += `
            <option value="${guide.id}" data-fee="${guide.fee}">
                ${guide.name} | ${languages} | $${guide.fee} | ★${guide.rating}
            </option>
        `;
    });
    
    select.innerHTML = html;
}

function displayReviews() {
    const container = document.getElementById("reviews-container");
    
    if (LocationData.reviews.length === 0) {
        container.innerHTML = "<p>No reviews yet. Be the first!</p>";
        return;
    }
    
    let html = "";
    LocationData.reviews.forEach(review => {
        html += `
            <div>
                <strong>${review.user}</strong> ${getStars(review.rating)}
                <p>${review.comment}</p>
                <small>Reviewed on: ${review.date}</small>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// PRICE CALCULATION
// ============================================

function getSelectedGuideFee() {
    const select = document.getElementById("guide-select");
    const selectedOption = select.options[select.selectedIndex];
    const fee = selectedOption.getAttribute("data-fee");
    return fee ? parseInt(fee) : 0;
}

function getQuantity() {
    const input = document.getElementById("quantity");
    return parseInt(input.value) || 1;
}

function calculateAndDisplayPrice() {
    const basePrice = LocationData.currentLocation.basePricePerPerson;
    const quantity = getQuantity();
    const guideFee = getSelectedGuideFee();
    
    const baseTotal = basePrice * quantity;
    const finalTotal = baseTotal + guideFee;
    
    document.getElementById("base-price").textContent = baseTotal;
    document.getElementById("guide-fee").textContent = guideFee;
    document.getElementById("total-price").textContent = finalTotal;
}

// ============================================
// FORM HANDLERS (No localStorage - Just alerts)
// ============================================

function getSelectedTimeSlot() {
    const selected = document.querySelector('input[name="time-slot"]:checked');
    if (!selected) return null;
    const slotId = parseInt(selected.value);
    return LocationData.timeSlots.find(slot => slot.id === slotId);
}

function getSelectedGuide() {
    const select = document.getElementById("guide-select");
    if (!select.value) return null;
    const guideId = parseInt(select.value);
    return LocationData.guides.find(guide => guide.id === guideId);
}

function validateBooking() {
    const visitDate = document.getElementById("visit-date").value;
    const timeSlot = getSelectedTimeSlot();
    const quantity = getQuantity();
    
    if (!visitDate) {
        alert("❌ Please select a visit date");
        return false;
    }
    
    if (!timeSlot) {
        alert("❌ Please select a time slot");
        return false;
    }
    
    if (quantity < 1) {
        alert("❌ Minimum 1 person required");
        return false;
    }
    
    return true;
}

function showBookingSummary() {
    const loc = LocationData.currentLocation;
    const visitDate = document.getElementById("visit-date").value;
    const timeSlot = getSelectedTimeSlot();
    const quantity = getQuantity();
    const guide = getSelectedGuide();
    const total = parseInt(document.getElementById("total-price").textContent);
    
    let summary = "📋 BOOKING SUMMARY\n\n";
    summary += `📍 Location: ${loc.name}\n`;
    summary += `📅 Date: ${visitDate}\n`;
    summary += `⏰ Time: ${timeSlot.time}\n`;
    summary += `👥 People: ${quantity}\n`;
    
    if (guide) {
        summary += `👨‍🏫 Guide: ${guide.name} ($${guide.fee})\n`;
    } else {
        summary += `👨‍🏫 Guide: No guide selected\n`;
    }
    
    summary += `\n💰 Total Price: $${total}\n`;
    summary += `\n✅ Booking confirmed! (Demo - no data saved)`;
    
    alert(summary);
}

function handleBooking(event) {
    event.preventDefault();
    
    if (validateBooking()) {
        showBookingSummary();
        // Optional: Reset form or redirect
        // document.getElementById("booking-form").reset();
    }
}

function handleAddToCart() {
    if (validateBooking()) {
        const loc = LocationData.currentLocation.name;
        const total = document.getElementById("total-price").textContent;
        alert(`🛒 Added "${loc}" to cart!\n💰 Total: $${total}\n\n(Demo - cart not implemented)`);
    }
}

// ============================================
// SETUP DATE PICKER
// ============================================

function setMinDate() {
    const dateInput = document.getElementById("visit-date");
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    const quantityInput = document.getElementById("quantity");
    const guideSelect = document.getElementById("guide-select");
    const bookingForm = document.getElementById("booking-form");
    const cartButton = document.getElementById("add-to-cart");
    
    quantityInput.addEventListener("input", calculateAndDisplayPrice);
    guideSelect.addEventListener("change", calculateAndDisplayPrice);
    bookingForm.addEventListener("submit", handleBooking);
    cartButton.addEventListener("click", handleAddToCart);
}

// ============================================
// INITIALIZE PAGE
// ============================================

function initPage() {
    displayLocationInfo();
    displayTimeSlots();
    displayGuides();
    displayReviews();
    setMinDate();
    calculateAndDisplayPrice();
    setupEventListeners();
    
    console.log("✅ Page loaded successfully!");
}

// Start everything when page is ready
window.addEventListener("DOMContentLoaded", initPage);