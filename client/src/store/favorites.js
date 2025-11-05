// src/store/favorites.js
import { ref, computed, watch } from 'vue';

// 1. Crée une variable réactive pour stocker les ID des favoris.
// On l'initialise en lisant ce qui est déjà sauvegardé dans le localStorage.
const favoriteIds = ref(JSON.parse(localStorage.getItem('favorites')) || []);

// 2. Crée un Set pour des recherches rapides. Un `computed` le met à jour automatiquement.
const favoriteSet = computed(() => new Set(favoriteIds.value));

// 3. La fonction pour ajouter/retirer un favori.
function toggleFavorite(itemId) {
  if (favoriteSet.value.has(itemId)) {
    // Si l'ID est déjà là, on le retire
    favoriteIds.value = favoriteIds.value.filter(id => id !== itemId);
  } else {
    // Sinon, on l'ajoute
    favoriteIds.value.push(itemId);
  }
}

// 4. On surveille les changements de `favoriteIds` pour mettre à jour le localStorage.
watch(favoriteIds, (newValue) => {
  localStorage.setItem('favorites', JSON.stringify(newValue));
}, { deep: true });

// 5. On exporte tout ce dont nos composants auront besoin.
export function useFavorites() {
  return {
    favoriteIds,
    favoriteSet,
    toggleFavorite
  };
}