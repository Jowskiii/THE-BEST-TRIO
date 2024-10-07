// Initialize Firebase (assuming firebase-config.js is loaded before this script)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// DOM elements
const profileInfo = document.getElementById('profile-info');
const editProfileForm = document.getElementById('edit-profile-form');
const favoriteItems = document.getElementById('favorite-items');

// Helper function to get current user ID
function getCurrentUserId() {
    return auth.currentUser ? auth.currentUser.uid : null;
}

// Load user profile
function loadUserProfile() {
    const userId = getCurrentUserId();
    if (!userId) {
        console.error('No user logged in');
        return;
    }

    db.collection('users').doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                profileInfo.innerHTML = `
                    <p><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
                `;
                document.getElementById('firstName').value = userData.firstName;
                document.getElementById('lastName').value = userData.lastName;
                document.getElementById('email').value = userData.email;
            } else {
                console.log('No such document!');
            }
        })
        .catch((error) => {
            console.error('Error getting document:', error);
        });
}

// Update user profile
editProfileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const userId = getCurrentUserId();
    if (!userId) {
        console.error('No user logged in');
        return;
    }

    const updatedProfile = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value
    };

    db.collection('users').doc(userId).update(updatedProfile)
        .then(() => {
            console.log('Profile updated successfully');
            loadUserProfile();
        })
        .catch((error) => {
            console.error('Error updating profile:', error);
        });
});

// Load favorite items
function loadFavoriteItems() {
    const userId = getCurrentUserId();
    if (!userId) {
        console.error('No user logged in');
        return;
    }

    db.collection('users').doc(userId).collection('favorites').get()
        .then((querySnapshot) => {
            let favoritesHtml = '';
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                favoritesHtml += `
                    <div class="card mb-3">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text">${item.description}</p>
                                    <p class="card-text"><small class="text-muted">Price: $${item.price}</small></p>
                                    <button class="btn btn-danger btn-sm remove-favorite" data-id="${doc.id}">Remove from Favorites</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
            favoriteItems.innerHTML = favoritesHtml;
            addRemoveFavoriteListeners();
        })
        .catch((error) => {
            console.error('Error getting favorite items:', error);
        });
}

// Add event listeners to remove favorite buttons
function addRemoveFavoriteListeners() {
    const removeButtons = document.querySelectorAll('.remove-favorite');
    removeButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const itemId = e.target.getAttribute('data-id');
            removeFavoriteItem(itemId);
        });
    });
}

// Remove favorite item
function removeFavoriteItem(itemId) {
    const userId = getCurrentUserId();
    if (!userId) {
        console.error('No user logged in');
        return;
    }

    db.collection('users').doc(userId).collection('favorites').doc(itemId).delete()
        .then(() => {
            console.log('Favorite item removed successfully');
            loadFavoriteItems();
        })
        .catch((error) => {
            console.error('Error removing favorite item:', error);
        });
}

// Check if user is logged in and load data
auth.onAuthStateChanged((user) => {
    if (user) {
        loadUserProfile();
        loadFavoriteItems();
    } else {
        console.log('No user logged in');
        // Redirect to login page or show login prompt
    }
});