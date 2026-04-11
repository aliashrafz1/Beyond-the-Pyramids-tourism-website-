// --- 1. Multi-Filter Logic ---

const allCards = document.querySelectorAll(".card");
const durationFilter = document.getElementById("filter-duration");
const priceFilter = document.getElementById("filter-price");
const accFilter = document.getElementById("filter-acc");

function applyFilters() {
    const selectedDuration = durationFilter.value;
    const selectedPrice = priceFilter.value;
    const selectedAcc = accFilter.value;

    allCards.forEach(function(card) {
        const cardDuration = card.dataset.duration;
        const cardPrice = card.dataset.price;
        const cardAcc = card.dataset.acc;

        const matchesDuration = (selectedDuration === "all" || selectedDuration === cardDuration);
        const matchesPrice = (selectedPrice === "all" || selectedPrice === cardPrice);
        const matchesAcc = (selectedAcc === "all" || selectedAcc === cardAcc);

        // Show card only if it matches all three dropdowns
        if (matchesDuration && matchesPrice && matchesAcc) {
            card.style.display = "flex"; // Must match the CSS display type
        } else {
            card.style.display = "none";
        }
    });
}

// Listen for changes on any of the dropdowns
durationFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);
accFilter.addEventListener("change", applyFilters);


// --- 2. Modal Popup Logic ---

const modal = document.getElementById("itinerary-modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const closeBtn = document.querySelector(".close-btn");
const detailsButtons = document.querySelectorAll(".details-btn");

// Open the modal and insert data when "View Details" is clicked
detailsButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        // Grab data from the specific card that was clicked
        const title = this.parentElement.querySelector("h3").textContent;
        // Using innerHTML so we keep the <br> line breaks we added in the HTML
        const itinerary = this.parentElement.querySelector(".itinerary-data").innerHTML;
        
        // Put the data into the modal
        modalTitle.textContent = title;
        modalText.innerHTML = itinerary;
        
        // Show the modal
        modal.style.display = "block";
    });
});

// Close the modal when the user clicks the 'X'
closeBtn.addEventListener("click", function() {
    modal.style.display = "none";
});

// Close the modal if the user clicks the dark background outside the white box
window.addEventListener("click", function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});