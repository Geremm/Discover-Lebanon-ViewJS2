import { ref, computed } from 'vue';

// VARIABLES D'ÉTAT (State)
const favoriteItems = ref([]); // La liste complète des objets (avec images, titres...)
const currentUserId = ref(null);

// GETTER (Computed) : Pour vérifier rapidement "Est-ce que l'ID 12 est favori ?"
const favoriteIds = computed(() => {
    return new Set(favoriteItems.value.map(item => item.id));
});

export function useFavorites() {

    // A. INITIALISATION (À appeler au login ou au chargement du site)
    async function initFavorites(user) {
        if (user && user.id) {
            // CAS 1 : Utilisateur Connecté -> API
            currentUserId.value = user.id;
            try {
                const res = await fetch(`http://localhost:3000/api/favorites/${user.id}`);
                const data = await res.json();
                favoriteItems.value = data;
            } catch (e) {
                console.error("Erreur init API favorites:", e);
            }
        } else {
            // CAS 2 : Invité -> LocalStorage
            currentUserId.value = null;
            const local = localStorage.getItem('guest_favorites');
            favoriteItems.value = local ? JSON.parse(local) : [];
        }
    }

    // B. ACTION : AJOUTER / RETIRER
    async function toggleFavorite(item) {
        // 1. Mise à jour immédiate de l'écran (Optimiste)
        const exists = favoriteIds.value.has(item.id);
        if (exists) {
            favoriteItems.value = favoriteItems.value.filter(i => i.id !== item.id);
        } else {
            favoriteItems.value.push(item);
        }

        // 2. Sauvegarde (API ou LocalStorage)
        if (currentUserId.value) {
            try {
                const url = exists 
                    ? `http://localhost:3000/api/favorites/${currentUserId.value}/${item.id}` // DELETE
                    : `http://localhost:3000/api/favorites`; // POST
                
                const method = exists ? 'DELETE' : 'POST';
                const body = exists ? null : JSON.stringify({ userId: currentUserId.value, productId: item.id });

                await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body
                });
            } catch (e) {
                console.error("Erreur API save:", e);
            }
        } else {
            localStorage.setItem('guest_favorites', JSON.stringify(favoriteItems.value));
        }
    }

    // C. EXPORT (Ce que les composants peuvent utiliser)
    return {
        favoriteItems,
        favoriteIds,
        initFavorites,
        toggleFavorite
    };
}