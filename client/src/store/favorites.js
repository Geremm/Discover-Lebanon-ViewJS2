import { ref, computed } from 'vue';
import api from '../services/api'; 

const favoriteItems = ref([]); 
const currentUserId = ref(null);

const favoriteIds = computed(() => {
    const items = Array.isArray(favoriteItems.value) ? favoriteItems.value : [];
    return new Set(items.map(item => item.id));
});

export function useFavorites() {

    async function initFavorites(user) {
        if (user && user.id) {
            currentUserId.value = user.id;
            try {
                const data = await api.getMyFavorites(user.id);
                favoriteItems.value = Array.isArray(data) ? data : [];
                
            } catch (e) {
                console.error("Error init API favorites:", e);
                favoriteItems.value = []; 
            }
        } else {
            currentUserId.value = null;
            const local = localStorage.getItem('guest_favorites');
            favoriteItems.value = local ? JSON.parse(local) : [];
        }
    }

    async function toggleFavorite(item) {
        const exists = favoriteIds.value.has(item.id);
        
        if (exists) {
            favoriteItems.value = favoriteItems.value.filter(i => i.id !== item.id);
        } else {
            if (!Array.isArray(favoriteItems.value)) favoriteItems.value = [];
            favoriteItems.value.push(item);
        }

        if (currentUserId.value) {
            console.log("Sauvegarde API...");
            try {
                if (exists) {
                    await api.removeFavorite(currentUserId.value, item.id);
                } else {
                    await api.addFavorite(currentUserId.value, item.id);
                }
            } catch (e) {
                console.error("Erreur API save:", e);
            }
        } else {
            console.log("Sauvegarde LocalStorage...");
            localStorage.setItem('guest_favorites', JSON.stringify(favoriteItems.value));
        }
    }

    return {
        favoriteItems,
        favoriteIds,
        initFavorites,
        toggleFavorite
    };
}