<template>
  <div class="destination-card">
    <router-link :to="detailsLink" class="card-link">
      
      <div class="favorite-icon" :class="{ favorited: isFavorited }" @click.prevent="handleToggle()">
        {{ isFavorited ? '♥' : '♡' }}
      </div>

      <img :src="image" loading="lazy" :alt="title" />
      <h3>{{ title }}</h3>
      <p>{{ description }}</p>
      <span class="learn-more">Learn more →</span>
    </router-link>
  </div>
  
  <div class="toast2" :class="{ show: isToastVisible }">
      {{ toastMessage }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useFavorites } from '@/store/favorites.js';

const props = defineProps({
  id: Number,
  category: String,
  title: String,
  description: String,
  image: String
});

const isToastVisible = ref(false);
const toastMessage = ref("");

const { favoriteIds, toggleFavorite } = useFavorites();

const isFavorited = computed(() => {
    // Sécurité si favoriteIds n'est pas encore chargé
    return favoriteIds.value ? favoriteIds.value.has(props.id) : false;
});

const detailsLink = computed(() => `/${props.category}/${props.id}`);

function showToast(message) {
  toastMessage.value = message;
  isToastVisible.value = true;
  setTimeout(() => { isToastVisible.value = false; }, 2000);
}

const handleToggle = () => {
  // On reconstruit l'objet pour le store local (important !)
  toggleFavorite({ 
    id: props.id, 
    name: props.title,       // Mapping title -> name
    imageUrl: props.image,   // Mapping image -> imageUrl
    category: props.category,
    shortDesc: props.description // Mapping description -> shortDesc
  });

  if (isFavorited.value) showToast("Added to Favorites!");
  else showToast("Removed from Favorites");
};
</script>

<style scoped>
.destination-card {
  width: 300px;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.destination-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}


.destination-card.visible {
  opacity: 1;
  transform: translateY(0);
}


.destination-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.destination-card:hover img {
  transform: scale(1.05);
}


.destination-card h3 {
  margin: 20px 0 10px;
  font-size: 1.4em;
}

.destination-card p {
  padding: 0 15px 20px;
  font-size: 0.95em;
  color: #333;
}

.destination-card:hover .learn-more {
  display: inline-block;
  animation: fadeIn 0.4s ease;
}


.learn-more {
  color: #D4AF37;
  font-weight: bold;
  text-decoration: none;
  font-size: 1rem;
  background: none;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  transition: all 0.3s ease;
}
.learn-more:hover {
  background-color: #fff8e1;
  color: #000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.learn-more {
margin-top: auto;
font-weight: bold;
color: #D4AF37;
display: inline-block;
text-align: center;
}

.card-link {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  text-decoration: none;
  color: inherit;
  padding: 1.2rem;
}

.card-link img {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.card-link h3 {
  margin: 0 0 0.5rem;
  text-align: center;
  color : black;
}

.card-link p {
  flex-grow: 1; /* for the learn more */
  text-align: center;
}

.favorite-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 1.4rem;
  color: #bbb;
  z-index: 10;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.2s ease;
  user-select: none;
}

.favorite-icon:hover {
  color: #e63946;
  transform: scale(1.2);
}

.favorite-icon.favorited {
  color: #e63946;
}
.toast2 {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  font-size: 0.95rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease, transform 0.4s ease;
  z-index: 10000;
}

.toast2.show {
  opacity: 1;
  transform: translateX(-50%) translateY(-10px);
}

@media (max-width: 768px) {
  .destination-card {
  width: 100%;
  max-width: 90%;
  margin: auto;
  }

  .destination-card p {
  font-size: 0.9em;
  }

  .learn-more {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  }
}
</style>