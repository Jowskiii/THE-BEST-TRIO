// Initialize Firebase (replace with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyAsXxiBkpkOywb7goIfcBRBnB8vNPt9hjc",
    authDomain: "isukat.firebaseapp.com",
    databaseURL: "https://isukat-default-rtdb.firebaseio.com",
    projectId: "isukat",
    storageBucket: "isukat.appspot.com",
    messagingSenderId: "751168754443",
    appId: "1:751168754443:web:e96a67dab5e30f077a080e",
    measurementId: "G-J090BFT08X"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
let currentUser;

// Check if user is logged in
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        loadUserProfile();
        loadFavoriteItems();
    } else {
        // Redirect to login page if not logged in
        window.location.href = 'login.html';
    }
});

function loadUserProfile() {
    db.collection('users').doc(currentUser.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementById('profile-info').innerHTML = `
                    <p><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</p>
                    <p><strong>Email:</strong> ${userData.email}</p>
                `;
            }
        })
        .catch((error) => {
            console.error("Error loading user profile: ", error);
        });
}

function loadFavoriteItems() {
    db.collection('users').doc(currentUser.uid).collection('favorites').get()
        .then((querySnapshot) => {
            let favoritesHtml = '';
            querySnapshot.forEach((doc) => {
                const item = doc.data();
                favoritesHtml += `
                    <div class="favorite-item">
                        <h5>${item.name}</h5>
                        <p>${item.description}</p>
                    </div>
                `;
            });
            document.getElementById('favorite-items').innerHTML = favoritesHtml || '<p>No favorite items yet.</p>';
        })
        .catch((error) => {
            console.error("Error loading favorite items: ", error);
        });
}

// Add event listener for the edit profile form (if you have one)
const editProfileForm = document.getElementById('edit-profile-form');
if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Get form values and update user profile in Firebase
        // ...
    });
}