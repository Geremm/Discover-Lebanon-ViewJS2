<template>
  <div id="app-container">
    <Navbar :class="navbarClass"/>
      <main :class="mainClass">
        <router-view />
      </main>  
      <router-link to="/favorites" v-if="showFavBtn" class="floating-fav-btn" aria-label="Voir mes favoris">Favorites</router-link>
    <Footer v-if="showFooter"/>
  </div>
</template>

<script setup>
import { computed } from 'vue'; 
import { useRoute } from 'vue-router';
import Navbar from './components/NavbarDiv.vue';
import Footer from './components/FooterDiv.vue';
import { useFavorites } from '@/store/favorites.js'; // On importe le store

const { favoriteIds } = useFavorites();
console.log('Favorite IDs in App.vue:');
console.log(favoriteIds);
console.log(favoriteIds.value);
console.log(favoriteIds.value.length);


const route = useRoute();

const showFooter = computed(() => {
  return route.name !== 'place-detail' && route.name !== 'chatbot' && route.name !== 'activity-detail' && route.name !== 'hotel-detail' && route.name !== 'restaurant-detail';
});

const showFavBtn = computed(() => {
  const v = favoriteIds?.value ?? favoriteIds
  if (!v) return false
  // supporte Array ou Set
  const count = Array.isArray(v) ? v.length : (typeof v.size === 'number' ? v.size : 0)
  return count > 0 && route.name !== 'place-detail'
})

const mainClass = computed(() => {
  // Si le nom de la route est 'chatbot', on retourne la classe 'main-chatbot-padding'
  if (route.name === 'chatbot') {
    return 'main-chatbot-padding';
  }
  // Sinon, on ne retourne aucune classe
  return '';
});

const navbarClass = computed(() => {
  // Si la page est un détail d'hôtel ou de restaurant, on ajoute la classe 'bg-dark'
  if (route.name === 'hotel-detail' || route.name === 'restaurant-detail') {
    return 'navbar d-flex justify-content-between align-items-center px-4 py-3 bg-dark';
  }
  // Pour toutes les autres pages, on n'envoie aucune classe supplémentaire
  return 'navbar-lebanon';
});
</script>

<style>
.main-chatbot-padding{
  padding-top: 25px; /* Adjust based on your navbar height */
}
</style>