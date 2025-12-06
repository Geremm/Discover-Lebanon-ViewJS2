import { ref, computed } from 'vue';
import api from '../services/api'; // <--- 1. ON IMPORTE NOTRE SERVICE MAGIQUE

// VARIABLES D'ÉTAT (State)
const favoriteItems = ref([]); 
const currentUserId = ref(null);

// GETTER (Computed)
const favoriteIds = computed(() => {
    // 2. SÉCURITÉ ANTI-CRASH : On vérifie que c'est bien un tableau avant de faire .map()
    // Si favoriteItems vaut null ou une erreur, on utilise un tableau vide []
    const items = Array.isArray(favoriteItems.value) ? favoriteItems.value : [];
    return new Set(items.map(item => item.id));
});

export function useFavorites() {

    // A. INITIALISATION
    async function initFavorites(user) {
        if (user && user.id) {
            // CAS 1 : Utilisateur Connecté -> API via api.js
            currentUserId.value = user.id;
            try {
                // api.js gère le token et l'URL tout seul !
                const data = await api.getMyFavorites(user.id);
                
                // On s'assure qu'on reçoit bien un tableau
                favoriteItems.value = Array.isArray(data) ? data : [];
                
                console.log("Favoris chargés depuis API");
            } catch (e) {
                console.error("Erreur init API favorites:", e);
                favoriteItems.value = []; // En cas d'erreur, on vide la liste pour ne pas planter
            }
        } else {
            // CAS 2 : Invité -> LocalStorage (Inchangé, c'est très bien)
            currentUserId.value = null;
            const local = localStorage.getItem('guest_favorites');
            favoriteItems.value = local ? JSON.parse(local) : [];
            console.log("Favoris chargés depuis LocalStorage (Invité)");
        }
    }

    // B. ACTION : AJOUTER / RETIRER
    async function toggleFavorite(item) {
        // 1. Mise à jour immédiate de l'écran (Optimiste) -> On ne change rien, c'est parfait
        const exists = favoriteIds.value.has(item.id);
        
        if (exists) {
            favoriteItems.value = favoriteItems.value.filter(i => i.id !== item.id);
        } else {
            // Attention : assurez-vous que favoriteItems.value est un tableau avant de push
            if (!Array.isArray(favoriteItems.value)) favoriteItems.value = [];
            favoriteItems.value.push(item);
        }

        // 2. Sauvegarde (API ou LocalStorage)
        if (currentUserId.value) {
            console.log("Sauvegarde API...");
            try {
                if (exists) {
                    // On supprime via l'API
                    await api.removeFavorite(currentUserId.value, item.id);
                } else {
                    // On ajoute via l'API
                    await api.addFavorite(currentUserId.value, item.id);
                }
            } catch (e) {
                console.error("Erreur API save:", e);
                // Optionnel : Si l'API échoue, on pourrait annuler le changement visuel ici (rollback)
            }
        } else {
            // Mode Invité
            console.log("Sauvegarde LocalStorage...");
            localStorage.setItem('guest_favorites', JSON.stringify(favoriteItems.value));
        }
    }

    // C. EXPORT
    return {
        favoriteItems,
        favoriteIds,
        initFavorites,
        toggleFavorite
    };
}