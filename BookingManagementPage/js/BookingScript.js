document.addEventListener("DOMContentLoaded", function() {

    // 1. Grab HTML Elements for the Table and Search
    const searchInput = document.getElementById("search-input");
    const statusFilter = document.getElementById("status-filter");
    const dataRows = document.querySelectorAll(".data-row");

    // 2. Grab HTML Elements for the Modal
    const modal = document.getElementById("add-modal");
    const btnAddBooking = document.getElementById("btn-add-booking");
    const btnCancel = document.getElementById("btn-cancel");
    const form = document.getElementById("add-form");

    // ==========================================
    // FILTERING LOGIC
    // ==========================================
    function filterTable() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;

        dataRows.forEach(row => {
            // We grab the textContent of the WHOLE row so the user can search by Name OR Booking ID
            const rowText = row.textContent.toLowerCase();
            const rowStatus = row.getAttribute("data-status");

            const matchesSearch = rowText.includes(searchTerm);
            const matchesStatus = (selectedStatus === "all") || (rowStatus === selectedStatus);

            if (matchesSearch && matchesStatus) {
                row.style.display = ""; 
            } else {
                row.style.display = "none"; 
            }
        });
    }

    searchInput.addEventListener("keyup", filterTable);
    statusFilter.addEventListener("change", filterTable);

    // ==========================================
    // MODAL LOGIC
    // ==========================================
    
    // Open Modal
    btnAddBooking.addEventListener("click", function() {
        modal.style.display = "flex";
    });

    // Close Modal
    btnCancel.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Submit Form
    form.addEventListener("submit", function(event) {
        event.preventDefault(); 
        alert("Success! Booking saved. In Phase 2, this hits the database.");
        form.reset();
        modal.style.display = "none";
    });

    // ==========================================
    // ROW ACTIONS & EDIT MODAL LOGIC
    // ==========================================
    
    const tableBody = document.querySelector("tbody");
    const editModal = document.getElementById("edit-modal");
    const editForm = document.getElementById("edit-form");
    const btnEditCancel = document.getElementById("btn-edit-cancel");
    
    // This variable is CRITICAL. It remembers exactly WHICH row we are currently editing
    let currentRowBeingEdited = null; 

    // 1. Listen for clicks on the Edit or Delete buttons
    tableBody.addEventListener("click", function(event) {
        
        // ACTION: DELETE BUTTON
        if (event.target.classList.contains("btn-delete")) {
            const rowToModify = event.target.closest("tr");
            const confirmAction = confirm("Are you sure you want to remove this record?");
            if (confirmAction) {
                rowToModify.remove(); 
            }
        }

        // ACTION: EDIT BUTTON
        if (event.target.classList.contains("btn-edit")) {
            // Lock onto the row we clicked
            currentRowBeingEdited = event.target.closest("tr");
            
            // Extract the current text from the row's HTML cells
            const currentName = currentRowBeingEdited.querySelector("td:nth-child(2)").innerText;
            const currentPackage = currentRowBeingEdited.querySelector("td:nth-child(3)").innerText;
            const currentStatus = currentRowBeingEdited.getAttribute("data-status");
            
            // Inject that text into the Edit Modal's input boxes
            document.getElementById("edit-customer").value = currentName;
            document.getElementById("edit-package").value = currentPackage;
            document.getElementById("edit-status").value = currentStatus;
            
            // Turn on the Edit Modal
            editModal.style.display = "flex";
        }
    });

    // 2. Handle the Edit Form Submission (The "Save Changes" Button)
    editForm.addEventListener("submit", function(event) {
        event.preventDefault(); 
        
        if (currentRowBeingEdited) {
            // Grab the fresh text the user just typed into the modal
            const updatedName = document.getElementById("edit-customer").value;
            const updatedPackage = document.getElementById("edit-package").value;
            const updatedStatus = document.getElementById("edit-status").value;
            
            // Inject the fresh text back into the HTML table row
            currentRowBeingEdited.querySelector("td:nth-child(2)").innerText = updatedName;
            currentRowBeingEdited.querySelector("td:nth-child(3)").innerText = updatedPackage;
            
            // Update the badge text and capitalize the first letter (e.g., "pending" -> "Pending")
            const badge = currentRowBeingEdited.querySelector("td:nth-child(4) .badge");
            badge.innerText = updatedStatus.charAt(0).toUpperCase() + updatedStatus.slice(1);
            
            // Update the hidden data attribute so the search filters still work!
            currentRowBeingEdited.setAttribute("data-status", updatedStatus);
            
            // Close the modal and reset our memory variable
            editModal.style.display = "none";
            currentRowBeingEdited = null;
        }
    });

    // 3. Close the Edit Modal (Cancel button)
    btnEditCancel.addEventListener("click", function() {
        editModal.style.display = "none";
        currentRowBeingEdited = null;
    });

});