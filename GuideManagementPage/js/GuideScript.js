document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. GRAB HTML ELEMENTS
    // ==========================================
    const searchInput = document.getElementById("search-input"); // Or whatever your search ID is
    const statusFilter = document.getElementById("status-filter");
    const dataRows = document.querySelectorAll(".data-row");

    // "Add Guide" Modal Elements
    const addModal = document.getElementById("add-modal");
    const btnAddGuide = document.getElementById("btn-add-guide");
    const btnCancelAdd = document.getElementById("btn-cancel");
    const addForm = document.getElementById("add-form");

    // "Edit Guide" Modal Elements
    const guideTableBody = document.querySelector("tbody");
    const editGuideModal = document.getElementById("edit-guide-modal");
    const editGuideForm = document.getElementById("edit-guide-form");
    const btnEditGuideCancel = document.getElementById("btn-edit-guide-cancel");
    
    let currentGuideRow = null; // Memory for editing

    // ==========================================
    // 2. FILTERING LOGIC
    // ==========================================
    function filterTable() {
        if (!searchInput || !statusFilter) return; // Skip if elements aren't found
        
        const searchTerm = searchInput.value.toLowerCase();
        const selectedStatus = statusFilter.value;

        const allRows = document.querySelectorAll("tbody tr"); // Re-select rows in case new ones were added

        allRows.forEach(row => {
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

    if (searchInput) searchInput.addEventListener("keyup", filterTable);
    if (statusFilter) statusFilter.addEventListener("change", filterTable);


    // ==========================================
    // 3. "ADD NEW GUIDE" MODAL LOGIC
    // ==========================================
    if (btnAddGuide) {
        btnAddGuide.addEventListener("click", function() {
            addModal.style.display = "flex";
        });
    }

    if (btnCancelAdd) {
        btnCancelAdd.addEventListener("click", function() {
            addModal.style.display = "none";
        });
    }

    if (addForm) {
        addForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            alert("Success! Guide saved. (Phase 2 will update the table automatically here)");
            addForm.reset();
            addModal.style.display = "none";
        });
    }


    // ==========================================
    // 4. ROW ACTIONS & "EDIT GUIDE" MODAL LOGIC
    // ==========================================
    
    // Listen for clicks anywhere inside the table body
    if (guideTableBody) {
        guideTableBody.addEventListener("click", function(event) {
            
            // ACTION: DELETE BUTTON
            if (event.target.classList.contains("btn-delete")) {
                const rowToModify = event.target.closest("tr");
                const confirmAction = confirm("Are you sure you want to remove this guide from the system?");
                if (confirmAction) {
                    rowToModify.remove(); 
                }
            }

            // ACTION: EDIT BUTTON
            if (event.target.classList.contains("btn-edit")) {
                currentGuideRow = event.target.closest("tr");
                
                // Extract text from the row
                const currentName = currentGuideRow.querySelector("td:nth-child(1)").innerText;
                const currentLang = currentGuideRow.querySelector("td:nth-child(2)").innerText;
                const currentStatus = currentGuideRow.getAttribute("data-status");
                
                // Inject text into the Edit Modal
                document.getElementById("edit-guide-name").value = currentName;
                document.getElementById("edit-guide-lang").value = currentLang;
                document.getElementById("edit-guide-status").value = currentStatus;
                
                // Show Edit Modal
                editGuideModal.style.display = "flex";
            }
        });
    }

    // Handle Edit Form Submission
    if (editGuideForm) {
        editGuideForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            
            if (currentGuideRow) {
                // Grab fresh text from the modal
                const updatedName = document.getElementById("edit-guide-name").value;
                const updatedLang = document.getElementById("edit-guide-lang").value;
                const updatedStatus = document.getElementById("edit-guide-status").value;
                
                // Inject text back into the table row
                currentGuideRow.querySelector("td:nth-child(1)").innerHTML = `<strong>${updatedName}</strong>`;
                currentGuideRow.querySelector("td:nth-child(2)").innerText = updatedLang;
                
                // Update badge and hidden attribute
                const badge = currentGuideRow.querySelector("td:nth-child(3) .badge");
                if (badge) {
                    badge.innerText = updatedStatus.charAt(0).toUpperCase() + updatedStatus.slice(1);
                }
                currentGuideRow.setAttribute("data-status", updatedStatus);
                
                // Close modal
                editGuideModal.style.display = "none";
                currentGuideRow = null;
            }
        });
    }

    // Close Edit Modal
    if (btnEditGuideCancel) {
        btnEditGuideCancel.addEventListener("click", function() {
            editGuideModal.style.display = "none";
            currentGuideRow = null;
        });
    }

});