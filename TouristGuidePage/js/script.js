let guide = {
    languages: ["English", "Arabic", "French"],
    rating: 4.8,
    totalReviews: 24
};

let availability = [
    { date: "2024-05-20", slot: "morning" },
    { date: "2024-05-21", slot: "full" },
    { date: "2024-05-22", slot: "afternoon" }
];

let assignedTours = [
    { id: 1, date: "2024-05-20", time: "10:00 AM", location: "Location A", customers: 4, status: "confirmed" },
    { id: 2, date: "2024-05-25", time: "9:00 AM", location: "Location B", customers: 2, status: "pending" }
];

let reviews = [
    { id: 1, rating: 5, comment: "Excellent!", date: "2024-05-01" },
    { id: 2, rating: 5, comment: "Very good!", date: "2024-04-28" },
    { id: 3, rating: 4, comment: "Good experience.", date: "2024-04-25" }
];

function showLanguages() {
    let container = document.getElementById("languages-list");
    if (!container) return;
    
    let html = "<ul>";
    for (let i = 0; i < guide.languages.length; i++) {
        html += `<li>${guide.languages[i]} <button onclick="removeLang(${i})">Remove</button></li>`;
    }
    html += "</ul>";
    container.innerHTML = html;
}

function addNewLanguage() {
    let input = document.getElementById("new-language");
    let newLang = input.value.trim();
    
    if (newLang === "") {
        alert("Enter a language");
        return;
    }
    
    guide.languages.push(newLang);
    input.value = "";
    showLanguages();
}

function removeLang(index) {
    guide.languages.splice(index, 1);
    showLanguages();
}

function showAvailability() {
    let container = document.getElementById("availability-list");
    if (!container) return;
    
    if (availability.length === 0) {
        container.innerHTML = "<p>No availability set</p>";
        return;
    }
    
    let html = "<ul>";
    for (let i = 0; i < availability.length; i++) {
        let a = availability[i];
        let slotText = a.slot === "morning" ? "Morning" : a.slot === "afternoon" ? "Afternoon" : "Full Day";
        html += `<li>${a.date} - ${slotText} <button onclick="removeAvail(${i})">Remove</button></li>`;
    }
    html += "</ul>";
    container.innerHTML = html;
}

function addNewAvailability() {
    let date = document.getElementById("availability-date").value;
    let slot = document.getElementById("availability-slot").value;
    
    if (!date) {
        alert("Select a date");
        return;
    }
    
    availability.push({ date: date, slot: slot });
    document.getElementById("availability-date").value = "";
    showAvailability();
}

function removeAvail(index) {
    availability.splice(index, 1);
    showAvailability();
}

function showTours() {
    let container = document.getElementById("tours-list");
    if (!container) return;
    
    if (assignedTours.length === 0) {
        container.innerHTML = "<p>No upcoming tours</p>";
        return;
    }
    
    let html = "<ul>";
    for (let i = 0; i < assignedTours.length; i++) {
        let t = assignedTours[i];
        let statusText = t.status === "confirmed" ? "Confirmed" : "Pending";
        html += `<li>
                    ${t.date} at ${t.time} - ${t.location}<br>
                    ${t.customers} customers - ${statusText}
                    ${t.status === "pending" ? ` <button onclick="acceptTour(${t.id})">Accept</button>` : ""}
                 </li><br>`;
    }
    html += "</ul>";
    container.innerHTML = html;
}

function acceptTour(id) {
    for (let i = 0; i < assignedTours.length; i++) {
        if (assignedTours[i].id === id) {
            assignedTours[i].status = "confirmed";
            break;
        }
    }
    showTours();
}

function showReviews() {
    let container = document.getElementById("reviews-list");
    if (!container) return;
    
    if (reviews.length === 0) {
        container.innerHTML = "<p>No reviews yet</p>";
        return;
    }
    
    let html = "";
    for (let i = 0; i < reviews.length; i++) {
        let r = reviews[i];
        let stars = "";
        for (let s = 0; s < 5; s++) {
            stars += s < r.rating ? "★" : "☆";
        }
        html += `<div style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
                    ${stars}<br>
                    ${r.comment}<br>
                    <small>${r.date}</small>
                 </div>`;
    }
    container.innerHTML = html;
}

function showRating() {
    let container = document.getElementById("rating-display");
    if (!container) return;
    
    let stars = "";
    for (let i = 0; i < 5; i++) {
        stars += i < guide.rating ? "★" : "☆";
    }
    
    container.innerHTML = `
        <p><strong>${guide.rating}/5 ${stars}</strong></p>
        <p>Based on ${guide.totalReviews} reviews</p>
    `;
}

document.getElementById("add-language").addEventListener("click", addNewLanguage);
document.getElementById("add-availability").addEventListener("click", addNewAvailability);

window.removeLang = removeLang;
window.removeAvail = removeAvail;
window.acceptTour = acceptTour;

showLanguages();
showAvailability();
showTours();
showReviews();
showRating();