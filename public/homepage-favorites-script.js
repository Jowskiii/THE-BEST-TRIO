// Import functions from favorite-sync.js
import { initFavoritesSync, toggleFavoriteItem, checkFavoriteStatus, registerFavoritesCallback } from './favorite-sync.js';

// Initialize favorites synchronization
initFavoritesSync();

// Function to toggle favorite status
async function toggleFavoriteItem(shoeId) {
    const isFavorite = await toggleFavoriteItem(shoeId);
    updateFavoriteUI(shoeId, isFavorite);
}

// Function to update UI based on favorite status
function updateFavoriteUI(shoeId, isFavorite) {
    const favoriteIcon = document.querySelector(`[data-shoe-id="${shoeId}"] .favorite-icon`);
    if (favoriteIcon) {
        favoriteIcon.classList.toggle('active', isFavorite);
    }
}

// Function to initialize favorite status for all shoes
async function initializeFavorites() {
    const shoes = document.querySelectorAll('[data-shoe-id]');
    for (const shoe of shoes) {
        const shoeId = shoe.dataset.shoeId;
        const isFavorite = await checkFavoriteStatus(shoeId);
        updateFavoriteUI(shoeId, isFavorite);
    }
}

// Register callback to update UI when favorites change
registerFavoritesCallback((favorites) => {
    for (const shoeId in favorites) {
        updateFavoriteUI(shoeId, favorites[shoeId]);
    }
});

// Initialize favorites when the page loads
document.addEventListener('DOMContentLoaded', initializeFavorites);