//Data

var DESTINATIONS = [
    { id: "giza", name: "Giza Pyramids", price: 45 },
    { id: "luxor", name: "Luxor Temple", price: 35 },
    { id: "valley", name: "Valley of Kings", price: 50 },
    { id: "aswan", name: "Aswan High Dam", price: 25 },
    { id: "abusimbel", name: "Abu Simbel", price: 65 },
    { id: "alexandria", name: "Alexandria Library", price: 30 },
    { id: "sharm", name: "Sharm El Sheikh", price: 55 },
    { id: "siwa", name: "Siwa Oasis", price: 40 },
    { id: "hurghada", name: "Hurghada", price: 50 },
    { id: "saqqara", name: "Saqqara", price: 30 }
];

var ACC_TYPES = [
    { id: "budget", name: "Budget Hostel", price: 25 },
    { id: "standard", name: "Standard Hotel", price: 60 },
    { id: "premium", name: "Premium Hotel", price: 120 },
    { id: "luxury", name: "Luxury Resort", price: 250 }
];

var ROOM_TYPES = [
    { id: "single", name: "Single Room", mult: 1 },
    { id: "double", name: "Double Room", mult: 1.4 },
    { id: "suite", name: "Suite", mult: 2 }
];

var TRANSPORT = [
    { id: "private", name: "Private Car", price: 45 },
    { id: "minibus", name: "Minibus", price: 30 },
    { id: "luxury", name: "Luxury Van", price: 80 }
];

var GUIDES = [
    { id: "standard", name: "Standard Guide", price: 40 },
    { id: "premium", name: "Premium Guide", price: 80 }
];

var LANGUAGES = ["English", "Arabic", "French", "German", "Spanish", "Italian", "Japanese", "Chinese", "Russian"];
var SPECS = ["Ancient History", "Islamic Architecture", "Marine Biology", "Photography Tours", "Adventure", "Food & Culture"];

//States

var currentStep = 0;
var selectedDests = [];
var selectedTransport = "";
var selectedGuide = "";

//Init

document.addEventListener("DOMContentLoaded", function () {
    buildStep1();
    buildStep3();
    buildStep4();
    buildStep5();

    var today = new Date().toISOString().split("T")[0];
    document.getElementById("trip-start").min = today;
    document.getElementById("trip-end").min = today;

    document.getElementById("trip-start").addEventListener("change", onDateChange);
    document.getElementById("trip-end").addEventListener("change", onDateChange);
    document.getElementById("acc-type").addEventListener("change", recalcPrice);
    document.getElementById("acc-room").addEventListener("change", recalcPrice);
    document.getElementById("airport-pickup").addEventListener("change", recalcPrice);
    document.getElementById("inter-city").addEventListener("change", recalcPrice);

    showStep(0);
});

//Navigation

function showStep(n) {
    currentStep = n;
    var steps = document.querySelectorAll(".wizard-step");
    for (var i = 0; i < steps.length; i++) {
        steps[i].classList.toggle("active", i === n);
    }
    var items = document.querySelectorAll(".stepper-step");
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("active", "completed");
        if (i === n) items[i].classList.add("active");
        else if (i < n) items[i].classList.add("completed");
    }
    if (n === 5) buildReview();
    recalcPrice();
}

function nextStep() {
    if (!validateStep(currentStep)) return;
    if (currentStep < 5) showStep(currentStep + 1);
}

function prevStep() {
    if (currentStep > 0) showStep(currentStep - 1);
}

//Validation (only destinations, dates, and terms are required) the rest is optional

function validateStep(step) {
    hideAllErrors();
    if (step === 0 && selectedDests.length < 1) {
        showError("dest-error", "Please select at least 1 destination.");
        return false;
    }
    if (step === 1) {
        var s = document.getElementById("trip-start").value;
        var e = document.getElementById("trip-end").value;
        if (!s) { showError("date-error", "Please select a start date."); return false; }
        if (!e) { showError("date-error", "Please select an end date."); return false; }
        var d = getDuration();
        if (d < 1) { showError("date-error", "End date must be after start date."); return false; }
        if (d > 14) { showError("date-error", "Maximum trip duration is 14 days."); return false; }
    }
    if (step === 5 && !document.getElementById("terms-check").checked) {
        showError("review-error", "Please accept the terms and conditions.");
        return false;
    }
    return true;
}

function showError(id, msg) {
    var el = document.getElementById(id);
    if (el) { el.textContent = msg; el.classList.add("show"); }
}

function hideAllErrors() {
    var errs = document.querySelectorAll(".error-msg");
    for (var i = 0; i < errs.length; i++) { errs[i].classList.remove("show"); errs[i].textContent = ""; }
}

//Step 1: Destinations

function buildStep1() {
    var grid = document.getElementById("dest-grid");
    for (var i = 0; i < DESTINATIONS.length; i++) {
        var card = document.createElement("div");
        card.className = "dest-card";
        card.dataset.id = DESTINATIONS[i].id;
        card.innerHTML = "<strong>" + DESTINATIONS[i].name + "</strong><br>$" + DESTINATIONS[i].price;
        card.addEventListener("click", (function (id) {
            return function () { toggleDest(id); };
        })(DESTINATIONS[i].id));
        grid.appendChild(card);
    }
}

function toggleDest(id) {
    var idx = selectedDests.indexOf(id);
    if (idx > -1) { selectedDests.splice(idx, 1); }
    else if (selectedDests.length < 5) { selectedDests.push(id); }
    else { alert("Maximum 5 destinations."); return; }

    var cards = document.querySelectorAll(".dest-card");
    for (var i = 0; i < cards.length; i++) {
        cards[i].classList.toggle("selected", selectedDests.indexOf(cards[i].dataset.id) > -1);
    }
    document.getElementById("dest-counter").textContent = selectedDests.length + " of 5 selected (min 1)";
    recalcPrice();
}

//Step 2: Dates

function onDateChange() {
    var startVal = document.getElementById("trip-start").value;
    var endEl = document.getElementById("trip-end");
    if (startVal) {
        var min = new Date(startVal); min.setDate(min.getDate() + 1);
        var max = new Date(startVal); max.setDate(max.getDate() + 14);
        endEl.min = min.toISOString().split("T")[0];
        endEl.max = max.toISOString().split("T")[0];
    }
    var dur = getDuration();
    document.getElementById("duration-display").textContent = dur > 0 ? dur + " day(s) / " + (dur - 1) + " night(s)" : "Select dates above";
    recalcPrice();
}

function getDuration() {
    var s = document.getElementById("trip-start").value;
    var e = document.getElementById("trip-end").value;
    if (!s || !e) return 0;
    var diff = Math.round((new Date(e) - new Date(s)) / 86400000);
    return diff > 0 ? diff : 0;
}

//Step 3: Accommodation

function buildStep3() {
    var sel1 = document.getElementById("acc-type");
    sel1.innerHTML = '<option value="">-- Select Type --</option>';
    for (var i = 0; i < ACC_TYPES.length; i++) {
        sel1.innerHTML += '<option value="' + ACC_TYPES[i].id + '">' + ACC_TYPES[i].name + ' - $' + ACC_TYPES[i].price + '/night</option>';
    }
    var sel2 = document.getElementById("acc-room");
    sel2.innerHTML = '<option value="">-- Select Room --</option>';
    for (var i = 0; i < ROOM_TYPES.length; i++) {
        sel2.innerHTML += '<option value="' + ROOM_TYPES[i].id + '">' + ROOM_TYPES[i].name + '</option>';
    }
}

//Step 4: Transportation

function buildStep4() {
    var c = document.getElementById("transport-cards");
    for (var i = 0; i < TRANSPORT.length; i++) {
        var card = document.createElement("div");
        card.className = "option-card";
        card.dataset.id = TRANSPORT[i].id;
        card.innerHTML = "<strong>" + TRANSPORT[i].name + "</strong><br>$" + TRANSPORT[i].price + "/day";
        card.addEventListener("click", (function (id) {
            return function () {
                selectedTransport = id;
                var all = document.querySelectorAll("#transport-cards .option-card");
                for (var j = 0; j < all.length; j++) { all[j].classList.toggle("selected", all[j].dataset.id === id); }
                recalcPrice();
            };
        })(TRANSPORT[i].id));
        c.appendChild(card);
    }
}

//Step 5: Guide

function buildStep5() {
    var c = document.getElementById("guide-cards");
    for (var i = 0; i < GUIDES.length; i++) {
        var card = document.createElement("div");
        card.className = "option-card";
        card.dataset.id = GUIDES[i].id;
        card.innerHTML = "<strong>" + GUIDES[i].name + "</strong><br>$" + GUIDES[i].price + "/day";
        card.addEventListener("click", (function (id) {
            return function () {
                selectedGuide = id;
                var all = document.querySelectorAll("#guide-cards .option-card");
                for (var j = 0; j < all.length; j++) { all[j].classList.toggle("selected", all[j].dataset.id === id); }
                recalcPrice();
            };
        })(GUIDES[i].id));
        c.appendChild(card);
    }

    var lang = document.getElementById("guide-lang");
    lang.innerHTML = '<option value="">-- Select Language --</option>';
    for (var i = 0; i < LANGUAGES.length; i++) { lang.innerHTML += '<option value="' + LANGUAGES[i] + '">' + LANGUAGES[i] + '</option>'; }

    var spec = document.getElementById("guide-spec");
    spec.innerHTML = '<option value="">-- Any --</option>';
    for (var i = 0; i < SPECS.length; i++) { spec.innerHTML += '<option value="' + SPECS[i] + '">' + SPECS[i] + '</option>'; }
}

//Price

function recalcPrice() {
    var days = getDuration();
    var nights = days > 0 ? days - 1 : 0;

    var destTotal = 0;
    for (var i = 0; i < selectedDests.length; i++) {
        for (var j = 0; j < DESTINATIONS.length; j++) {
            if (DESTINATIONS[j].id === selectedDests[i]) destTotal += DESTINATIONS[j].price;
        }
    }

    var accTotal = 0;
    var at = document.getElementById("acc-type").value;
    var ar = document.getElementById("acc-room").value;
    if (at && nights > 0) {
        var ppn = 0, rm = 1;
        for (var i = 0; i < ACC_TYPES.length; i++) { if (ACC_TYPES[i].id === at) ppn = ACC_TYPES[i].price; }
        for (var i = 0; i < ROOM_TYPES.length; i++) { if (ROOM_TYPES[i].id === ar) rm = ROOM_TYPES[i].mult; }
        accTotal = ppn * rm * nights;
    }

    var transTotal = 0;
    if (selectedTransport && days > 0) {
        for (var i = 0; i < TRANSPORT.length; i++) { if (TRANSPORT[i].id === selectedTransport) transTotal = TRANSPORT[i].price * days; }
    }
    if (document.getElementById("airport-pickup").checked) transTotal += 35;
    if (document.getElementById("inter-city").checked) transTotal += 50;

    var guideTotal = 0;
    if (selectedGuide && days > 0) {
        for (var i = 0; i < GUIDES.length; i++) { if (GUIDES[i].id === selectedGuide) guideTotal = GUIDES[i].price * days; }
    }

    document.getElementById("price-dest").textContent = "$" + destTotal;
    document.getElementById("price-acc").textContent = "$" + Math.round(accTotal);
    document.getElementById("price-trans").textContent = "$" + transTotal;
    document.getElementById("price-guide").textContent = "$" + guideTotal;
    document.getElementById("price-total").textContent = "$" + (destTotal + Math.round(accTotal) + transTotal + guideTotal);
}

//Review

function buildReview() {
    var h = "";

    h += "<h3>Destinations</h3>";
    for (var i = 0; i < selectedDests.length; i++) {
        for (var j = 0; j < DESTINATIONS.length; j++) {
            if (DESTINATIONS[j].id === selectedDests[i]) h += "<p>" + DESTINATIONS[j].name + " - $" + DESTINATIONS[j].price + "</p>";
        }
    }

    h += "<h3>Dates</h3>";
    h += "<p>" + (document.getElementById("trip-start").value || "—") + " to " + (document.getElementById("trip-end").value || "—") + " (" + getDuration() + " days)</p>";

    h += "<h3>Accommodation</h3>";
    var at = document.getElementById("acc-type").value;
    if (at) {
        var name = "";
        for (var i = 0; i < ACC_TYPES.length; i++) { if (ACC_TYPES[i].id === at) name = ACC_TYPES[i].name; }
        h += "<p>" + name + "</p>";
    } else { h += "<p>Not selected</p>"; }

    h += "<h3>Transportation</h3>";
    if (selectedTransport) {
        var name = "";
        for (var i = 0; i < TRANSPORT.length; i++) { if (TRANSPORT[i].id === selectedTransport) name = TRANSPORT[i].name; }
        h += "<p>" + name + "</p>";
    } else { h += "<p>Not selected</p>"; }

    h += "<h3>Guide</h3>";
    if (selectedGuide) {
        var name = "";
        for (var i = 0; i < GUIDES.length; i++) { if (GUIDES[i].id === selectedGuide) name = GUIDES[i].name; }
        h += "<p>" + name + " - " + (document.getElementById("guide-lang").value || "No language") + "</p>";
    } else { h += "<p>Not selected</p>"; }

    document.getElementById("review-body").innerHTML = h;
}

//Submit

function submitTrip() {
    if (!validateStep(5)) return;
    localStorage.removeItem("btp_draft");
    alert("Trip submitted successfully!");
}