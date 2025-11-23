<template>
  <div>
    <div v-if="!place">
      <p>Place not found.</p>
    </div>
    <div v-else>
      <section class="baalbek-hero">
        <div class="baalbek-overlay"></div>
        <div class="baalbek-text fade-in" id="baalbekText">
          <h1 class="hero-title">{{ place.title }}</h1>
          <p>{{ place.longDesc }}</p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api.js';

const route = useRoute();
// CORRECTION : On renomme 'item' en 'place' pour correspondre au template
const place = ref(null); 

const loadItem = async () => {
  const id = route.params.id;
  try {
    const data = await api.getItemById(id);
    place.value = data; // On met à jour 'place'
    
    updateBodyBackground();
  } catch (error) {
    console.error("Erreur lors du chargement du lieu:", error);
  }
};

function updateBodyBackground() {
  // On vérifie 'place.value'
  if (place.value) {
    document.body.style.backgroundImage = `url(${place.value.imageUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  }
}

onMounted(() => {
  loadItem();
});

watch(() => route.params.id, () => {
  loadItem();
});

onUnmounted(() => {
  document.body.style.backgroundImage = '';
  document.body.style.backgroundSize = '';
  document.body.style.backgroundPosition = '';
  document.body.style.backgroundAttachment = '';
});
</script>