document.addEventListener('DOMContentLoaded', function () {
    displayUserName();
    setupReviewTypeSelection();
    setupStarRating();
    setupPhotoUpload();
    setupFormSubmission();
});

function displayUserName() {
    const userName = document.getElementById('user-name');

    if (userName) {
        userName.textContent = 'Maryam Ayman';
    }
}

function setupReviewTypeSelection() {
    const radioButtons = document.querySelectorAll('input[name="reviewType"]');
    const itemLabel = document.getElementById('item-label');
    const itemSelect = document.getElementById('item-select');

    const options = {
        guide: [
            { value: 'guide1', text: 'Ahmed Hassan - English, French, German' },
            { value: 'guide2', text: 'Fatima Farouk - English, Spanish, Russian, Chinese' },
            { value: 'guide3', text: 'Mohamed Ali - English, Italian, German' }
        ],
        hotel: [
            { value: 'hotel1', text: 'Marriott Mena House - Giza' },
            { value: 'hotel2', text: 'Sofitel Legend Old Cataract - Aswan' },
            { value: 'hotel3', text: 'Steigenberger Nile Palace - Luxor' }
        ],
        transport: [
            { value: 'transport1', text: 'Nile Cruise - 5 Star' },
            { value: 'transport2', text: 'Private A/C Vehicle' },
            { value: 'transport3', text: 'Domestic Flight Service' }
        ]
    };

    radioButtons.forEach(radio => {
        radio.addEventListener('change', function () {
            const selectedType = this.value;

            if (selectedType === 'guide') itemLabel.textContent = 'Guide';
            if (selectedType === 'hotel') itemLabel.textContent = 'Hotel';
            if (selectedType === 'transport') itemLabel.textContent = 'Transportation';

            itemSelect.innerHTML = '<option value="">-- Select --</option>';
            options[selectedType].forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.text;
                itemSelect.appendChild(option);
            });
        });
    });
}

function setupStarRating() {
    const stars = document.querySelectorAll('.stars i');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('mouseenter', function () {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });

        star.addEventListener('mouseleave', function () {
            highlightStars(currentRating);
        });

        star.addEventListener('click', function () {
            currentRating = parseInt(this.getAttribute('data-rating'));
            highlightStars(currentRating);
        });
    });

    function highlightStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('fas');
                star.classList.remove('far');
            } else {
                star.classList.add('far');
                star.classList.remove('fas');
            }
        });
    }
}

function setupPhotoUpload() {
    const uploadArea = document.getElementById('upload-area');
    const photoInput = document.getElementById('photo-input');
    const photoPreview = document.getElementById('photo-preview');
    let selectedFiles = [];

    if (uploadArea) {
        uploadArea.addEventListener('click', function () {
            photoInput.click();
        });
    }

    if (photoInput) {
        photoInput.addEventListener('change', function (e) {
            selectedFiles = Array.from(e.target.files);
            displayPhotoPreviews();
        });
    }

    function displayPhotoPreviews() {
        photoPreview.innerHTML = '';

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function (e) {
                const preview = document.createElement('div');
                preview.className = 'preview-item';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="remove-photo" data-index="${index}">✕</button>
                `;
                photoPreview.appendChild(preview);

                preview.querySelector('.remove-photo').addEventListener('click', function () {
                    selectedFiles.splice(index, 1);
                    displayPhotoPreviews();
                    photoInput.value = '';
                });
            };
            reader.readAsDataURL(file);
        });
    }
}

function setupFormSubmission() {
    const submitBtn = document.getElementById('submit-review');

    if (submitBtn) {
        submitBtn.addEventListener('click', function () {
            const selectedType = document.querySelector('input[name="reviewType"]:checked');
            const reviewType = selectedType ? selectedType.value : null;

            const itemSelect = document.getElementById('item-select');
            const selectedItem = itemSelect.options[itemSelect.selectedIndex]?.text;

            const filledStars = document.querySelectorAll('.stars i.fas');
            const rating = filledStars.length;

            const reviewText = document.getElementById('review-text').value.trim();

            if (!reviewType) {
                alert('Please select what you want to review (Guide, Hotel, or Transportation)');
                return;
            }

            if (!selectedItem || selectedItem === '-- Select --') {
                alert('Please select a specific ' + reviewType);
                return;
            }

            if (rating === 0) {
                alert('Please select a star rating (1-5)');
                return;
            }

            if (reviewText.length < 10) {
                alert('Please write a review (minimum 10 characters)');
                return;
            }


            console.log('Review data (ready for database):', {
                type: reviewType,
                item: selectedItem,
                rating: rating,
                text: reviewText,
                photos: selectedFiles.length,
                user: document.getElementById('user-name').textContent,
                date: new Date().toISOString()
            });

            document.getElementById('success-modal').style.display = 'flex';
        });
    }
}

function closeModal() {
    document.getElementById('success-modal').style.display = 'none';
    document.getElementById('review-text').value = '';
    const stars = document.querySelectorAll('.stars i');
    stars.forEach(star => {
        star.classList.add('far');
        star.classList.remove('fas');
    });
    document.getElementById('item-select').selectedIndex = 0;
    document.getElementById('photo-preview').innerHTML = '';
    window.location.href = 'main.html';
}