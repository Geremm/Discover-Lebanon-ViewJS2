<template>
  <div id="app-container">
    <Navbar :class="navbarClass"/>
      <main :class="mainClass">
        <router-view />
      </main>  
      
      <router-link to="/favorites" v-if="showFavBtn" class="floating-fav-btn" aria-label="Voir mes favoris">
        Favorites
      </router-link>

    <Footer v-if="showFooter"/>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'; // 1. Ajout de onMounted
import { useRoute } from 'vue-router';
import Navbar from './components/NavbarDiv.vue';
import Footer from './components/FooterDiv.vue';
import { useFavorites } from '@/store/favorites.js';
import { isLoggedIn } from './store/auth';

// 2. On récupère initFavorites ici
const { favoriteIds, initFavorites } = useFavorites();
const route = useRoute();

// 3. C'EST ICI QUE TOUT SE JOUE
// Au chargement de l'application, on va chercher les favoris
onMounted(() => {
  // On regarde si un utilisateur est connecté dans le navigateur
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  
  // On lance l'initialisation (API si user existe, sinon LocalStorage)
  initFavorites(user);
});

// --- Tes Computed Properties (j'ai simplifié showFavBtn) ---

const showFooter = computed(() => {
  return route.name !== 'place-detail' && route.name !== 'chatbot' && route.name !== 'activity-detail' && route.name !== 'hotel-detail' && route.name !== 'restaurant-detail' && route.name !== 'login' && route.name !== 'register' && route.name !== 'account' && route.name !== 'contact';
});

const showFavBtn = computed(() => {
  // Simplification : favoriteIds est un Set, on regarde juste sa taille
  // On cache le bouton si on est déjà sur la page Account ou détails
  if (!favoriteIds.value) return false;
  
  return favoriteIds.value.size > 0 
      && route.name !== 'place-detail' 
      && route.name !== 'account'
      && isLoggedIn.value === false;
});

const mainClass = computed(() => {
  if (route.name === 'chatbot') {
    return 'main-chatbot-padding';
  }
  return '';
});

const navbarClass = computed(() => {
  if (route.name === 'hotel-detail' || route.name === 'restaurant-detail') {
    return 'navbar d-flex justify-content-between align-items-center px-4 py-3 bg-dark';
  }
  return 'navbar-lebanon';
});
</script>

<style>
.main-chatbot-padding{
  padding-top: 25px; 
}

.floating-fav-btn {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #D4AF37;
  color: white;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 10px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  font-size: 1rem;
  z-index: 1000;
  display: block; /* hidden by default */
  transition: background 0.3s ease, transform 0.3s ease;
}

.floating-fav-btn:hover {
  background-color: rgb(183, 140, 0);
  transform: scale(1.05);
}
</style>